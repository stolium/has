export type CastingCostAction =
  | { kind: 'cards'; count: number }
  | { kind: 'all' }
  | { kind: 'time_bonus_minutes'; minMinutes: number };

export interface CastingCost {
  label: string;
  action?: CastingCostAction;
}

export interface Card {
  id: string;
  type: 'curse' | 'time_bonus' | 'veto' | 'randomize';
  name: string;
  castingCost?: CastingCost;
  effect: string;
  value?: number;
}

export interface Hint {
  id: string;
  category: 'radar' | 'thermometer' | 'photo' | 'location' | 'creative';
  text: string;
  pickCount: number;
  drawCount: number;
  timerSeconds: number | null;
  timerLabel: string;
}

export type Role = 'hider' | 'seeker' | null;

export const MAX_HAND_SIZE = 6;

export interface GameState {
  role: Role;

  // Seeker
  activeHint: string | null;
  timerEndTimestamp: number | null;
  usedHints: { hintId: string; timestamp: string }[];

  // Hider
  drawPile: Card[];
  discardPile: Card[];
  hand: Card[];
  scoreLedger: Card[];
  draftPool: Card[];
  draftSelections: string[];
  draftDrawCount: number;
  pendingHandDiscard: number;
}
