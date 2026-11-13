import React, { useState } from 'react';
import { X, Shield, Lock, Globe, Check } from 'lucide-react';
import { sound } from '../../utils/audio';
import { AI_SERVICES } from '../../data/tunnelData';

export default function SettingsModal({
  isOpen,
  onClose,
  killSwitch,
  onToggleKillSwitch,
  dnsLeakProtection,
  onToggleDnsLeak,
  webrtcProtection,
  onToggleWebRTC,
  autoStart,
  onToggleAutoStart
}) {
  const [protocol, setProtocol] = useState('vless-reality');
  const [services, setServices] = useState(AI_SERVICES);

  if (!isOpen) return null;

  const toggleService = (id) => {
    sound.playToggle();
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="absolute inset-0 z-50 modal-backdrop flex flex-col justify-end animate-fade-in select-none">
      <div className="w-full bg-[#161719] border-t border-white/10 rounded-t-3xl max-h-[92%] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#5B9CFF]" />
              <span>Настройки туннеля</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Конфигурация сетевого драйвера и правил защиты
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* 1. Core Security Toggles */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Безопасность и Kill Switch
            </span>

            {/* Kill Switch Toggle */}
            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="pr-3">
                <div className="text-sm font-semibold text-white flex items-center space-x-2">
                  <span>Kill Switch (WFP драйвер)</span>
                  <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.2 rounded font-mono font-medium">
                    ВАЖНО
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Полная блокировка исходящего трафика при обрыве туннеля. Claude никогда не увидит реальный IP.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => {
                  sound.playToggle();
                  onToggleKillSwitch();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                  killSwitch ? 'bg-[#5B9CFF]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    killSwitch ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* DNS Leak Toggle */}
            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="pr-3">
                <div className="text-sm font-semibold text-white">
                  Защита от утечек DNS (DoH)
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Принудительный зашифрованный DNS-резолвер для обхода локальных блокировок.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playToggle();
                  onToggleDnsLeak();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                  dnsLeakProtection ? 'bg-[#5B9CFF]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    dnsLeakProtection ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* WebRTC Leak Toggle */}
            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="pr-3">
                <div className="text-sm font-semibold text-white">
                  Блокировка WebRTC STUN
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Изолирует локальные IP адреса от считывания через браузерные скрипты.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playToggle();
                  onToggleWebRTC();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                  webrtcProtection ? 'bg-[#5B9CFF]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    webrtcProtection ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Protocol Selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Протокол туннелирования
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'vless-reality', name: 'VLESS Reality', tag: 'Маскировка под Chrome' },
                { id: 'sing-box', name: 'Sing-box TUN', tag: 'Системный адаптер' },
                { id: 'shadowtls', name: 'ShadowTLS v3', tag: 'Обход DPI' },
                { id: 'wireguard', name: 'WireGuard Clean', tag: 'Макс. скорость' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playClick();
                    setProtocol(p.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    protocol === p.id
                      ? 'bg-[#5B9CFF]/15 border-[#5B9CFF] text-white'
                      : 'bg-[#1e2024] border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold font-poppins">{p.name}</div>
                  <div className="text-[10px] text-zinc-400">{p.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Whitelist AI Services */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Нейросети в умном вайтлисте
            </span>

            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5 space-y-2">
              {services.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleService(item.id)}
                  className="flex items-center justify-between text-xs py-1 cursor-pointer hover:text-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-zinc-200">{item.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{item.domain}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      item.enabled
                        ? 'bg-[#5B9CFF] border-[#5B9CFF] text-black'
                        : 'border-zinc-600 bg-transparent'
                    }`}
                  >
                    {item.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Startup */}
          <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">
                Автозапуск с Windows
              </div>
              <p className="text-xs text-zinc-400">
                Запускать свернутым в трей при включении компьютера
              </p>
            </div>

            <button
              onClick={() => {
                sound.playToggle();
                onToggleAutoStart();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                autoStart ? 'bg-[#5B9CFF]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  autoStart ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
