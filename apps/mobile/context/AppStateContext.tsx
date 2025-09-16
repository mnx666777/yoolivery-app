import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from '../utils/storage';

type AppState = {
  isAdultConfirmed: boolean;
  district?: string;
  confirmAdult: () => void;
  setDistrict: (d: string) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [district, setDistrictState] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const loaded = await loadJson('appState', { isAdultConfirmed: false, district: undefined as string | undefined });
      setIsAdultConfirmed(loaded.isAdultConfirmed);
      setDistrictState(loaded.district);
    })();
  }, []);

  const confirmAdult = () => setIsAdultConfirmed(true);
  const setDistrict = (d: string) => setDistrictState(d);

  useEffect(() => {
    saveJson('appState', { isAdultConfirmed, district });
  }, [isAdultConfirmed, district]);

  const value = useMemo(() => ({ isAdultConfirmed, district, confirmAdult, setDistrict }), [isAdultConfirmed, district]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}


