import React, { useState, useEffect } from 'react';
import { ScreenTab, TelemetryMetric, Operative, AugmentModule, SectorNode, LogEntry, CalibrationState } from './types';
import { INITIAL_METRICS, OPERATIVES_LIST, AUGMENT_CATALOG, SECTOR_NODES, INITIAL_LOGS } from './data/cyberData';
import { HeaderHUD } from './components/HeaderHUD';
import { NeuralHUDDeck } from './components/NeuralHUDDeck';
import { AugmentMatrixDeck } from './components/AugmentMatrixDeck';
import { GridTacticalDeck } from './components/GridTacticalDeck';
import { TerminalDeck } from './components/TerminalDeck';
import { InspectModal } from './components/InspectModal';
import { playHudConfirm, playWarningTone, playTactileClick } from './utils/audio';
import { Activity, Shield, Cpu, Terminal, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>('neural_hud');
  const [metrics, setMetrics] = useState<TelemetryMetric[]>(INITIAL_METRICS);
  const [operatives, setOperatives] = useState<Operative[]>(OPERATIVES_LIST);
  const [augments, setAugments] = useState<AugmentModule[]>(AUGMENT_CATALOG);
  const [sectors, setSectors] = useState<SectorNode[]>(SECTOR_NODES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  
  // User's installed augments in their active chassis
  const [installedAugmentIds, setInstalledAugmentIds] = useState<string[]>([
    'cortex-synapse-v5',
    'apex-optic-9',
    'quantum-transceiver-q7'
  ]);

  // Selected sector
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-01');

  // Overdrive state
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);

  // Calibration state
  const [calibration, setCalibration] = useState<CalibrationState>({
    synapticClock: 2.2,
    photonicIntensity: 75,
    neuroDampener: 80,
    cryoCoolingRatio: 70,
    quantumEntropy: 94.1,
    coreTempCelsius: 38.2,
    overdriveEngaged: false
  });

  // Modal inspection
  const [inspectItem, setInspectItem] = useState<AugmentModule | Operative | null>(null);
  const [inspectType, setInspectType] = useState<'augment' | 'operative' | null>(null);

  // Overdrive effect handler
  const handleToggleOverdrive = () => {
    const next = !isOverdrive;
    setIsOverdrive(next);
    if (next) {
      playWarningTone();
      setCalibration(prev => ({
        ...prev,
        synapticClock: 4.2,
        photonicIntensity: 95,
        overdriveEngaged: true
      }));
      setMetrics(prev => prev.map(m => m.id === 'synaptic_bw' ? { ...m, value: '14.80', change: '+6.38 Tb/s' } : m));
      // Add log
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        category: 'SYSTEM',
        severity: 'CRITICAL',
        message: 'OVERDRIVE MODE ENGAGED. Synaptic throughput multiplied across all 5 chassis buses.',
        nodeTag: 'CORE_OVERCLOCK'
      };
      setLogs(prev => [newLog, ...prev.slice(0, 20)]);
    } else {
      playHudConfirm();
      setCalibration(prev => ({
        ...prev,
        synapticClock: 2.2,
        photonicIntensity: 75,
        overdriveEngaged: false
      }));
      setMetrics(prev => prev.map(m => m.id === 'synaptic_bw' ? { ...m, value: '8.42', change: '+0.34 Tb/s' } : m));
    }
  };

  // Run diagnostics pulse
  const handleRunDiagnostics = () => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      category: 'NEURAL',
      severity: 'INFO',
      message: `Full system telemetry scan completed. 4/4 operatives synchronized. 0 packet parity faults.`,
      nodeTag: 'DIAG_CORE'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 20)]);
  };

  // Install / Uninstall augment
  const handleToggleInstall = (augId: string) => {
    setInstalledAugmentIds(prev => {
      const exists = prev.includes(augId);
      let updated: string[];
      if (exists) {
        updated = prev.filter(id => id !== augId);
      } else {
        if (prev.length >= 5) {
          playWarningTone();
          return prev;
        }
        updated = [...prev, augId];
      }
      return updated;
    });
  };

  // Periodic telemetry micro-fluctuation to create authentic living HUD feel
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.id === 'synaptic_bw') {
          const delta = (Math.random() * 0.08 - 0.04);
          const base = isOverdrive ? 14.8 : 8.42;
          const newVal = (base + delta).toFixed(2);
          return { ...m, value: newVal };
        }
        if (m.id === 'neural_drift') {
          const drift = (0.002 + Math.random() * 0.002).toFixed(3);
          return { ...m, value: drift };
        }
        return m;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [isOverdrive]);

  return (
    <div className={`min-h-screen bg-[#0a0a0f] text-[#f1f5f9] flex flex-col cyber-grid relative ${isOverdrive ? 'border-t-2 border-[#ff0055]' : ''}`}>
      {/* Subtle ambient photonic back-glow lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-[#00f2fe]/[0.025] blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 rounded-full bg-[#9d4edd]/[0.025] blur-3xl pointer-events-none" />

      {/* Primary Header HUD Navigation Bar */}
      <HeaderHUD
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          playTactileClick();
          setActiveScreen(screen);
        }}
        isOverdrive={isOverdrive}
        onToggleOverdrive={handleToggleOverdrive}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeScreen === 'neural_hud' && (
          <NeuralHUDDeck
            metrics={metrics}
            operatives={operatives}
            logs={logs}
            onInspectOperative={(op) => {
              setInspectItem(op);
              setInspectType('operative');
            }}
            isOverdrive={isOverdrive}
            onRunDiagnostics={handleRunDiagnostics}
          />
        )}

        {activeScreen === 'augment_matrix' && (
          <AugmentMatrixDeck
            augments={augments}
            onInspectAugment={(aug) => {
              setInspectItem(aug);
              setInspectType('augment');
            }}
            installedAugmentIds={installedAugmentIds}
            onToggleInstall={handleToggleInstall}
          />
        )}

        {activeScreen === 'grid_tactical' && (
          <GridTacticalDeck
            sectors={sectors}
            onSelectSector={(sector) => setSelectedSectorId(sector.id)}
            selectedSectorId={selectedSectorId}
          />
        )}

        {activeScreen === 'terminal_tuner' && (
          <TerminalDeck
            calibration={calibration}
            onUpdateCalibration={(updates) => setCalibration(prev => ({ ...prev, ...updates }))}
            onResetCalibration={() => {
              setCalibration({
                synapticClock: 2.2,
                photonicIntensity: 75,
                neuroDampener: 80,
                cryoCoolingRatio: 70,
                quantumEntropy: 94.1,
                coreTempCelsius: 38.2,
                overdriveEngaged: false
              });
              setIsOverdrive(false);
              playHudConfirm();
            }}
          />
        )}
      </main>

      {/* Footer HUD Diagnostics Bar */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#0e0e13]/90 backdrop-blur-md px-4 sm:px-8 py-3 text-xs font-mono text-[#94a3b8] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe]" />
            <span className="text-white font-bold tracking-wider">CYBERNETIC PRECISION</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-[11px] text-white/50">CHASSIS_SYS: MK-IV CALIBRATED</span>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="text-[11px] text-[#00f2fe] hidden md:inline">4 OPERATIVES DIRECT LINK</span>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
          <div>QKD ENCRYPTION: <span className="text-[#10b981]">LOCKED</span></div>
          <span className="text-white/20">|</span>
          <div>UPTIME: <span className="text-white">99.999%</span></div>
          <span className="text-white/20">|</span>
          <span className="text-[#9d4edd]">MIL-SPEC // SEC-V4</span>
        </div>
      </footer>

      {/* Inspect Modal (Z2 Elevated HUD Deck) */}
      <InspectModal
        item={inspectItem}
        type={inspectType}
        onClose={() => {
          setInspectItem(null);
          setInspectType(null);
        }}
        isInstalled={inspectType === 'augment' && inspectItem ? installedAugmentIds.includes(inspectItem.id) : false}
        onToggleInstall={inspectType === 'augment' && inspectItem ? () => handleToggleInstall(inspectItem.id) : undefined}
      />
    </div>
  );
}
