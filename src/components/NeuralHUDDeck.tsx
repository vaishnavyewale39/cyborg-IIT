import React, { useState, useEffect, useRef } from 'react';
import { TelemetryMetric, Operative, LogEntry } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { Activity, ShieldCheck, Cpu, Waves, ArrowUpRight, Zap, RefreshCw, Radio } from 'lucide-react';
import { playHudConfirm, playTactileClick } from '../utils/audio';

interface NeuralHUDDeckProps {
  metrics: TelemetryMetric[];
  operatives: Operative[];
  logs: LogEntry[];
  onInspectOperative: (op: Operative) => void;
  isOverdrive: boolean;
  onRunDiagnostics: () => void;
}

export const NeuralHUDDeck: React.FC<NeuralHUDDeckProps> = ({
  metrics,
  operatives,
  logs,
  onInspectOperative,
  isOverdrive,
  onRunDiagnostics
}) => {
  const [waveMode, setWaveMode] = useState<'ALPHA' | 'GAMMA' | 'SYNAPTIC_FLUX'>('GAMMA');
  const [logFilter, setLogFilter] = useState<'ALL' | 'NEURAL' | 'PHOTONIC' | 'SECURITY'>('ALL');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated synaptic waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw vector background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw baseline axis
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Primary photonic wave (Electric cyan)
      ctx.strokeStyle = isOverdrive ? '#ff0055' : '#00f2fe';
      ctx.lineWidth = 2;
      ctx.shadowColor = isOverdrive ? 'rgba(255, 0, 85, 0.6)' : 'rgba(0, 242, 254, 0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const speedMultiplier = isOverdrive ? 0.08 : 0.04;
      const freq = waveMode === 'GAMMA' ? 0.03 : waveMode === 'ALPHA' ? 0.015 : 0.05;
      const amp = isOverdrive ? 45 : waveMode === 'GAMMA' ? 32 : 22;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * freq + step * speedMultiplier) * amp 
                + Math.sin(x * (freq * 1.8) - step * 0.02) * (amp * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary neural wave (Neon violet)
      ctx.strokeStyle = '#9d4edd';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(157, 78, 221, 0.4)';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.cos(x * (freq * 0.7) - step * speedMultiplier * 0.8) * (amp * 0.6)
                + Math.sin(x * 0.01 + step * 0.01) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;
      step++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [waveMode, isOverdrive]);

  const filteredLogs = logs.filter(l => logFilter === 'ALL' || l.category === logFilter);

  return (
    <div className="space-y-6">
      {/* Top Deck Title & Tactical Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">
              // DECK_01: NEURAL_HUD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
            <span className="text-[11px] font-mono text-white/40">
              QUADRANT_STATUS: NOMINAL // 4 OPERATIVES SYNCED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">
            Tactical Neural Telemetry Deck
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <CyberPillButton
            id="btn-run-diag"
            variant="ghost"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              playHudConfirm();
              onRunDiagnostics();
            }}
          >
            PULSE DIAGNOSTIC
          </CyberPillButton>
          <CyberPillButton
            id="btn-lock-resonance"
            variant="primary"
            size="sm"
            icon={<Radio className="w-3.5 h-3.5" />}
            onClick={() => {
              playHudConfirm();
            }}
          >
            LOCK FREQUENCY
          </CyberPillButton>
        </div>
      </div>

      {/* 4-Quadrant Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const colorClass = {
            cyan: 'text-[#00f2fe]',
            violet: 'text-[#9d4edd]',
            sky: 'text-[#4cc9f0]',
            emerald: 'text-[#10b981]'
          }[m.color];

          const borderGlow = {
            cyan: 'hover:border-[#00f2fe]/40 hover:shadow-[0_0_18px_rgba(0,242,254,0.15)]',
            violet: 'hover:border-[#9d4edd]/40 hover:shadow-[0_0_18px_rgba(157,78,221,0.15)]',
            sky: 'hover:border-[#4cc9f0]/40 hover:shadow-[0_0_18px_rgba(76,201,240,0.15)]',
            emerald: 'hover:border-[#10b981]/40 hover:shadow-[0_0_18px_rgba(16,185,129,0.15)]'
          }[m.color];

          return (
            <div
              key={m.id}
              className={`relative rounded-lg p-4 bg-[#12121a]/85 border border-white/[0.08] backdrop-blur-md transition-all duration-300 cockpit-highlight ${borderGlow}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] tracking-widest">
                <span>{m.label}</span>
                <span className="text-white/30">// 0{m.id.slice(-1)}</span>
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className={`text-3xl font-bold font-mono tracking-tight ${colorClass}`}>
                  {m.value}
                </span>
                <span className="text-xs font-mono text-white/50">{m.unit}</span>
              </div>

              {/* Segmented Sparkline Meter */}
              <div className="mt-3 flex items-center gap-1">
                {m.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-1.5 rounded-xs bg-white/[0.06] overflow-hidden"
                  >
                    <div
                      className={`h-full transition-all duration-500 ${
                        m.color === 'cyan' ? 'bg-[#00f2fe]' :
                        m.color === 'violet' ? 'bg-[#9d4edd]' :
                        m.color === 'sky' ? 'bg-[#4cc9f0]' : 'bg-[#10b981]'
                      }`}
                      style={{ width: `${seg * 10}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>DELTA: {m.change}</span>
                <span className="text-[10px] text-[#00f2fe] uppercase">{m.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Waveform HUD & Synced Operatives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Synaptic Flux Waveform Monitor (7 cols) */}
        <div className="lg:col-span-7 rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative overflow-hidden cockpit-highlight">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-xs font-mono text-[#00f2fe] tracking-wider uppercase">
                  // MOD_01_SYNAPSE_OSCILLOSCOPE
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-0.5">
                Real-Time Synaptic Resonance Flux
              </h3>
            </div>

            {/* Wave mode selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#0a0a0f] border border-white/10 text-[10px] font-mono">
              {(['ALPHA', 'GAMMA', 'SYNAPTIC_FLUX'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setWaveMode(mode);
                  }}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                    waveMode === mode
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Waveform Container */}
          <div className="relative rounded-md bg-[#0a0a0f] border border-white/[0.06] p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={220}
              className="w-full h-[220px] block"
            />
            {/* Top-right telemetry overlay */}
            <div className="absolute top-3 right-4 flex items-center gap-3 text-[10px] font-mono bg-[#12121a]/80 px-2.5 py-1 rounded border border-white/10">
              <span className="text-[#00f2fe]">FREQ: {waveMode === 'GAMMA' ? '60.4 GHz' : '14.2 GHz'}</span>
              <span className="text-white/20">|</span>
              <span className="text-[#9d4edd]">HARMONIC: 0.002%</span>
            </div>
          </div>

          {/* Bottom HUD info bar */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-mono border-t border-white/[0.06] pt-3">
            <div>
              <div className="text-[10px] text-[#94a3b8]">PHASE SYNCHRONY</div>
              <div className="text-[#00f2fe] font-bold text-sm">99.82° NOMINAL</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94a3b8]">CORTICAL DRIFT</div>
              <div className="text-[#9d4edd] font-bold text-sm">0.0031 δ MAX</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94a3b8]">PHOTON PULSE</div>
              <div className="text-[#4cc9f0] font-bold text-sm">820 J/s LOCKED</div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Operatives Synced Matrix (5 cols) */}
        <div className="lg:col-span-5 rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative cockpit-highlight">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#9d4edd]" />
                <span className="text-xs font-mono text-[#9d4edd] tracking-wider uppercase">
                  // MOD_02_OPERATIVES_LINK
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-0.5">
                Active Operative Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              4 ONLINE
            </span>
          </div>

          {/* Operative list */}
          <div className="space-y-3">
            {operatives.map((op) => (
              <div
                key={op.id}
                onClick={() => {
                  playTactileClick();
                  onInspectOperative(op);
                }}
                className="group p-3 rounded-lg bg-[#1a1a24]/70 hover:bg-[#222230]/90 border border-white/[0.06] hover:border-[#00f2fe]/40 transition-all duration-200 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden border border-white/15 group-hover:border-[#00f2fe] transition-colors shrink-0">
                    <img
                      src={op.avatarUrl}
                      alt={op.codename}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-[#00f2fe]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white group-hover:text-[#00f2fe] transition-colors">
                        {op.codename}
                      </span>
                      <span className="text-[10px] font-mono text-[#94a3b8]">
                        [{op.callsign}]
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94a3b8] font-mono">
                      {op.chassisClass}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-[#00f2fe]">
                      {op.syncIndex}%
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/40 mt-0.5">
                    {op.augmentCount} AUGMENTS
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
            <span>LINK PROTOCOL: NEURAL_DIRECT</span>
            <span className="text-[#00f2fe] cursor-pointer hover:underline flex items-center gap-1" onClick={() => onInspectOperative(operatives[0])}>
              INSPECT PILOT <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Diagnostic Event Stream Terminal Panel */}
      <div className="rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative cockpit-highlight">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#4cc9f0] tracking-wider uppercase">
              // MOD_03_DIAGNOSTIC_LOG_STREAM
            </span>
            <span className="text-[10px] font-mono text-white/40">BUFFER: 256 TELEMETRY EVENTS</span>
          </div>

          {/* Log category filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0a0a0f] border border-white/10 text-[10px] font-mono">
            {(['ALL', 'NEURAL', 'PHOTONIC', 'SECURITY'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  playTactileClick();
                  setLogFilter(f);
                }}
                className={`px-3 py-0.5 rounded-full cursor-pointer transition-all ${
                  logFilter === f
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-2 rounded bg-[#0a0a0f]/60 hover:bg-[#1a1a24] border border-white/[0.04] transition-colors"
            >
              <span className="text-white/40 shrink-0">[{log.timestamp}]</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] tracking-wider shrink-0 ${
                  log.category === 'PHOTONIC'
                    ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30'
                    : log.category === 'NEURAL'
                    ? 'bg-[#9d4edd]/15 text-[#9d4edd] border border-[#9d4edd]/30'
                    : 'bg-[#ff4d79]/15 text-[#ff4d79] border border-[#ff4d79]/30'
                }`}
              >
                {log.category}
              </span>
              <span className="text-[#f1f5f9] flex-1">{log.message}</span>
              <span className="text-white/30 text-[10px] hidden md:inline-block">
                TAG: {log.nodeTag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
