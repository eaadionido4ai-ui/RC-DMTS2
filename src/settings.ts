import type { DemoSettings, LogoConcept, OpMode, PositionKey, SignInResult } from './anchor/types';

export const SETTING_OPTIONS = {
  demoResult: ['match', 'mismatch', 'duress', 'alternate'] as SignInResult[],
  codePosition: ['ic', 'ops', 'log', 'fin'] as PositionKey[],
  logoConcept: ['A', 'B', 'C', 'D'] as LogoConcept[],
  opMode: ['drill', 'actual'] as OpMode[],
};

export const DEFAULT_SETTINGS: DemoSettings = {
  demoResult: 'match',
  codePosition: 'ic',
  logoConcept: 'A',
  opMode: 'drill',
};

/**
 * Reads demo settings from the query string, e.g. `?demoResult=mismatch&codePosition=ops`.
 * Until sign-in checks a real credential, this is how to try the other sign-in outcomes.
 */
export function readSettings(search: string): DemoSettings {
  const params = new URLSearchParams(search);
  const pick = <K extends keyof DemoSettings>(key: K): DemoSettings[K] => {
    const value = params.get(key);
    return (SETTING_OPTIONS[key] as string[]).includes(value ?? '') ? (value as DemoSettings[K]) : DEFAULT_SETTINGS[key];
  };
  return {
    demoResult: pick('demoResult'),
    codePosition: pick('codePosition'),
    logoConcept: pick('logoConcept'),
    opMode: pick('opMode'),
  };
}
