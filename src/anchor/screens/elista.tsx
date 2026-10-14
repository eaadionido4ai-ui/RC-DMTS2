import type { CSSProperties } from 'react';
import { useAnchor } from '../context';
import { I, REG_CENTERS, REG_GROUPS, RELEASED, viewOf } from '../data';
import { initials } from '../logic';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';
import { ChipRow, ChoiceChip, EmptyState, FieldLabel, Initials, SectionLabel } from '../ui/primitives';
import { card, col, rowDivider, subText, timeText } from '../ui/styles';

const BLUE = viewOf('elista').c;

const statTile = (bg: string): CSSProperties => ({ background: bg, borderRadius: 10, padding: '9px 10px' });
const statValue = font('800 20px/1', 'cond');
const statLabel: CSSProperties = {
  font: font('600 10px/1.2', 'body'),
  color: C.muted,
  marginTop: 3,
  textTransform: 'uppercase',
  letterSpacing: '.4px',
};

export function ElistaStatus() {
  const a = useAnchor();
  const { s } = a;
  const pct = `${Math.round((s.accounted / s.registered) * 100)}%`;
  return (
    <div style={col(14)}>
      <div style={{ ...card(18, 16), ...col(12) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ font: font('800 10.5px/1', 'cond'), letterSpacing: '1.3px', textTransform: 'uppercase', color: BLUE }}>
            Accountability
          </span>
          <span style={{ font: font('600 11px/1', 'body'), color: C.faint }}>{pct} accounted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ font: font('800 44px/1', 'cond') }}>{s.accounted}</span>
          <span style={{ font: font('600 14px/1', 'body'), color: C.muted }}>of {s.registered} accounted</span>
        </div>
        <div
          role="progressbar"
          aria-label="Evacuees accounted for"
          aria-valuenow={s.accounted}
          aria-valuemin={0}
          aria-valuemax={s.registered}
          style={{ height: 10, borderRadius: 5, background: C.redTint, overflow: 'hidden' }}
        >
          <div style={{ height: '100%', width: pct, background: BLUE, borderRadius: 5, transition: 'width .4s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          <div style={statTile(C.surface)}>
            <div style={{ font: statValue }}>{a.inCenter}</div>
            <div style={statLabel}>In center</div>
          </div>
          <div style={statTile(C.surface)}>
            <div style={{ font: statValue }}>{RELEASED}</div>
            <div style={statLabel}>Released</div>
          </div>
          <div style={statTile(C.redTint)}>
            <div style={{ font: statValue, color: C.red }}>{a.missingN}</div>
            <div style={{ ...statLabel, color: C.redDeep }}>Unaccounted</div>
          </div>
        </div>
      </div>

      <div style={col(9)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px' }}>
          <SectionLabel as="span">Still unaccounted</SectionLabel>
          <span style={{ font: font('600 11px/1', 'body'), color: C.faint }}>
            Showing {s.missing.length} of {a.missingN}
          </span>
        </div>
        {s.missing.map((m) => (
          <div key={m.id} style={{ ...card(14, '12px 12px 12px 14px'), display: 'flex', alignItems: 'center', gap: 12 }}>
            <Initials text={initials(m.name)} size={38} bg={C.slateTint} color={C.slate} fontSize={13} />
            <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
              <span style={{ font: font('700 14px/1.2', 'body') }}>{m.name}</span>
              <span style={subText}>
                {m.id} · {m.last}
              </span>
            </div>
            <button
              type="button"
              className="press-95"
              onClick={() => a.markFound(m)}
              aria-label={`Mark ${m.name} found`}
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 10,
                background: C.greenTint,
                color: C.greenInk,
                font: font('700 12px', 'body'),
              }}
            >
              Found
            </button>
          </div>
        ))}
        {s.missing.length === 0 && <EmptyState>Everyone on this list is accounted for.</EmptyState>}
      </div>
    </div>
  );
}

const corner = (pos: CSSProperties, sides: ('Left' | 'Right' | 'Top' | 'Bottom')[], radius: string): CSSProperties => ({
  position: 'absolute',
  width: 34,
  height: 34,
  ...pos,
  ...Object.fromEntries(sides.map((side) => [`border${side}`, `4px solid ${C.white}`])),
  borderRadius: radius,
});

