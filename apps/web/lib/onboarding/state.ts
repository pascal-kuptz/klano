import type { Country, AmbitionLevel } from '@klano/db';

export const STORAGE_KEY = 'klano-onboarding-v1';
export const TOTAL_STEPS = 7 as const;

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface BandDraft {
  name: string;
  logoDataUrl?: string; // base64 — uploaded to Supabase Storage on finalize
  genres: string[]; // up to 3
  bandSize?: 3 | 4 | 5 | 6 | 7 | 8;
  country?: Country;
  regions: string[]; // 1–5 cities
  ambition?: AmbitionLevel;
}

export interface InviteDraft {
  /** Name of the person to invite — email is collected later in the dashboard. */
  name: string;
  instrument?: string;
}

export interface UserDraft {
  fullName?: string;
  instrument?: string;
}

export interface WizardState {
  step: Step;
  band: BandDraft;
  user: UserDraft;
  invites: InviteDraft[];
  selectedVenueId?: string;
  /** Locale of the wizard — defaults to DE, set early in step 1 if needed */
  locale: 'de' | 'en';
}

export const initialState: WizardState = {
  step: 1,
  band: { name: '', genres: [], regions: [] },
  user: {},
  invites: [],
  locale: 'de',
};

export type WizardAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; step: Step }
  | { type: 'patch-band'; patch: Partial<BandDraft> }
  | { type: 'patch-user'; patch: Partial<UserDraft> }
  | { type: 'set-invites'; invites: InviteDraft[] }
  | { type: 'select-venue'; id: string }
  | { type: 'reset' }
  | { type: 'hydrate'; state: WizardState };

export function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'next':
      return state.step < TOTAL_STEPS ? { ...state, step: (state.step + 1) as Step } : state;
    case 'prev':
      return state.step > 1 ? { ...state, step: (state.step - 1) as Step } : state;
    case 'goto':
      return { ...state, step: action.step };
    case 'patch-band':
      return { ...state, band: { ...state.band, ...action.patch } };
    case 'patch-user':
      return { ...state, user: { ...state.user, ...action.patch } };
    case 'set-invites':
      return { ...state, invites: action.invites };
    case 'select-venue':
      return { ...state, selectedVenueId: action.id };
    case 'hydrate':
      return action.state;
    case 'reset':
      return initialState;
  }
}

/**
 * Step gating: which steps are reachable / valid given current state.
 * Used by Wizard nav to disable forward when current step isn't satisfied.
 */
export function canAdvance(state: WizardState): boolean {
  switch (state.step) {
    case 1:
      return true;
    case 2:
      return state.band.name.trim().length >= 2 && state.band.genres.length >= 1;
    case 3:
      return Boolean(state.band.country) && state.band.regions.length >= 1;
    case 4:
      return Boolean(state.band.ambition);
    case 5:
      return true; // skipping is allowed
    case 6:
      return Boolean(state.selectedVenueId);
    case 7:
      return true; // sign-up form handles its own validation
  }
}
