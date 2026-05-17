export interface Card {
  id: string;
  type: 'curse' | 'time_bonus' | 'veto' | 'randomize';
  name: string;
  castingCost?: string;
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
}
