import React, { useState, useEffect } from 'react';
import { X, Search, Check, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { SERVERS } from '../../data/tunnelData';
import { sound } from '../../utils/audio';
import FlagIcon from '../FlagIcon';

export default function LocationModal({ isOpen, onClose, selectedServer, onSelectServer, backendServers = [] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'europe' | 'usa' | 'asia'
  const [isPinging, setIsPinging] = useState(false);
  const [serversList, setServersList] = useState(backendServers.length > 0 ? backendServers : SERVERS);

  useEffect(() => {
    if (backendServers && backendServers.length > 0) {
      setServersList(backendServers);
    }
  }, [backendServers]);

  if (!isOpen) return null;

  const handleRefreshPing = () => {
    sound.playClick();
    setIsPinging(true);
    setTimeout(() => {
      setServersList((prev) =>
        prev.map((s) => ({
          ...s,
          ping: Math.max(18, s.ping + Math.floor(Math.random() * 6 - 3))
        }))
      );
      setIsPinging(false);
    }, 700);
  };

  const filteredServers = serversList.filter((s) => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      (s.ip && s.ip.includes(search));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="absolute inset-0 z-50 modal-backdrop flex flex-col justify-end animate-fade-in select-none">
      <div className="w-full bg-[#161719] border-t border-white/10 rounded-t-3xl max-h-[90%] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Локации серверов</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5B9CFF]/15 text-[#5B9CFF] border border-[#5B9CFF]/30 font-semibold">
                NodeJS Zero-Knowledge
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              VLESS ключи зашифрованы на сервере и скрыты от пользователя
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

        {/* Search & Filter bar */}
        <div className="p-3.5 space-y-2.5 border-b border-white/5 bg-[#131416]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск страны, города..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1b1c20] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#5B9CFF]/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs py-0.5">
              {[
                { id: 'all', label: 'Все' },
                { id: 'europe', label: 'Европа' },
                { id: 'usa', label: 'США (Anthropic)' },
                { id: 'asia', label: 'Азия' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setFilter(tab.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    filter === tab.id
                      ? 'bg-[#5B9CFF]/20 text-[#5B9CFF] border border-[#5B9CFF]/40 font-semibold'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefreshPing}
              disabled={isPinging}
              title="Обновить пинг"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#5B9CFF] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#5B9CFF]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {filteredServers.map((s) => {
            const isSelected = selectedServer.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  sound.playToggle();
                  onSelectServer(s);
                  onClose();
                }}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#5B9CFF]/10 border-[#5B9CFF]/50 shadow-[0_0_15px_rgba(91,156,255,0.2)]'
                    : 'bg-[#1a1b1e] border-white/5 hover:border-white/10 hover:bg-[#202227]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                  <FlagIcon code={s.flag || s.code} className="w-6 h-4 rounded-sm shadow-sm flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-white font-poppins">
                        {s.name}
                      </span>
                      <span className="text-xs text-zinc-400 font-normal">({s.city})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] bg-[#5B9CFF]/15 text-[#5B9CFF] px-1.5 py-0.2 rounded font-mono font-medium flex items-center space-x-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        <span>0% Fraud • Clean</span>
                      </span>
                      <span>•</span>
                      <span className="text-zinc-500 font-mono text-[10px]">{s.isp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.ping < 50
                            ? 'bg-emerald-400'
                            : s.ping < 110
                            ? 'bg-amber-400'
                            : 'bg-zinc-400'
                        }`}
                      ></span>
                      <span className="font-mono text-xs font-bold text-white">
                        {s.ping} ms
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {s.ping < 40 ? 'Ультра-быстро' : 'Стабильно'}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#5B9CFF] border-[#5B9CFF] text-black'
                        : 'border-zinc-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
