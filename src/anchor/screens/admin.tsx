import { useAnchor } from '../context';
import { ALTERNATE_CANDIDATES } from '../data';
import { C, font } from '../tokens';
import type { SecKind } from '../types';
import { EmptyState, Intro, Pill } from '../ui/primitives';
import { card, col, timeText } from '../ui/styles';

export function AdminPositions() {
  const a = useAnchor();
  return (
    <div style={col(10)}>
      <Intro>
        Modules follow each person's IMT position. Name an alternate when a position holder is absent; their next sign-in
        picks up that position's modules for this operation.
      </Intro>
      {a.s.positions.map((p) => {
        const hasAlt = !p.present && !!p.alt;
        const needsAlt = !p.present && !p.alt;
        const status = p.present
          ? { label: 'On duty', bg: C.greenTint, ink: C.greenInk }
          : hasAlt
            ? { label: 'Covered', bg: C.amberTint, ink: C.amberInk }
            : { label: 'Absent', bg: C.redTint, ink: C.red };
        return (
          <div key={p.k} style={{ ...card(14, '12px 14px'), ...col(10) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0, ...col(3) }}>
                <span style={{ font: font('700 14px/1.2', 'body') }}>{p.title}</span>
                <span style={{ font: font('500 11.5px/1.3', 'body'), color: C.faint }}>
                  {p.holder}
                  {hasAlt && ` · alternate: ${p.alt}`}
                </span>
              </div>
              <Pill bg={status.bg} color={status.ink}>
                {status.label}
              </Pill>
            </div>
            {needsAlt && (
              <div style={col(7)}>
                <span style={{ font: font('700 10px/1', 'cond'), letterSpacing: '1px', textTransform: 'uppercase', color: C.muted }}>
                  Assign alternate
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALTERNATE_CANDIDATES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="press-96"
                      onClick={() => a.nameAlternate(p, n)}
                      style={{
                        height: 36,
                        padding: '0 12px',
                        borderRadius: 99,
                        border: `1.5px solid ${C.line}`,
                        background: C.white,
                        font: font('700 12px', 'body'),
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasAlt && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => a.issueTempCode(p)}
                  style={{ flex: 1, height: 40, borderRadius: 11, background: C.teal, color: C.white, font: font('700 12.5px', 'body') }}
                >
                  Issue temporary code
                </button>
                <button
                  type="button"
                  onClick={() => a.clearAlternate(p)}
                  style={{ height: 40, padding: '0 14px', borderRadius: 11, background: C.slateTint, color: C.ink2, font: font('700 12.5px', 'body') }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AdminCodes() {
  const a = useAnchor();
  const { codes } = a.s;
  return (
    <div style={col(10)}>
      <Intro>
        Temporary codes let an alternate sign in with the absent position's modules. Each one expires when the operation
        closes. Share it in person only.
      </Intro>
      {codes.map((c) => (
        <div key={c.code} style={{ ...card(14, '13px 14px'), display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0, ...col(4) }}>
            <span style={{ font: font('800 18px/1', 'mono'), letterSpacing: '2px', color: c.live ? C.navy : C.faint }}>{c.code}</span>
            <span style={{ font: font('500 11.5px/1.3', 'body'), color: C.muted }}>
              {c.who} · {c.pos}
            </span>
            <span style={{ font: font('500 10.5px/1.3', 'body'), color: C.faint }}>
              {c.live ? 'Valid until this operation closes' : 'Revoked'}
            </span>
          </div>
          {c.live && (
            <button
              type="button"
              onClick={() => a.revokeTempCode(c)}
              style={{ height: 36, padding: '0 12px', borderRadius: 10, background: C.redTint, color: C.red, font: font('700 12px', 'body') }}
            >
              Revoke
            </button>
          )}
        </div>
      ))}
      {codes.length === 0 && <EmptyState>No temporary codes. Issue one from Positions after naming an alternate.</EmptyState>}
    </div>
  );
}

const SEC_COLOR: Record<SecKind, string> = { Mismatch: C.red, Duress: C.redDeep, Monitored: C.amberDeep };

export function AdminActivity() {
  const { s } = useAnchor();
  return (
    <div style={col(10)}>
      <Intro>Sign-in problems and everything a flagged session does. Only the IC sees this.</Intro>
      {s.sec.map((x, i) => {
        const color = SEC_COLOR[x.kind] ?? C.steel;
        return (
          <div key={s.sec.length - i} style={{ ...card(14, '12px 14px'), display: 'flex', gap: 12 }}>
            <div style={{ width: 4, borderRadius: 2, background: color, flex: 'none' }} />
            <div style={{ flex: 1, ...col(4) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ font: font('800 10px/1', 'cond'), letterSpacing: '1.1px', textTransform: 'uppercase', color }}>
                  {x.kind}
                </span>
                <span style={timeText}>{x.t}</span>
              </div>
              <span style={{ font: font('600 13px/1.4', 'body') }}>{x.text}</span>
            </div>
          </div>
        );
      })}
      {s.sec.length === 0 && (
        <EmptyState>No flagged sign-ins or sessions yet.</EmptyState>
      )}
    </div>
  );
}
