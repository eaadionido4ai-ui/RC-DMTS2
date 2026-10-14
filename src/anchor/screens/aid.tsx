import { useMemo } from 'react';
import { useAnchor } from '../context';
import { CENTER_CAPACITY, HOTLINES, I, SOS_CATEGORIES, SOS_LOCATION } from '../data';
import { QR_SIZE, qrCells } from '../logic';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';
import { LogoMark } from '../ui/LogoMark';
import { ChoiceChip, Pill } from '../ui/primitives';
import { card, col, rowDivider, subText } from '../ui/styles';

function QrCode({ seed, label }: { seed: number; label: string }) {
  const path = useMemo(() => {
    let d = '';
    qrCells(seed).forEach((dark, i) => {
      if (dark) d += `M${i % QR_SIZE} ${Math.floor(i / QR_SIZE)}h1v1h-1z`;
    });
    return d;
  }, [seed]);
  return (
    <svg width={200} height={200} viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} shapeRendering="crispEdges" role="img" aria-label={label}>
      <rect width={QR_SIZE} height={QR_SIZE} fill={C.white} />
      <path d={path} fill={C.navy} />
    </svg>
  );
}

export function AidId() {
  const a = useAnchor();
  const { user } = a;
  return (
    <div style={col(12)}>
      <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.line}`, boxShadow: '0 6px 20px rgba(11,34,55,.12)' }}>
        <div
          style={{
            background: C.navy,
            color: C.white,
            padding: '11px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark concept={a.settings.logoConcept} size={22} flat />
            <span style={{ font: font('800 14px/1', 'cond'), letterSpacing: '1px' }}>ANCHOR</span>
          </span>
          <span style={{ font: font('700 10px/1', 'body'), letterSpacing: '1.4px', color: C.amber }}>DRRM ID</span>
        </div>
        <div style={{ background: C.white, padding: '16px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <QrCode seed={a.s.uIdx} label={`DRRM ID QR code for ${user.code}`} />
          <div style={{ textAlign: 'center', ...col(4) }}>
            <span style={{ font: font('800 20px/1.1', 'cond'), color: C.navy }}>{user.name}</span>
            <span style={{ font: font('600 12px/1.3', 'body'), color: C.muted }}>
              {user.meta} · {user.org}
            </span>
            <span style={{ font: font('800 16px/1', 'mono'), color: C.teal, letterSpacing: '2px', marginTop: 4 }}>{user.code}</span>
          </div>
        </div>
        <div style={{ background: C.slateTint, padding: '9px 15px', font: font('600 11px/1.3', 'body'), color: C.slate }}>
          The QR carries only your code. The IMT credential stays sealed.
        </div>
      </div>
    </div>
  );
}

export function AidSos() {
  const a = useAnchor();
  const { s } = a;
  return (
    <div style={col(14)}>
      {!s.sos && (
        <div style={{ ...card(18, 16), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
            {SOS_CATEGORIES.map((c) => (
              <ChoiceChip
                key={c}
                on={s.sosCat === c}
                color={C.red}
                onClick={() => a.set({ sosCat: c })}
                style={{ height: 'auto', padding: '8px 13px' }}
              >
                {c}
              </ChoiceChip>
            ))}
          </div>
          <button
            type="button"
            className="press-96"
            onClick={a.startSos}
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `radial-gradient(circle at 50% 38%,#E23A50,${C.red})`,
              color: C.white,
              font: font('800 36px/1', 'cond'),
              letterSpacing: '2px',
              boxShadow: `0 10px 30px rgba(200,30,54,.35),0 0 0 12px ${C.redTint}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              margin: '14px 0',
            }}
          >
            SOS
            <span style={{ font: font('700 11px/1', 'body'), letterSpacing: 0, opacity: 0.92 }}>Tap once</span>
          </button>
          <div style={{ font: font('400 11.5px/1.5', 'body'), color: C.muted, textAlign: 'center' }}>
            Sounds an alarm on this phone and shares your location as soon as there is signal.
          </div>
        </div>
      )}
      {s.sos && (
        <div
          role="alert"
          style={{
            background: C.redTint,
            border: `2px solid ${C.red}`,
            borderRadius: 18,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: C.red,
              color: C.white,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 0 10px rgba(200,30,54,.18),0 0 0 22px rgba(200,30,54,.08)',
            }}
          >
            <Icon d={I.siren} size={44} strokeWidth={2} />
          </div>
          <div style={{ font: font('800 21px/1.1', 'cond'), color: C.redDeep, marginTop: 10 }}>Help is being requested</div>
          <div style={{ font: font('500 12.5px/1.5', 'body'), color: C.redDeep }}>
            Sent {s.sosAt} · {s.sosCat} · location {SOS_LOCATION}
          </div>
          <button
            type="button"
            onClick={a.stopSos}
            style={{
              height: 48,
              width: '100%',
              borderRadius: 12,
              background: C.white,
              color: C.red,
              font: font('700 14px', 'body'),
              marginTop: 4,
            }}
          >
            Stop, I am safe now
          </button>
        </div>
      )}
    </div>
  );
}

export function AidEvacMap() {
  const a = useAnchor();
  const centers = [
    { n: 'UP Gym (Evacuation Center)', d: '350 m', cap: `${a.inCenter} of ${CENTER_CAPACITY}`, st: 'Open', c: C.greenInk, bg: C.greenTint },
    { n: 'Covered Court', d: '600 m', cap: 'Overflow', st: 'Open', c: C.greenInk, bg: C.greenTint },
    { n: 'Palma Hall', d: '900 m', cap: 'Shelter in place', st: 'Restricted', c: C.amberInk, bg: C.amberTint },
  ];
  return (
    <div style={col(10)}>
      <div style={{ background: C.navy, color: C.white, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: C.navy2,
            display: 'grid',
            placeItems: 'center',
            color: C.amber,
            flex: 'none',
          }}
        >
          <Icon d={I.pin} size={21} strokeWidth={2} />
        </span>
        <div style={{ flex: 1, ...col(3) }}>
          <span style={{ font: font('800 10px/1', 'cond'), letterSpacing: '1.2px', textTransform: 'uppercase', color: C.amber }}>
            Nearest open center
          </span>
          <span style={{ font: font('800 18px/1.1', 'cond') }}>UP Gym · 350 m</span>
          <span style={{ font: font('500 11.5px/1.3', 'body'), color: C.navyInk }}>
            Walk north on the main road. Avoid the east side, it is flooded.
          </span>
        </div>
      </div>
      {centers.map((ec) => (
        <div key={ec.n} style={{ ...card(14, '12px 14px'), display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, ...col(3) }}>
            <span style={{ font: font('700 14px/1.2', 'body') }}>{ec.n}</span>
            <span style={subText}>
              {ec.d} · {ec.cap}
            </span>
          </div>
          <Pill bg={ec.bg} color={ec.c}>
            {ec.st}
          </Pill>
        </div>
      ))}
    </div>
  );
}

export function AidHotlines() {
  const a = useAnchor();
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2px 14px' }}>
      {HOTLINES.map((h) => (
        <div key={h.n} style={rowDivider('11px 0')}>
          <div style={{ flex: 1, ...col(2) }}>
            <span style={{ font: font('700 14px/1.2', 'body') }}>{h.n}</span>
            <span style={{ font: font('600 12px/1.3', 'mono'), color: C.muted }}>{h.num}</span>
          </div>
          <button
            type="button"
            className="press-94"
            onClick={() => a.callHotline(h.n)}
            aria-label={`Call ${h.n}`}
            style={{ width: 44, height: 44, borderRadius: 12, background: C.greenTint, color: C.greenInk, display: 'grid', placeItems: 'center' }}
          >
            <Icon d={I.phone} size={19} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}

