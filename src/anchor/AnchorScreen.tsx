import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useAnchor } from './context';
import { SCREENS } from './screens';
import { BottomNav } from './shell/BottomNav';
import { Drawer } from './shell/Drawer';
import { GateAidHeader, ModuleHeader, OperationBanner } from './shell/Header';
import { SavedIdSheet, Toast } from './shell/Overlays';
import { C } from './tokens';

type InsetVars = CSSProperties & Record<'--inset-top' | '--inset-bottom', string>;

/** Widest the app gets; on larger screens it sits in a centred column. */
export const APP_MAX_WIDTH = 480;

/** The ANCHOR app: header, the current screen, its bottom bar, and the drawer, sheet and toast above them. */
export function AnchorScreen() {
  const a = useAnchor();
  const scroller = useRef<HTMLElement>(null);
  const Screen = SCREENS[a.screenKey] ?? SCREENS.gate;

  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [a.screenKey]);

  const style: InsetVars = {
    position: 'relative',
    width: '100%',
    maxWidth: APP_MAX_WIDTH,
    height: '100dvh',
    margin: '0 auto',
    overflow: 'hidden',
    background: C.surface,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 0 1px rgba(11,34,55,.06),0 10px 40px rgba(11,34,55,.08)',
    // Space the header, drawer, sheet and bottom bar keep clear of the phone's status bar and home indicator.
    '--inset-top': 'max(env(safe-area-inset-top, 0px), 10px)',
    '--inset-bottom': 'max(env(safe-area-inset-bottom, 0px), 12px)',
  };

  return (
    <div style={style}>
      <div style={{ flex: 'none', height: 'var(--inset-top)' }} />

      {a.isGate && a.s.gateAid && <GateAidHeader />}
      {a.isApp && (
        <>
          <ModuleHeader />
          <OperationBanner />
        </>
      )}

      <main
        ref={scroller}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          // The sign-in screen has no bottom bar, so it keeps clear of the home indicator itself.
          padding: `12px 16px ${a.curMod ? '24px' : 'calc(24px + env(safe-area-inset-bottom, 0px))'}`,
        }}
      >
        <Screen />
      </main>

      <BottomNav />
      {a.isApp && <Drawer />}
      <SavedIdSheet />
      <Toast />
    </div>
  );
}
