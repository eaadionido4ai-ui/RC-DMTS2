import { MANUAL } from '../data';
import { C, font } from '../tokens';
import { UPRI_LOGO, UP_LOGO } from '../ui/brand';
import { col } from '../ui/styles';

export function AboutManual() {
  return (
    <div style={col(14)}>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2px 14px' }}>
        {MANUAL.map((m) => (
          <div key={m.h} style={{ ...col(4), padding: '13px 0', borderBottom: `1px solid ${C.divider}` }}>
            <span style={{ font: font('700 14px/1.2', 'body') }}>{m.h}</span>
            <span style={{ font: font('400 12.5px/1.5', 'body'), color: C.muted }}>{m.b}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: '6px 0' }}>
        <img src={UP_LOGO} alt="University of the Philippines" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <img src={UPRI_LOGO} alt="UP Resilience Institute" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        <div style={col(2)}>
          <span style={{ font: font('700 11.5px/1.2', 'body'), color: C.ink2 }}>University of the Philippines</span>
          <span style={{ font: font('500 10.5px/1.2', 'body'), color: C.faint }}>Resilience Institute · ANCHOR concept v0.2</span>
        </div>
      </div>
    </div>
  );
}
