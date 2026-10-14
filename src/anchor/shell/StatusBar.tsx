import { useAnchor } from '../context';
import { C, font } from '../tokens';

/** The device status bar drawn inside the phone frame. */
export function StatusBar() {
  const { clock } = useAnchor();
  return (
    <div
      aria-hidden="true"
      style={{
        flex: 'none',
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 28px 0 30px',
        font: font('600 14px/1', 'body'),
        position: 'relative',
        zIndex: 3,
      }}
    >
      <span>{clock}</span>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10,
          transform: 'translateX(-50%)',
          width: 108,
          height: 30,
          borderRadius: 20,
          background: C.device,
        }}
      />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11">
          <rect x="0" y="7" width="3" height="4" rx="1" fill={C.ink} />
          <rect x="4.3" y="5" width="3" height="6" rx="1" fill={C.ink} />
          <rect x="8.6" y="2.5" width="3" height="8.5" rx="1" fill={C.ink} />
          <rect x="12.9" y="0" width="3" height="11" rx="1" fill={C.ink} opacity=".3" />
        </svg>
        <div style={{ width: 24, height: 11, borderRadius: 3, border: `1.5px solid ${C.ink}`, padding: 1 }}>
          <div style={{ width: '70%', height: '100%', background: C.ink, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}
