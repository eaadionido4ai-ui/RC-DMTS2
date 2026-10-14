import type { CSSProperties } from 'react';
import { C, font } from '../tokens';

/** White card with the standard hairline border. */
export const card = (radius: number, padding: number | string): CSSProperties => ({
  background: C.white,
  border: `1px solid ${C.line}`,
  borderRadius: radius,
  padding,
});

/** A list row inside a card, separated by a divider. */
export const rowDivider = (padding: string): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding,
  borderBottom: `1px solid ${C.divider}`,
});

export const col = (gap: number): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap });

export const timeText: CSSProperties = { font: font('600 10.5px/1', 'mono'), color: C.faint };
export const subText: CSSProperties = { font: font('500 11px/1.3', 'body'), color: C.faint };
