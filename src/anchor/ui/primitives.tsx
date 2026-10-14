import type { CSSProperties, ReactNode } from 'react';
import { chipColors } from '../logic';
import { C, font } from '../tokens';

export function SectionLabel({ children, as: Tag = 'div' }: { children: ReactNode; as?: 'div' | 'span' }) {
  return (
    <Tag
      style={{
        font: font('800 10.5px/1', 'cond'),
        letterSpacing: '1.3px',
        textTransform: 'uppercase',
        color: C.muted,
        padding: Tag === 'div' ? '0 2px' : undefined,
      }}
    >
      {children}
    </Tag>
  );
}

/** Explanatory line at the top of a list screen. */
export function Intro({ children }: { children: ReactNode }) {
  return <div style={{ font: font('400 12.5px/1.5', 'body'), color: C.muted, padding: '2px 2px 4px' }}>{children}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1.5px dashed ${C.line}`,
        borderRadius: 14,
        padding: 18,
        textAlign: 'center',
        font: font('500 13px/1.5', 'body'),
        color: C.muted,
      }}
    >
      {children}
    </div>
  );
}

const fieldLabelStyle: CSSProperties = {
  font: font('700 10.5px/1', 'cond'),
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: C.muted,
};

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return htmlFor ? (
    <label htmlFor={htmlFor} style={fieldLabelStyle}>
      {children}
    </label>
  ) : (
    <div style={fieldLabelStyle}>{children}</div>
  );
}

export function Pill({ children, bg, color }: { children: ReactNode; bg: string; color: string }) {
  return (
    <span style={{ font: font('700 10.5px/1', 'body'), padding: '5px 8px', borderRadius: 99, background: bg, color }}>
      {children}
    </span>
  );
}

interface ChoiceChipProps {
  on: boolean;
  color: string;
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

/** A pill that fills with the module colour when selected. */
export function ChoiceChip({ on, color, onClick, children, style }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      style={{
        height: 38,
        padding: '0 13px',
        borderRadius: 99,
        font: font('700 12.5px', 'body'),
        borderWidth: 1.5,
        borderStyle: 'solid',
        ...chipColors(on, color),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function ChipRow({ children, gap = 7 }: { children: ReactNode; gap?: number }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap }}>{children}</div>;
}

/** Small round avatar showing initials. */
export function Initials({ text, size, bg, color, fontSize }: { text: string; size: number; bg: string; color: string; fontSize: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        background: bg,
        color,
        display: 'grid',
        placeItems: 'center',
        font: font(`800 ${fontSize}px/1`, 'cond'),
      }}
    >
      {text}
    </div>
  );
}

/** Big number with a small unit caption, right-aligned. */
export function Quantity({ qty, unit }: { qty: number; unit: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ font: font('800 22px/1', 'cond') }}>{qty}</div>
      <div
        style={{
          font: font('600 9.5px/1', 'body'),
          color: C.muted,
          textTransform: 'uppercase',
          letterSpacing: '.5px',
          marginTop: 3,
        }}
      >
        {unit}
      </div>
    </div>
  );
}
