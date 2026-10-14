import { Fragment } from 'react';
import { useAnchor } from '../context';
import { viewOf } from '../data';
import { C, font } from '../tokens';
import { col } from '../ui/styles';

export function GabBrief() {
  const a = useAnchor();
  const { s } = a;
  const endorsed = a.endorsed.length;
  const brief = [
    `${s.accounted} of ${s.registered} accounted for; ${a.missingN} still open in eLISTA.`,
    a.lowStock.length
      ? `${a.lowStock.map((x) => x.name.toLowerCase()).join(', ')} below a quarter of capacity.`
      : 'Stock levels are healthy.',
    `${endorsed} procurement request${endorsed === 1 ? '' : 's'} waiting on the IC in ALAGA.`,
  ];
  return (
    <div
      style={{
        background: `linear-gradient(160deg,${C.navy2},${C.navy})`,
        color: C.white,
        borderRadius: 18,
        padding: 16,
        ...col(10),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: font('800 10.5px/1', 'cond'), letterSpacing: '1.3px', textTransform: 'uppercase', color: C.amber }}>
          Situation brief
        </span>
        <span style={{ font: font('600 10.5px/1', 'mono'), color: C.navyInk }}>{a.clock}</span>
      </div>
      {brief.map((b) => (
        <div key={b} style={{ display: 'flex', gap: 10, font: font('500 13.5px/1.45', 'body'), color: '#DCEBF4' }}>
          <span style={{ flex: 'none', width: 6, height: 6, borderRadius: '50%', background: viewOf('gab').c, marginTop: 7 }} />
          <span>{b}</span>
        </div>
      ))}
      <div style={{ font: font('500 10.5px/1.4', 'body'), color: '#7F9AAC' }}>
        Drawn from eLISTA, KAMALIG and ALAGA records on this device. Advisory only; the IC decides.
      </div>
    </div>
  );
}

export function GabAsk() {
  const a = useAnchor();
  const { s } = a;
  const endorsed = a.endorsed;
  const answers: Record<string, string> = {
    'What needs my decision?': endorsed.length
      ? `${endorsed.length} ALAGA request${endorsed.length > 1 ? 's wait' : ' waits'} on the IC: ${endorsed
          .map((x) => `${x.id} ${x.item.toLowerCase()}`)
          .join(' and ')}.`
      : 'Nothing is waiting on the IC right now.',
    'Who is still unaccounted?': `${a.missingN} people. ${s.missing
      .slice(0, 2)
      .map((m) => `${m.name} (${m.last.toLowerCase()})`)
      .join(', ')} were seen most recently, so start there.`,
    'Summarize the last hour': `${s.log
      .slice(0, 3)
      .map((l) => l.text)
      .join('. ')}.`,
  };
  return (
    <div style={col(14)}>
      <div style={col(10)} aria-live="polite">
        {s.gab.map((c, i) => (
          <Fragment key={i}>
            <div
              style={{
                alignSelf: 'flex-end',
                maxWidth: '80%',
                background: C.navy,
                color: C.white,
                borderRadius: '16px 16px 4px 16px',
                padding: '10px 13px',
                font: font('600 13px/1.4', 'body'),
              }}
            >
              {c.q}
            </div>
            <div
              style={{
                alignSelf: 'flex-start',
                maxWidth: '88%',
                background: C.white,
                border: `1px solid ${C.line}`,
                borderRadius: '16px 16px 16px 4px',
                padding: '11px 13px',
                font: font('400 13px/1.5', 'body'),
              }}
            >
              {c.a}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {Object.entries(answers).map(([q, ans]) => (
          <button
            key={q}
            type="button"
            className="press-96"
            onClick={() => a.ask(q, ans)}
            style={{
              padding: '10px 13px',
              borderRadius: 99,
              background: viewOf('gab').t,
              color: '#8A5A0E',
              font: font('700 12.5px', 'body'),
              border: '1px solid #F4DDB4',
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
