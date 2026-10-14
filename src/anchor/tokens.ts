export const FONT = {
  cond: "'Barlow Semi Condensed',sans-serif",
  body: "'Barlow',sans-serif",
  mono: 'ui-monospace,Menlo,monospace',
} as const;

/** Builds a CSS `font` shorthand, e.g. `font('800 10.5px/1', 'cond')`. */
export const font = (spec: string, family: keyof typeof FONT) => `${spec} ${FONT[family]}`;

/** Field Signage palette shared by every screen. Module accents live in data.ts. */
export const C = {
  page: '#E4EAE9',
  ink: '#12222F',
  ink2: '#3E505C',
  muted: '#5C6D79',
  faint: '#8CA0AC',
  line: '#E1E8EA',
  divider: '#EEF2F3',
  mapLine: '#D5E0DF',
  surface: '#F3F6F5',
  white: '#fff',
  device: '#0E1A24',

  navy: '#0B2237',
  navy2: '#14324E',
  navyInk: '#9FB8C8',

  teal: '#14788F',
  tealTint: '#E7F2F5',

  amber: '#F2B705',
  amberTint: '#FFF6DC',
  amberLine: '#F1DC9C',
  amberInk: '#5E4A00',
  amberDeep: '#8A6A00',

  red: '#C81E36',
  redTint: '#FBE9EC',
  redDeep: '#8E1023',
  redLine: '#F2C2CA',

  green: '#0B8A4B',
  greenTint: '#E7F5EC',
  greenInk: '#07603A',
  greenLine: '#BFE3CC',
  greenMid: '#2C7A4F',

  orange: '#E8590C',

  slate: '#5B6B7A',
  slateTint: '#EDF1F3',

  steel: '#24476E',
  steelTint: '#E6EDF4',
  steelLine: '#C9D6E3',
} as const;
