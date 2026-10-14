import type { CSSProperties } from 'react';
import { useAnchor } from '../context';
import { I, viewOf } from '../data';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';

const headerRow: CSSProperties = { flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '6px 16px 12px' };

const squareButton: CSSProperties = {
  position: 'relative',
  width: 40,
  height: 40,
  borderRadius: 12,
  background: C.white,
  border: `1px solid ${C.line}`,
  display: 'grid',
  placeItems: 'center',
};

const tile = (bg: string, color: string): CSSProperties => ({
  width: 40,
  height: 40,
  flex: 'none',
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  background: bg,
  color,
});

const subtitle: CSSProperties = { font: font('500 11.5px/1.3', 'body'), color: C.muted, marginTop: 3 };

/** Header for DRRM AID opened from the sign-in screen. */
export function GateAidHeader() {
  const a = useAnchor();
  return (
    <header style={headerRow}>
      <button type="button" onClick={a.closeGateAid} aria-label="Back to sign-in" style={squareButton}>
        <Icon d={I.back} size={20} strokeWidth={2.2} />
      </button>
      <div style={tile(C.redTint, C.red)}>
        <Icon d={I.shield} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, font: font('800 21px/1', 'cond') }}>DRRM AID</h1>
        <div style={subtitle}>{a.s.limited ? 'Responder sign-in unavailable on this phone' : 'Available without signing in'}</div>
      </div>
    </header>
  );
}

/** Header for a signed-in view: drawer button, the current module and its full name. */
export function ModuleHeader() {
  const a = useAnchor();
  const cur = viewOf(a.curMod ?? 'home');
  const unread = a.showSec && a.secAlerts.length > 0;
  return (
    <header style={headerRow}>
      <button
        type="button"
        className="press-94"
        onClick={a.openDrawer}
        aria-label={unread ? 'Open modules, new sign-in flags' : 'Open modules'}
        aria-expanded={a.s.drawer}
        aria-controls="anchor-drawer"
        style={squareButton}
      >
        <Icon d={I.menu} size={20} strokeWidth={2.2} />
        {unread && (
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.red,
              border: `2px solid ${C.white}`,
              boxSizing: 'content-box',
            }}
          />
        )}
      </button>
      <div style={tile(cur.t, cur.c)}>
        <Icon d={cur.icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, font: font('800 21px/1', 'cond'), letterSpacing: '.3px' }}>{cur.n}</h1>
        <div style={{ ...subtitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.full}</div>
      </div>
    </header>
  );
}

/** Drill or actual-incident strip with the operation's running clock. */
export function OperationBanner() {
  const a = useAnchor();
  const op = a.live
    ? {
        bg: C.redDeep,
        stripe: `repeating-linear-gradient(-45deg,${C.red} 0 10px,#fff 10px 20px)`,
        badgeBg: C.white,
        badgeInk: C.redDeep,
        dot: C.red,
        label: 'Actual',
      }
    : {
        bg: C.navy,
        stripe: `repeating-linear-gradient(-45deg,${C.amber} 0 10px,${C.navy} 10px 20px)`,
        badgeBg: C.amber,
        badgeInk: C.navy,
        dot: C.navy,
        label: 'Drill',
      };
  return (
    <div style={{ flex: 'none', margin: '0 16px 4px', borderRadius: 12, overflow: 'hidden', background: op.bg, color: C.white }}>
      <div style={{ height: 5, background: op.stripe }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            font: font('800 11px/1', 'cond'),
            letterSpacing: '1.1px',
            textTransform: 'uppercase',
            padding: '5px 8px',
            borderRadius: 5,
            background: op.badgeBg,
            color: op.badgeInk,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: op.dot }} />
          {op.label}
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            font: font('700 13px/1.15', 'cond'),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Typhoon response · Campus Evac Center
        </div>
        <span style={{ font: font('700 13px/1', 'mono') }}>{a.elapsed}</span>
      </div>
    </div>
  );
}
