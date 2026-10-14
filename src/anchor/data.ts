import { C } from './tokens';
import type {
  Alert,
  AlagaStage,
  AnchorState,
  LogoConcept,
  ModuleKey,
  PositionDef,
  PositionKey,
  SavedUser,
  TabDef,
  ViewDef,
  ViewKey,
} from './types';

/** 24×24 stroke icon paths. */
export const I = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6',
  bell: 'M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9zM13.7 20a2 2 0 0 1-3.4 0',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8',
  plus: 'M12 5v14M5 12h14',
  pin: 'M12 21s6.5-5.8 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.2 12 21 12 21zM12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z',
  chart: 'M5 20V11M11 20V5M17 20v-6M3 20h18',
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c.7-3.5 3.2-5.5 6-5.5s5.3 2 6 5.5M16 5.2a3 3 0 0 1 0 5.6M18 14.6c1.6.7 2.6 2.4 3 5.4',
  inbox: 'M4 13h4l2 3h4l2-3h4M5.5 5h13L20 13v6H4v-6z',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a1.6 1.6 0 1 0 0-.01M17 19a1.6 1.6 0 1 0 0-.01',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  chat: 'M5 5h14v10H10l-5 4z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  flow: 'M4 6h5v5H4zM15 13h5v5h-5zM9 8.5h3.5a2 2 0 0 1 2 2V13',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2',
  phone: 'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z',
  key: 'M7.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM11 12h10M18 12v3M21 12v2',
  act: 'M3 12h4l3-7 4 14 3-7h4',
  swap: 'M4 8h14l-3-3M20 16H6l3 3',
  sync: 'M20 11a8 8 0 0 0-14.5-4M4 13a8 8 0 0 0 14.5 4M5 3v4h4M19 21v-4h-4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8v.01',
  shield: 'M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6zM12 8v4M12 15.5v.01',
  map: 'M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20',
  box: 'm12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5 12 12l8-4.5M12 12v9',
  spark: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z',
  wallet: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zM4 7V6a2 2 0 0 1 2-2h10v3M16 13.5h2',
  menu: 'M4 7h16M4 12h16M4 17h10',
  back: 'm15 5-7 7 7 7',
  chevron: 'm9 6 6 6-6 6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  lock: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3',
  siren: 'M7 18v-5a5 5 0 0 1 10 0v5M4.5 18h15M12 4v2M5.6 6.6l1.4 1.4M18.4 6.6 17 8',
} as const;

export interface LogoPath {
  d: string;
  /** Stroke colour; ignored when `f` (fill) is set. */
  s?: string;
  f?: string;
}

export const LOGOS: Record<LogoConcept, { name: string; paths: LogoPath[] }> = {
  A: {
    name: 'Beacon Anchor',
    paths: [
      { d: 'M24 12a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z', s: C.white },
      { d: 'M24 19v21', s: C.white },
      { d: 'M17.5 24h13', s: C.white },
      { d: 'M10.5 29.5a13.5 11 0 0 0 27 0', s: C.white },
      { d: 'M17.5 9a9.5 9.5 0 0 1 13 0', s: C.amber },
      { d: 'M13.5 6a15 15 0 0 1 21 0', s: C.amber },
    ],
  },
  B: {
    name: 'Response Shield',
    paths: [
      { d: 'M24 5l15 5.5v11c0 10-6.5 17.5-15 21.5C15.5 39 9 31.5 9 21.5v-11z', s: C.white },
      { d: 'M14 25h5.5l2.5-5.5 4 11 2.5-5.5H34', s: C.amber },
    ],
  },
  C: {
    name: 'Anchor Pin',
    paths: [
      { d: 'M24 43s12.5-11 12.5-21.5a12.5 12.5 0 0 0-25 0C11.5 32 24 43 24 43z', s: C.white },
      { d: 'M24 10.8a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4z', s: C.amber },
      { d: 'M24 15.2V29', s: C.amber },
      { d: 'M20.5 18.5h7', s: C.amber },
      { d: 'M18 24a6 4.8 0 0 0 12 0', s: C.amber },
    ],
  },
  D: {
    name: 'Converge',
    paths: [
      { d: 'M17 9l7 7 7-7', s: C.white },
      { d: 'M17 39l7-7 7 7', s: C.white },
      { d: 'M9 17l7 7-7 7', s: C.white },
      { d: 'M39 17l-7 7 7 7', s: C.white },
      { d: 'M24 20.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z', f: C.amber },
    ],
  },
};

