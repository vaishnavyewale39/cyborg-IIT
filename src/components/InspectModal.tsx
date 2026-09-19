import React from 'react';
import { AugmentModule, Operative } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { X, Cpu, Zap, Radio, Thermometer, ShieldCheck, Activity } from 'lucide-react';
import { playTactileClick, playHudConfirm } from '../utils/audio';

interface InspectModalProps {
  item: AugmentModule | Operative | null;
  type: 'augment' | 'operative' | null;
  onClose: () => void;
  isInstalled?: boolean;
  onToggleInstall?: (id: string) => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({
  item,
  type,
  onClose,
  isInstalled,
  onToggleInstall
}) => {
  if (!item || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container: Elevated HUD Deck (Z2) with cyan to violet gradient border */}
      <div className="relative w-full max-w-2xl rounded-xl p-[1.5px] bg-gradient-to-br from-[#00f2fe] via-[#7b2cbf] to-[#9d4edd] shadow-[0_0_35px_rgba(0,242,254,0.3)]">
        <div className="rounded-[10px] bg-[#1a1a24] p-6 text-white max-h-[90vh] overflow-y-auto">
          {/* Header bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">
                // INSPECT_HUD_DECK_Z2 // {type.toUpperCase()}
              </span>
            </div>
            <button
              id="btn-close-inspect-modal"
              type="button"
              onClick={() => {
                playTactileClick();
                onClose();
              }}
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          {type === 'augment' ? (
            (() => {
              const aug = item as AugmentModule;
              return (
                <div className="mt-4 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-48 h-36 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-[#0a0a0f]">
                      <img
                        src={aug.imageUrl}
                        alt={aug.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#00f2fe]">
                        SLOT: {aug.chassisSlot}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#9d4edd]/20 text-[#e0b6ff] border border-[#9d4edd]/40">
                          {aug.tier}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          ID: {aug.id}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold font-display text-white mt-1">
                        {aug.title}
                      </h2>
                      <p className="text-xs font-sans text-[#94a3b8] mt-2 leading-relaxed">
                        {aug.fullDesc}
                      </p>
                    </div>
                  </div>

                  {/* Telemetry Matrix Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10">
                      <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#00f2fe]" /> POWER DRAW
                      </div>
                      <div className="text-base font-bold text-white mt-1">
                        {aug.powerDrawWatts} W
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10">
                      <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-[#9d4edd]" /> NEURAL TOL
                      </div>
                      <div className="text-base font-bold text-[#9d4edd] mt-1">
                        {aug.neuralTolerancePct}%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10">
                      <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                        <Radio className="w-3 h-3 text-[#4cc9f0]" /> LATENCY
                      </div>
                      <div className="text-base font-bold text-[#4cc9f0] mt-1">
                        {aug.syncLatencyMs} ms
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10">
                      <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-[#ff7875]" /> THERMAL
                      </div>
                      <div className="text-base font-bold text-[#ff7875] mt-1">
                        {aug.thermalDissipationKw} kW
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs List */}
                  <div className="p-4 rounded-lg bg-[#0a0a0f] border border-white/10 font-mono text-xs space-y-2">
                    <div className="text-[10px] text-[#00f2fe] tracking-widest uppercase mb-1">
                      CHASSIS INTERFACE SPECIFICATIONS
                    </div>
                    {aug.specs.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-[#94a3b8]">{s.label}</span>
                        <span className="text-white font-bold">{s.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#94a3b8]">CREDIT ALLOCATION</span>
                      <span className="text-[#00f2fe] font-bold">{aug.priceCreds.toLocaleString()} CR</span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {onToggleInstall && (
                      <CyberPillButton
                        variant={isInstalled ? 'danger' : 'primary'}
                        size="md"
                        onClick={() => {
                          onToggleInstall(aug.id);
                          onClose();
                        }}
                      >
                        {isInstalled ? 'UNINSTALL FROM CHASSIS' : 'INSTALL INTO CHASSIS'}
                      </CyberPillButton>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            (() => {
              const op = item as Operative;
              return (
                <div className="mt-4 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#00f2fe] shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                      <img
                        src={op.avatarUrl}
                        alt={op.codename}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#00f2fe] font-bold">
                          CALLSIGN: [{op.callsign}]
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                          {op.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold font-display text-white mt-1">
                        {op.codename}
                      </h2>
                      <p className="text-xs font-mono text-[#94a3b8] mt-1">
                        {op.role} // {op.chassisClass}
                      </p>
                      <div className="text-[11px] font-mono text-[#00f2fe] mt-1">
                        ASSIGNMENT: {op.currentSector}
                      </div>
                    </div>
                  </div>

                  {/* Operative Vitals & Sync Matrix */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-center">
                      <div className="text-[10px] text-[#94a3b8]">NEURAL SYNC</div>
                      <div className="text-xl font-bold text-[#00f2fe] mt-1">
                        {op.syncIndex}%
                      </div>
                      <div className="text-[9px] text-[#10b981]">OPTIMAL</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-center">
                      <div className="text-[10px] text-[#94a3b8]">CORTICAL DRIFT</div>
                      <div className="text-xl font-bold text-[#9d4edd] mt-1">
                        {op.neuralDrift} δ
                      </div>
                      <div className="text-[9px] text-white/40">&lt; 0.01 LIMIT</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-center">
                      <div className="text-[10px] text-[#94a3b8]">RESTING PULSE</div>
                      <div className="text-xl font-bold text-[#4cc9f0] mt-1">
                        {op.vitalsHeart} BPM
                      </div>
                      <div className="text-[9px] text-[#4cc9f0]">STABILIZED</div>
                    </div>
                  </div>

                  {/* Installed Modules */}
                  <div className="p-4 rounded-lg bg-[#0a0a0f] border border-white/10 font-mono text-xs space-y-2">
                    <div className="text-[10px] text-[#00f2fe] tracking-widest uppercase mb-1">
                      ACTIVE AUGMENTATION SUITE ({op.installedModules.length} INSTALLED)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {op.installedModules.map((modId) => (
                        <span
                          key={modId}
                          className="px-2.5 py-1 rounded bg-[#12121a] border border-[#00f2fe]/30 text-[#00f2fe] text-[11px]"
                        >
                          // {modId}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <CyberPillButton
                      variant="primary"
                      size="md"
                      onClick={() => {
                        playHudConfirm();
                        onClose();
                      }}
                    >
                      PULSE NEURAL SYNC
                    </CyberPillButton>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};
