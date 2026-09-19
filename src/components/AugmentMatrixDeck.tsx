import React, { useState } from 'react';
import { AugmentModule } from '../types';
import { CyberPillButton } from './CyberPillButton';
import { Cpu, Zap, Thermometer, Radio, Check, Plus, Search, Layers, Eye, Shield } from 'lucide-react';
import { playHudConfirm, playTactileClick, playWarningTone } from '../utils/audio';

interface AugmentMatrixDeckProps {
  augments: AugmentModule[];
  onInspectAugment: (aug: AugmentModule) => void;
  installedAugmentIds: string[];
  onToggleInstall: (augId: string) => void;
}

export const AugmentMatrixDeck: React.FC<AugmentMatrixDeckProps> = ({
  augments,
  onInspectAugment,
  installedAugmentIds,
  onToggleInstall
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'NEURAL', 'OPTICS', 'BIOMECH', 'DEFENSE', 'QUANTUM'];

  const filteredAugments = augments.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.chassisSlot.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate live loadout totals
  const equippedModules = augments.filter(a => installedAugmentIds.includes(a.id));
  const totalPowerDraw = equippedModules.reduce((acc, curr) => acc + curr.powerDrawWatts, 0);
  const totalThermal = equippedModules.reduce((acc, curr) => acc + curr.thermalDissipationKw, 0);
  const avgTolerance = equippedModules.length > 0 
    ? Math.round(equippedModules.reduce((acc, curr) => acc + curr.neuralTolerancePct, 0) / equippedModules.length)
    : 100;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#9d4edd] tracking-widest uppercase">
              // DECK_02: AUGMENT_MATRIX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9d4edd] animate-pulse" />
            <span className="text-[11px] font-mono text-white/40">
              HARDWARE SPECIFICATIONS & BIOMECHANICAL SUITE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-1">
            Cybernetic Augmentation Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#94a3b8]">
            CHASSIS SLOTS: <span className="text-[#00f2fe] font-bold">{equippedModules.length}/5 EQUIPPED</span>
          </span>
        </div>
      </div>

      {/* Chassis Loadout HUD Summary Banner */}
      <div className="rounded-lg p-4 bg-[#12121a]/90 border border-white/[0.08] backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-4 cockpit-highlight">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#94a3b8] uppercase">POWER_DRAW_TOTAL</div>
            <div className="text-lg font-mono font-bold text-white">
              {totalPowerDraw} <span className="text-xs text-[#00f2fe]">/ 500 W</span>
            </div>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full ${totalPowerDraw > 400 ? 'bg-[#ff4d4f]' : 'bg-[#00f2fe]'}`}
                style={{ width: `${(totalPowerDraw / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#9d4edd]/10 border border-[#9d4edd]/30 flex items-center justify-center text-[#9d4edd]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#94a3b8] uppercase">NEURAL_TOLERANCE</div>
            <div className="text-lg font-mono font-bold text-[#9d4edd]">
              {avgTolerance}% <span className="text-xs text-white/50">SAFE</span>
            </div>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#9d4edd]"
                style={{ width: `${avgTolerance}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#4cc9f0]/10 border border-[#4cc9f0]/30 flex items-center justify-center text-[#4cc9f0]">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#94a3b8] uppercase">THERMAL_DISSIPATION</div>
            <div className="text-lg font-mono font-bold text-[#4cc9f0]">
              {totalThermal.toFixed(2)} <span className="text-xs text-white/50">kW</span>
            </div>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#4cc9f0]"
                style={{ width: `${Math.min(100, (totalThermal / 2.5) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start md:justify-end">
          <div className="text-right font-mono text-xs">
            <div className="text-[#94a3b8]">CHASSIS RECEPTACLE</div>
            <div className="text-[#00f2fe] font-bold">MK-IV CYBER-SPEC</div>
            <div className="text-[10px] text-white/40">CALIBRATION: SYNCHRONIZED</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-btn-${cat}`}
              onClick={() => {
                playTactileClick();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/50 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                  : 'bg-[#12121a] text-[#94a3b8] border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input with 1px ghost boundary & cyan focus corona */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="input-augment-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER MODULE SPECS..."
            className="w-full pl-9 pr-4 py-1.5 rounded-md bg-[#12121a] border border-white/15 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#00f2fe] focus:shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all"
          />
        </div>
      </div>

      {/* Modular Augment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAugments.map((aug) => {
          const isInstalled = installedAugmentIds.includes(aug.id);

          return (
            <div
              key={aug.id}
              className={`group rounded-lg bg-[#12121a]/90 border transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between cockpit-highlight ${
                isInstalled
                  ? 'border-[#00f2fe]/50 shadow-[0_0_20px_rgba(0,242,254,0.18)]'
                  : 'border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'
              }`}
            >
              {/* Image Banner with Cyber HUD Overlay */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0a0a0f] border-b border-white/[0.08]">
                <img
                  src={aug.imageUrl}
                  alt={aug.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Cyber HUD grid & crosshair overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/60 pointer-events-none" />
                <div className="absolute inset-0 cyber-grid-dense pointer-events-none" />
                
                {/* Crosshair markers in corners */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00f2fe]/60 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00f2fe]/60 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00f2fe]/60 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00f2fe]/60 pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0a0a0f]/80 backdrop-blur-md border border-[#00f2fe]/40 text-[#00f2fe]">
                    SLOT: {aug.chassisSlot}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#9d4edd]/20 backdrop-blur-md border border-[#9d4edd]/40 text-[#e0b6ff]">
                    {aug.tier}
                  </span>
                </div>

                {/* Installed Status Badge */}
                {isInstalled && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00f2fe] text-[#00373a] shadow-[0_0_12px_rgba(0,242,254,0.6)]">
                    <Check className="w-3 h-3" />
                    <span>INSTALLED</span>
                  </div>
                )}

                {/* Bottom telemetry overlay */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/70">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#00f2fe]" /> {aug.powerDrawWatts} W
                  </span>
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-[#4cc9f0]" /> {aug.syncLatencyMs} ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-[#9d4edd]" /> {aug.thermalDissipationKw} kW
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#94a3b8] tracking-widest uppercase">
                    // MOD_{aug.id.toUpperCase().slice(0, 10)}
                  </div>
                  <h3 className="text-base font-bold font-display text-white mt-1 group-hover:text-[#00f2fe] transition-colors line-clamp-1">
                    {aug.title}
                  </h3>
                  <p className="text-xs font-sans text-[#94a3b8] mt-2 line-clamp-2 leading-relaxed">
                    {aug.shortDesc}
                  </p>

                  {/* Spec table */}
                  <div className="mt-3 grid grid-cols-2 gap-2 bg-[#0a0a0f]/60 rounded-md p-2 border border-white/[0.04] text-[11px] font-mono">
                    {aug.specs.slice(0, 2).map((s, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[9px] text-white/40">{s.label}</span>
                        <span className="text-white font-medium">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      onInspectAugment(aug);
                    }}
                    className="text-xs font-mono text-[#94a3b8] hover:text-[#00f2fe] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>INSPECT SPEC</span>
                  </button>

                  <CyberPillButton
                    id={`btn-install-${aug.id}`}
                    variant={isInstalled ? 'danger' : 'primary'}
                    size="sm"
                    icon={isInstalled ? <Shield className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    onClick={() => {
                      if (isInstalled) {
                        playWarningTone();
                      } else {
                        playHudConfirm();
                      }
                      onToggleInstall(aug.id);
                    }}
                  >
                    {isInstalled ? 'UNINSTALL' : 'INSTALL'}
                  </CyberPillButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
