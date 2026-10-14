import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useAnchor } from './context';
import { SCREENS } from './screens';
import { BottomNav } from './shell/BottomNav';
import { Drawer } from './shell/Drawer';
import { GateAidHeader, ModuleHeader, OperationBanner } from './shell/Header';
import { SavedIdSheet, Toast } from './shell/Overlays';
import { StatusBar } from './shell/StatusBar';
import { C } from './tokens';

interface AnchorScreenProps {
  /** Inside the 390×844 device frame (draws its own status bar) rather than filling a real phone's screen. */
  framed: boolean;
}

type InsetVars = CSSProperties & Record<'--inset-top' | '--inset-bottom', string>;

/** The ANCHOR app itself: header, the current screen, its bottom bar, and the drawer, sheet and toast above them. */
export function AnchorScreen({ framed }: AnchorScreenProps) {
  const a = useAnchor();
  const scroller = useRef<HTMLDivElement>(null);
  const Screen = SCREENS[a.screenKey] ?? SCREENS.gate;

  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [a.screenKey]);

  const style: InsetVars = {
    position: 'relative',
    width: '100%',
    height: framed ? '100%' : '100dvh',
    borderRadius: framed ? 44 : 0,
    overflow: 'hidden',
    background: C.surface,
    display: 'flex',
    flexDirection: 'column',
    // Space the drawer, sheet and bottom bar keep clear of the status bar and home indicator.
    '--inset-top': framed ? '46px' : 'env(safe-area-inset-top, 0px)',
    '--inset-bottom': framed ? '24px' : 'max(env(safe-area-inset-bottom, 0px), 12px)',
  };

  return (
    <div style={style}>
      {framed ? <StatusBar /> : <div style={{ flex: 'none', height: 'max(env(safe-area-inset-top, 0px), 10px)' }} />}

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
          // On a real phone the sign-in screen has no bottom bar, so it keeps clear of the home indicator itself.
          padding: `12px 16px ${!framed && !a.curMod ? 'calc(24px + env(safe-area-inset-bottom, 0px))' : '24px'}`,
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
