import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModeTabs from './components/ModeTabs';
import CenterPowerButton from './components/CenterPowerButton';
import InfoCards from './components/InfoCards';
import BottomBar from './components/BottomBar';
import Footer from './components/Footer';

import LocationModal from './components/modals/LocationModal';
import ScenarioModal from './components/modals/ScenarioModal';
import PingStatsModal from './components/modals/PingStatsModal';
import StreakModal from './components/modals/StreakModal';
import SettingsModal from './components/modals/SettingsModal';

import { SERVERS, SCENARIOS } from './data/tunnelData';
import { sound } from './utils/audio';

const BACKEND_URL = 'http://127.0.0.1:3001';

export default function App() {
  // Connection states: 'disconnected' | 'connecting' | 'connected'
  const [status, setStatus] = useState('disconnected');
  const [activeMode, setActiveMode] = useState('whitelist'); // 'whitelist' | 'direct' | 'blacklist'
  const [serversList, setServersList] = useState(SERVERS);
  const [server, setServer] = useState(SERVERS[0]); // Default: Finland
  const [scenario, setScenario] = useState(SCENARIOS[0]); // Default: Баланс
  const [ping, setPing] = useState(24);
  const [streakDays, setStreakDays] = useState(14);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Security toggles
  const [killSwitch, setKillSwitch] = useState(true);
  const [dnsLeak, setDnsLeak] = useState(true);
  const [webrtc, setWebrtc] = useState(true);
  const [autoStart, setAutoStart] = useState(false);

  // Modals state
  const [openModal, setOpenModal] = useState(null); // 'location' | 'scenario' | 'stats' | 'streak' | 'settings' | null

  // Fetch servers from NodeJS backend
  useEffect(() => {
    async function loadBackendServers() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/servers`);
        if (res.ok) {
          const data = await res.json();
          if (data.servers && data.servers.length > 0) {
            setServersList(data.servers);
            setServer(data.servers[0]);
            setIsBackendOnline(true);
          }
        }
      } catch {
        // Backend not running, use fallback data
        setIsBackendOnline(false);
      }
    }
    loadBackendServers();
  }, []);

  // Support URL params for testing/screenshots
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('state') === 'connected') {
      setStatus('connected');
    }
    const modalParam = params.get('modal');
    if (modalParam) {
      setOpenModal(modalParam);
    }
  }, []);

  // Handle power button click with zero-knowledge session ticket
  const handleToggleConnection = async () => {
    if (status === 'connected') {
      sound.playDisconnected();
      setStatus('disconnected');
    } else if (status === 'disconnected') {
      setStatus('connecting');

      // Attempt handshake with NodeJS backend
      try {
        await fetch(`${BACKEND_URL}/api/tunnel/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serverId: server.id,
            userToken: '@claude_vpn'
          })
        });
      } catch {
        // Local simulation fallback
      }

      setTimeout(() => {
        setStatus('connected');
        sound.playConnected();
        setPing(server.ping || 24);
      }, 1300);
    }
  };

  const handleSelectServer = (newServer) => {
    setServer(newServer);
    if (status === 'connected') {
      setPing(newServer.ping || 25);
    }
  };

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#0e0e10] p-2 md:p-6 overflow-hidden">
      {/* Background ambient light effects in #5B9CFF */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#5B9CFF]/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Main App Desktop Card */}
      <div className="app-container relative shadow-2xl bg-[#141414] border border-white/[0.08] flex flex-col justify-between">
        
        {/* Top Window Header */}
        <Header isConnected={status === 'connected'} isOnline={isBackendOnline} />

        {/* Mode Selector Tabs (Вайтлист / Напрямую / Блэклист) */}
        <ModeTabs
          activeMode={activeMode}
          onModeChange={(mode) => setActiveMode(mode)}
        />

        {/* Central Power Button */}
        <CenterPowerButton
          status={status}
          onToggle={handleToggleConnection}
          activeServer={server}
          killSwitchEnabled={killSwitch}
        />

        {/* Middle Two Info Cards (Локация & Сценарий) */}
        <InfoCards
          server={server}
          scenario={scenario}
          isConnected={status === 'connected'}
          ping={ping}
          onOpenLocation={() => setOpenModal('location')}
          onOpenScenario={() => setOpenModal('scenario')}
        />

        {/* Bottom Quick Action Bar (📶 24 ms / 🔥 14 дней / ⚙️ Настройки) */}
        <BottomBar
          isConnected={status === 'connected'}
          ping={ping}
          streakDays={streakDays}
          onOpenStats={() => setOpenModal('stats')}
          onOpenStreak={() => setOpenModal('streak')}
          onOpenSettings={() => setOpenModal('settings')}
        />

        {/* Footer (@username & Expiry Date) */}
        <Footer
          userTag="@claude_vpn"
          expiryDate="28.10.2026"
        />

        {/* --- MODAL DRAWERS --- */}
        <LocationModal
          isOpen={openModal === 'location'}
          onClose={() => setOpenModal(null)}
          selectedServer={server}
          onSelectServer={handleSelectServer}
          backendServers={serversList}
        />

        <ScenarioModal
          isOpen={openModal === 'scenario'}
          onClose={() => setOpenModal(null)}
          selectedScenario={scenario}
          onSelectScenario={(sc) => setScenario(sc)}
        />

        <PingStatsModal
          isOpen={openModal === 'stats'}
          onClose={() => setOpenModal(null)}
          server={server}
          isConnected={status === 'connected'}
          killSwitchEnabled={killSwitch}
        />

        <StreakModal
          isOpen={openModal === 'streak'}
          onClose={() => setOpenModal(null)}
          streakDays={streakDays}
        />

        <SettingsModal
          isOpen={openModal === 'settings'}
          onClose={() => setOpenModal(null)}
          killSwitch={killSwitch}
          onToggleKillSwitch={() => setKillSwitch(!killSwitch)}
          dnsLeakProtection={dnsLeak}
          onToggleDnsLeak={() => setDnsLeak(!dnsLeak)}
          webrtcProtection={webrtc}
          onToggleWebRTC={() => setWebrtc(!webrtc)}
          autoStart={autoStart}
          onToggleAutoStart={() => setAutoStart(!autoStart)}
        />
      </div>
    </div>
  );
}
