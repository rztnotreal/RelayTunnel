import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldAlert, Activity, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/audio';

export default function PingStatsModal({ isOpen, onClose, server, isConnected, killSwitchEnabled }) {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(148.6);
  const [uploadSpeed, setUploadSpeed] = useState(82.4);

  useEffect(() => {
    if (!isOpen || !isConnected) return;
    const interval = setInterval(() => {
      setDownloadSpeed((145 + Math.random() * 8).toFixed(1));
      setUploadSpeed((80 + Math.random() * 5).toFixed(1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isOpen, isConnected]);

  if (!isOpen) return null;

  const handleRunAudit = () => {
    sound.playClick();
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 modal-backdrop flex flex-col justify-end animate-fade-in select-none">
      <div className="w-full bg-[#161719] border-t border-white/10 rounded-t-3xl max-h-[90%] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#5B9CFF]" />
              <span>Диагностика туннеля & IP</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Статус соединения с пулом чистых адресов Claude
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

        {/* Live Network Bandwidth */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5">
              <div className="flex items-center space-x-1.5 text-zinc-400 text-xs mb-1">
                <ArrowDown className="w-3.5 h-3.5 text-[#5B9CFF]" />
                <span>Входящий трафик</span>
              </div>
              <div className="font-mono text-lg font-bold text-white">
                {isConnected ? `${downloadSpeed} Mbps` : '0 Mbps'}
              </div>
            </div>

            <div className="p-3 bg-[#1e2024] rounded-2xl border border-white/5">
              <div className="flex items-center space-x-1.5 text-zinc-400 text-xs mb-1">
                <ArrowUp className="w-3.5 h-3.5 text-[#5B9CFF]" />
                <span>Исходящий трафик</span>
              </div>
              <div className="font-mono text-lg font-bold text-white">
                {isConnected ? `${uploadSpeed} Mbps` : '0 Mbps'}
              </div>
            </div>
          </div>

          {/* Current IP & Node information */}
          <div className="p-3.5 bg-[#1e2024] rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Текущий выходной IP:</span>
              <span className="font-mono text-xs font-bold text-[#5B9CFF] bg-[#5B9CFF]/10 px-2 py-0.5 rounded border border-[#5B9CFF]/20">
                {isConnected ? (server.ip || '185.196.220.44 (Clean)') : 'Прямой IP (туннель выключен)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Провайдер / ASN:</span>
              <span className="text-zinc-200 font-medium truncate max-w-[190px]">
                {isConnected ? (server.isp || 'Clean Tier-1') : 'Локальный провайдер'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Fraud Score:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {isConnected ? `${server.fraudScore || 0} / 100 (Clean Pool)` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-zinc-400">Защита VLESS ключа:</span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                🔒 Зашифрован на сервере
              </span>
            </div>
          </div>

          {/* Claude Security Checklist */}
          <div className="p-3.5 bg-[#1e2024] rounded-2xl border border-white/5 space-y-2.5">
            <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Чеклист совместимости с Claude</span>
              <span className="text-[10px] text-[#5B9CFF] font-mono">100% READY</span>
            </div>

            {[
              {
                title: 'Anthropic API & Claude.ai',
                status: isConnected ? 'Доступ без капч и банов' : 'Не защищено',
                ok: isConnected
              },
              {
                title: 'Kill Switch драйвер (WFP)',
                status: killSwitchEnabled ? 'Активен (утечки блокируются)' : 'Отключен',
                ok: killSwitchEnabled
              },
              {
                title: 'Защита от утечек DNS (DoH)',
                status: isConnected ? 'Шифрованный RelayDNS' : 'Провайдерский DNS',
                ok: isConnected
              },
              {
                title: 'Защита от утечек WebRTC',
                status: isConnected ? 'STUN маскирован под IP сервера' : 'Прямой локальный IP',
                ok: isConnected
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-zinc-200 font-medium">{item.title}</div>
                  <div className="text-[11px] text-zinc-400">{item.status}</div>
                </div>
                <div className="flex-shrink-0">
                  {item.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Run Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={testing}
            className="w-full py-2.5 rounded-xl bg-[#5B9CFF]/15 hover:bg-[#5B9CFF]/25 border border-[#5B9CFF]/30 text-[#5B9CFF] font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>
              {testing ? 'Проверка соединения с серверами Claude...' : 'Повторить тест чистоты IP'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
