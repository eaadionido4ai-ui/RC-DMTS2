import { LOGOS } from '../data';
import { C } from '../tokens';
import type { LogoConcept } from '../types';

interface LogoMarkProps {
  concept: LogoConcept;
  size: number;
  /** Glyph only, with no tile behind it (for use on navy). */
  flat?: boolean;
}

export function LogoMark({ concept, size, flat = false }: LogoMarkProps) {
  const { paths } = LOGOS[concept] ?? LOGOS.A;
  const glyph = size * (flat ? 0.95 : 0.72);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: flat ? 'transparent' : `linear-gradient(160deg,${C.navy2},${C.navy})`,
        boxShadow: flat ? 'none' : size > 40 ? '0 8px 20px rgba(11,34,55,.22)' : '0 0 0 1px rgba(255,255,255,.12)',
      }}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 48 48"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.f ?? 'none'} stroke={p.f ? 'none' : p.s} strokeWidth={3.2} />
        ))}
      </svg>
    </div>
  );
}
