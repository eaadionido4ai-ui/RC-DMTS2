export type ModuleKey = 'elista' | 'sipat' | 'kamalig' | 'gab' | 'alaga' | 'aid';
/** Everything that can own a header and a bottom bar: the six modules plus the operation-level views. */
export type ViewKey = ModuleKey | 'home' | 'admin' | 'about';
export type PositionKey = 'ic' | 'ops' | 'log' | 'fin';
export type SignInResult = 'match' | 'mismatch' | 'duress' | 'alternate';
export type LogoConcept = 'A' | 'B' | 'C' | 'D';
export type OpMode = 'drill' | 'actual';

/** Demo-only settings (read from the URL) that stand in for a real credential check. */
export interface DemoSettings {
  demoResult: SignInResult;
  codePosition: PositionKey;
  logoConcept: LogoConcept;
  opMode: OpMode;
}

export interface ViewDef {
  k: ViewKey;
  n: string;
  /** Short feature line shown in the drawer. */
  f?: string;
  full: string;
  /** Accent colour. */
  c: string;
  /** Tint colour. */
  t: string;
  icon: string;
}

export interface PositionDef {
  t: string;
  mods: ModuleKey[];
  admin?: boolean;
}

export type TabDef = readonly [key: string, label: string, icon: string];

export interface SavedUser {
  name: string;
  first: string;
  code: string;
  org: string;
  meta: string;
}

export interface MissingPerson {
  id: string;
  name: string;
  last: string;
}

export interface RosterEntry {
  name: string;
  code: string;
  center: string;
  t: string;
}

export interface StockItem {
  k: string;
  name: string;
  qty: number;
  cap: number;
  unit: string;
}

export interface SupplyRequest {
  id: string;
  item: string;
  qty: number;
  unit: string;
  from: string;
  /** Matching storehouse stock key, or null when the item is not carried. */
  sk: string | null;
}

export interface Dispatch {
  id: string;
  item: string;
  qty: number;
  unit: string;
  to: string;
  t: string;
}

export type AlagaStage = 'flagged' | 'endorsed' | 'approved' | 'processing' | 'delivered';

export interface ProcurementRequest {
  id: string;
  item: string;
  qty: number;
  unit: string;
  stage: AlagaStage;
  urgent?: boolean;
}

export interface ChatEntry {
  q: string;
  a: string;
}

export type MapLayer = 'hazards' | 'facilities' | 'teams';

export interface Hazard {
  l: string;
  t: string;
  x: string;
  y: string;
}

export interface ImtPosition {
  k: string;
  title: string;
  holder: string;
  present: boolean;
  alt?: string | null;
}

export interface TempCode {
  code: string;
  /** Position key the code covers. */
  pk: string;
  who: string;
  pos: string;
  live: boolean;
}

export type SecKind = 'Mismatch' | 'Duress' | 'Monitored';

export interface SecEntry {
  t: string;
  kind: SecKind;
  text: string;
}

export interface LogEntry {
  t: string;
  mod: ViewKey;
  text: string;
}

export interface Alert {
  kind: string;
  t: string;
  title: string;
  body: string;
  color: string;
  bg: string;
  border: string;
}

export interface AnchorState {
  screen: 'gate' | 'app';
  /** True while DRRM AID is open from the sign-in screen, before anyone signs in. */
  gateAid: boolean;
  /** True after a wrong IMT code: only DRRM AID is available and every action is monitored. */
  limited: boolean;
  session: SignInResult;
  sessionPos: PositionKey;
  mod: ViewKey;
  tabs: Partial<Record<ViewKey, string>>;
  drawer: boolean;
  sheet: boolean;
  code: string;
  pin: string;
  uIdx: number;

  registered: number;
  accounted: number;
  missing: MissingPerson[];
  roster: RosterEntry[];
  lastScan: RosterEntry | null;
  regName: string;
  regGroup: string;
  regCenter: string;

  stock: StockItem[];
  reqs: SupplyRequest[];
  sent: Dispatch[];

  alaga: ProcurementRequest[];
  prSeq: number;

  gab: ChatEntry[];

  sos: boolean;
  sosCat: string;
  sosAt: string;

  layers: Record<MapLayer, boolean>;
  hzType: string;
  hazards: Hazard[];

  positions: ImtPosition[];
  codes: TempCode[];
  sec: SecEntry[];
  log: LogEntry[];
}
