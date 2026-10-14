import type { ReactNode } from 'react';
import { LOGOS, POSITIONS } from '../anchor/data';
import { C, font } from '../anchor/tokens';
import type { DemoSettings } from '../anchor/types';
import { LogoMark } from '../anchor/ui/LogoMark';
import { SETTING_OPTIONS } from '../settings';

const RESULT_LABEL: Record<DemoSettings['demoResult'], string> = {
  match: 'Match',
  mismatch: 'Wrong code',
  duress: 'Duress',
  alternate: 'Alternate',
};
const POSITION_LABEL: Record<DemoSettings['codePosition'], string> = { ic: 'IC', ops: 'Ops', log: 'Logistics', fin: 'Finance' };
const MODE_LABEL: Record<DemoSettings['opMode'], string> = { drill: 'Drill', actual: 'Actual' };

interface Option<T extends string> {
  value: T;
  label: ReactNode;
  title?: string;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ font: font('600 11.5px/1.2', 'body'), color: C.ink2 }}>{label}</span>
      <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              title={o.title}
              onClick={() => onChange(o.value)}
              style={{
                minHeight: 30,
                padding: '0 11px',
                borderRadius: 99,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                font: font('700 11.5px', 'body'),
                border: `1.5px solid ${on ? C.teal : C.mapLine}`,
                background: on ? C.teal : C.white,
                color: on ? C.white : C.muted,
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Stand-ins for the prototype's Tweaks: what the code check decides, the logo, and the operation mode. */
export function TweaksPanel({ settings, onChange }: { settings: DemoSettings; onChange: (patch: Partial<DemoSettings>) => void }) {
  return (
    <section
      aria-labelledby="tweaks-title"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${C.mapLine}`,
        background: 'rgba(255,255,255,.55)',
      }}
    >
      <h2
        id="tweaks-title"
        style={{ margin: 0, font: font('800 10.5px/1', 'cond'), letterSpacing: '1.3px', textTransform: 'uppercase', color: C.teal }}
      >
        Tweaks
      </h2>
      <Segmented
        label="Sign-in result"
        value={settings.demoResult}
        options={SETTING_OPTIONS.demoResult.map((v) => ({ value: v, label: RESULT_LABEL[v] }))}
        onChange={(demoResult) => onChange({ demoResult })}
      />
      <Segmented
        label="Code decodes to"
        value={settings.codePosition}
        options={SETTING_OPTIONS.codePosition.map((v) => ({ value: v, label: POSITION_LABEL[v], title: POSITIONS[v].t }))}
        onChange={(codePosition) => onChange({ codePosition })}
      />
      <Segmented
        label="Logo"
        value={settings.logoConcept}
        options={SETTING_OPTIONS.logoConcept.map((v) => ({
          value: v,
          title: LOGOS[v].name,
          label: (
            <>
              <LogoMark concept={v} size={18} />
              {v}
            </>
          ),
        }))}
        onChange={(logoConcept) => onChange({ logoConcept })}
      />
      <Segmented
        label="Operation"
        value={settings.opMode}
        options={SETTING_OPTIONS.opMode.map((v) => ({ value: v, label: MODE_LABEL[v] }))}
        onChange={(opMode) => onChange({ opMode })}
      />
    </section>
  );
}
