import { useState, useSyncExternalStore } from 'react';
import { AnchorScreen } from './anchor/AnchorScreen';
import { AnchorContext } from './anchor/context';
import type { DemoSettings } from './anchor/types';
import { useAnchorController } from './anchor/useAnchorController';
import { readSettings } from './settings';
import { Showcase } from './showcase/Showcase';

/** Below this width the app fills the screen instead of sitting in a phone frame. */
const PHONE_QUERY = '(max-width: 480px)';

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
  );
}

export default function App() {
  const [settings, setSettings] = useState<DemoSettings>(() => readSettings(window.location.search));
  const changeSettings = (patch: Partial<DemoSettings>) => setSettings((prev) => ({ ...prev, ...patch }));
  // State lives here, above the layout switch, so resizing across the breakpoint keeps the session.
  const anchor = useAnchorController(settings, (opMode) => changeSettings({ opMode }));
  const onPhone = useMediaQuery(PHONE_QUERY);

  return (
    <AnchorContext.Provider value={anchor}>
      {onPhone ? (
        <AnchorScreen framed={false} />
      ) : (
        <Showcase settings={settings} onSettingsChange={changeSettings}>
          <AnchorScreen framed />
        </Showcase>
      )}
    </AnchorContext.Provider>
  );
}
