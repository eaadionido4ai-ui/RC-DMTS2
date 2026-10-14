interface IconProps {
  d: string;
  size?: number;
  strokeWidth?: number;
  stroke?: string;
}

/** A single-path 24×24 line icon. */
export function Icon({ d, size = 21, strokeWidth = 1.9, stroke = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
