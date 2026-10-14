import { POSITIONS } from './data';
import { C } from './tokens';
import type { ModuleKey, PositionKey, SignInResult, StockItem, SupplyRequest } from './types';

export const pad = (n: number) => String(n).padStart(2, '0');

/** 24-hour "HH:MM". */
export const hm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** "H:MM:SS" since the operation started. */
export function formatElapsed(ms: number) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(sec / 3600)}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`;
}

export const greetingFor = (hour: number) =>
  hour < 12 ? 'Magandang umaga' : hour < 18 ? 'Magandang hapon' : 'Magandang gabi';

/** Up to two initials from the capitalised words of a name ("Andrea Dela Cruz" → "AD"). */
export const initials = (name: string) =>
  name
    .split(' ')
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/** The position an alternate covers in this demo: Logistics covers Finance, everyone else covers Logistics. */
export const alternateFor = (pos: PositionKey): PositionKey => (pos === 'log' ? 'fin' : 'log');

/** Modules a session may open: its own position's, plus the covered position's when signed in as an alternate. */
export function grantedModules(pos: PositionKey, session: SignInResult): ModuleKey[] {
  const mods = [...(POSITIONS[pos] ?? POSITIONS.ic).mods];
  if (session === 'alternate') {
    for (const m of POSITIONS[alternateFor(pos)].mods) if (!mods.includes(m)) mods.push(m);
  }
  return mods;
}

export const QR_SIZE = 21;

/**
 * A stand-in 21×21 QR: three finder patterns and a pattern seeded by the saved ID,
 * row by row (true = dark module).
 */
export function qrCells(seed: number): boolean[] {
  const cells: boolean[] = [];
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const finder = (cx: number, cy: number) => {
        const dx = x - cx;
        const dy = y - cy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) return null;
        return Math.max(Math.abs(dx), Math.abs(dy)) !== 2;
      };
      const dark = finder(3, 3) ?? finder(17, 3) ?? finder(3, 17) ?? (x * 7 + y * 13 + x * y + seed * 3) % 5 < 2;
      cells.push(dark);
    }
  }
  return cells;
}

/** Colours for a choice chip, filled with `color` when selected. */
export const chipColors = (on: boolean, color: string) => ({
  borderColor: on ? color : C.line,
  background: on ? color : C.white,
  color: on ? C.white : C.muted,
});

/** How much of a request the storehouse can fill from stock. */
export function availability(req: SupplyRequest, stock: StockItem[]) {
  const item = req.sk ? stock.find((x) => x.k === req.sk) : undefined;
  const have = item ? item.qty : 0;
  return { item, have, ok: have >= req.qty };
}

/** Bar colour for a stock level: red under a quarter, orange under half. */
export const stockColor = (ratio: number) => (ratio < 0.25 ? C.red : ratio < 0.5 ? C.orange : '#6C4FD1');

export const isLow = (x: StockItem) => x.qty / x.cap < 0.25;

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** A short random code for DRRM IDs and temporary sign-in codes. */
export function randomCode(length: number) {
  let out = '';
  for (let i = 0; i < length; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return out;
}

export const procurementId = (seq: number) => `PR-${String(seq).padStart(3, '0')}`;
