import type { CSSProperties, ReactNode } from 'react';
import { useAnchor } from '../context';
import { CENTER_CAPACITY, HAZARD_TYPES, I, MAP_LAYERS, TEAMS, viewOf } from '../data';
import { C, font } from '../tokens';
import { Icon } from '../ui/Icon';
import { ChipRow, ChoiceChip, FieldLabel, SectionLabel } from '../ui/primitives';
import { card, col, rowDivider, subText, timeText } from '../ui/styles';

const TEAL = viewOf('sipat').c;

interface FacilityProps {
  box: CSSProperties;
  border: string;
  children: ReactNode;
  spread?: boolean;
}

function Facility({ box, border, children, spread = true }: FacilityProps) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 10,
        background: C.white,
        border: `1.5px solid ${border}`,
        padding: '8px 10px',
        ...(spread ? { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } : {}),
        ...box,
      }}
    >
      {children}
    </div>
  );
}

const facilityName = (color: string, lineHeight = 1): CSSProperties => ({ font: font(`800 12px/${lineHeight}`, 'cond'), color });
const facilityStat = (color: string): CSSProperties => ({ font: font('700 11px/1', 'body'), color });

function TeamMarker({ k, left, top }: { k: string; left: number; top: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: TEAL,
        border: `3px solid ${C.white}`,
        color: C.white,
        display: 'grid',
        placeItems: 'center',
        font: font('800 10px/1', 'cond'),
        boxShadow: '0 3px 8px rgba(11,34,55,.3)',
      }}
    >
      {k}
    </div>
  );
}

export function SipatMap() {
  const a = useAnchor();
  const { layers, hazards } = a.s;
  return (
    <div style={col(14)}>
      <div style={{ display: 'flex', gap: 7 }}>
        {MAP_LAYERS.map(([k, label]) => (
          <ChoiceChip
            key={k}
            on={layers[k]}
            color={TEAL}
            onClick={() => a.set((st) => ({ layers: { ...st.layers, [k]: !st.layers[k] } }))}
            style={{ height: 36, font: font('700 12px', 'body') }}
          >
            {label}
          </ChoiceChip>
        ))}
      </div>
      <div
        role="img"
        aria-label="Schematic map of the campus with hazards, facilities and teams"
        style={{
          position: 'relative',
          height: 330,
          borderRadius: 18,
          overflow: 'hidden',
          border: `1px solid ${C.mapLine}`,
          backgroundColor: '#E9F0EE',
          backgroundImage: 'linear-gradient(#DCE6E4 1px,transparent 1px),linear-gradient(90deg,#DCE6E4 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 148, height: 16, background: C.white, boxShadow: `0 0 0 1px ${C.mapLine}` }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 196, width: 14, background: C.white, boxShadow: `0 0 0 1px ${C.mapLine}` }} />

        {layers.hazards && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 214,
                top: 170,
                width: 140,
                height: 118,
                borderRadius: '40px 18px 30px 60px',
                background: 'repeating-linear-gradient(-45deg,rgba(242,183,5,.35) 0 8px,rgba(242,183,5,.12) 8px 16px)',
                border: `1.5px dashed ${C.amberDeep}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 226,
                top: 262,
                font: font('800 9.5px/1', 'cond'),
                letterSpacing: '.8px',
                textTransform: 'uppercase',
                color: C.amberDeep,
              }}
            >
              Flood-prone · knee-deep
            </div>
            {hazards.map((h, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: C.orange,
                  color: C.white,
                  display: 'grid',
                  placeItems: 'center',
                  font: font('800 13px/1', 'cond'),
                  boxShadow: '0 0 0 5px rgba(232,89,12,.2)',
                }}
              >
                !
              </div>
            ))}
          </>
        )}

        {layers.facilities && (
          <>
            <Facility box={{ left: 20, top: 22, width: 160, height: 106, padding: '9px 10px' }} border={viewOf('elista').c}>
              <span style={facilityName(C.steel, 1.1)}>
                Evacuation Center
                <br />
                (Gym)
              </span>
              <span style={facilityStat(viewOf('elista').c)}>
                {a.inCenter} / {CENTER_CAPACITY}
              </span>
            </Facility>
            <Facility box={{ left: 226, top: 22, width: 126, height: 62 }} border={C.red}>
              <span style={facilityName(C.redDeep)}>First Aid</span>
              <span style={facilityStat(C.red)}>6 patients</span>
            </Facility>
            <Facility box={{ left: 226, top: 96, width: 126, height: 42 }} border={viewOf('kamalig').c} spread={false}>
              <span style={facilityName('#4A3496')}>Storehouse</span>
            </Facility>
            <Facility box={{ left: 70, top: 180, width: 110, height: 56 }} border={C.slate}>
              <span style={facilityName(C.slate)}>Covered Court</span>
              <span style={facilityStat(C.slate)}>Overflow</span>
            </Facility>
          </>
        )}

        {layers.teams && (
          <>
            <TeamMarker k="T1" left={150} top={140} />
            <TeamMarker k="T2" left={290} top={196} />
            <TeamMarker k="T3" left={96} top={270} />
          </>
        )}

        <div
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            font: font('600 9.5px/1', 'body'),
            color: C.faint,
            background: 'rgba(255,255,255,.85)',
            padding: '4px 7px',
            borderRadius: 5,
          }}
        >
          Schematic · offline tiles in build
        </div>
      </div>
    </div>
  );
}

export function SipatTeams() {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '4px 14px' }}>
      {TEAMS.map((tm) => (
        <div key={tm.k} style={rowDivider('12px 0')}>
          <span
            style={{
              width: 30,
              height: 30,
              flex: 'none',
              borderRadius: '50%',
              background: '#E3F5F3',
              color: '#137A70',
              display: 'grid',
              placeItems: 'center',
              font: font('800 10px/1', 'cond'),
            }}
          >
            {tm.k}
          </span>
          <div style={{ flex: 1, ...col(2) }}>
            <span style={{ font: font('700 13.5px/1.2', 'body') }}>{tm.name}</span>
            <span style={subText}>{tm.task}</span>
          </div>
          <span style={timeText}>{tm.t}</span>
        </div>
      ))}
    </div>
  );
}

export function SipatReport() {
  const a = useAnchor();
  const { s } = a;
  return (
    <div style={col(14)}>
      <div style={{ ...card(18, 16), ...col(12) }}>
        <FieldLabel>What is it?</FieldLabel>
        <ChipRow>
          {HAZARD_TYPES.map((t) => (
            <ChoiceChip key={t} on={s.hzType === t} color={TEAL} onClick={() => a.set({ hzType: t })}>
              {t}
            </ChoiceChip>
          ))}
        </ChipRow>
        <button
          type="button"
          className="press-97"
          onClick={a.pinHazard}
          style={{
            height: 52,
            borderRadius: 14,
            background: TEAL,
            color: C.white,
            font: font('700 14.5px', 'body'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
          }}
        >
          <Icon d={I.pin} size={19} strokeWidth={2} />
          Pin at my location
        </button>
      </div>
      <SectionLabel>Reported this operation</SectionLabel>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2px 14px' }}>
        {s.hazards.map((h, i) => (
          <div key={i} style={rowDivider('11px 0')}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.orange }} />
            <span style={{ flex: 1, font: font('600 13px/1.3', 'body') }}>{h.l}</span>
            <span style={timeText}>{h.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