export const MODS: (ViewDef & { k: ModuleKey; f: string })[] = [
  { k: 'elista', n: 'eLISTA', f: 'Evacuee accountability', full: 'Evacuation Logging and Identification System', c: '#3a7fc4', t: '#E8F0F9', icon: I.users },
  { k: 'sipat', n: 'SIPAT', f: 'Spatial picture', full: 'Live map of zones, hazards and teams', c: '#1fa79a', t: '#E3F5F3', icon: I.map },
  { k: 'kamalig', n: 'KAMALIG', f: 'Storehouse and requests', full: 'Stock, requests and deployment', c: '#6C4FD1', t: '#EDE8FB', icon: I.box },
  { k: 'gab', n: 'GAB.ai', f: 'Decision support', full: 'Briefs and answers from your records', c: '#E09A2E', t: '#FDF3E3', icon: I.spark },
  { k: 'alaga', n: 'ALAGA', f: 'Procurement handoff', full: 'Acquisition, Liquidation, and Allocation of Government Assets', c: '#A3316F', t: '#F8E9F1', icon: I.wallet },
  { k: 'aid', n: 'DRRM AID', f: 'My ID and SOS', full: 'Alerts, Identification, and Distress signaling', c: C.red, t: C.redTint, icon: I.shield },
];

const EXTRA: ViewDef[] = [
  { k: 'home', n: 'Overview', full: 'Typhoon response · your operation at a glance', c: C.teal, t: C.tealTint, icon: I.home },
  { k: 'admin', n: 'Command', full: 'IMT positions, alternates and sign-in activity', c: C.teal, t: C.tealTint, icon: I.key },
  { k: 'about', n: 'About', full: 'Manual and credits', c: C.slate, t: C.slateTint, icon: I.info },
];

const VIEWS = new Map<ViewKey, ViewDef>([...MODS, ...EXTRA].map((m) => [m.k, m]));
export const viewOf = (k: ViewKey): ViewDef => VIEWS.get(k)!;
export const isModuleKey = (k: ViewKey): k is ModuleKey => MODS.some((m) => m.k === k);

const ALL = MODS.map((m) => m.k);

export const POSITIONS: Record<PositionKey, PositionDef> = {
  ic: { t: 'Incident Commander', mods: ALL, admin: true },
  ops: { t: 'Operations Section Chief', mods: ['elista', 'sipat', 'gab', 'aid'] },
  log: { t: 'Logistics Section Chief', mods: ['kamalig', 'alaga', 'sipat', 'aid'] },
  fin: { t: 'Finance and Admin Section Chief', mods: ['alaga', 'aid'] },
};

/** Each view's own features, shown on the bottom bar. The first tab is the default. */
export const TABS: Record<ViewKey, readonly TabDef[]> = {
  home: [['overview', 'Overview', I.home], ['alerts', 'Alerts', I.bell], ['log', 'Log', I.list]],
  elista: [['status', 'Status', I.chart], ['scan', 'Scan', I.scan], ['register', 'Register', I.plus], ['roster', 'Roster', I.list]],
  sipat: [['map', 'Map', I.map], ['teams', 'Teams', I.users], ['report', 'Report', I.pin]],
  kamalig: [['requests', 'Requests', I.inbox], ['stock', 'Stock', I.box], ['dispatched', 'Dispatched', I.truck]],
  gab: [['brief', 'Brief', I.doc], ['ask', 'Ask', I.chat]],
  alaga: [['queue', 'To act', I.check], ['pipeline', 'Pipeline', I.flow], ['done', 'Delivered', I.box]],
  aid: [['id', 'My ID', I.qr], ['sos', 'SOS', I.shield], ['alerts', 'Alerts', I.bell], ['map', 'Evac map', I.map], ['hotlines', 'Hotlines', I.phone]],
  admin: [['positions', 'Positions', I.users], ['codes', 'Temp codes', I.key], ['activity', 'Activity', I.act]],
  about: [['manual', 'Manual', I.doc]],
};

