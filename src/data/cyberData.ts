import { AugmentModule, Operative, SectorNode, LogEntry, TelemetryMetric } from '../types';

export const INITIAL_METRICS: TelemetryMetric[] = [
  {
    id: 'synaptic_bw',
    label: 'SYNAPTIC_BANDWIDTH',
    value: '8.42',
    unit: 'Tb/s',
    numericVal: 8.42,
    change: '+0.34 Tb/s',
    trend: 'up',
    color: 'cyan',
    segments: [9, 8, 9, 10, 8, 9, 10, 9]
  },
  {
    id: 'neural_drift',
    label: 'NEURAL_DRIFT_INDEX',
    value: '0.003',
    unit: 'δ',
    numericVal: 0.003,
    change: '-0.001 δ',
    trend: 'down',
    color: 'violet',
    segments: [2, 1, 3, 2, 1, 2, 1, 1]
  },
  {
    id: 'core_temp',
    label: 'CRYOGENIC_CORE_TEMP',
    value: '38.2',
    unit: '°C',
    numericVal: 38.2,
    change: 'NOMINAL',
    trend: 'stable',
    color: 'sky',
    segments: [5, 5, 6, 5, 6, 5, 5, 6]
  },
  {
    id: 'photonic_flux',
    label: 'PHOTONIC_EMISSION_RATE',
    value: '94.8',
    unit: 'THz',
    numericVal: 94.8,
    change: '+1.8 THz',
    trend: 'up',
    color: 'emerald',
    segments: [8, 9, 9, 10, 9, 9, 10, 10]
  }
];

export const OPERATIVES_LIST: Operative[] = [
  {
    id: 'op-01',
    codename: 'VALKYRIE-09',
    callsign: 'Kestrel',
    role: 'Vanguard Neural Tactician',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    syncIndex: 99.8,
    neuralDrift: 0.002,
    vitalsHeart: 68,
    status: 'SYNCHRONIZED',
    augmentCount: 6,
    installedModules: ['apex-optic-9', 'cortex-synapse-v5', 'aegis-dermal-matrix'],
    chassisClass: 'MK-IV VANGUARD',
    currentSector: 'Sector 01 // Neo-Kyoto Core'
  },
  {
    id: 'op-02',
    codename: 'CIPHER-KAI',
    callsign: 'Spectre',
    role: 'Deep Quantum Infiltrator',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    syncIndex: 98.4,
    neuralDrift: 0.007,
    vitalsHeart: 72,
    status: 'AUGMENTED',
    augmentCount: 5,
    installedModules: ['quantum-transceiver-q7', 'cortex-synapse-v5', 'myomer-titanium-actuator'],
    chassisClass: 'MK-VII CYBER-SPEC',
    currentSector: 'Sector 07 // Zurich Quantum Hub'
  },
  {
    id: 'op-03',
    codename: 'NEXUS-PRIME',
    callsign: 'Archon',
    role: 'Orbital Strike Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    syncIndex: 97.9,
    neuralDrift: 0.009,
    vitalsHeart: 64,
    status: 'CALIBRATED',
    augmentCount: 7,
    installedModules: ['bio-shield-photonic', 'apex-optic-9', 'quantum-transceiver-q7'],
    chassisClass: 'AEGIS-9 HEAVY',
    currentSector: 'Sector 04 // Orbital Ring Relay'
  },
  {
    id: 'op-04',
    codename: 'GHOST-AURA',
    callsign: 'Wraith',
    role: 'Synthetic Counter-Intrusion Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    syncIndex: 99.2,
    neuralDrift: 0.004,
    vitalsHeart: 70,
    status: 'OVERDRIVE',
    augmentCount: 4,
    installedModules: ['cortex-synapse-v5', 'bio-shield-photonic'],
    chassisClass: 'SPECTRE PHANTOM',
    currentSector: 'Sector 12 // Pacific Sub-Trench'
  }
];

