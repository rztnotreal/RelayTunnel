export const SERVERS = [
  {
    id: 'fi-hel',
    name: 'Finland',
    city: 'Helsinki',
    flag: '🇫🇮',
    code: 'FI',
    ping: 24,
    load: 28,
    ip: '185.196.220.44',
    isp: 'Ficolo Oy (Clean Tier-1)',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'se-sto',
    name: 'Sweden',
    city: 'Stockholm',
    flag: '🇸🇪',
    code: 'SE',
    ping: 29,
    load: 34,
    ip: '194.26.29.112',
    isp: 'GleSYS AB (Clean Pool)',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'de-fra',
    name: 'Germany',
    city: 'Frankfurt',
    flag: '🇩🇪',
    code: 'DE',
    ping: 38,
    load: 52,
    ip: '45.133.178.50',
    isp: 'Equinix Clean Datacenter',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'nl-ams',
    name: 'Netherlands',
    city: 'Amsterdam',
    flag: '🇳🇱',
    code: 'NL',
    ping: 35,
    load: 46,
    ip: '195.206.181.9',
    isp: 'Iron Mountain AMS',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'us-ore',
    name: 'USA - West (Claude DC)',
    city: 'Oregon',
    flag: '🇺🇸',
    code: 'US',
    ping: 112,
    load: 31,
    ip: '23.106.12.88',
    isp: 'Residential AT&T Clean',
    fraudScore: 0,
    claudeVerified: true,
    category: 'usa'
  },
  {
    id: 'us-va',
    name: 'USA - East (Virginia)',
    city: 'Ashburn',
    flag: '🇺🇸',
    code: 'US',
    ping: 104,
    load: 40,
    ip: '167.172.99.14',
    isp: 'Verizon Residential Clean',
    fraudScore: 0,
    claudeVerified: true,
    category: 'usa'
  },
  {
    id: 'gb-lon',
    name: 'United Kingdom',
    city: 'London',
    flag: '🇬🇧',
    code: 'GB',
    ping: 42,
    load: 39,
    ip: '178.62.80.12',
    isp: 'Telehouse London Clean',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'ch-zur',
    name: 'Switzerland',
    city: 'Zurich',
    flag: '🇨🇭',
    code: 'CH',
    ping: 44,
    load: 22,
    ip: '185.107.56.21',
    isp: 'Equinix Zurich Zero-Log',
    fraudScore: 0,
    claudeVerified: true,
    category: 'europe'
  },
  {
    id: 'jp-tyo',
    name: 'Japan',
    city: 'Tokyo',
    flag: '🇯🇵',
    code: 'JP',
    ping: 148,
    load: 25,
    ip: '139.162.115.33',
    isp: 'SoftBank Clean Backbone',
    fraudScore: 0,
    claudeVerified: true,
    category: 'asia'
  }
];

export const SCENARIOS = [
  {
    id: 'balance',
    name: 'Баланс',
    icon: 'Sliders',
    description: 'Оптимальный баланс высокой скорости и чистых IP адресов',
    badge: 'Рекомендуется',
    details: 'Умная маршрутизация запросов к нейросетям без лишних задержек.'
  },
  {
    id: 'claude-ultra',
    name: 'Claude Ultra-Clean',
    icon: 'Zap',
    description: 'Эксклюзивный пул чистых IP без блокировок Anthropic',
    badge: 'Для Claude 3.5 & Sonnet',
    details: '0% Fraud Score, маскировка под стационарный браузер из Финляндии/Швеции/США.'
  },
  {
    id: 'max-defense',
    name: 'Макс. Защита',
    icon: 'Shield',
    description: 'Жесткий Kill Switch, изоляция WebRTC и полное шифрование',
    badge: 'Анонимность',
    details: 'Никаких утечек DNS или IPv6. Автоматическое отключение сети при обрыве туннеля.'
  },
  {
    id: 'speed-boost',
    name: 'Скорость & Стриминг',
    icon: 'Rocket',
    description: 'Прямые BGP-маршруты и минимальный пинг для Cursor / VS Code',
    badge: 'Минимальный пинг',
    details: 'Приоритетные каналы с ультра-низким временем отклика.'
  }
];

export const AI_SERVICES = [
  { id: 'claude', name: 'Claude.ai & Anthropic API', domain: 'claude.ai, anthropic.com', enabled: true },
  { id: 'cursor', name: 'Cursor Editor & Claude Models', domain: 'cursor.com, cursor.sh', enabled: true },
  { id: 'chatgpt', name: 'ChatGPT & OpenAI Platform', domain: 'chatgpt.com, openai.com', enabled: true },
  { id: 'midjourney', name: 'Midjourney & Discord AI', domain: 'midjourney.com', enabled: true },
  { id: 'perplexity', name: 'Perplexity AI Search', domain: 'perplexity.ai', enabled: true },
  { id: 'copilot', name: 'GitHub Copilot', domain: 'githubcopilot.com', enabled: false }
];
