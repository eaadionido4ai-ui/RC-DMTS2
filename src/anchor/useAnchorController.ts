import { useEffect, useRef, useState } from 'react';
import {
  BASE_ALERTS,
  HAZARD_SPOTS,
  OPERATION_AGE_MS,
  POSITIONS,
  RELEASED,
  TABS,
  USERS,
  createInitialState,
  isModuleKey,
  viewOf,
} from './data';
import {
  alternateFor,
  availability,
  formatElapsed,
  grantedModules,
  greetingFor,
  hm,
  isLow,
  procurementId,
  randomCode,
} from './logic';
import { C } from './tokens';
import type {
  Alert,
  AlagaStage,
  AnchorState,
  DemoSettings,
  ImtPosition,
  MissingPerson,
  OpMode,
  ProcurementRequest,
  SecKind,
  SupplyRequest,
  TempCode,
  ViewKey,
} from './types';

type Patch = Partial<AnchorState> | ((s: AnchorState) => Partial<AnchorState>);

const TOAST_MS = 2400;
const stamp = () => hm(new Date());

/**
 * All of ANCHOR's on-device state, what follows from it, and every action a screen can take.
 * The demo settings stand in for what a real IMT code check would decide.
 */
export function useAnchorController(settings: DemoSettings, onOpModeChange: (mode: OpMode) => void) {
  const [s, setS] = useState<AnchorState>(createInitialState);
  const [now, setNow] = useState(() => Date.now());
  const [t0] = useState(() => Date.now() - OPERATION_AGE_MS);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const update = (patch: Patch) =>
    setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));

  const showToast = (message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  };

  /** Appends to the operation log, applying any state change that goes with it in the same update. */
  const addLog = (mod: ViewKey, text: string, extra?: (st: AnchorState) => Partial<AnchorState>) =>
    update((st) => ({ log: [{ t: stamp(), mod, text }, ...st.log], ...(extra ? extra(st) : {}) }));

  const addSec = (kind: SecKind, text: string) =>
    update((st) => ({ sec: [{ t: stamp(), kind, text }, ...st.sec] }));

  // ---- Derived ----
  const user = USERS[s.uIdx];
  const granted = grantedModules(s.sessionPos, s.session);
  const position = POSITIONS[s.sessionPos] ?? POSITIONS.ic;
  const admin = !!position.admin;
  const isGate = s.screen === 'gate';
  const isApp = s.screen === 'app';
  const curMod: ViewKey | null = isGate ? (s.gateAid ? 'aid' : null) : s.mod;
  const curTab = curMod ? (s.tabs[curMod] ?? TABS[curMod][0][0]) : null;
  /** Which screen fills the content area: `gate`, or `<view>_<tab>`. */
  const screenKey = curMod ? `${curMod}_${curTab}` : 'gate';
  const showSec = isApp && admin && s.session !== 'duress';
  const secAlerts: Alert[] = showSec
    ? s.sec
        .filter((x) => x.kind !== 'Monitored')
        .map((x) => ({
          kind: `IC only · ${x.kind}`,
          t: x.t,
          title: x.kind === 'Duress' ? 'Duress sign-in' : 'IMT code mismatch',
          body: x.text,
          color: C.steel,
          bg: C.steelTint,
          border: C.steelLine,
        }))
    : [];
  const nowDate = new Date(now);

  const derived = {
    user,
    granted,
    position,
    admin,
    isAlt: s.session === 'alternate',
    altTitle: POSITIONS[alternateFor(s.sessionPos)].t,
    isGate,
    isApp,
    curMod,
    curTab,
    screenKey,
    showSec,
    secAlerts,
    alerts: [...secAlerts, ...BASE_ALERTS],
    missingN: s.registered - s.accounted,
    inCenter: s.accounted - RELEASED,
    lowStock: s.stock.filter(isLow),
    endorsed: s.alaga.filter((a) => a.stage === 'endorsed'),
    flagged: s.alaga.filter((a) => a.stage === 'flagged'),
    live: settings.opMode === 'actual',
    clock: hm(nowDate),
    elapsed: formatElapsed(now - t0),
    greeting: greetingFor(nowDate.getHours()),
  };

  /** While a wrong code is in use, every action is logged and quietly flagged to the IC. */
  const watch = (what: string) => {
    if (s.limited) addSec('Monitored', `${user.code} (limited session) ${what}`);
  };

  const openMod = (k: ViewKey, tab?: string) => {
    if (isModuleKey(k) && !granted.includes(k)) {
      showToast(`${viewOf(k).n} is not part of your IMT position.`);
      return;
    }
    if (k === 'admin' && !admin) {
      showToast('Only the IC can manage positions.');
      return;
    }
    update((st) => ({ mod: k, drawer: false, tabs: tab ? { ...st.tabs, [k]: tab } : st.tabs }));
  };

  const actions = {
    set: update,
    showToast,
    openMod,

    // ---- Shell ----
    goToTab(tab: string, label: string) {
      if (!curMod) return;
      update((st) => ({ tabs: { ...st.tabs, [curMod]: tab } }));
      if (isGate) watch(`opened ${label}`);
    },
    openDrawer: () => update({ drawer: true }),
    closeDrawer: () => update({ drawer: false }),
    setOpMode: onOpModeChange,
    sync() {
      update({ drawer: false });
      showToast('Synced. 2 queued actions sent.');
    },
    signOut: () =>
      update({ screen: 'gate', gateAid: false, limited: false, drawer: false, mod: 'home', tabs: {} }),

    // ---- Sign-in gate ----
    signIn() {
      if (!s.code.trim() || !s.pin.trim()) {
        showToast('Enter your IMT code and PIN');
        return;
      }
      const result = settings.demoResult;
      if (result === 'mismatch') {
        update({ limited: true, code: '', pin: '' });
        addSec(
          'Mismatch',
          `IMT code entered on ${user.code} did not match its sealed credential. Session limited to DRRM AID and monitored.`,
        );
        return;
      }
      if (result === 'duress') {
        addSec('Duress', `Duress code used at sign-in by ${user.name} (${user.code}). Location shared with command.`);
      }
      update({
        screen: 'app',
        session: result,
        sessionPos: settings.codePosition,
        mod: 'home',
        tabs: {},
        drawer: false,
        code: '',
        pin: '',
      });
    },
    retrySignIn() {
      watch('tried sign-in again');
      update({ limited: false });
    },
    openGateAid(tab: string) {
      update((st) => ({ gateAid: true, tabs: { ...st.tabs, aid: tab } }));
      watch(`opened ${TABS.aid.find(([k]) => k === tab)?.[1] ?? tab}`);
    },
    closeGateAid: () => update({ gateAid: false }),
    openSheet: () => update({ sheet: true }),
    closeSheet: () => update({ sheet: false }),
    pickSavedId(i: number) {
      watch(`switched saved ID to ${USERS[i].code}`);
      update({ uIdx: i, sheet: false });
    },
    addSavedId() {
      update({ sheet: false });
      showToast('Camera opens to scan a DRRM ID QR');
    },

    // ---- eLISTA ----
    markFound(m: MissingPerson) {
      addLog('elista', `${m.name} marked accounted for`, (st) => ({
        missing: st.missing.filter((x) => x.id !== m.id),
        accounted: st.accounted + 1,
      }));
      showToast(`${m.name} accounted for`);
    },
    simulateScan() {
      const m = s.missing[0];
      const person = m ? { name: m.name, code: m.id } : { name: 'Teresa Aquino', code: 'K3M8P' };
      const rec = { ...person, t: stamp(), center: 'Gym' };
      addLog('elista', `Scanned ${person.code}: ${person.name} checked in`, (st) => ({
        lastScan: rec,
        missing: m ? st.missing.slice(1) : st.missing,
        accounted: m ? st.accounted + 1 : st.accounted,
        roster: [rec, ...st.roster],
      }));
    },
    register() {
      const name = s.regName.trim();
      if (!name) {
        showToast('Enter the evacuee name');
        return;
      }
      const code = randomCode(5);
      addLog('elista', `${name} registered at the ${s.regCenter} (${s.regGroup.toLowerCase()})`, (st) => ({
        registered: st.registered + 1,
        accounted: st.accounted + 1,
        regName: '',
        roster: [{ name, code, center: st.regCenter, t: stamp() }, ...st.roster],
      }));
      showToast(`${name} registered · DRRM ID ${code}`);
    },

    // ---- SIPAT ----
    pinHazard() {
      const n = HAZARD_SPOTS.length;
      const [x, y] = HAZARD_SPOTS[(((s.hazards.length - 1) % n) + n) % n];
      addLog('sipat', `${s.hzType} hazard pinned near the Covered Court`, (st) => ({
        hazards: [...st.hazards, { l: `${st.hzType} · near the Covered Court`, t: stamp(), x, y }],
      }));
      showToast('Hazard pinned. Nearby teams are notified.');
    },

    // ---- KAMALIG ----
    fillRequest(r: SupplyRequest) {
      if (!availability(r, s.stock).ok) {
        showToast('Not enough on hand. Flag it to ALAGA instead.');
        return;
      }
      addLog('kamalig', `${r.id} filled: ${r.qty} ${r.unit} ${r.item.toLowerCase()}`, (st) => ({
        reqs: st.reqs.filter((x) => x.id !== r.id),
        stock: st.stock.map((x) => (x.k === r.sk ? { ...x, qty: x.qty - r.qty } : x)),
        sent: [{ id: r.id, item: r.item.toLowerCase(), qty: r.qty, unit: r.unit, to: r.from, t: stamp() }, ...st.sent],
      }));
      showToast(`${r.id} filled and dispatched`);
    },
    flagRequest(r: SupplyRequest) {
      const id = procurementId(s.prSeq);
      const { have } = availability(r, s.stock);
      addLog('kamalig', `${r.id} flagged for procurement as ${id}`, (st) => ({
        reqs: st.reqs.filter((x) => x.id !== r.id),
        prSeq: st.prSeq + 1,
        alaga: [{ id, item: r.item, qty: r.qty - have, unit: r.unit, stage: 'flagged' as const }, ...st.alaga],
      }));
      showToast(`${id} sent to ALAGA for endorsement`);
    },

    // ---- ALAGA ----
    moveRequest(a: ProcurementRequest, to: AlagaStage, what: string) {
      addLog('alaga', `${a.id} ${what}`, (st) => ({
        alaga: st.alaga.map((x) => (x.id === a.id ? { ...x, stage: to } : x)),
      }));
      showToast(`${a.id} ${what}`);
    },

    // ---- GAB.ai ----
    ask: (q: string, a: string) => update((st) => ({ gab: [...st.gab, { q, a }] })),

    // ---- DRRM AID ----
    startSos() {
      watch(`sent an SOS (${s.sosCat})`);
      addLog('aid', `SOS sent (${s.sosCat}) by ${user.code}`, () => ({ sos: true, sosAt: stamp() }));
    },
    stopSos() {
      addLog('aid', 'SOS stopped, marked safe', () => ({ sos: false }));
      showToast('Help request stopped');
    },
    callHotline(name: string) {
      watch(`called ${name}`);
      showToast(`Calling ${name}…`);
    },

    // ---- Command ----
    nameAlternate(p: ImtPosition, name: string) {
      addLog('admin', `${name} named alternate for ${p.title}`, (st) => ({
        positions: st.positions.map((x) => (x.k === p.k ? { ...x, alt: name } : x)),
      }));
      showToast(`${name} now covers ${p.title}`);
    },
    clearAlternate(p: ImtPosition) {
      addLog('admin', `Alternate removed for ${p.title}`, (st) => ({
        positions: st.positions.map((x) => (x.k === p.k ? { ...x, alt: null } : x)),
        codes: st.codes.map((c) => (c.pk === p.k ? { ...c, live: false } : c)),
      }));
    },
    issueTempCode(p: ImtPosition) {
      const code = `T-${randomCode(4)}`;
      addLog('admin', `Temporary code issued to ${p.alt} for ${p.title}`, (st) => ({
        codes: [{ code, pk: p.k, who: p.alt ?? '', pos: p.title, live: true }, ...st.codes],
      }));
      showToast(`Temporary code ${code} issued`);
    },
    revokeTempCode(c: TempCode) {
      addLog('admin', `Temporary code ${c.code} revoked`, (st) => ({
        codes: st.codes.map((x) => (x.code === c.code ? { ...x, live: false } : x)),
      }));
    },
  };

  return { s, settings, toast, ...derived, ...actions };
}

export type AnchorApi = ReturnType<typeof useAnchorController>;