export const AUGMENT_CATALOG: AugmentModule[] = [
  {
    id: 'apex-optic-9',
    title: 'Apex-9 Optic Suite (LiDAR Spectrometry)',
    category: 'OPTICS',
    tier: 'MIL-SPEC',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Sub-millimeter ocular telemetry with dual-channel multispectral LiDAR and electromagnetic infrared overlay.',
    fullDesc: 'The Apex-9 replaces biological retinal matrices with an ultra-dense graphene photodiode array. Capable of processing 1,440 frames per second with real-time ballistic vector calculation and thermal footprint tracking.',
    powerDrawWatts: 42,
    neuralTolerancePct: 96,
    syncLatencyMs: 0.8,
    thermalDissipationKw: 0.15,
    chassisSlot: 'OCULAR',
    specs: [
      { label: 'RESOLUTION', value: '16K Ultra-Optic' },
      { label: 'SPECTRUM', value: 'UV / IR / LiDAR' },
      { label: 'LATENCY', value: '0.8 ms' },
      { label: 'CHOPPER_FREQ', value: '4.8 GHz' }
    ],
    priceCreds: 84500
  },
  {
    id: 'cortex-synapse-v5',
    title: 'Cortex V5 Synaptic Overdrive',
    category: 'NEURAL',
    tier: 'VANGUARD',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Direct cerebrovascular nano-mesh accelerating cognitive throughput by 420% under combat loads.',
    fullDesc: 'Constructed from bio-compatible superconductive carbon nanotubes woven into the prefrontal cortex and parietal lobes. Bridges cortical synapses directly to high-frequency cryptographic memory banks.',
    powerDrawWatts: 88,
    neuralTolerancePct: 99,
    syncLatencyMs: 0.2,
    thermalDissipationKw: 0.38,
    chassisSlot: 'CORTEX',
    specs: [
      { label: 'THROUGHPUT', value: '12.4 Tbps' },
      { label: 'SYNAPSE_ACCEL', value: '+420%' },
      { label: 'NEURO_DRIFT', value: '< 0.002%' },
      { label: 'QUANTUM_CORES', value: '128 Qubits' }
    ],
    priceCreds: 142000
  },
  {
    id: 'myomer-titanium-actuator',
    title: 'Titanium-Carbide Myomer Actuator Rig',
    category: 'BIOMECH',
    tier: 'MIL-SPEC',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Artificial contractile bundle delivering 18,000 Newtons of instant kinetic force with micro-hydraulic stabilization.',
    fullDesc: 'Synthetic muscle fibers utilizing electro-active polymers shielded by titanium-carbide skeletal sleeves. Eliminates biological fatigue limits while dampening kinetic shock transfers by 94%.',
    powerDrawWatts: 120,
    neuralTolerancePct: 91,
    syncLatencyMs: 1.4,
    thermalDissipationKw: 0.62,
    chassisSlot: 'MYOMER',
    specs: [
      { label: 'PEAK_FORCE', value: '18.4 kN' },
      { label: 'RESPONSE_TIME', value: '1.2 ms' },
      { label: 'SHOCK_ABSORPTION', value: '94.2%' },
      { label: 'WEIGHT_RATIO', value: '24:1' }
    ],
    priceCreds: 98000
  },
  {
    id: 'aegis-dermal-matrix',
    title: 'Aegis-X Sub-Dermal Reactive Weave',
    category: 'DEFENSE',
    tier: 'BLACK-OPS',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Non-Newtonian shear-thickening graphene dermal sheath with integrated micro-deflection nodes.',
    fullDesc: 'Implanted directly into the hypodermal layer, the Aegis-X instantly transitions from supple biological flexibility to diamondoid hardness upon hyper-velocity projectile or thermal blade impact.',
    powerDrawWatts: 35,
    neuralTolerancePct: 94,
    syncLatencyMs: 0.4,
    thermalDissipationKw: 0.12,
    chassisSlot: 'DERMAL',
    specs: [
      { label: 'KINETIC_RESIST', value: 'Level IV AP' },
      { label: 'THERMAL_LIMIT', value: '2,800 °C' },
      { label: 'REACT_TIME', value: '0.04 ms' },
      { label: 'MASS_IMPACT', value: '-85%' }
    ],
    priceCreds: 115000
  },
  {
    id: 'quantum-transceiver-q7',
    title: 'Quantum Entangled Q-7 Transceiver',
    category: 'QUANTUM',
    tier: 'PROTOTYPE',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Zero-latency orbital node synchronization through closed-loop quantum entanglement channels.',
    fullDesc: 'Houses an isolated cryogenic vacuum chamber with 64 pair-entangled rubidium atoms. Guarantees unbreakable cryptographic command streaming even in hyper-dense electronic warfare fields.',
    powerDrawWatts: 65,
    neuralTolerancePct: 98,
    syncLatencyMs: 0.01,
    thermalDissipationKw: 0.22,
    chassisSlot: 'CORE',
    specs: [
      { label: 'TRANSMISSION', value: '0.00 ms (Instant)' },
      { label: 'SECURITY', value: '2048-QKD' },
      { label: 'CHANNELS', value: '64 Concurrent' },
      { label: 'CARRIER_FREQ', value: 'Quantum Zero' }
    ],
    priceCreds: 210000
  },
  {
    id: 'bio-shield-photonic',
    title: 'Bio-Shield Photonic Matrix Emitter',
    category: 'DEFENSE',
    tier: 'VANGUARD',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Localized electromagnetic plasma envelope dispersing concentrated energy fire and ionic pulses.',
    fullDesc: 'Projects a 360-degree energized photon halo around the operative silhouette. Automatically compensates for directional ballistic angles through harmonic frequency oscillation.',
    powerDrawWatts: 140,
    neuralTolerancePct: 90,
    syncLatencyMs: 1.1,
    thermalDissipationKw: 0.74,
    chassisSlot: 'CORE',
    specs: [
      { label: 'SHIELD_CAPACITY', value: '6,400 Joules' },
      { label: 'RECHARGE_RATE', value: '820 J/s' },
      { label: 'DEFLECTION_ARC', value: '360° Omnidirectional' },
      { label: 'SPECTRUM', value: 'Photonic Blue' }
    ],
    priceCreds: 175000
  }
];

