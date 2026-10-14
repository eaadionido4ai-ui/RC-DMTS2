import { useAnchor } from '../context';
import { I, viewOf } from '../data';
import { availability, stockColor } from '../logic';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';
import { EmptyState, Quantity } from '../ui/primitives';
import { card, col, subText, timeText } from '../ui/styles';

const VIOLET = viewOf('kamalig').c;
const ALAGA = viewOf('alaga');

export function KamaligRequests() {
  const a = useAnchor();
  const { s } = a;
  return (
    <div style={col(10)}>
      {s.reqs.map((r) => {
        const { item, have, ok } = availability(r, s.stock);
        const avail = item ? (ok ? `${have} ${item.unit} on hand, enough to fill` : `Only ${have} on hand`) : 'Not carried in the storehouse';
        return (
          <div key={r.id} style={{ ...card(16, '13px 14px'), ...col(10) }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, ...col(3) }}>
                <span style={{ font: font('700 14.5px/1.2', 'body') }}>{r.item}</span>
                <span style={subText}>
                  {r.id} · {r.from}
                </span>
                <span style={{ font: font('600 11.5px/1.3', 'body'), color: ok ? C.green : C.orange }}>{avail}</span>
              </div>
              <Quantity qty={r.qty} unit={r.unit} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                className="press-97"
                aria-disabled={!ok}
                onClick={() => a.fillRequest(r)}
                style={{
                  height: 42,
                  borderRadius: 11,
                  background: ok ? VIOLET : C.slateTint,
                  color: ok ? C.white : C.faint,
                  font: font('700 13px', 'body'),
                }}
              >
                Fill from stock
              </button>
              <button
                type="button"
                className="press-97"
                onClick={() => a.flagRequest(r)}
                style={{ height: 42, borderRadius: 11, background: ALAGA.t, color: '#74204F', font: font('700 13px', 'body') }}
              >
                Flag to ALAGA
              </button>
            </div>
          </div>
        );
      })}
      {s.reqs.length === 0 && <EmptyState>No open requests.</EmptyState>}
    </div>
  );
}

export function KamaligStock() {
  const { s } = useAnchor();
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '6px 14px' }}>
      {s.stock.map((x) => {
        const ratio = x.qty / x.cap;
        const color = stockColor(ratio);
        const pct = `${Math.round(ratio * 100)}%`;
        return (
          <div key={x.k} style={{ ...col(7), padding: '11px 0', borderBottom: `1px solid ${C.divider}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ font: font('700 13.5px/1.2', 'body') }}>{x.name}</span>
              <span style={{ font: font('700 12px/1.2', 'body'), color }}>
                {x.qty} {x.unit}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${x.name} stock`}
              aria-valuenow={x.qty}
              aria-valuemin={0}
              aria-valuemax={x.cap}
              style={{ height: 6, borderRadius: 3, background: C.slateTint, overflow: 'hidden' }}
            >
              <div style={{ height: '100%', width: pct, background: color, borderRadius: 3, transition: 'width .4s' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KamaligDispatched() {
  const { s } = useAnchor();
  return (
    <div style={col(10)}>
      {s.sent.map((d, i) => (
        <div key={s.sent.length - i} style={{ ...card(14, '12px 14px'), display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: viewOf('kamalig').t,
              color: VIOLET,
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}
          >
            <Icon d={I.truck} size={18} strokeWidth={2} />
          </span>
          <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
            <span style={{ font: font('700 13.5px/1.2', 'body') }}>
              {d.qty} {d.unit} {d.item}
            </span>
            <span style={subText}>
              {d.id} · to {d.to}
            </span>
          </div>
          <span style={timeText}>{d.t}</span>
        </div>
      ))}
    </div>
  );
}
