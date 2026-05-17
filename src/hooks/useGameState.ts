import { useReducer, useEffect } from 'react';
import { GameState, Card } from '../data/types';
import { buildDeck } from '../data/cards';

const STORAGE_KEY = 'hunt-game-state';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createInitialState(): GameState {
  return {
    role: null,
    activeHint: null,
    timerEndTimestamp: null,
    usedHints: [],
    drawPile: shuffleArray(buildDeck()),
    discardPile: [],
    hand: [],
    scoreLedger: [],
    draftPool: [],
    draftSelections: [],
    draftDrawCount: 0,
  };
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as GameState;
    }
  } catch {
    // corrupted data, start fresh
  }
  return createInitialState();
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export type GameAction =
  | { type: 'SET_ROLE'; role: GameState['role'] }
  | { type: 'FORCE_RESET' }
  | { type: 'ACTIVATE_HINT'; hintId: string; timerEndTimestamp: number | null }
  | { type: 'DISMISS_TIMER' }
  | { type: 'START_DRAFT'; pickCount: number; drawCount: number }
  | { type: 'TOGGLE_DRAFT_SELECTION'; cardId: string }
  | { type: 'CONFIRM_DRAFT' }
  | { type: 'PLAY_CARD'; cardId: string }
  | { type: 'DISCARD_CARD'; cardId: string };

function ensureDrawPile(state: GameState, needed: number): GameState {
  if (state.drawPile.length >= needed) return state;
  const combined = [...state.drawPile, ...shuffleArray(state.discardPile)];
  return { ...state, drawPile: combined, discardPile: [] };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role };

    case 'FORCE_RESET':
      return createInitialState();

    case 'ACTIVATE_HINT':
      return {
        ...state,
        activeHint: action.hintId,
        timerEndTimestamp: action.timerEndTimestamp,
        usedHints: [
          { hintId: action.hintId, timestamp: new Date().toLocaleTimeString() },
          ...state.usedHints,
        ],
      };

    case 'DISMISS_TIMER':
      return { ...state, activeHint: null, timerEndTimestamp: null };

    case 'START_DRAFT': {
      const withPile = ensureDrawPile(state, action.pickCount);
      const drawn = withPile.drawPile.slice(0, action.pickCount);
      const remaining = withPile.drawPile.slice(action.pickCount);
      return {
        ...withPile,
        drawPile: remaining,
        draftPool: drawn,
        draftSelections: [],
        draftDrawCount: action.drawCount,
      };
    }

    case 'TOGGLE_DRAFT_SELECTION': {
      const idx = state.draftSelections.indexOf(action.cardId);
      if (idx > -1) {
        return {
          ...state,
          draftSelections: state.draftSelections.filter((id) => id !== action.cardId),
        };
      }
      if (state.draftSelections.length >= state.draftDrawCount) {
        return state;
      }
      return {
        ...state,
        draftSelections: [...state.draftSelections, action.cardId],
      };
    }

    case 'CONFIRM_DRAFT': {
      const selected: Card[] = [];
      const unselected: Card[] = [];
      for (const card of state.draftPool) {
        if (state.draftSelections.includes(card.id)) {
          selected.push(card);
        } else {
          unselected.push(card);
        }
      }

      const newHand = [...state.hand];
      const newScoreLedger = [...state.scoreLedger];
      for (const card of selected) {
        if (card.type === 'time_bonus') {
          newScoreLedger.push(card);
        } else {
          newHand.push(card);
        }
      }

      const newDrawPile = shuffleArray([...state.drawPile, ...unselected]);

      return {
        ...state,
        hand: newHand,
        scoreLedger: newScoreLedger,
        drawPile: newDrawPile,
        draftPool: [],
        draftSelections: [],
        draftDrawCount: 0,
      };
    }

    case 'PLAY_CARD': {
      const cardIndex = state.hand.findIndex((c) => c.id === action.cardId);
      if (cardIndex === -1) return state;
      const card = state.hand[cardIndex];
      return {
        ...state,
        hand: state.hand.filter((_, i) => i !== cardIndex),
        discardPile: [...state.discardPile, card],
      };
    }

    case 'DISCARD_CARD': {
      const cardIndex = state.hand.findIndex((c) => c.id === action.cardId);
      if (cardIndex === -1) return state;
      const card = state.hand[cardIndex];
      return {
        ...state,
        hand: state.hand.filter((_, i) => i !== cardIndex),
        discardPile: [...state.discardPile, card],
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return { state, dispatch };
}
