import type { ReactNode } from 'react';
import { C, font } from '../anchor/tokens';
import type { DemoSettings } from '../anchor/types';
import { LogoMark } from '../anchor/ui/LogoMark';
import { TweaksPanel } from './TweaksPanel';

const sectionTitle = {
  margin: 0,
  font: font('800 10.5px/1', 'cond'),
  letterSpacing: '1.3px',
  textTransform: 'uppercase',
  color: C.teal,
} as const;

const notes = { display: 'flex', flexDirection: 'column', gap: 8, font: font('400 12.5px/1.5', 'body'), color: C.muted } as const;

interface ShowcaseProps {
  settings: DemoSettings;
  onSettingsChange: (patch: Partial<DemoSettings>) => void;
  children: ReactNode;
}

/** Desktop presentation: concept notes and Tweaks beside the app in a phone frame. */
export function Showcase({ settings, onSettingsChange, children }: ShowcaseProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 48,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <aside style={{ maxWidth: 310, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark concept={settings.logoConcept} size={34} />
          <div style={{ font: font('800 13px/1.2', 'cond'), letterSpacing: '1.4px', textTransform: 'uppercase' }}>
            ANCHOR · Concept 2 · Drawer
          </div>
        </div>
        <p style={{ margin: 0, font: font('400 14px/1.6', 'body'), color: C.ink2, textWrap: 'pretty' }}>
          Modules sit in a sliding drawer, and each module's own features sit on the bottom bar, as in ALAGA. The first screen
          is the DRRM AID saved on this phone, so SOS, ID, alerts, the evacuation map and hotlines all work before anyone signs
          in.
        </p>
        <section style={notes}>
          <h2 style={sectionTitle}>Sign-in rules</h2>
          <div>
            The IMT code and PIN must match the credential sealed inside the saved DRRM AID. The card never shows it. A valid
            code from someone else still fails.
          </div>
          <div>
            The code tells the app the person's IMT position, and the position decides which modules open. The IC can name an
            alternate for an absent position, either in the app or with a temporary code.
          </div>
          <div>A wrong code leaves only DRRM AID. The attempt and every action after it are logged and quietly flagged to the IC.</div>
          <div>A duress code signs in as normal and silently alerts command.</div>
        </section>
        <section style={notes}>
          <h2 style={sectionTitle}>Try</h2>
          <div>
            Any code works in this demo. Use Tweaks to set the sign-in result (match, wrong code, duress, alternate), the
            position the code decodes to, and the logo. After a wrong code, sign in again as IC and open Command, then Activity.
          </div>
        </section>
        <TweaksPanel settings={settings} onChange={onSettingsChange} />
      </aside>

      <div
        style={{
          width: 390,
          height: 844,
          flex: 'none',
          borderRadius: 54,
          background: C.device,
          padding: 11,
          boxShadow: '0 30px 70px rgba(11,34,55,.28),0 0 0 1px rgba(0,0,0,.4)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
