import React, { useState, useEffect, useRef } from 'react';
import { SectorNode } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { Globe, Radio, Shield, AlertTriangle, ArrowRight, Zap, RefreshCw, Lock } from 'lucide-react';
import { playHudConfirm, playTactileClick, playWarningTone } from '../utils/audio';

interface GridTacticalDeckProps {
  sectors: SectorNode[];
  onSelectSector: (sector: SectorNode) => void;
  selectedSectorId: string;
}

export const GridTacticalDeck: React.FC<GridTacticalDeckProps> = ({
  sectors,
  onSelectSector,
  selectedSectorId
}) => {
  const [activeSectors, setActiveSectors] = useState<SectorNode[]>(sectors);
  const [isPinging, setIsPinging] = useState(false);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSector = activeSectors.find(s => s.id === selectedSectorId) || activeSectors[0];

  // Rotating Radar Sweep Canvas
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 15;

      // Draw concentric radar range rings
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1.0].forEach((mult) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * mult, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Azimuth crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.stroke();

      // Rotating photonic sweep beam
      const sweepGradient = ctx.createConicGradient(angle, cx, cy);
      sweepGradient.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
      sweepGradient.addColorStop(0.1, 'rgba(0, 242, 254, 0.05)');
      sweepGradient.addColorStop(0.2, 'transparent');
      sweepGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Sweep lead line
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.stroke();

      // Draw sector blips
      activeSectors.forEach((sec, idx) => {
        const blipAngle = (idx * (Math.PI / 2)) + 0.4;
        const dist = r * (0.45 + (idx % 3) * 0.2);
        const bx = cx + Math.cos(blipAngle) * dist;
        const by = cy + Math.sin(blipAngle) * dist;

        const isSelected = sec.id === selectedSectorId;

        // Blip outer pulse
        ctx.fillStyle = isSelected ? 'rgba(0, 242, 254, 0.3)' : 'rgba(157, 78, 221, 0.3)';
        ctx.beginPath();
        ctx.arc(bx, by, isSelected ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();

        // Blip core
        ctx.fillStyle = isSelected ? '#00f2fe' : '#9d4edd';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isSelected ? '#00f2fe' : '#94a3b8';
        ctx.font = '9px "Space Mono", monospace';
        ctx.fillText(sec.code, bx + 10, by + 3);
      });

      angle += 0.025;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSectors, selectedSectorId]);

  const handlePingAll = () => {
    setIsPinging(true);
    playTactileClick();
    setTimeout(() => {
      setActiveSectors(prev => prev.map(s => ({
        ...s,
        pingMs: Number((Math.random() * 5 + 0.8).toFixed(1)),
        trafficGbps: Number((s.trafficGbps + (Math.random() * 20 - 10)).toFixed(1))
      })));
      setIsPinging(false);
      playHudConfirm();
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#4cc9f0] tracking-widest uppercase">
              // DECK_03: GRID_TACTICAL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cc9f0] animate-ping" />
            <span className="text-[11px] font-mono text-white/40">
              GLOBAL DEFENSE NODE ARRAY & SUB-ORBITAL RELAYS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">
            Tactical Operations & Grid Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <CyberPillButton
            id="btn-ping-sectors"
            variant="ghost"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#00f2fe]' : ''}`} />}
            onClick={handlePingAll}
            disabled={isPinging}
          >
            {isPinging ? 'PINGING...' : 'PING ALL SECTORS'}
          </CyberPillButton>
        </div>
      </div>

      {/* Grid: Tactical Radar View + Sector Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar & Sector List (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Radar HUD Card */}
          <div className="rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative cockpit-highlight">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-xs font-mono text-[#00f2fe] tracking-wider uppercase">
                  // RADAR_SWEEP_POLAR_AZIMUTH
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40">RANGE: 40,000 KM GEO-SYNC</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              <canvas
                ref={radarCanvasRef}
                width={260}
                height={260}
                className="w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] rounded-full bg-[#0a0a0f] border border-[#00f2fe]/20 shadow-[0_0_25px_rgba(0,242,254,0.15)]"
              />

              {/* Legend & live stats */}
              <div className="space-y-3 font-mono text-xs w-full sm:w-auto">
                <div className="p-2.5 rounded bg-[#0a0a0f] border border-white/[0.06]">
                  <div className="text-[10px] text-[#94a3b8]">TRACKED RELAYS</div>
                  <div className="text-[#00f2fe] font-bold text-base">4 NODES ACTIVE</div>
                  <div className="text-[10px] text-white/40">ZERO DETECTED BLINDSPOTS</div>
                </div>
                <div className="p-2.5 rounded bg-[#0a0a0f] border border-white/[0.06]">
                  <div className="text-[10px] text-[#94a3b8]">DEFENSE FIREWALL</div>
                  <div className="text-[#9d4edd] font-bold text-base">QKD-QUANTUM SEC</div>
                  <div className="text-[10px] text-[#10b981]">99.99% PACKET INTEGRITY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Nodes List */}
          <div className="space-y-2.5">
            {activeSectors.map((sector) => {
              const isSelected = sector.id === activeSector.id;
              return (
                <div
                  key={sector.id}
                  onClick={() => {
                    playTactileClick();
                    onSelectSector(sector);
                  }}
                  className={`p-3.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1a1a24] border-[#00f2fe]/50 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                      : 'bg-[#12121a]/80 border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      sector.status === 'ONLINE' ? 'bg-[#10b981]' :
                      sector.status === 'SYNCHRONIZED' ? 'bg-[#00f2fe]' : 'bg-[#eab308]'
                    }`} />
                    <div>
                      <div className="text-sm font-bold font-display text-white flex items-center gap-2">
                        <span>{sector.name}</span>
                        <span className="text-[10px] font-mono text-[#94a3b8]">[{sector.code}]</span>
                      </div>
                      <div className="text-[11px] font-mono text-white/40">
                        {sector.coordinates}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right font-mono">
                    <div>
                      <div className="text-xs text-[#00f2fe] font-bold">{sector.pingMs} ms</div>
                      <div className="text-[9px] text-white/40">{sector.trafficGbps} Gbps</div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#00f2fe] translate-x-1' : 'text-white/20'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Sector Deep Telemetry Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-lg p-5 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md relative cockpit-highlight flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-[#00f2fe] tracking-widest uppercase">
                  // SECTOR_INSPECTOR_ACTIVE
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  {activeSector.name}
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeSector.threatLevel === 'MINIMAL'
                  ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                  : 'bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40'
              }`}>
                {activeSector.threatLevel} THREAT
              </span>
            </div>

            {/* Spec readout matrix */}
            <div className="mt-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
                <span className="text-[#94a3b8]">NODE COORDINATES</span>
                <span className="text-white font-bold">{activeSector.coordinates}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
                <span className="text-[#94a3b8]">PING LATENCY</span>
                <span className="text-[#00f2fe] font-bold">{activeSector.pingMs} ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
                <span className="text-[#94a3b8]">DATA THROUGHPUT</span>
                <span className="text-[#4cc9f0] font-bold">{activeSector.trafficGbps} Gbps</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
                <span className="text-[#94a3b8]">COUNTER-DEFLECTIONS</span>
                <span className="text-[#9d4edd] font-bold">{activeSector.deflectionCount.toLocaleString()} PACKETS</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0a0a0f] border border-white/[0.04]">
                <span className="text-[#94a3b8]">DEFENSE PROTOCOL</span>
                <span className="text-white font-bold">{activeSector.securityProtocol}</span>
              </div>
            </div>

            {/* Tactical Directives Queue */}
            <div className="mt-5">
              <div className="text-[10px] font-mono text-[#94a3b8] tracking-wider uppercase mb-2">
                ACTIVE DIRECTIVES QUEUE
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2 rounded bg-[#0a0a0f] border border-white/[0.04] flex items-center justify-between text-white/80">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-[#00f2fe]" /> 01 // ROTATE QUANTUM CORTEX KEYS
                  </span>
                  <span className="text-[10px] text-[#10b981]">STANDBY</span>
                </div>
                <div className="p-2 rounded bg-[#0a0a0f] border border-white/[0.04] flex items-center justify-between text-white/80">
                  <span className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-[#9d4edd]" /> 02 // STRENGTHEN SUBCARRIER HARMONICS
                  </span>
                  <span className="text-[10px] text-[#00f2fe]">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Action Pills */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
            <CyberPillButton
              variant="ghost"
              size="sm"
              icon={<Shield className="w-3.5 h-3.5" />}
              onClick={() => {
                playHudConfirm();
              }}
            >
              DEFENSE SWEEP
            </CyberPillButton>

            <CyberPillButton
              variant="primary"
              size="sm"
              icon={<Zap className="w-3.5 h-3.5" />}
              onClick={() => {
                playHudConfirm();
              }}
            >
              LOCK PROTOCOL
            </CyberPillButton>
          </div>
        </div>
      </div>
    </div>
  );
};