export const STAGES: Record<AlagaStage, { l: string; c: string; tint: string; i: number }> = {
  flagged: { l: 'Needs endorsement', c: '#6C4FD1', tint: '#EDE8FB', i: 0 },
  endorsed: { l: 'Awaiting IC', c: C.steel, tint: C.steelTint, i: 1 },
  approved: { l: 'Sent to F&A', c: '#A3316F', tint: '#F8E9F1', i: 2 },
  processing: { l: 'With F&A', c: '#74204F', tint: '#F8E9F1', i: 3 },
  delivered: { l: 'Delivered', c: C.green, tint: C.greenTint, i: 4 },
};
export const PIPELINE: AlagaStage[] = ['flagged', 'endorsed', 'approved', 'processing', 'delivered'];
export const PIPELINE_LABEL: Record<AlagaStage, string> = {
  flagged: 'To endorse',
  endorsed: 'At IC',
  approved: 'To F&A',
  processing: 'With F&A',
  delivered: 'Done',
};

/** DRRM AIDs saved on this phone. */
export const USERS: SavedUser[] = [
  { name: 'Andrea Dela Cruz', first: 'Andrea', code: '4R7DC', org: 'UPRI', meta: 'Female · O+' },
  { name: 'Joel Navarro', first: 'Joel', code: '8T2WB', org: 'UP Diliman OCS', meta: 'Male · A+' },
];

/** The operation started this long before the app opened. */
export const OPERATION_AGE_MS = (5 * 3600 + 20 * 60) * 1000;
/** Evacuees accounted for and already released from the centers. */
export const RELEASED = 14;
export const CENTER_CAPACITY = 200;
export const SOS_LOCATION = '14.6537, 121.0687';

export const BASE_ALERTS: Alert[] = [
  { kind: 'Overt alert', t: '11:52', title: 'Move to higher floors', body: 'Water is rising on the east side of the main road. Evacuees in the Covered Court move to the Gym second floor.', color: C.red, bg: C.redTint, border: C.redLine },
  { kind: 'Silent alert', t: '10:15', title: 'Shelter in place, Palma Hall', body: 'Stay away from windows. Await instruction from your floor marshal.', color: C.amberDeep, bg: C.amberTint, border: C.amberLine },
  { kind: 'Advisory', t: '08:30', title: 'Signal No. 2 raised', body: 'Typhoon response is active. Report to your assigned station and check in through eLISTA.', color: C.slate, bg: C.white, border: C.line },
];

export const TEAMS = [
  { k: 'T1', name: 'Search and rescue', task: 'Sweeping Palma Hall, floors 1 to 3', t: '12:58' },
  { k: 'T2', name: 'Water rescue', task: 'Standing by at the flood edge', t: '12:40' },
  { k: 'T3', name: 'Medical', task: 'Escorting two patients to First Aid', t: '13:20' },
];

export const HOTLINES = [
  { n: 'Campus DRRM Operations Center', num: 'Local 4000' },
  { n: 'UP Health Service', num: 'Local 4100' },
  { n: 'Campus Security', num: 'Local 4200' },
  { n: 'National Emergency Hotline', num: '911' },
];

export const MANUAL = [
  { h: 'Signing in', b: 'Your phone keeps your DRRM AID. Enter your IMT code and PIN; they must match the sealed credential inside it.' },
  { h: 'Your modules', b: 'Your IMT position decides which modules open. Others stay listed in the menu with a lock.' },
  { h: 'Alternates', b: 'When a position holder is absent, the IC names an alternate or issues a temporary code for this operation.' },
  { h: 'Offline', b: 'Everything you do is saved on the phone first and sent when there is signal.' },
];

export const ALTERNATE_CANDIDATES = ['Joel Navarro', 'Paolo Garcia', 'Rina Velasco'];
export const REG_GROUPS = ['Adult', 'Senior', 'Child', 'PWD'];
export const REG_CENTERS = ['Gym', 'Covered Court'];
export const HAZARD_TYPES = ['Flood', 'Landslide', 'Fire', 'Debris', 'Power line'];
export const SOS_CATEGORIES = ['Medical', 'Trapped', 'Fire', 'Security', 'Other'];
export const MAP_LAYERS = [['hazards', 'Hazards'], ['facilities', 'Facilities'], ['teams', 'Teams']] as const;
/** Where newly reported hazards land on the schematic map, in turn. */
export const HAZARD_SPOTS: readonly [x: string, y: string][] = [['120px', '250px'], ['330px', '120px'], ['250px', '300px'], ['40px', '140px']];

