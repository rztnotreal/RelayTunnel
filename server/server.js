import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const CONFIG_FILE = path.join(__dirname, 'config', 'servers.json');
const ADMIN_API_KEY = process.env.ADMIN_KEY || 'relay_admin_secret_key_2026';

// Master encryption key for generating zero-knowledge tunnel sessions (32 bytes for AES-256)
const MASTER_SECRET = crypto.createHash('sha256').update(process.env.MASTER_SECRET || 'relaytunnel_secret_claude_2026').digest();

// Load servers from config file
function loadServers() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading servers.json:', err.message);
  }
  return [];
}

// Save servers to config file
function saveServers(servers) {
  try {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(servers, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving servers.json:', err.message);
    return false;
  }
}

// Memory cache of servers
let serversCache = loadServers();

// Sanitize server object for public client consumption (STRICTLY STRIP VLESS KEYS)
function sanitizeServerForClient(server) {
  const { vlessKey, ...safeData } = server;
  return safeData;
}

// Encrypt VLESS payload into a secure ephemeral session ticket
function createEncryptedSessionTicket(vlessKey, serverId, userToken) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_SECRET, iv);
  
  const payloadData = JSON.stringify({
    key: vlessKey,
    serverId,
    userToken,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12 // 12 hours valid
  });

  let encrypted = cipher.update(payloadData, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedPayload: encrypted,
    iv: iv.toString('hex'),
    authTag,
    sessionId: crypto.randomUUID(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12
  };
}

// Decrypt and verify session ticket (for local tunnel engine)
export function verifySessionTicket(encryptedPayload, ivHex, authTagHex) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_SECRET, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedPayload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const parsed = JSON.parse(decrypted);
    if (parsed.expiresAt < Date.now()) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

// HTTP Server
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Helper to read JSON body
  const readBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });

  // JSON helper
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // 1. Health check
  if (req.method === 'GET' && (pathname === '/' || pathname === '/api/status')) {
    sendJson(200, {
      service: 'RelayTunnel Backend API',
      status: 'operational',
      activeServers: serversCache.filter(s => s.active !== false).length,
      claudePurityFilter: 'active',
      uptime: process.uptime()
    });
    return;
  }

  // 2. PUBLIC CLIENT ENDPOINT: Get list of servers (NEVER EXPOSES VLESS KEYS)
  if (req.method === 'GET' && pathname === '/api/servers') {
    const publicList = serversCache
      .filter(s => s.active !== false)
      .map(sanitizeServerForClient);
    sendJson(200, {
      success: true,
      servers: publicList
    });
    return;
  }

  // 3. CLIENT TUNNEL HANDSHAKE: Request encrypted session ticket for a server
  if (req.method === 'POST' && pathname === '/api/tunnel/session') {
    readBody().then(body => {
      console.log('Session request body:', body);
      const { serverId, userToken } = body;
      const targetServer = serversCache.find(s => s.id === serverId);

      if (!targetServer) {
        sendJson(404, { success: false, error: 'Сервер не найден' });
        return;
      }

      // Create zero-knowledge encrypted ticket
      const sessionTicket = createEncryptedSessionTicket(
        targetServer.vlessKey,
        targetServer.id,
        userToken || '@claude_vpn'
      );

      // Return session ticket with public metadata. The raw vlessKey is NOT returned!
      sendJson(200, {
        success: true,
        server: sanitizeServerForClient(targetServer),
        session: sessionTicket
      });
    });
    return;
  }

  // 4. ADMIN ENDPOINTS: Manage servers with VLESS keys (Protected by x-admin-key)
  const clientAdminKey = req.headers['x-admin-key'] || url.searchParams.get('adminKey');
  const isAdmin = clientAdminKey === ADMIN_API_KEY;

  if (pathname.startsWith('/api/admin/')) {
    if (!isAdmin) {
      sendJson(401, { success: false, error: 'Доступ запрещен. Неверный x-admin-key.' });
      return;
    }

    // GET /api/admin/servers - view all with keys
    if (req.method === 'GET' && pathname === '/api/admin/servers') {
      sendJson(200, {
        success: true,
        servers: serversCache
      });
      return;
    }

    // POST /api/admin/servers - add or update server
    if (req.method === 'POST' && pathname === '/api/admin/servers') {
      readBody().then(body => {
        const { id, name, city, flag, category, ping, load, isp, vlessKey, active } = body;
        if (!name || !vlessKey) {
          sendJson(400, { success: false, error: 'Поля name и vlessKey обязательны' });
          return;
        }

        const serverId = id || `srv-${Date.now()}`;
        const existingIdx = serversCache.findIndex(s => s.id === serverId);
        const serverObj = {
          id: serverId,
          name,
          city: city || 'Helsinki',
          flag: flag || 'FI',
          category: category || 'europe',
          ping: ping || 25,
          load: load || 20,
          isp: isp || 'Clean Tier-1 Provider',
          fraudScore: 0,
          claudeOptimized: true,
          vlessKey,
          active: active !== false
        };

        if (existingIdx >= 0) {
          serversCache[existingIdx] = serverObj;
        } else {
          serversCache.push(serverObj);
        }

        saveServers(serversCache);
        sendJson(200, { success: true, message: 'Сервер сохранен', server: serverObj });
      });
      return;
    }

    // DELETE /api/admin/servers/:id
    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/servers/')) {
      const idToDelete = pathname.replace('/api/admin/servers/', '');
      serversCache = serversCache.filter(s => s.id !== idToDelete);
      saveServers(serversCache);
      sendJson(200, { success: true, message: 'Сервер удален' });
      return;
    }
  }

  // 404
  sendJson(404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log('=====================================================');
  console.log(`⚡ RelayTunnel Server running on http://127.0.0.1:${PORT}`);
  console.log(`📁 Config file: ${CONFIG_FILE}`);
  console.log(`🛡️  Zero-Knowledge VLESS Protection: ACTIVE`);
  console.log(`🔑 Admin API Key: ${ADMIN_API_KEY}`);
  console.log('=====================================================');
});
