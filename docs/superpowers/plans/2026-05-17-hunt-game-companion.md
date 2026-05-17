# Hunt Game Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React browser app for a Jetlag-style hide-and-seek game with two independent UX flows (seeker and hider), card drafting, timers, and localStorage persistence.

**Architecture:** Single-page React app with conditional rendering based on role selection (`null | 'hider' | 'seeker'`). No routing library. State managed via `useReducer` with localStorage sync on every change. Timer persists via end-timestamps for reload resilience. Tailwind CSS for styling.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Create React App, localStorage

---

### Task 1: Project Setup — Install Tailwind and Clean Template

**Files:**
- Modify: `package.json`
- Modify: `src/index.css`
- Delete: `src/App.css`, `src/App.test.tsx`, `src/logo.svg`, `src/reportWebVitals.ts`, `hunt.html`
- Modify: `src/index.tsx` (remove reportWebVitals import)
- Modify: `src/App.tsx` (strip to empty shell)

- [ ] **Step 1: Install Tailwind CSS and its CRA-compatible dependencies**

Run:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure tailwind.config.js**

Create `tailwind.config.js` with content paths:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 3: Replace src/index.css with Tailwind directives**

Replace the entire contents of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Delete template files**

```bash
rm src/App.css src/App.test.tsx src/logo.svg src/reportWebVitals.ts hunt.html
```

- [ ] **Step 5: Clean up src/index.tsx**

Replace `src/index.tsx` with:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Strip src/App.tsx to shell**

Replace `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        <h1 className="text-2xl font-bold text-center mt-8">Hunt</h1>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Verify Tailwind is working**

Run:
```bash
npm start
```

Open the browser and confirm you see "Hunt" styled with the dark background and white text. Kill the dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: clean CRA template, install and configure Tailwind CSS"
```

---

### Task 2: Types and Data Definitions

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/hints.ts`
- Create: `src/data/cards.ts`

- [ ] **Step 1: Create src/data/types.ts**

```typescript
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
```

Note: `draftSelections` is `string[]` instead of `Set<string>` for JSON serialization compatibility with localStorage. The component logic will use `.includes()` for lookups.

Note: `timerEndTimestamp` stores the absolute epoch time (ms) when the timer expires, not seconds remaining. This makes page reloads resume correctly.

- [ ] **Step 2: Create src/data/hints.ts**

```typescript
import { Hint } from './types';

