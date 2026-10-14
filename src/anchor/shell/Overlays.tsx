import { useAnchor } from '../context';
import { I, USERS } from '../data';
import { initials } from '../logic';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';

/** Bottom sheet listing the DRRM AIDs saved on this phone. */
export function SavedIdSheet() {
  const a = useAnchor();
  if (!a.s.sheet) return null;
  return (
    <>
      <div onClick={a.closeSheet} aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(11,34,55,.5)', zIndex: 10 }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-ids-title"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 11,
          background: C.white,
          borderRadius: '26px 26px 0 0',
          padding: '10px 18px calc(var(--inset-bottom) + 10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 3, background: C.line, alignSelf: 'center' }} />
        <h2 id="saved-ids-title" style={{ margin: 0, font: font('800 20px/1', 'cond') }}>
          Saved DRRM AIDs on this phone
        </h2>
        {USERS.map((u, i) => {
          const on = i === a.s.uIdx;
          return (
            <button
              key={u.code}
              type="button"
              aria-pressed={on}
              onClick={() => a.pickSavedId(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 14,
                textAlign: 'left',
                border: `1.5px solid ${on ? C.teal : C.line}`,
                background: on ? C.tealTint : C.white,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  flex: 'none',
                  borderRadius: '50%',
                  background: C.navy,
                  color: C.white,
                  display: 'grid',
                  placeItems: 'center',
                  font: font('800 14px/1', 'cond'),
                }}
              >
                {initials(u.name)}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: font('700 14px/1.2', 'body') }}>{u.name}</span>
                <span style={{ font: font('600 11px/1.2', 'mono'), color: C.muted }}>
                  {u.code} · {u.org}
                </span>
              </span>
              {on && <Icon d={I.check} size={20} strokeWidth={2.6} stroke={C.teal} />}
            </button>
          );
        })}
        <button
          type="button"
          onClick={a.addSavedId}
          style={{ height: 48, borderRadius: 12, border: '1.5px dashed #C6D2D6', font: font('700 13.5px', 'body'), color: C.teal }}
        >
          Add a DRRM AID by scanning its QR
        </button>
      </div>
    </>
  );
}

export function Toast() {
  const { toast } = useAnchor();
  return (
    <div role="status" aria-live="polite" style={{ position: 'absolute', left: 24, right: 24, bottom: 100, zIndex: 20, pointerEvents: 'none' }}>
      {toast && (
        <div
          style={{
            background: C.navy,
            color: C.white,
            borderRadius: 14,
            padding: '12px 16px',
            font: font('600 13px/1.35', 'body'),
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,.35)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
