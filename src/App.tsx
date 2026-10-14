import { useState } from 'react';
import { AnchorScreen } from './anchor/AnchorScreen';
import { AnchorContext } from './anchor/context';
import type { DemoSettings } from './anchor/types';
import { useAnchorController } from './anchor/useAnchorController';
import { readSettings } from './settings';

export default function App() {
  const [settings, setSettings] = useState<DemoSettings>(() => readSettings(window.location.search));
  const anchor = useAnchorController(settings, (opMode) => setSettings((prev) => ({ ...prev, opMode })));

  return (
    <AnchorContext.Provider value={anchor}>
      <AnchorScreen />
    </AnchorContext.Provider>
  );
}
