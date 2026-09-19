export type ScreenTab = 'neural_hud' | 'augment_matrix' | 'grid_tactical' | 'terminal_tuner';

export interface TelemetryMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
  numericVal: number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: 'cyan' | 'violet' | 'sky' | 'emerald';
  segments: number[]; // 0 to 10 for bar meters
}

export interface Operative {
  id: string;
  codename: string;
  callsign: string;
  role: string;
  avatarUrl: string;
  syncIndex: number;
  neuralDrift: number;
  vitalsHeart: number;
  status: 'SYNCHRONIZED' | 'CALIBRATED' | 'AUGMENTED' | 'OVERDRIVE';
  augmentCount: number;
  installedModules: string[];
  chassisClass: 'MK-IV VANGUARD' | 'MK-VII CYBER-SPEC' | 'AEGIS-9 HEAVY' | 'SPECTRE PHANTOM';
  currentSector: string;
}

export interface AugmentModule {
  id: string;
  title: string;
  category: 'NEURAL' | 'OPTICS' | 'BIOMECH' | 'DEFENSE' | 'QUANTUM';
  tier: 'PROTOTYPE' | 'MIL-SPEC' | 'BLACK-OPS' | 'VANGUARD';
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  powerDrawWatts: number;
  neuralTolerancePct: number;
  syncLatencyMs: number;
  thermalDissipationKw: number;
  chassisSlot: 'CORTEX' | 'OCULAR' | 'MYOMER' | 'DERMAL' | 'CORE';
  specs: {
    label: string;
    value: string;
  }[];
  priceCreds: number;
}

export interface SectorNode {
  id: string;
  name: string;
  code: string;
  coordinates: string;
  status: 'ONLINE' | 'DEFENDING' | 'OVERLOAD' | 'SYNCHRONIZED';
  pingMs: number;
  trafficGbps: number;
  deflectionCount: number;
  threatLevel: 'MINIMAL' | 'ELEVATED' | 'CRITICAL';
  securityProtocol: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'SYSTEM' | 'NEURAL' | 'PHOTONIC' | 'SECURITY';
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
  nodeTag: string;
}

export interface CalibrationState {
  synapticClock: number; // 1.0x to 4.5x
  photonicIntensity: number; // 10% to 100%
  neuroDampener: number; // 0% to 100%
  cryoCoolingRatio: number; // 20% to 100%
  quantumEntropy: number;
  coreTempCelsius: number;
  overdriveEngaged: boolean;
}
