import { useAnchor } from '../context';
import { I, MODS } from '../data';
import { initials } from '../logic';
import { C, font } from '../tokens';
import { UP_LOGO } from '../ui/brand';
import { Icon } from '../ui/Icon';
import { LogoMark } from '../ui/LogoMark';
import { col } from '../ui/styles';

type DrawerEntry =
  | { head: string }
  | {
      key: string;
      label: string;
      sub: string;
      icon: string;
      c: string;
      t: string;
      locked?: boolean;
      count?: number;
      active?: boolean;
      go: () => void;
    };

function DrawerHead({ label }: { label: string }) {
  return (
    <div
      style={{
        font: font('800 10px/1', 'cond'),
        letterSpacing: '1.3px',
        textTransform: 'uppercase',
        color: C.faint,
        padding: '14px 10px 6px',
      }}
    >
      {label}
    </div>
  );
}

/** The sliding module drawer: operation, modules (locked if outside the position), command and device items. */
export function Drawer() {
  const a = useAnchor();
  const { s, granted, user } = a;
  const open = s.drawer;
  const flags = a.secAlerts.length;

  const entries: DrawerEntry[] = [
    { head: 'Operation' },
    {
      key: 'home',
      label: 'Overview',
      sub: 'Needs you now, alerts, log',
      icon: I.home,
      c: C.teal,
      t: C.tealTint,
      active: s.mod === 'home',
      go: () => a.openMod('home'),
    },
    { head: `Modules · ${granted.length} of ${MODS.length}` },
    ...MODS.map((m) => {
      const ok = granted.includes(m.k);
      return {
        key: m.k,
        label: m.n,
        sub: ok ? m.f : 'Not in your position',
        icon: m.icon,
        c: ok ? m.c : C.faint,
        t: ok ? m.t : C.slateTint,
        locked: !ok,
        active: s.mod === m.k,
        go: () => a.openMod(m.k),
      };
    }),
    ...(a.admin
      ? [
          { head: 'Command' },
          {
            key: 'admin',
            label: 'Positions and alternates',
            sub: 'IC only',
            icon: I.key,
            c: C.teal,
            t: C.tealTint,
            count: a.showSec && flags > 0 ? flags : undefined,
            active: s.mod === 'admin',
            go: () => a.openMod('admin'),
          },
        ]
      : []),
    { head: 'This device' },
    {
      key: 'alerts',
      label: 'Alerts inbox',
      sub: 'From the IC and building admin',
      icon: I.bell,
      c: C.red,
      t: C.redTint,
      count: a.alerts.length,
      go: () => a.openMod('home', 'alerts'),
    },
    {
      key: 'sync',
      label: `Synced ${a.clock}`,
      sub: 'Offline-ready · 2 actions queued',
      icon: I.sync,
      c: C.greenInk,
      t: C.greenTint,
      go: a.sync,
    },
    {
      key: 'about',
      label: 'About and manual',
      sub: 'How ANCHOR works',
      icon: I.info,
      c: C.slate,
      t: C.slateTint,
      active: s.mod === 'about',
      go: () => a.openMod('about'),
    },
  ];

  return (
    <>
      <div
        onClick={a.closeDrawer}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 8,
          background: 'rgba(11,34,55,.5)',
          transition: 'opacity .25s',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <aside
        id="anchor-drawer"
        aria-label="Modules"
        aria-hidden={!open}
        inert={!open}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 308,
          maxWidth: '86%',
          zIndex: 9,
          background: C.surface,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform .28s cubic-bezier(.2,.8,.2,1)',
          transform: open ? 'translateX(0)' : 'translateX(-105%)',
          boxShadow: '10px 0 40px rgba(0,0,0,.18)',
        }}
      >
        <div
          style={{
            flex: 'none',
            background: C.navy,
            color: C.white,
            padding: 'calc(var(--inset-top) + 12px) 18px 16px',
            ...col(12),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark concept={a.settings.logoConcept} size={30} />
            <span style={{ font: font('800 18px/1', 'cond'), letterSpacing: '3px' }}>ANCHOR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <div
              style={{
                width: 44,
                height: 44,
                flex: 'none',
                borderRadius: '50%',
                background: C.navy2,
                display: 'grid',
                placeItems: 'center',
                font: font('800 16px/1', 'cond'),
              }}
            >
              {initials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0, ...col(3) }}>
              <span style={{ font: font('800 16px/1.1', 'cond') }}>{user.name}</span>
              <span style={{ font: font('600 11px/1.3', 'body'), color: C.navyInk }}>{a.position.t}</span>
              {a.isAlt && <span style={{ font: font('600 10.5px/1.3', 'body'), color: C.amber }}>Alternate for {a.altTitle}</span>}
            </div>
          </div>
          <div role="radiogroup" aria-label="Operation mode" style={{ display: 'flex', gap: 4, background: C.navy2, borderRadius: 11, padding: 4 }}>
            <button
              type="button"
              role="radio"
              aria-checked={!a.live}
              onClick={() => a.setOpMode('drill')}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 8,
                font: font('700 12px', 'body'),
                background: a.live ? 'transparent' : C.amber,
                color: a.live ? C.navyInk : C.navy,
              }}
            >
              Drill
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={a.live}
              onClick={() => a.setOpMode('actual')}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 8,
                font: font('700 12px', 'body'),
                background: a.live ? C.red : 'transparent',
                color: a.live ? C.white : C.navyInk,
              }}
            >
              Actual incident
            </button>
          </div>
        </div>

        <nav style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 10px', ...col(2) }}>
          {entries.map((d) =>
            'head' in d ? (
              <DrawerHead key={d.head} label={d.head} />
            ) : (
              <button
                key={d.key}
                type="button"
                className="press-98"
                onClick={d.go}
                aria-current={d.active ? 'page' : undefined}
                aria-disabled={d.locked || undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 10px',
                  borderRadius: 12,
                  textAlign: 'left',
                  background: d.active ? C.white : 'transparent',
                  opacity: d.locked ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    flex: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    background: d.t,
                    color: d.c,
                  }}
                >
                  <Icon d={d.icon} size={18} />
                </span>
                <span style={{ flex: 1, minWidth: 0, ...col(2) }}>
                  <span style={{ font: font('700 14px/1.15', 'body') }}>{d.label}</span>
                  <span
                    style={{
                      font: font('500 11px/1.2', 'body'),
                      color: C.faint,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {d.sub}
                  </span>
                </span>
                {d.locked && <Icon d={I.lock} size={15} strokeWidth={2} stroke={C.faint} />}
                {d.count !== undefined && (
                  <span
                    style={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: 11,
                      background: C.red,
                      color: C.white,
                      font: font('800 11px/22px', 'body'),
                      textAlign: 'center',
                      padding: '0 6px',
                    }}
                  >
                    {d.count}
                  </span>
                )}
              </button>
            ),
          )}
        </nav>

        <div
          style={{
            flex: 'none',
            borderTop: `1px solid ${C.line}`,
            padding: '12px 18px calc(var(--inset-bottom) + 2px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <img src={UP_LOGO} alt="University of the Philippines" style={{ width: 26, height: 26, objectFit: 'contain' }} />
          <span style={{ flex: 1, font: font('500 10.5px/1.3', 'body'), color: C.faint }}>
            University of the Philippines
            <br />
            Resilience Institute
          </span>
          <button
            type="button"
            onClick={a.signOut}
            style={{
              height: 38,
              padding: '0 13px',
              borderRadius: 10,
              background: C.white,
              border: `1.5px solid ${C.line}`,
              font: font('700 12.5px', 'body'),
              color: C.red,
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
