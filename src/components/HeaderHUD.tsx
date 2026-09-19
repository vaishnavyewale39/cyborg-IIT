import React, { useState, useEffect } from 'react';
import { ScreenTab } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { isSoundEnabled, setSoundEnabled, playHudConfirm } from '../utils/audio';
import { Activity, ShieldAlert, Cpu, Globe, Terminal, Volume2, VolumeX, Zap } from 'lucide-react';

interface HeaderHUDProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
  isOverdrive: boolean;
  onToggleOverdrive: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  activeScreen,
  onSelectScreen,
  isOverdrive,
  onToggleOverdrive
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [audioActive, setAudioActive] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    const next = !audioActive;
    setAudioActive(next);
    setSoundEnabled(next);
    if (next) {
      playHudConfirm();
    }
  };

  const navItems: { id: ScreenTab; label: string; icon: React.ReactNode; index: string }[] = [
    { id: 'neural_hud', label: 'NEURAL HUD', icon: <Activity className="w-3.5 h-3.5" />, index: '01' },
    { id: 'augment_matrix', label: 'AUGMENT MATRIX', icon: <Cpu className="w-3.5 h-3.5" />, index: '02' },
    { id: 'grid_tactical', label: 'GRID TACTICAL', icon: <Globe className="w-3.5 h-3.5" />, index: '03' },
    { id: 'terminal_tuner', label: 'TERMINAL & TUNER', icon: <Terminal className="w-3.5 h-3.5" />, index: '04' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0a0a0f]/90 backdrop-blur-xl transition-colors">
      {/* Top telemetry ticker */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-white/[0.04] text-[11px] font-mono text-[#94a3b8]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
            <span className="text-[#00f2fe] font-medium tracking-widest">SYSTEM_NODE: CYBER-77X</span>
          </div>
          <span className="text-white/20">|</span>
          <div>CORE_SYNC: <span className="text-[#00f2fe]">99.98%</span> (CALIBRATED)</div>
          <span className="text-white/20">|</span>
          <div>LATENCY: <span className="text-[#4cc9f0]">1.2ms</span></div>
          <span className="text-white/20">|</span>
          <div>CRYPTO: <span className="text-[#9d4edd]">QKD-2048 LCK</span></div>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-white/30">// 35.0116° N, 135.7681° E</span>
          <span className="text-white/20">|</span>
          <span className="text-[#00f2fe] tracking-wider">{currentTime || '02:15:00.00'} UTC</span>
          {isOverdrive && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#ff0055]/20 text-[#ff4d79] border border-[#ff0055]/50 animate-pulse font-bold">
              OVERDRIVE ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Main HUD Nav Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#12121a] border border-white/10 shadow-[0_0_15px_rgba(0,242,254,0.15)] group cursor-pointer" onClick={() => onSelectScreen('neural_hud')}>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00f2fe]/20 to-[#9d4edd]/20 opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="w-4 h-4 border-2 border-[#00f2fe] rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute w-1.5 h-1.5 bg-[#9d4edd] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-display tracking-tight text-white flex items-center">
                CYBERNETIC
                <span className="mx-1.5 text-xs text-[#00f2fe] font-mono">//</span>
                <span className="text-[#00f2fe]">PRECISION</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
                MIL-SPEC v4.2
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#94a3b8] hidden sm:block">
              Neural Telemetry Deck & Augmentation Platform
            </p>
          </div>
        </div>

        {/* Screen Switcher Nav */}
        <nav className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-[#12121a]/80 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectScreen(item.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#00f2fe] bg-[#0a0a0f] border border-[#00f2fe]/40 shadow-[0_0_14px_rgba(0,242,254,0.3)]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-[#9d4edd]' : 'text-white/40'}`}>
                  [{item.index}]
                </span>
                <span className={isActive ? 'text-[#00f2fe]' : ''}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            id="btn-hud-audio"
            type="button"
            onClick={toggleAudio}
            title={audioActive ? 'Mute HUD Audio Feedback' : 'Enable HUD Audio Synthesizer'}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              audioActive
                ? 'border-[#00f2fe]/40 bg-[#00f2fe]/10 text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.25)]'
                : 'border-white/10 bg-[#12121a] text-white/40 hover:text-white'
            }`}
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Overdrive toggle pill */}
          <CyberPillButton
            id="btn-overdrive-toggle"
            variant={isOverdrive ? 'danger' : 'primary'}
            size="sm"
            icon={<Zap className={`w-3.5 h-3.5 ${isOverdrive ? 'animate-bounce text-[#ff4d79]' : ''}`} />}
            onClick={onToggleOverdrive}
          >
            {isOverdrive ? 'DISENGAGE' : 'OVERCLOCK'}
          </CyberPillButton>
        </div>
      </div>
    </header>
  );
};