export const SECTOR_NODES: SectorNode[] = [
  {
    id: 'sec-01',
    name: 'Sector 01 // Neo-Kyoto Cyber Grid',
    code: 'NKY-GRID-01',
    coordinates: '35.0116° N, 135.7681° E',
    status: 'ONLINE',
    pingMs: 1.2,
    trafficGbps: 489.2,
    deflectionCount: 14208,
    threatLevel: 'MINIMAL',
    securityProtocol: 'QUANTUM_AEGIS_V9'
  },
  {
    id: 'sec-04',
    name: 'Sector 04 // Orbital Ring Relay Alpha',
    code: 'ORB-RING-04',
    coordinates: 'GEO-SYNC 35,786 KM ALT',
    status: 'SYNCHRONIZED',
    pingMs: 4.8,
    trafficGbps: 1240.5,
    deflectionCount: 39450,
    threatLevel: 'MINIMAL',
    securityProtocol: 'PHOTON_FIREWALL_PRIME'
  },
  {
    id: 'sec-07',
    name: 'Sector 07 // Zurich Quantum Hub',
    code: 'ZUR-HUB-07',
    coordinates: '47.3769° N, 8.5417° E',
    status: 'DEFENDING',
    pingMs: 2.1,
    trafficGbps: 874.0,
    deflectionCount: 68210,
    threatLevel: 'ELEVATED',
    securityProtocol: 'INTRUSION_COUNTER_V4'
  },
  {
    id: 'sec-12',
    name: 'Sector 12 // Pacific Sub-Trench Relay',
    code: 'PAC-DEEP-12',
    coordinates: '11.3493° N, 142.1996° E',
    status: 'ONLINE',
    pingMs: 8.4,
    trafficGbps: 2150.8,
    deflectionCount: 91040,
    threatLevel: 'MINIMAL',
    securityProtocol: 'CRYO_SUBMERSIBLE_ISOLATE'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-01',
    timestamp: '02:14:18.420',
    category: 'PHOTONIC',
    severity: 'INFO',
    message: 'Photonic beam resonance locked at 94.8 THz across 8 telemetry quadrants.',
    nodeTag: 'NODE_CYBER_77X'
  },
  {
    id: 'log-02',
    timestamp: '02:14:19.012',
    category: 'NEURAL',
    severity: 'INFO',
    message: 'Operative VALKYRIE-09 established zero-drift cortical link. Index 99.8%.',
    nodeTag: 'MK-IV-CORE'
  },
  {
    id: 'log-03',
    timestamp: '02:14:20.180',
    category: 'SECURITY',
    severity: 'WARN',
    message: 'Divergent handshake packet dropped at Sector 07 ingress relay. Origin masked.',
    nodeTag: 'ZUR-HUB-07'
  },
  {
    id: 'log-04',
    timestamp: '02:14:21.500',
    category: 'SYSTEM',
    severity: 'INFO',
    message: 'Cryogenic core pumps adjusted. Stabilized at 38.2 °C baseline.',
    nodeTag: 'CRYO_PUMP_02'
  },
  {
    id: 'log-05',
    timestamp: '02:14:22.890',
    category: 'PHOTONIC',
    severity: 'INFO',
    message: 'Aegis photonic array verified 6,400 Joule capacity. Deflection ready.',
    nodeTag: 'AEGIS_SHIELD_ARRAY'
  }
];
