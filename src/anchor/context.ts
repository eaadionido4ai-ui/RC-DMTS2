import { createContext, useContext } from 'react';
import type { AnchorApi } from './useAnchorController';

export const AnchorContext = createContext<AnchorApi | null>(null);

export function useAnchor(): AnchorApi {
  const api = useContext(AnchorContext);
  if (!api) throw new Error('useAnchor must be used inside <AnchorContext.Provider>');
  return api;
}
