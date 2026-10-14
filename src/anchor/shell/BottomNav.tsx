import { useAnchor } from '../context';
import { TABS, viewOf } from '../data';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';

/** The current view's own features, as in ALAGA. */
export function BottomNav() {
  const a = useAnchor();
  if (!a.curMod) return null;
  const view = viewOf(a.curMod);
  return (
    <nav
      aria-label={`${view.n} sections`}
      style={{
        flex: 'none',
        background: C.white,
        borderTop: `1px solid ${C.line}`,
        padding: '6px 10px var(--inset-bottom)',
        display: 'flex',
      }}
    >
      {TABS[a.curMod].map(([k, label, icon]) => {
        const on = k === a.curTab;
        const badge = k === 'alerts' && !on;
        return (
          <button
            key={k}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => a.goToTab(k, label)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '6px 0 2px',
              color: on ? view.c : C.muted,
              font: font('700 10px/1', 'cond'),
              letterSpacing: '.6px',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ position: 'relative', padding: '5px 14px', borderRadius: 12, background: on ? view.t : 'transparent' }}>
              <Icon d={icon} />
              {badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: 4,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: C.red,
                    color: C.white,
                    font: font('800 10px/18px', 'body'),
                    padding: '0 4px',
                    border: `2px solid ${C.white}`,
                    boxSizing: 'content-box',
                  }}
                >
                  {a.alerts.length}
                </span>
              )}
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
