import { describe, expect, it } from 'vitest';
import { readSettings, DEFAULT_SETTINGS } from '../settings';
import { createInitialState } from './data';
import {
  QR_SIZE,
  availability,
  formatElapsed,
  grantedModules,
  greetingFor,
  initials,
  procurementId,
  qrCells,
  randomCode,
  stockColor,
} from './logic';

describe('initials', () => {
  it('takes the first two capitalised words', () => {
    expect(initials('Andrea Dela Cruz')).toBe('AD');
    expect(initials('Maria Santos')).toBe('MS');
    expect(initials('Juan dela Cruz')).toBe('JC');
  });
});

describe('grantedModules', () => {
  it('opens every module for the Incident Commander', () => {
    expect(grantedModules('ic', 'match')).toEqual(['elista', 'sipat', 'kamalig', 'gab', 'alaga', 'aid']);
  });

  it('limits a section chief to their position', () => {
    expect(grantedModules('fin', 'match')).toEqual(['alaga', 'aid']);
  });

  it('adds the covered position for an alternate', () => {
    expect(grantedModules('ops', 'alternate')).toEqual(['elista', 'sipat', 'gab', 'aid', 'kamalig', 'alaga']);
    // Logistics covers Finance, whose modules it already has.
    expect(grantedModules('log', 'alternate')).toEqual(['kamalig', 'alaga', 'sipat', 'aid']);
  });
});

describe('time formatting', () => {
  it('formats elapsed operation time', () => {
    expect(formatElapsed((5 * 3600 + 20 * 60) * 1000)).toBe('5:20:00');
    expect(formatElapsed(65_000)).toBe('0:01:05');
  });

  it('greets by time of day', () => {
    expect(greetingFor(8)).toBe('Magandang umaga');
    expect(greetingFor(12)).toBe('Magandang hapon');
    expect(greetingFor(18)).toBe('Magandang gabi');
  });
});

describe('qrCells', () => {
  const at = (cells: boolean[], x: number, y: number) => cells[y * QR_SIZE + x];

  it('draws the three finder patterns', () => {
    const cells = qrCells(0);
    expect(cells).toHaveLength(QR_SIZE * QR_SIZE);
    for (const [cx, cy] of [[3, 3], [17, 3], [3, 17]]) {
      expect(at(cells, cx, cy)).toBe(true); // centre
      expect(at(cells, cx - 2, cy)).toBe(false); // light ring
      expect(at(cells, cx - 3, cy - 3)).toBe(true); // outer corner
    }
  });

  it('varies with the saved ID', () => {
    expect(qrCells(0)).toEqual(qrCells(0));
    expect(qrCells(0)).not.toEqual(qrCells(1));
  });
});

describe('availability', () => {
  const { reqs, stock } = createInitialState();
  const req = (id: string) => reqs.find((r) => r.id === id)!;

  it('fills when there is enough stock', () => {
    expect(availability(req('RR-017'), stock)).toMatchObject({ have: 120, ok: true });
  });

  it('reports a shortfall', () => {
    expect(availability(req('RR-018'), stock)).toMatchObject({ have: 40, ok: false });
  });

  it('handles items the storehouse does not carry', () => {
    expect(availability(req('RR-016'), stock)).toMatchObject({ item: undefined, have: 0, ok: false });
  });
});

describe('misc', () => {
  it('colours stock by level', () => {
    expect(stockColor(0.1)).toBe('#C81E36');
    expect(stockColor(0.4)).toBe('#E8590C');
    expect(stockColor(0.8)).toBe('#6C4FD1');
  });

  it('numbers procurement requests', () => {
    expect(procurementId(9)).toBe('PR-009');
    expect(procurementId(12)).toBe('PR-012');
  });

  it('makes codes of the requested length', () => {
    expect(randomCode(5)).toMatch(/^[A-Z2-9]{5}$/);
  });
});

describe('readSettings', () => {
  it('reads valid query parameters', () => {
    expect(readSettings('?demoResult=mismatch&codePosition=ops&logoConcept=C&opMode=actual')).toEqual({
      demoResult: 'mismatch',
      codePosition: 'ops',
      logoConcept: 'C',
      opMode: 'actual',
    });
  });

  it('falls back to defaults for missing or unknown values', () => {
    expect(readSettings('?demoResult=bogus')).toEqual(DEFAULT_SETTINGS);
    expect(readSettings('')).toEqual(DEFAULT_SETTINGS);
  });
});
