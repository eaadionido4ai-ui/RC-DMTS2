import { useAnchor } from '../context';
import { I, MODS, viewOf } from '../data';
import { C, font } from '../tokens';
import type { ModuleKey } from '../types';
import { Icon } from '../ui/Icon';
import { Intro, Pill, SectionLabel } from '../ui/primitives';
import { col, timeText } from '../ui/styles';

interface Need {
  mod: string;
  color: string;
  n: number;
  label: string;
  sub: string;
  open: () => void;
}

export function Overview() {
  const a = useAnchor();
  const { s, granted } = a;
  const has = (k: ModuleKey) => granted.includes(k);

  const needs: Need[] = [];
  const waiting = a.endorsed.length + a.flagged.length;
  if (has('alaga') && waiting) {
    needs.push({
      mod: 'ALAGA',
      color: viewOf('alaga').c,
      n: waiting,
      label: 'Procurement waiting on a decision',
      sub: `${a.endorsed.length} at the IC · ${a.flagged.length} to endorse`,
      open: () => a.openMod('alaga', 'queue'),
    });
  }
  if (has('elista') && a.missingN) {
    needs.push({
      mod: 'eLISTA',
      color: viewOf('elista').c,
      n: a.missingN,
      label: 'Evacuees still unaccounted',
      sub: 'Oldest registered 08:40',
      open: () => a.openMod('elista', 'status'),
    });
  }
  if (has('kamalig') && s.reqs.length) {
    needs.push({
      mod: 'KAMALIG',
      color: viewOf('kamalig').c,
      n: s.reqs.length,
      label: 'Requests to fill',
      sub: 'From eLISTA and Medical',
      open: () => a.openMod('kamalig', 'requests'),
    });
  }
  if (has('kamalig') && a.lowStock.length) {
    needs.push({
      mod: 'KAMALIG',
      color: viewOf('kamalig').c,
      n: a.lowStock.length,
      label: 'Items running low',
      sub: a.lowStock.map((x) => x.name).join(', '),
      open: () => a.openMod('kamalig', 'stock'),
    });
  }
  if (a.showSec && a.secAlerts.length) {
    needs.unshift({
      mod: 'Command',
      color: C.steel,
      n: a.secAlerts.length,
      label: 'Sign-in flags to review',
      sub: 'Visible to the IC only',
      open: () => a.openMod('admin', 'activity'),
    });
  }

  const hazards = s.hazards.length;
  const status: Record<ModuleKey, string> = {
    elista: `${s.accounted} of ${s.registered} accounted`,
    sipat: `${hazards} hazard${hazards > 1 ? 's' : ''} · 3 teams`,
    kamalig: `${s.reqs.length} requests open`,
    gab: `Brief ready · ${a.clock}`,
    alaga: `${s.alaga.filter((x) => x.stage !== 'delivered').length} in the pipeline`,
    aid: s.sos ? 'SOS active' : 'ID ready offline',
  };

  return (
    <div style={col(18)}>
      <div style={{ ...col(7), padding: '4px 2px 0' }}>
        <div style={{ font: font('800 26px/1.05', 'cond') }}>
          {a.greeting}, {a.user.first}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Pill bg={C.tealTint} color={C.teal}>
            {a.position.t}
          </Pill>
          {a.isAlt && (
            <Pill bg={C.amberTint} color={C.amberInk}>
              Alternate for {a.altTitle}
            </Pill>
          )}
        </div>
      </div>

      {needs.length > 0 && (
        <section style={col(9)} aria-label="Needs you now">
          <SectionLabel>Needs you now</SectionLabel>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '2px 16px 6px' }}>
            {needs.map((nd) => (
              <button
                key={nd.label}
                type="button"
                className="press-97"
                onClick={nd.open}
                style={{
                  flex: 'none',
                  width: 172,
                  textAlign: 'left',
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: 16,
                  padding: '13px 14px',
                  ...col(8),
                  boxShadow: '0 1px 2px rgba(11,34,55,.05),0 4px 14px rgba(11,34,55,.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: nd.color }} />
                  <span style={{ font: font('800 10.5px/1', 'cond'), letterSpacing: '1px', textTransform: 'uppercase', color: nd.color }}>
                    {nd.mod}
                  </span>
                </div>
                <div style={{ font: font('800 30px/1', 'cond') }}>{nd.n}</div>
                <div style={{ font: font('600 12.5px/1.3', 'body') }}>{nd.label}</div>
                <div style={{ font: font('500 11px/1.3', 'body'), color: C.faint }}>{nd.sub}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section style={col(9)} aria-label="Your modules">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
          <SectionLabel as="span">Your modules</SectionLabel>
          <button type="button" onClick={a.openDrawer} style={{ font: font('700 11px/1', 'body'), color: C.teal }}>
            All in menu
          </button>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2px 6px' }}>
          {MODS.filter((m) => has(m.k)).map((m) => (
            <button
              key={m.k}
              type="button"
              className="press-bg"
              onClick={() => a.openMod(m.k)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 8px',
                borderBottom: `1px solid ${C.divider}`,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flex: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  background: m.t,
                  color: m.c,
                }}
              >
                <Icon d={m.icon} size={19} />
              </span>
              <span style={{ flex: 1, minWidth: 0, ...col(2) }}>
                <span style={{ font: font('800 15px/1.1', 'cond'), letterSpacing: '.3px' }}>{m.n}</span>
                <span style={{ font: font('500 11.5px/1.2', 'body'), color: m.c }}>{status[m.k]}</span>
              </span>
              <Icon d={I.chevron} size={16} strokeWidth={2.2} stroke={C.faint} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AlertsList() {
  const { alerts } = useAnchor();
  return (
    <div style={col(10)}>
      <Intro>Sent by the Incident Commander or building administrator. Overt alerts sound and take over the screen.</Intro>
      {alerts.map((al, i) => (
        <article
          key={`${al.t}-${al.title}-${i}`}
          style={{
            background: al.bg,
            border: `1px solid ${al.border}`,
            borderRadius: 14,
            padding: '13px 14px',
            display: 'flex',
            gap: 12,
          }}
        >
          <div style={{ width: 4, borderRadius: 2, background: al.color, flex: 'none' }} />
          <div style={{ flex: 1, ...col(4) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ font: font('800 10px/1', 'cond'), letterSpacing: '1.1px', textTransform: 'uppercase', color: al.color }}>
                {al.kind}
              </span>
              <span style={timeText}>{al.t}</span>
            </div>
            <div style={{ font: font('800 16px/1.2', 'cond') }}>{al.title}</div>
            <div style={{ font: font('400 12.5px/1.45', 'body'), color: C.ink2 }}>{al.body}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ActivityLog() {
  const { s } = useAnchor();
  return (
    <div style={col(10)}>
      <Intro>Every action across modules, newest first. Entries cannot be edited and go into the after-action report.</Intro>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '4px 14px' }}>
        {s.log.map((l, i) => {
          const m = viewOf(l.mod);
          return (
            <div
              key={s.log.length - i}
              style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.divider}` }}
            >
              <span style={{ flex: 'none', width: 40, font: font('700 11px/1.3', 'mono'), color: C.faint, paddingTop: 2 }}>{l.t}</span>
              <div style={{ flex: 1, ...col(4) }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    font: font('800 9.5px/1', 'cond'),
                    letterSpacing: '.9px',
                    textTransform: 'uppercase',
                    padding: '4px 6px',
                    borderRadius: 4,
                    background: m.t,
                    color: m.c,
                  }}
                >
                  {m.n}
                </span>
                <span style={{ font: font('600 13px/1.4', 'body') }}>{l.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
