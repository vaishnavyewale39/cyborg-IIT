import React, { useState, useRef, useEffect } from 'react';
import { CalibrationState } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { Terminal, Sliders, Cpu, Zap, Flame, ShieldAlert, Play, RotateCcw } from 'lucide-react';
import { playHudConfirm, playTactileClick, playWarningTone } from '../utils/audio';

interface TerminalDeckProps {
  calibration: CalibrationState;
  onUpdateCalibration: (updates: Partial<CalibrationState>) => void;
  onResetCalibration: () => void;
}

interface CommandHistory {
  command: string;
  output: string[];
  timestamp: string;
  type: 'success' | 'warn' | 'info';
}

export const TerminalDeck: React.FC<TerminalDeckProps> = ({
  calibration,
  onUpdateCalibration,
  onResetCalibration
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'sys.init --spec mil-v4',
      output: [
        '[BOOT] Cybernetic Kernel v4.28-x86_64 loaded.',
        '[OK] Photonic bus mapped to /dev/synapse0.',
        '[OK] Cryo-cooling pumps synchronized.',
        'Type "help" to list available military command protocols.'
      ],
      timestamp: '02:14:00',
      type: 'info'
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Derived telemetry calculations
  const synapticStress = Math.min(100, Math.round(
    (calibration.synapticClock * 22) + 
    (calibration.photonicIntensity * 0.3) - 
    (calibration.neuroDampener * 0.25)
  ));

  const thermalEquilibrium = Number((
    28.0 + 
    (calibration.synapticClock * 4.2) + 
    (calibration.photonicIntensity * 0.08) - 
    (calibration.cryoCoolingRatio * 0.15)
  ).toFixed(1));

  const quantumFluctuation = Number((
    (calibration.photonicIntensity * 0.6) + 
    (calibration.synapticClock * 8)
  ).toFixed(1));

  const isHazardState = synapticStress > 85 || thermalEquilibrium > 46;

  const handleSliderChange = (key: keyof CalibrationState, val: number) => {
    playTactileClick();
    onUpdateCalibration({ [key]: val });
  };

  const handleRunCommand = (cmdStr?: string) => {
    const commandToRun = (cmdStr || inputVal).trim();
    if (!commandToRun) return;

    playTactileClick();
    const now = new Date().toTimeString().split(' ')[0];
    let output: string[] = [];
    let type: 'success' | 'warn' | 'info' = 'info';

    const lower = commandToRun.toLowerCase();

    if (lower === 'help') {
      output = [
        'CYBERNETIC TELEMETRY PROTOCOL CLI v4.2',
        'Available Directives:',
        '  help              Display this command protocol registry',
        '  status            Inspect real-time synaptic core state',
        '  calibrate         Auto-tune dampers & cooling for nominal sync',
        '  overclock         Force synaptic multiplier to 4.2x (CAUTION)',
        '  cryo --boost      Maximize cryo-pumping ratio to 100%',
        '  ping              Perform ultra-low latency node heartbeat',
        '  clear             Purge terminal output buffer'
      ];
      type = 'info';
    } else if (lower === 'status') {
      output = [
        `[STATUS] Synaptic Clock: ${calibration.synapticClock.toFixed(1)}x`,
        `[STATUS] Photonic Beam: ${calibration.photonicIntensity}%`,
        `[STATUS] Neuro-Dampeners: ${calibration.neuroDampener}%`,
        `[STATUS] Cryo-Cooling: ${calibration.cryoCoolingRatio}%`,
        `[STATUS] Calculated Stress Index: ${synapticStress}% (${isHazardState ? 'CRITICAL' : 'NOMINAL'})`,
        `[STATUS] Thermal Equilibrium: ${thermalEquilibrium}°C`
      ];
      type = isHazardState ? 'warn' : 'success';
    } else if (lower === 'calibrate') {
      onUpdateCalibration({
        synapticClock: 2.2,
        photonicIntensity: 75,
        neuroDampener: 80,
        cryoCoolingRatio: 70
      });
      playHudConfirm();
      output = [
        '[AUTO-CALIBRATE] Re-aligning cortical harmonics...',
        '[OK] Synaptic Clock normalized to 2.2x.',
        '[OK] Neuro-dampeners locked at 80%.',
        '[OK] Cryo-cooling set to 70%. Baseline achieved.'
      ];
      type = 'success';
    } else if (lower === 'overclock') {
      onUpdateCalibration({
        synapticClock: 4.2,
        photonicIntensity: 95
      });
      playWarningTone();
      output = [
        '[WARNING] OVERDRIVE COMMENCING.',
        '[WARN] Synaptic Clock forced to 4.2x.',
        '[WARN] Core temperature rising rapidly. Ensure cryo-circulation!'
      ];
      type = 'warn';
    } else if (lower.includes('cryo')) {
      onUpdateCalibration({ cryoCoolingRatio: 100 });
      playHudConfirm();
      output = [
        '[CRYO] Actuating liquid nitrogen micro-channels...',
        '[OK] Cooling ratio set to 100%. Core temp dampening engaged.'
      ];
      type = 'success';
    } else if (lower === 'ping') {
      output = [
        '[PING] 64 bytes from CYBER-77X-PRIME: icmp_seq=1 ttl=64 time=0.82 ms',
        '[PING] 64 bytes from ZUR-HUB-07: icmp_seq=2 ttl=64 time=1.42 ms',
        '[OK] Packet loss: 0.00% (Quantum zero-drift link).'
      ];
      type = 'success';
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      output = [
        `Command not recognized: "${commandToRun}". Type "help" for syntax.`
      ];
      type = 'warn';
    }

    setHistory(prev => [...prev, { command: commandToRun, output, timestamp: now, type }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">
              // DECK_04: TERMINAL_CALIBRATOR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="text-[11px] font-mono text-white/40">
              CORTICAL CLOCK MULTIPLIER & DIAGNOSTIC CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">
            Neural Calibrator & Terminal Deck
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <CyberPillButton
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              playTactileClick();
              onResetCalibration();
            }}
          >
            RESET TO BASELINE
          </CyberPillButton>
        </div>
      </div>

      {/* Grid: Calibration Controls + Live HUD gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calibrator Tuning Deck (6 cols) */}
        <div className="lg:col-span-6 rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative cockpit-highlight space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00f2fe]" />
              <span className="text-xs font-mono text-[#00f2fe] tracking-wider uppercase">
                // HARDWARE_TUNER_CONTROLS
              </span>
            </div>
            {isHazardState && (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff4d4f]/20 text-[#ff7875] border border-[#ff4d4f]/40 animate-pulse font-bold">
                <ShieldAlert className="w-3 h-3" /> HAZARD THRESHOLD
              </span>
            )}
          </div>

          {/* Slider 1: Synaptic Clock */}
          <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94a3b8]">SYNAPTIC_CLOCK_MULTIPLIER</span>
              <span className="text-[#00f2fe] font-bold text-sm">
                {calibration.synapticClock.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.1"
              value={calibration.synapticClock}
              onChange={(e) => handleSliderChange('synapticClock', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2fe]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30">
              <span>1.0x (Standard)</span>
              <span>2.5x (Tactical)</span>
              <span>4.5x (Hyper-Overdrive)</span>
            </div>
          </div>

          {/* Slider 2: Photonic Beam Intensity */}
          <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94a3b8]">PHOTONIC_BEAM_INTENSITY</span>
              <span className="text-[#4cc9f0] font-bold text-sm">
                {calibration.photonicIntensity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={calibration.photonicIntensity}
              onChange={(e) => handleSliderChange('photonicIntensity', parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4cc9f0]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30">
              <span>10% (Stealth)</span>
              <span>50% (Sustained)</span>
              <span>100% (Maximum Lux)</span>
            </div>
          </div>

          {/* Slider 3: Neuro-Dampener */}
          <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94a3b8]">NEURO_DAMPENER_THRESHOLD</span>
              <span className="text-[#9d4edd] font-bold text-sm">
                {calibration.neuroDampener}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={calibration.neuroDampener}
              onChange={(e) => handleSliderChange('neuroDampener', parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#9d4edd]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30">
              <span>0% (Raw Feedback)</span>
              <span>50% (Filtered)</span>
              <span>100% (Full Isolation)</span>
            </div>
          </div>

          {/* Slider 4: Cryo-Cooling */}
          <div className="p-3.5 rounded-lg bg-[#0a0a0f] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94a3b8]">CRYO_COOLING_PUMP_RATIO</span>
              <span className="text-[#10b981] font-bold text-sm">
                {calibration.cryoCoolingRatio}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={calibration.cryoCoolingRatio}
              onChange={(e) => handleSliderChange('cryoCoolingRatio', parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30">
              <span>20% (Eco)</span>
              <span>60% (Combat Load)</span>
              <span>100% (Absolute Zero)</span>
            </div>
          </div>

          {/* Output Telemetry Summary */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
            <div className="p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
              <div className="text-[10px] text-[#94a3b8]">STRESS INDEX</div>
              <div className={`text-base font-bold ${synapticStress > 80 ? 'text-[#ff4d4f]' : 'text-[#00f2fe]'}`}>
                {synapticStress}%
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
              <div className="text-[10px] text-[#94a3b8]">EQUILIBRIUM</div>
              <div className={`text-base font-bold ${thermalEquilibrium > 44 ? 'text-[#ff4d4f]' : 'text-[#4cc9f0]'}`}>
                {thermalEquilibrium} °C
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
              <div className="text-[10px] text-[#94a3b8]">QUANTUM FLUX</div>
              <div className="text-base font-bold text-[#9d4edd]">
                {quantumFluctuation}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Command CLI Console (6 cols) */}
        <div className="lg:col-span-6 rounded-lg p-5 bg-[#0e0e13] border border-white/[0.08] backdrop-blur-md relative cockpit-highlight flex flex-col justify-between h-[520px]">
          <div>
            {/* Terminal Window Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-xs font-mono text-white font-bold">
                  CYBER_ROOT@CYBER-77X // BASH
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
            </div>

            {/* Suggested quick commands pills */}
            <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none border-b border-white/[0.04]">
              <span className="text-[10px] font-mono text-white/40 shrink-0">QUICK:</span>
              {['status', 'calibrate', 'overclock', 'ping', 'cryo --boost', 'clear'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleRunCommand(cmd)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] hover:bg-[#00f2fe]/15 hover:text-[#00f2fe] text-[#94a3b8] border border-white/10 transition-colors cursor-pointer shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Command History Buffer */}
            <div className="mt-3 space-y-3 font-mono text-xs overflow-y-auto max-h-[300px] pr-2">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-[#00f2fe]">
                    <span className="text-white/40">root@CYBER-77X:~$</span>
                    <span className="font-bold text-white">{item.command}</span>
                    <span className="text-[10px] text-white/20 ml-auto">[{item.timestamp}]</span>
                  </div>
                  <div className="pl-4 border-l border-white/10 space-y-0.5">
                    {item.output.map((outLine, lineIdx) => (
                      <div
                        key={lineIdx}
                        className={`${
                          item.type === 'warn'
                            ? 'text-[#ff7875]'
                            : item.type === 'success'
                            ? 'text-[#10b981]'
                            : 'text-[#94a3b8]'
                        }`}
                      >
                        {outLine}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Interactive Command Input line */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2 font-mono text-xs">
            <span className="text-[#00f2fe] shrink-0">root@CYBER-77X:~$</span>
            <input
              id="terminal-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ENTER COMMAND (e.g. status, calibrate, help)..."
              className="flex-1 bg-transparent text-[#f1f5f9] placeholder-white/25 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleRunCommand()}
              className="p-1.5 rounded bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
