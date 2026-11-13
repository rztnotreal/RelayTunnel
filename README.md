# ⚡ RelayTunnel • AI Shield & Clean Routing (.exe + NodeJS Server)

Приложение-туннель для безопасной работы с нейросетями (**Claude**, Anthropic API, Cursor, ChatGPT, Midjourney) с аппаратным **Kill Switch**, чистыми резидентными IP адресами и **Zero-Knowledge защитой VLESS-ключей на сервере**.

---

## 🎨 Дизайн и спецификация:
- **Логотип**: Точное соответствие предоставленному изображению — `Relay` (белый `#FFFFFF`) + `Tunnel` (электрический лазурный синий `#5B9CFF`).
- **Акцент**: `#5B9CFF` (неоновый синий из логотипа).
- **Фон**: `#141414` (OLED Dark).
- **Шрифты**: `Google Sans` + `Poppins`.
- **Исполняемый файл**: [`RelayTunnel.exe`](file:///c:/Users/user/Desktop/RelayTunnel/RelayTunnel.exe) — **~1.2 МБ** (нативное безрамочное окно WebView2, мгновенный старт, без раздутого Electron).

---

## 🛡 Архитектура серверной части (NodeJS + Защита VLESS-ключей)

Сервер находится в папке [`server/`](file:///c:/Users/user/Desktop/RelayTunnel/server).

### 📁 Конфиг серверов: [`server/config/servers.json`](file:///c:/Users/user/Desktop/RelayTunnel/server/config/servers.json)
Вы (как администратор) можете в любой момент добавить или изменить сервера в файле:
```json
[
  {
    "id": "fi-hel-01",
    "name": "Finland",
    "city": "Helsinki",
    "flag": "FI",
    "category": "europe",
    "ping": 24,
    "isp": "Ficolo Oy (Clean Tier-1)",
    "fraudScore": 0,
    "claudeOptimized": true,
    "vlessKey": "vless://uuid@185.196.220.44:443?security=reality&sni=claude.ai&pbk=...",
    "active": true
  }
]
```

### 🔒 Как гарантируется, что пользователь НИКОГДА не узнает VLESS-ключ:
1. **Публичный эндпоинт `/api/servers`**:
   - Приложение клиента запрашивает список доступных локаций.
   - Сервер на уровне кода **безвозвратно вырезает поле `vlessKey`**, UUID, приватные ключи и Reality-хеши.
   - Пользователь в браузере / DevTools / сниффере видит только: название страны, город, пинг и оценку чистоты IP (0% Fraud Score).
2. **Сессионный эндпоинт `/api/tunnel/session` (Zero-Knowledge Ticket)**:
   - При нажатии кнопки подключения клиент отправляет `{ serverId: "fi-hel-01", userToken: "@claude_vpn" }`.
   - Сервер шифрует параметры соединения алгоритмом **AES-256-GCM** с использованием серверного мастер-ключа, уникального одноразового вектора инициализации (IV) и временного срока действия (TTL).
   - Клиент получает зашифрованный бинарный токен (`encryptedPayload`). Открытый VLESS-ключ **никогда не передается по сети в открытом виде**.
3. **Панель администратора (`/api/admin/servers`)**:
   - Защищена секретным ключом `x-admin-key: relay_admin_secret_key_2026`.
   - Позволяет добавлять, редактировать и удалять VLESS-серверы через API.

---

## 🚀 Запуск:

### 1. Серверная часть (NodeJS):
Запустите файл [`server/start-server.bat`](file:///c:/Users/user/Desktop/RelayTunnel/server/start-server.bat) либо командой:
```powershell
node server/server.js
```
Сервер запустится на `http://127.0.0.1:3001`.

### 2. Клиентское приложение:
Дважды кликните по файлу **[`RelayTunnel.exe`](file:///c:/Users/user/Desktop/RelayTunnel/RelayTunnel.exe)** в корне проекта.