export function createInitialState(): AnchorState {
  return {
    screen: 'gate',
    gateAid: false,
    limited: false,
    session: 'match',
    sessionPos: 'ic',
    mod: 'home',
    tabs: {},
    drawer: false,
    sheet: false,
    code: '',
    pin: '',
    uIdx: 0,

    registered: 156,
    accounted: 142,
    missing: [
      { id: '7K2Q9', name: 'Maria Santos', last: 'Seen 11:20 at Gate 2' },
      { id: '3H8LM', name: 'Jose Reyes', last: 'Registered 09:05' },
      { id: 'P41XT', name: 'Liza Ramos', last: 'Seen 12:02, First Aid' },
      { id: 'Q9D2A', name: 'Ramon Cruz', last: 'Registered 08:40' },
    ],
    roster: [
      { name: 'Teresa Aquino', code: 'K3M8P', center: 'Gym', t: '13:12' },
      { name: 'Benjie Torres', code: 'Z7Q1R', center: 'Covered Court', t: '12:58' },
      { name: 'Nora Villanueva', code: 'H2D6S', center: 'Gym', t: '12:44' },
    ],
    lastScan: null,
    regName: '',
    regGroup: 'Adult',
    regCenter: 'Gym',

    stock: [
      { k: 'water', name: 'Drinking water', qty: 24, cap: 200, unit: 'gal' },
      { k: 'food', name: 'Family food packs', qty: 60, cap: 200, unit: 'packs' },
      { k: 'hyg', name: 'Hygiene kits', qty: 40, cap: 80, unit: 'kits' },
      { k: 'mat', name: 'Sleeping mats', qty: 40, cap: 150, unit: 'pcs' },
      { k: 'blank', name: 'Blankets', qty: 120, cap: 150, unit: 'pcs' },
    ],
    reqs: [
      { id: 'RR-016', item: 'Water containers (20 L)', qty: 30, unit: 'pcs', from: 'Evac Center', sk: null },
      { id: 'RR-017', item: 'Blankets', qty: 40, unit: 'pcs', from: 'Covered Court', sk: 'blank' },
      { id: 'RR-018', item: 'Hygiene kits', qty: 60, unit: 'kits', from: 'Medical', sk: 'hyg' },
    ],
    sent: [{ id: 'RR-012', item: 'family food packs', qty: 40, unit: 'packs', to: 'Gym', t: '11:30' }],

    alaga: [
      { id: 'PR-001', item: 'Portable generator (5 kVA)', qty: 2, unit: 'units', stage: 'flagged', urgent: true },
      { id: 'PR-002', item: 'Family food packs', qty: 140, unit: 'packs', stage: 'endorsed', urgent: true },
      { id: 'PR-008', item: 'Water containers (20 L)', qty: 20, unit: 'pcs', stage: 'endorsed' },
      { id: 'PR-003', item: 'Portable oxygen tanks', qty: 4, unit: 'units', stage: 'approved', urgent: true },
      { id: 'PR-004', item: 'Sleeping mats', qty: 110, unit: 'pcs', stage: 'processing' },
      { id: 'PR-005', item: 'Hygiene kits', qty: 40, unit: 'kits', stage: 'delivered' },
    ],
    prSeq: 9,

    gab: [],

    sos: false,
    sosCat: 'Medical',
    sosAt: '',

    layers: { hazards: true, facilities: true, teams: true },
    hzType: 'Flood',
    hazards: [{ l: 'Flood · east of the main road', t: '12:10', x: '30px', y: '186px' }],

    positions: [
      { k: 'ic', title: 'Incident Commander', holder: 'Andrea Dela Cruz', present: true },
      { k: 'ops', title: 'Operations Section Chief', holder: 'Paolo Garcia', present: true },
      { k: 'plan', title: 'Planning Section Chief', holder: 'Rina Velasco', present: true },
      { k: 'log', title: 'Logistics Section Chief', holder: 'Mark Bautista', present: false, alt: null },
      { k: 'fin', title: 'Finance and Admin Section Chief', holder: 'Celia Ong', present: true },
      { k: 'safe', title: 'Safety Officer', holder: 'Dan Lim', present: false, alt: null },
    ],
    codes: [],
    sec: [],
    log: [
      { t: '13:31', mod: 'alaga', text: 'PR-008 water containers endorsed to the IC' },
      { t: '13:02', mod: 'kamalig', text: 'RR-016 received from the Evac Center' },
      { t: '12:44', mod: 'elista', text: '12 evacuees checked in at the Gym' },
      { t: '12:10', mod: 'sipat', text: 'Flood-prone zone marked east of the main road' },
      { t: '11:52', mod: 'aid', text: 'Overt alert sent: move to higher floors' },
    ],
  };
}