export const HINTS: Hint[] = [
  {
    id: 'radar-5km',
    category: 'radar',
    text: 'Radar 5km — is the hider inside a 5km zone from your current location?',
    pickCount: 3,
    drawCount: 2,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'radar-1500m',
    category: 'radar',
    text: 'Radar 1500m — is the hider inside a 1500m zone from your current location?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'radar-500m',
    category: 'radar',
    text: 'Radar 500m — is the hider inside a 500m zone from your current location?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'thermo-1km',
    category: 'thermometer',
    text: 'Thermometer 1km — walk 1km to point B, is point B closer to the hider than point A?',
    pickCount: 3,
    drawCount: 2,
    timerSeconds: null,
    timerLabel: 'When location reached',
  },
  {
    id: 'thermo-300m',
    category: 'thermometer',
    text: 'Thermometer 300m — walk 300m to point B, is point B closer to the hider than point A?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: null,
    timerLabel: 'When location reached',
  },
  {
    id: 'thermo-3min',
    category: 'thermometer',
    text: 'Thermometer 3 min — walk for 3 minutes to point B, is point B closer to the hider than point A?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 180,
    timerLabel: '3 min',
  },
  {
    id: 'photo-highest-building',
    category: 'photo',
    text: 'Send a photo of the highest building visible from your hiding location.',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'photo-selfie',
    category: 'photo',
    text: 'Send a selfie with something in the background (not sky).',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'photo-red-white-shop',
    category: 'photo',
    text: 'Send a photo of the closest "red and white" shop — door and entry must be visible.',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 600,
    timerLabel: '10 min',
  },
  {
    id: 'loc-cinema-radar',
    category: 'location',
    text: 'Cinema radar — every cinema creates its own 800m radius radar. Is the hider inside any cinema radar?',
    pickCount: 3,
    drawCount: 2,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'loc-same-district',
    category: 'location',
    text: 'Is the hider in the same district as the seekers?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'loc-electric-transport',
    category: 'location',
    text: 'Your closest building\'s address street — does it have electric transport on it?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'loc-lenta',
    category: 'location',
    text: 'Is your closest Lenta shop the same as mine?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 180,
    timerLabel: '3 min',
  },
  {
    id: 'loc-runway',
    category: 'location',
    text: 'Is your closest runway the same as mine?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
  {
    id: 'loc-street-letter',
    category: 'location',
    text: 'Does your street name start with the same letter as mine?',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 180,
    timerLabel: '3 min',
  },
  {
    id: 'creative-non-square',
    category: 'creative',
    text: 'Draw the closest non-square building.',
    pickCount: 2,
    drawCount: 1,
    timerSeconds: 300,
    timerLabel: '5 min',
  },
];
```

- [ ] **Step 3: Create src/data/cards.ts**

```typescript
import { Card } from './types';

function makeCurse(id: string, name: string, castingCost: string, effect: string): Card {
  return { id, type: 'curse', name, castingCost, effect };
}

function makeTimeBonus(id: string, value: number): Card {
  return { id, type: 'time_bonus', name: `+${value} Minutes`, effect: `Adds ${value} minutes to your final score.`, value };
}

const CURSES: Card[] = [
  makeCurse('curse-move', 'Curse of the Move Card', 'Discard 2 cards', 'Gives the hider 45–60 minutes to pack up and completely change locations.'),
  makeCurse('curse-hide-seek-ception', 'Curse of the Hide-and-Seek-Ception', 'Seekers must be off-transit and at least 500 feet from a station', 'One seeker hides 500 feet away; the other seeker must find them before proceeding.'),
  makeCurse('curse-drained-brain', 'Curse of the Drained Brain', 'Discard your entire hand', 'Hider chooses 3 questions; seekers are banned from asking them for the rest of the run.'),
  makeCurse('curse-gilded-inquiry', 'Curse of the Gilded Inquiry', "The seekers' next question is free", 'Hider secretly picks a question. If seekers ask it, it\'s auto-vetoed and hider draws 3 cards.'),
  makeCurse('curse-prosperous-home', 'Curse of the Prosperous Home', 'Discard 20+ minutes of time bonuses', "Permanently expands the hider's zone radius by 50%. (Removed in endgame)."),
  makeCurse('curse-gamblers-feet', "Curse of the Gambler's Feet", 'Roll a die (even number = curse fails)', 'For 1 hour, seekers must roll a die before taking steps, moving only that many paces.'),
  makeCurse('curse-bird-guide', 'Curse of the Bird Guide', 'Film a bird', 'Seekers must film a single wild bird for up to 15 minutes continuous uncut frame.'),
  makeCurse('curse-zoologist', 'Curse of the Zoologist', 'Take a photo of a wild animal', 'Seekers must find and photograph an animal in that same biological category.'),
  makeCurse('curse-frozen-dot', 'Curse of the Frozen Dot', 'Seekers must be at least 10 miles away', 'Drops a pin 1,000 feet from seekers. If they walk within 250 feet of it in 15 mins, they freeze for 30 mins.'),
  makeCurse('curse-hidden-hangman', 'Curse of the Hidden Hangman', 'Discard 2 cards', 'Seekers must beat the hider in a 5-letter game of Hangman before moving or asking questions.'),
  makeCurse('curse-overflowing-chalice', 'Curse of the Overflowing Chalice', 'Discard 1 card', 'For the next 3 questions, the hider draws an extra card from the deck.'),
  makeCurse('curse-impressionable-consumer', 'Curse of the Impressionable Consumer', "Seekers' next question is free", 'Seekers must physically buy a product or enter a location they spot on a real-world advertisement.'),
  makeCurse('curse-town-hall', 'Town Hall Census Curse', "Seekers' next question is free", "Seekers must go to a local town hall and guess its jurisdiction's population within 25%."),
  makeCurse('curse-long-distance-die', 'Long-Distance Die Roll', 'None', 'Seekers must roll a physical die 100 feet away using only gravity/momentum to land a 5 or 6.'),
];

const POWERUPS_TEMPLATE: Card[] = [
  makeTimeBonus('tb-5', 5),
  makeTimeBonus('tb-10', 10),
  makeTimeBonus('tb-15', 15),
  { id: 'veto', type: 'veto', name: 'Veto Question', effect: 'Refuse to answer a question. You still receive card rewards.' },
  { id: 'randomize', type: 'randomize', name: 'Randomize Question', effect: 'Seekers must re-roll and pick a different hint.' },
];

export function buildDeck(): Card[] {
  const deck: Card[] = [...CURSES];
  for (let copy = 0; copy < 3; copy++) {
    for (const template of POWERUPS_TEMPLATE) {
      deck.push({ ...template, id: `${template.id}-${copy}` });
    }
  }
  return deck;
}
```

- [ ] **Step 4: Verify types compile**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/hints.ts src/data/cards.ts
git commit -m "feat: add game types, hint catalog, and card deck data"
```

---

### Task 3: State Management — useGameState Hook with localStorage Persistence

**Files:**
- Create: `src/hooks/useGameState.ts`

- [ ] **Step 1: Create src/hooks/useGameState.ts**

This hook manages all game state via `useReducer`, syncs to localStorage on every change, and restores on mount.

```typescript
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
        return {[index.html](../../../build/index.html)
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
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useGameState.ts
git commit -m "feat: add useGameState hook with reducer and localStorage persistence"
```

---

### Task 4: useTimer Hook

**Files:**
- Create: `src/hooks/useTimer.ts`

- [ ] **Step 1: Create src/hooks/useTimer.ts**

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseTimerResult {
  secondsLeft: number | null;
  isExpired: boolean;
}

export function useTimer(endTimestamp: number | null): UseTimerResult {
  const calcRemaining = useCallback(() => {
    if (endTimestamp === null) return null;
    return Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
  }, [endTimestamp]);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(calcRemaining);

  useEffect(() => {
    setSecondsLeft(calcRemaining());

    if (endTimestamp === null) return;

    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp, calcRemaining]);

  return {
    secondsLeft,
    isExpired: secondsLeft === 0,
  };
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTimer.ts
git commit -m "feat: add useTimer hook with timestamp-based countdown"
```

---

### Task 5: GateScreen Component

**Files:**
- Create: `src/components/GateScreen.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create src/components/GateScreen.tsx**

```tsx
import { GameAction } from '../hooks/useGameState';

interface GateScreenProps {
  dispatch: React.Dispatch<GameAction>;
}

export function GateScreen({ dispatch }: GateScreenProps) {
  const handleForceReset = () => {
    if (window.confirm('This will end the current game. Are you sure?')) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="my-auto text-center py-8">
      <div className="text-5xl mb-2">🔍</div>
      <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent uppercase">
        Hunt
      </h1>
      <p className="text-sm text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
        A companion app for hide-and-seek. Choose your role to begin.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'hider' })}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-indigo-900/30"
        >
          I'm the Hider
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'seeker' })}
          className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-amber-900/30"
        >
          I'm a Seeker
        </button>
      </div>
      <button
        onClick={handleForceReset}
        className="mt-6 text-xs text-slate-500 hover:text-rose-400 transition"
      >
        Force Reset
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Wire up App.tsx with GateScreen**

Replace `src/App.tsx` with:

```tsx
import { useGameState } from './hooks/useGameState';
import { GateScreen } from './components/GateScreen';

export default function App() {
  const { state, dispatch } = useGameState();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        {state.role === null && <GateScreen dispatch={dispatch} />}
        {state.role === 'seeker' && (
          <div className="text-center mt-8">Seeker Dashboard (coming soon)</div>
        )}
        {state.role === 'hider' && (
          <div className="text-center mt-8">Hider Dashboard (coming soon)</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Run:
```bash
npm start
```

Confirm: gate screen renders with two role buttons and Force Reset. Clicking "I'm the Hider" switches to placeholder. Reload page — role persists from localStorage. Click Force Reset — returns to gate.

- [ ] **Step 4: Commit**

```bash
git add src/components/GateScreen.tsx src/App.tsx
git commit -m "feat: add GateScreen component with role selection and force reset"
```

---

### Task 6: Seeker Dashboard — HintCard and Hint Catalog

**Files:**
- Create: `src/components/seeker/HintCard.tsx`
- Create: `src/components/seeker/SeekerDashboard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create src/components/seeker/HintCard.tsx**

```tsx
import { Hint } from '../../data/types';

interface HintCardProps {
  hint: Hint;
  disabled: boolean;
  onAsk: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  radar: 'bg-blue-900 text-blue-300',
  thermometer: 'bg-orange-900 text-orange-300',
  photo: 'bg-pink-900 text-pink-300',
  location: 'bg-emerald-900 text-emerald-300',
  creative: 'bg-purple-900 text-purple-300',
};

export function HintCard({ hint, disabled, onAsk }: HintCardProps) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 shadow-md">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[hint.category] ?? 'bg-slate-700 text-slate-300'}`}
        >
          {hint.category}
        </span>
        <span className="text-[10px] text-slate-500 whitespace-nowrap">
          {hint.timerLabel}
        </span>
      </div>
      <p className="text-slate-100 font-medium text-sm mt-1">{hint.text}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          Pick {hint.pickCount}, Draw {hint.drawCount}
        </span>
        <button
          onClick={onAsk}
          disabled={disabled}
          className={`text-xs font-extrabold py-2 px-4 rounded-lg uppercase tracking-wider transition ${
            disabled
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-slate-900'
          }`}
        >
          Ask This Hint
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/seeker/SeekerDashboard.tsx**

```tsx
import { GameState } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { HINTS } from '../../data/hints';
import { HintCard } from './HintCard';

interface SeekerDashboardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const CATEGORY_LABELS: Record<string, string> = {
  radar: 'Radar',
  thermometer: 'Thermometer',
  photo: 'Photo',
  location: 'Location Matching',
  creative: 'Creative',
};

const CATEGORY_ORDER = ['radar', 'thermometer', 'photo', 'location', 'creative'];

export function SeekerDashboard({ state, dispatch }: SeekerDashboardProps) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] ?? cat,
    hints: HINTS.filter((h) => h.category === cat),
  }));

  const hasActiveHint = state.activeHint !== null;

  const handleAskHint = (hintId: string, timerSeconds: number | null) => {
    const timerEndTimestamp = timerSeconds !== null ? Date.now() + timerSeconds * 1000 : null;
    dispatch({ type: 'ACTIVATE_HINT', hintId, timerEndTimestamp });
  };

  const handleForceReset = () => {
    if (window.confirm('This will end the current game. Are you sure?')) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tight">
          Seeker Menu
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_ROLE', role: null })}
            className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded hover:bg-slate-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleForceReset}
            className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded hover:bg-rose-950/60 transition"
          >
            Force Reset
          </button>
        </div>
      </div>

      {hasActiveHint && (
        <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-900/50 p-2 rounded-lg">
          A hint is currently active. Dismiss the timer to ask another.
        </p>
      )}

      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.hints.map((hint) => (
              <HintCard
                key={hint.id}
                hint={hint}
                disabled={hasActiveHint}
                onAsk={() => handleAskHint(hint.id, hint.timerSeconds)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire SeekerDashboard into App.tsx**

In `src/App.tsx`, replace the seeker placeholder:

```tsx
import { useGameState } from './hooks/useGameState';
import { GateScreen } from './components/GateScreen';
import { SeekerDashboard } from './components/seeker/SeekerDashboard';

export default function App() {
  const { state, dispatch } = useGameState();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        {state.role === null && <GateScreen dispatch={dispatch} />}
        {state.role === 'seeker' && (
          <SeekerDashboard state={state} dispatch={dispatch} />
        )}
        {state.role === 'hider' && (
          <div className="text-center mt-8">Hider Dashboard (coming soon)</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run `npm start`. Click "I'm a Seeker". Confirm:
- All 16 hints render, grouped by category
- Category badges have distinct colors
- "Ask This Hint" buttons are clickable (hint activates, all other buttons disable)
- "Back" returns to gate; "Force Reset" resets everything

- [ ] **Step 5: Commit**

```bash
git add src/components/seeker/HintCard.tsx src/components/seeker/SeekerDashboard.tsx src/App.tsx
git commit -m "feat: add SeekerDashboard with hint catalog grouped by category"
```

---

### Task 7: TimerOverlay Component

**Files:**
- Create: `src/components/seeker/TimerOverlay.tsx`
- Modify: `src/components/seeker/SeekerDashboard.tsx`

- [ ] **Step 1: Create src/components/seeker/TimerOverlay.tsx**

```tsx
import { useTimer } from '../../hooks/useTimer';
import { Hint } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';

interface TimerOverlayProps {
  hint: Hint;
  timerEndTimestamp: number | null;
  dispatch: React.Dispatch<GameAction>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TimerOverlay({ hint, timerEndTimestamp, dispatch }: TimerOverlayProps) {
  const { secondsLeft, isExpired } = useTimer(timerEndTimestamp);

  const isLocationBased = timerEndTimestamp === null;

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_TIMER' });
  };

  const handleLocationReached = () => {
    dispatch({ type: 'DISMISS_TIMER' });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-900/60 uppercase">
          Hint Active
        </span>

        <p className="text-slate-300 text-sm mt-6 mb-8 leading-relaxed">{hint.text}</p>

        {isLocationBased ? (
          <>
            <div className="text-6xl font-black text-amber-400 mb-2">📍</div>
            <p className="text-slate-400 text-sm mb-8">
              Walk to point B, then tap below when you arrive.
            </p>
            <button
              onClick={handleLocationReached}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-900 font-black py-4 rounded-xl text-lg uppercase tracking-wide transition shadow-lg shadow-amber-900/30"
            >
              Location Reached
            </button>
          </>
        ) : isExpired ? (
          <>
            <div className="text-6xl font-black text-emerald-400 mb-2">0:00</div>
            <p className="text-emerald-300 text-lg font-bold mb-8">
              Time's up! Ask the hider for their answer.
            </p>
            <button
              onClick={handleDismiss}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black py-4 rounded-xl text-lg uppercase tracking-wide transition shadow-lg shadow-emerald-950/30"
            >
              Dismiss
            </button>
          </>
        ) : (
          <>
            <div className="text-7xl font-black text-amber-400 tabular-nums mb-2">
              {secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}
            </div>
            <p className="text-slate-500 text-xs mb-8">Waiting for the hider to respond...</p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
                style={{
                  width:
                    secondsLeft !== null && hint.timerSeconds
                      ? `${(secondsLeft / hint.timerSeconds) * 100}%`
                      : '100%',
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire TimerOverlay into SeekerDashboard**

Add the timer overlay at the bottom of the `SeekerDashboard` return, before the closing `</div>`:

Add this import at the top of `src/components/seeker/SeekerDashboard.tsx`:

```tsx
import { TimerOverlay } from './TimerOverlay';
```

Add this block right before the final closing `</div>` of the component's return:

```tsx
      {state.activeHint && (() => {
        const activeHintData = HINTS.find((h) => h.id === state.activeHint);
        if (!activeHintData) return null;
        return (
          <TimerOverlay
            hint={activeHintData}
            timerEndTimestamp={state.timerEndTimestamp}
            dispatch={dispatch}
          />
        );
      })()}
```

- [ ] **Step 3: Verify in browser**

Run `npm start`. As seeker:
- Click "Ask This Hint" on a 5-min hint → fullscreen overlay with countdown from 5:00, progress bar
- Wait for expiry (or use browser devtools to fast-forward) → "Time's up!" message with Dismiss button
- Click a thermometer hint without a timer → "Location Reached" button instead of countdown
- Reload during active timer → timer resumes from correct remaining time (timestamp-based)

- [ ] **Step 4: Commit**

```bash
git add src/components/seeker/TimerOverlay.tsx src/components/seeker/SeekerDashboard.tsx
git commit -m "feat: add TimerOverlay with countdown and location-reached modes"
```

---

### Task 8: UsedHintsLog Component

**Files:**
- Create: `src/components/seeker/UsedHintsLog.tsx`
- Modify: `src/components/seeker/SeekerDashboard.tsx`

- [ ] **Step 1: Create src/components/seeker/UsedHintsLog.tsx**

```tsx
import { useState } from 'react';
import { HINTS } from '../../data/hints';

interface UsedHintsLogProps {
  usedHints: { hintId: string; timestamp: string }[];
}

export function UsedHintsLog({ usedHints }: UsedHintsLogProps) {
  const [expanded, setExpanded] = useState(false);

  if (usedHints.length === 0) return null;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Hint History ({usedHints.length})
        </h3>
        <span className="text-slate-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <ul className="mt-3 space-y-2 text-xs divide-y divide-slate-800/50">
          {usedHints.map((entry, i) => {
            const hint = HINTS.find((h) => h.id === entry.hintId);
            return (
              <li key={i} className="pt-2 first:pt-0 text-slate-300 flex justify-between gap-2">
                <span className="truncate">{hint?.text ?? entry.hintId}</span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {entry.timestamp}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add UsedHintsLog to SeekerDashboard**

Add this import at the top of `src/components/seeker/SeekerDashboard.tsx`:

```tsx
import { UsedHintsLog } from './UsedHintsLog';
```

Add this right after the `grouped.map(...)` block and before the `TimerOverlay` block:

```tsx
      <UsedHintsLog usedHints={state.usedHints} />
```

- [ ] **Step 3: Verify in browser**

Run `npm start`. As seeker:
- Ask a hint, dismiss the timer → "Hint History (1)" appears at bottom
- Click it to expand → shows hint text + timestamp
- Ask another → count increments, newest on top

- [ ] **Step 4: Commit**

```bash
git add src/components/seeker/UsedHintsLog.tsx src/components/seeker/SeekerDashboard.tsx
git commit -m "feat: add collapsible UsedHintsLog to seeker dashboard"
```

---

### Task 9: Hider Dashboard — ScoreLedger and DraftTrigger

**Files:**
- Create: `src/components/hider/ScoreLedger.tsx`
- Create: `src/components/hider/DraftTrigger.tsx`
- Create: `src/components/hider/HiderDashboard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create src/components/hider/ScoreLedger.tsx**

```tsx
import { Card } from '../../data/types';

interface ScoreLedgerProps {
  scoreLedger: Card[];
}

export function ScoreLedger({ scoreLedger }: ScoreLedgerProps) {
  const totalScore = scoreLedger.reduce((sum, c) => sum + (c.value ?? 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto bg-slate-950 border-t border-slate-800 p-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Time Bonus Score
            </div>
            <div className="text-2xl font-black text-emerald-400">
              +{totalScore}{' '}
              <span className="text-xs text-slate-300 font-normal">mins</span>
            </div>
          </div>
        </div>
        {scoreLedger.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-2 pb-1 no-scrollbar">
            {scoreLedger.map((card, i) => (
              <div
                key={`${card.id}-${i}`}
                className="bg-emerald-950/30 border border-emerald-900/60 rounded-lg p-1.5 text-center min-w-[60px] shrink-0"
              >
                <span className="text-emerald-400 text-sm font-black block">
                  {card.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/hider/DraftTrigger.tsx**

```tsx
import { GameAction } from '../../hooks/useGameState';

interface DraftTriggerProps {
  canDraft: boolean;
  dispatch: React.Dispatch<GameAction>;
}

export function DraftTrigger({ canDraft, dispatch }: DraftTriggerProps) {
  const handleDraft = (pickCount: number, drawCount: number) => {
    dispatch({ type: 'START_DRAFT', pickCount, drawCount });
  };

  if (!canDraft) {
    return (
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 italic">
        No cards available to draft.
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        Start Draft
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        When seekers ask a hint, start a draft matching the hint's reward tier.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleDraft(3, 2)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition"
        >
          Pick 3, Draw 2
        </button>
        <button
          onClick={() => handleDraft(2, 1)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition"
        >
          Pick 2, Draw 1
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/hider/HiderDashboard.tsx**

```tsx
import { GameState } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { ScoreLedger } from './ScoreLedger';
import { DraftTrigger } from './DraftTrigger';

interface HiderDashboardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function HiderDashboard({ state, dispatch }: HiderDashboardProps) {
  const canDraft = state.drawPile.length + state.discardPile.length > 0;

  const handleForceReset = () => {
    if (window.confirm('This will end the current game. Are you sure?')) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-indigo-400 uppercase tracking-tight">
          Hider Deck
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_ROLE', role: null })}
            className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded hover:bg-slate-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleForceReset}
            className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded hover:bg-rose-950/60 transition"
          >
            Force Reset
          </button>
        </div>
      </div>

      {/* Deck Stats */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-slate-800/40 border border-slate-800 p-2 rounded-lg">
          <span className="text-slate-400 block font-medium">Draw Pile</span>
          <strong className="text-base text-indigo-300 font-bold">
            {state.drawPile.length} left
          </strong>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-2 rounded-lg">
          <span className="text-slate-400 block font-medium">Discard Pile</span>
          <strong className="text-base text-slate-500 font-bold">
            {state.discardPile.length} cards
          </strong>
        </div>
      </div>

      <DraftTrigger canDraft={canDraft} dispatch={dispatch} />

      {/* Hand Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Active Hand ({state.hand.length})
        </h3>
        {state.hand.length === 0 ? (
          <div className="border border-dashed border-slate-800 text-slate-500 rounded-xl p-8 text-center text-xs italic">
            No curses or powerups in hand. Start a draft to get cards.
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">Cards will render here (next task)</div>
        )}
      </div>

      <ScoreLedger scoreLedger={state.scoreLedger} />
    </div>
  );
}
```

- [ ] **Step 4: Wire HiderDashboard into App.tsx**

Replace `src/App.tsx`:

```tsx
import { useGameState } from './hooks/useGameState';
import { GateScreen } from './components/GateScreen';
import { SeekerDashboard } from './components/seeker/SeekerDashboard';
import { HiderDashboard } from './components/hider/HiderDashboard';

export default function App() {
  const { state, dispatch } = useGameState();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        {state.role === null && <GateScreen dispatch={dispatch} />}
        {state.role === 'seeker' && (
          <SeekerDashboard state={state} dispatch={dispatch} />
        )}
        {state.role === 'hider' && (
          <HiderDashboard state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify in browser**

Run `npm start`. Click "I'm the Hider". Confirm:
- Header with "Hider Deck", Back, Force Reset
- Deck stats: "29 left" draw pile, "0 cards" discard
- Draft trigger with two tier buttons
- Empty hand placeholder
- Score ledger fixed at bottom showing "+0 mins"
- Click "Pick 2, Draw 1" → state updates (draftPool populated, but overlay not yet built)

- [ ] **Step 6: Commit**

```bash
git add src/components/hider/ScoreLedger.tsx src/components/hider/DraftTrigger.tsx src/components/hider/HiderDashboard.tsx src/App.tsx
git commit -m "feat: add HiderDashboard with ScoreLedger, DraftTrigger, and deck stats"
```

---

### Task 10: DraftOverlay Component

**Files:**
- Create: `src/components/hider/DraftOverlay.tsx`
- Modify: `src/components/hider/HiderDashboard.tsx`

- [ ] **Step 1: Create src/components/hider/DraftOverlay.tsx**

```tsx
import { Card } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';

interface DraftOverlayProps {
  draftPool: Card[];
  draftSelections: string[];
  draftDrawCount: number;
  dispatch: React.Dispatch<GameAction>;
}

const TYPE_COLORS: Record<string, string> = {
  curse: 'bg-red-950 text-red-300 border-red-900',
  time_bonus: 'bg-emerald-950 text-emerald-300 border-emerald-900',
  veto: 'bg-violet-950 text-violet-300 border-violet-900',
  randomize: 'bg-cyan-950 text-cyan-300 border-cyan-900',
};

export function DraftOverlay({ draftPool, draftSelections, draftDrawCount, dispatch }: DraftOverlayProps) {
  const canConfirm = draftSelections.length === draftDrawCount;

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col p-4 overflow-y-auto">
      <div className="text-center mb-6 mt-4">
        <span className="text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-900/60 uppercase">
          Draft Phase
        </span>
        <h2 className="text-2xl font-black text-slate-100 mt-3 uppercase">
          Select {draftDrawCount} Card{draftDrawCount > 1 ? 's' : ''}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Time bonuses go to your score. Curses and powerups go to your hand. Unchosen cards return to the deck.
        </p>
      </div>

      <div className="space-y-2 mb-6 flex-1">
        {draftPool.map((card) => {
          const isSelected = draftSelections.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => dispatch({ type: 'TOGGLE_DRAFT_SELECTION', cardId: card.id })}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${TYPE_COLORS[card.type] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}
                >
                  {card.type.replace('_', ' ')}
                </span>
                <h4 className="font-extrabold text-base text-slate-100 mt-1">{card.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{card.effect}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-indigo-500 border-indigo-400 text-white'
                    : 'border-slate-700 bg-slate-950'
                }`}
              >
                {isSelected ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-900 sticky bottom-0 bg-slate-950/90 backdrop-blur-md">
        <button
          disabled={!canConfirm}
          onClick={() => dispatch({ type: 'CONFIRM_DRAFT' })}
          className={`w-full py-4 rounded-xl font-bold text-center uppercase tracking-wide text-sm transition ${
            canConfirm
              ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-950/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Confirm Selection ({draftSelections.length}/{draftDrawCount})
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add DraftOverlay to HiderDashboard**

Add this import at the top of `src/components/hider/HiderDashboard.tsx`:

```tsx
import { DraftOverlay } from './DraftOverlay';
```

Add this block right before `<ScoreLedger ... />` at the end of the component's return:

```tsx
      {state.draftPool.length > 0 && (
        <DraftOverlay
          draftPool={state.draftPool}
          draftSelections={state.draftSelections}
          draftDrawCount={state.draftDrawCount}
          dispatch={dispatch}
        />
      )}
```

- [ ] **Step 3: Verify in browser**

Run `npm start`. As hider:
- Click "Pick 3, Draw 2" → fullscreen overlay with 3 cards
- Tap cards to select/deselect — max 2 selectable
- Confirm button disabled until exactly 2 selected
- Click confirm → overlay closes, time bonuses appear in score ledger, curses/powerups in hand area, draw pile count decreases
- Unselected card goes back to draw pile (verify draw pile count = 29 - 2 kept, since 1 returned)

- [ ] **Step 4: Commit**

```bash
git add src/components/hider/DraftOverlay.tsx src/components/hider/HiderDashboard.tsx
git commit -m "feat: add DraftOverlay with card selection and confirm flow"
```

---

### Task 11: CardInHand Component

**Files:**
- Create: `src/components/hider/CardInHand.tsx`
- Modify: `src/components/hider/HiderDashboard.tsx`

- [ ] **Step 1: Create src/components/hider/CardInHand.tsx**

```tsx
import { Card } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';

interface CardInHandProps {
  card: Card;
  dispatch: React.Dispatch<GameAction>;
}

const TYPE_BADGE: Record<string, string> = {
  curse: 'bg-red-950 text-red-300 border-red-900',
  veto: 'bg-violet-950 text-violet-300 border-violet-900',
  randomize: 'bg-cyan-950 text-cyan-300 border-cyan-900',
};

export function CardInHand({ card, dispatch }: CardInHandProps) {
  const handlePlay = () => {
    if (window.confirm(`Activate "${card.name}"?\n\n${card.effect}`)) {
      dispatch({ type: 'PLAY_CARD', cardId: card.id });
    }
  };

  const handleDiscard = () => {
    if (window.confirm(`Discard "${card.name}" without activating?`)) {
      dispatch({ type: 'DISCARD_CARD', cardId: card.id });
    }
  };

  return (
    <div className="bg-slate-800 border border-indigo-950/40 rounded-xl p-4 shadow-md">
      <span
        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${TYPE_BADGE[card.type] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}
      >
        {card.type}
      </span>
      <h4 className="font-bold text-slate-100 text-base mt-1.5">{card.name}</h4>
      {card.castingCost && (
        <p className="text-[10px] text-amber-400 mt-1 font-medium uppercase tracking-wider">
          Cost: {card.castingCost}
        </p>
      )}
      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{card.effect}</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handlePlay}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 rounded-lg text-white uppercase tracking-wider transition"
        >
          Play
        </button>
        <button
          onClick={handleDiscard}
          className="px-3 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-lg text-slate-300 transition"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace the hand placeholder in HiderDashboard**

In `src/components/hider/HiderDashboard.tsx`, add this import:

```tsx
import { CardInHand } from './CardInHand';
```

Then replace this block:

```tsx
        {state.hand.length === 0 ? (
          <div className="border border-dashed border-slate-800 text-slate-500 rounded-xl p-8 text-center text-xs italic">
            No curses or powerups in hand. Start a draft to get cards.
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">Cards will render here (next task)</div>
        )}
```

With:

```tsx
        {state.hand.length === 0 ? (
          <div className="border border-dashed border-slate-800 text-slate-500 rounded-xl p-8 text-center text-xs italic">
            No curses or powerups in hand. Start a draft to get cards.
          </div>
        ) : (
          <div className="space-y-2">
            {state.hand.map((card) => (
              <CardInHand key={card.id} card={card} dispatch={dispatch} />
            ))}
          </div>
        )}
```

- [ ] **Step 3: Verify in browser**

Run `npm start`. As hider:
- Draft cards, select a curse → appears in hand with Play/Discard buttons
- Click "Play" → confirmation dialog with card name + effect, then card removed from hand, discard pile count increases
- Click "Discard" → confirmation, card removed, discard pile count increases
- Casting cost visible on curse cards, not on powerups

- [ ] **Step 4: Commit**

```bash
git add src/components/hider/CardInHand.tsx src/components/hider/HiderDashboard.tsx
git commit -m "feat: add CardInHand with play and discard actions"
```

---

### Task 12: Add no-scrollbar CSS utility

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add scrollbar-hiding utility to src/index.css**

Append to `src/index.css` after the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "chore: add no-scrollbar CSS utility for score ledger"
```

---

### Task 13: Final Integration — Verify Full Flow and Build

**Files:** None — this is verification only.

- [ ] **Step 1: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Full flow test in browser**

Run `npm start` and test these flows:

**Gate:**
- Gate screen renders with two role buttons and Force Reset
- Force Reset shows confirmation dialog

**Seeker flow:**
- Click "I'm a Seeker" → 16 hints grouped by 5 categories
- Click "Ask This Hint" on a radar hint → timer overlay with countdown
- All other hint buttons disabled during active timer
- Timer expires → "Time's up!" message → Dismiss → back to catalog
- Click thermometer hint (1km or 300m) → "Location Reached" button instead of countdown
- Click thermometer 3min → 3-minute countdown
- Hint history shows used hints, collapsible
- "Back" returns to gate
- Reload page → state persists

**Hider flow:**
- Click "I'm the Hider" → deck stats, draft trigger, empty hand, score ledger
- Click "Pick 3, Draw 2" → draft overlay with 3 cards
- Select 2 cards, confirm → time bonuses to score ledger, curses/powerups to hand
- Unselected card returns to deck (draw pile count = prev - 2, not prev - 3)
- Play a curse → confirmation → card removed → discard pile count increases
- Discard a card → confirmation → removed → discard count increases
- Score ledger at bottom shows accumulated time bonuses
- Reload page → all state persists
- Force Reset → clears everything, back to gate

- [ ] **Step 3: Build static bundle**

Run:
```bash
npm run build
```

Expected: `build/` folder created with `index.html`, static JS/CSS. No errors.

- [ ] **Step 4: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: integration fixes from full flow testing"
```

(Skip this step if no fixes were needed.)
