import { useAnchor } from '../context';
import { PIPELINE, PIPELINE_LABEL, STAGES } from '../data';
import { C, font } from '../tokens';
import type { AlagaStage, ProcurementRequest } from '../types';
import { EmptyState, Quantity } from '../ui/primitives';
import { card, col } from '../ui/styles';

/** The next step for a request at each stage: button label, colour, target stage and log wording. */
const NEXT: Partial<Record<AlagaStage, { label: string; color: string; to: AlagaStage; what: string }>> = {
  flagged: { label: 'Endorse to IC', color: C.teal, to: 'endorsed', what: 'endorsed to the IC' },
  endorsed: { label: 'Approve', color: C.green, to: 'approved', what: 'approved and sent to F&A' },
  approved: { label: 'Acknowledge', color: '#A3316F', to: 'processing', what: 'received by F&A' },
  processing: { label: 'Mark delivered', color: C.green, to: 'delivered', what: 'delivered to the storehouse' },
};

/** Endorsed requests first, since they wait on the IC. */
const ORDER: Record<AlagaStage, number> = { endorsed: 0, flagged: 1, approved: 2, processing: 3, delivered: 4 };

const actionButton = {
  flex: 1,
  height: 42,
  borderRadius: 11,
  font: font('800 13px', 'cond'),
  letterSpacing: '.8px',
  textTransform: 'uppercase',
} as const;

/** Shared by the To act, Pipeline and Delivered tabs; the tab decides the filter and whether actions show. */
export function AlagaList() {
  const a = useAnchor();
  const tab = a.curTab;
  const pipeline = tab === 'pipeline';
  const keep = (x: ProcurementRequest) => (tab === 'done' ? x.stage === 'delivered' : tab === 'queue' ? x.stage !== 'delivered' : true);
  const items = a.s.alaga.filter(keep).sort((x, y) => ORDER[x.stage] - ORDER[y.stage]);

  const counts = Object.fromEntries(PIPELINE.map((k) => [k, 0])) as Record<AlagaStage, number>;
  for (const x of a.s.alaga) counts[x.stage]++;

  return (
    <div style={col(12)}>
      {pipeline && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 6 }}>
          {PIPELINE.map((k) => (
            <div
              key={k}
              style={{
                background: C.white,
                borderStyle: 'solid',
                borderColor: C.line,
                borderWidth: '4px 1px 1px',
                borderTopColor: STAGES[k].c,
                borderRadius: 12,
                padding: '9px 4px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ font: font('800 24px/1', 'cond'), color: STAGES[k].c }}>{counts[k]}</div>
              <div
                style={{
                  font: font('700 8.5px/1.2', 'body'),
                  color: C.muted,
                  marginTop: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '.3px',
                }}
              >
                {PIPELINE_LABEL[k]}
              </div>
            </div>
          ))}
        </div>
      )}

      {items.map((x) => {
        const st = STAGES[x.stage];
        const next = pipeline ? undefined : NEXT[x.stage];
        return (
          <div key={x.id} style={{ ...card(16, '13px 14px'), ...col(10) }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, ...col(5) }}>
                <span style={{ font: font('700 14.5px/1.2', 'body') }}>{x.item}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ font: font('700 10px/1', 'body'), padding: '5px 8px', borderRadius: 99, background: st.tint, color: st.c }}>
                    {st.l}
                  </span>
                  {x.urgent && (
                    <span
                      style={{
                        font: font('700 9px/1', 'body'),
                        letterSpacing: '.4px',
                        textTransform: 'uppercase',
                        padding: '4px 6px',
                        borderRadius: 4,
                        background: C.redTint,
                        color: C.red,
                      }}
                    >
                      Urgent
                    </span>
                  )}
                  <span style={{ font: font('500 11px/1', 'body'), color: C.faint }}>{x.id}</span>
                </div>
              </div>
              <Quantity qty={x.qty} unit={x.unit} />
            </div>
            <div style={{ display: 'flex', gap: 3 }} aria-label={`Stage ${st.i + 1} of ${PIPELINE.length}`}>
              {PIPELINE.map((k, i) => (
                <span
                  key={k}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i < st.i || x.stage === 'delivered' ? C.green : i === st.i ? C.teal : C.line,
                  }}
                />
              ))}
            </div>
            {next && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="press-97"
                  onClick={() => a.moveRequest(x, next.to, next.what)}
                  style={{ ...actionButton, background: next.color, color: C.white }}
                >
                  {next.label}
                </button>
                {x.stage === 'endorsed' && (
                  <button
                    type="button"
                    onClick={() => a.moveRequest(x, 'flagged', 'returned to Logistics')}
                    style={{ ...actionButton, background: '#FDEEE3', color: '#B4440A' }}
                  >
                    Return
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {items.length === 0 && <EmptyState>Nothing here right now.</EmptyState>}
    </div>
  );
}