export function ElistaScan() {
  const a = useAnchor();
  const last = a.s.lastScan;
  return (
    <div style={col(14)}>
      <div
        role="img"
        aria-label="Camera viewfinder"
        style={{ position: 'relative', height: 300, borderRadius: 20, background: C.device, overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: '50px 60px', borderRadius: 18, boxShadow: '0 0 0 999px rgba(14,26,36,.55)' }} />
        <div style={corner({ left: 60, top: 50 }, ['Left', 'Top'], '16px 0 0 0')} />
        <div style={corner({ right: 60, top: 50 }, ['Right', 'Top'], '0 16px 0 0')} />
        <div style={corner({ left: 60, bottom: 50 }, ['Left', 'Bottom'], '0 0 0 16px')} />
        <div style={corner({ right: 60, bottom: 50 }, ['Right', 'Bottom'], '0 0 16px 0')} />
        <div
          className="scanline"
          style={{ position: 'absolute', left: 70, right: 70, height: 2, background: BLUE, boxShadow: `0 0 12px ${BLUE}` }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 16,
            textAlign: 'center',
            font: font('600 12px/1', 'body'),
            color: C.navyInk,
          }}
        >
          Point at the QR on a DRRM ID
        </div>
      </div>
      <button
        type="button"
        className="press-97"
        onClick={a.simulateScan}
        style={{ height: 54, borderRadius: 14, background: BLUE, color: C.white, font: font('700 15px', 'body') }}
      >
        Simulate a scan
      </button>
      {last && (
        <div
          role="status"
          style={{
            background: C.greenTint,
            border: `1px solid ${C.greenLine}`,
            borderRadius: 14,
            padding: '13px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Icon d={I.check} size={22} strokeWidth={2.4} stroke={C.greenInk} />
          <div style={{ flex: 1, ...col(2) }}>
            <span style={{ font: font('700 14px/1.2', 'body'), color: C.greenInk }}>{last.name} checked in</span>
            <span style={{ font: font('500 11px/1.3', 'body'), color: C.greenMid }}>
              {last.code} · {last.t} · {last.center}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ElistaRegister() {
  const a = useAnchor();
  const { s } = a;
  return (
    <div style={{ ...card(18, 16), ...col(12) }}>
      <div style={col(6)}>
        <FieldLabel htmlFor="reg-name">Full name</FieldLabel>
        <input
          id="reg-name"
          className="focus-blue"
          value={s.regName}
          onChange={(e) => a.set({ regName: e.target.value })}
          placeholder="Last name, First name"
          autoComplete="off"
          style={{
            height: 48,
            border: `1.5px solid ${C.line}`,
            borderRadius: 12,
            padding: '0 14px',
            font: font('600 15px', 'body'),
            outline: 'none',
          }}
        />
      </div>
      <div style={col(6)}>
        <FieldLabel>Group</FieldLabel>
        <ChipRow>
          {REG_GROUPS.map((g) => (
            <ChoiceChip key={g} on={s.regGroup === g} color={BLUE} onClick={() => a.set({ regGroup: g })}>
              {g}
            </ChoiceChip>
          ))}
        </ChipRow>
      </div>
      <div style={col(6)}>
        <FieldLabel>Center</FieldLabel>
        <ChipRow>
          {REG_CENTERS.map((c) => (
            <ChoiceChip key={c} on={s.regCenter === c} color={BLUE} onClick={() => a.set({ regCenter: c })}>
              {c}
            </ChoiceChip>
          ))}
        </ChipRow>
      </div>
      <button
        type="button"
        className="press-97"
        onClick={a.register}
        style={{ height: 52, borderRadius: 14, background: BLUE, color: C.white, font: font('700 15px', 'body'), marginTop: 4 }}
      >
        Register and issue DRRM ID
      </button>
    </div>
  );
}

export function ElistaRoster() {
  const { s } = useAnchor();
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2px 14px' }}>
      {s.roster.map((r, i) => (
        <div key={s.roster.length - i} style={rowDivider('11px 0')}>
          <Initials text={initials(r.name)} size={34} bg="#E8F0F9" color={C.steel} fontSize={12} />
          <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
            <span style={{ font: font('700 13.5px/1.2', 'body') }}>{r.name}</span>
            <span style={subText}>
              {r.code} · {r.center}
            </span>
          </div>
          <span style={timeText}>{r.t}</span>
        </div>
      ))}
    </div>
  );
}
