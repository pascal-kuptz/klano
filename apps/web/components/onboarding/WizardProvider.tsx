'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  STORAGE_KEY,
  initialState,
  reducer,
  type WizardAction,
  type WizardState,
} from '@/lib/onboarding/state';

interface Ctx {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
}

const WizardCtx = createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<WizardState> & { band?: Record<string, unknown> };
      if (!parsed || typeof parsed.step !== 'number') return;
      // Schema-tolerant merge: missing fields are filled from initialState.
      const next: WizardState = {
        ...initialState,
        ...parsed,
        band: {
          ...initialState.band,
          ...(parsed.band ?? {}),
          countries: Array.isArray(parsed.band?.countries) ? (parsed.band.countries as WizardState['band']['countries']) : [],
          regions: Array.isArray(parsed.band?.regions) ? (parsed.band.regions as string[]) : [],
          genres: Array.isArray(parsed.band?.genres) ? (parsed.band.genres as string[]) : [],
        },
        invites: Array.isArray(parsed.invites) ? parsed.invites : [],
        user: parsed.user ?? {},
      } as WizardState;
      dispatch({ type: 'hydrate', state: next });
    } catch {
      // ignore — corrupted state, start fresh
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or disabled — silently ignore
    }
  }, [state]);

  return <WizardCtx.Provider value={{ state, dispatch }}>{children}</WizardCtx.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error('useWizard must be used inside <WizardProvider>');
  return ctx;
}
