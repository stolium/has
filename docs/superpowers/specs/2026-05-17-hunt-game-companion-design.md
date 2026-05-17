# Hunt: Hide & Seek Game Companion App

A browser-based companion app for a Jetlag-style hide-and-seek game. Two independent apps (seeker device, hider device) with no networking — players coordinate verbally.

Built with React 19, TypeScript, Tailwind CSS on Create React App. Output is a static `build/` folder.

---

## 1. App Structure & Navigation

### Role Selection Gate
- Two buttons: "I'm the Hider" / "I'm a Seeker"
- Once chosen, user stays in that role for the session
- Small "back to role select" button in header to restart

### Routing
- No React Router — `role` state variable (`null | 'hider' | 'seeker'`) conditionally renders the appropriate dashboard

### Component Tree
```
App
├── GateScreen
├── SeekerDashboard
│   ├── HintCard
│   ├── TimerOverlay
│   └── UsedHintsLog
└── HiderDashboard
    ├── DraftTrigger
    ├── CardInHand
    ├── DraftOverlay
    └── ScoreLedger
```

### Styling
- Dark theme: slate-900 background, slate-100 text
- Mobile-first: max-w-md centered
- Tailwind utility classes throughout

---

## 2. Seeker Dashboard

### Hint Catalog
Scrollable list of hint cards grouped by category with section headers.

**Categories:**
- **Radar** (3 hints)
- **Thermometer** (3 hints)
- **Photo** (3 hints)
- **Location Matching** (6 hints)
- **Creative** (1 hint)

### HintCard Display
- Category badge
- Hint description text
- Reward info: "Pick X, Draw Y"
- Timer duration label
- "Ask This Hint" button

### Hint Activation Flow
1. Hint logged to "Used Hints" history
2. Fullscreen countdown timer overlay appears
3. For thermometer hints with "as location B reached": manual "Location Reached" button instead of countdown; 3-min thermometer runs a 3-min countdown then seeker confirms arrival
4. On expiry/confirm: overlay shows "Time's up! Ask the hider for their answer." with dismiss button

### Constraints
- One hint active at a time — other hint buttons disabled during active countdown
- Used Hints History: collapsible section at bottom, shows hint text + timestamp

---

## 3. Hider Dashboard

Operates independently. No visibility into seeker hints.

### Manual Draft Trigger
Button to initiate drafting when seekers verbally communicate a hint was asked. Opens a tier picker:
- "Pick 3, Draw 2"
- "Pick 2, Draw 1"

Draws cards from deck and opens Draft Overlay.

### Card Hand
Scrollable list of curses & powerups currently held. Each card shows:
- Type badge (curse / powerup)
- Card name
- Casting cost (curses only)
- Effect text
- "Play" button — confirmation dialog, then moves to discard
- "Discard" button — discards without activating

No hand size limit.

### Deck Stats
Info bar showing draw pile remaining / discard pile count. Auto-reshuffles discard back into draw pile when draw pile is exhausted.

### Score Ledger (Fixed Bottom Tray)
Permanently pinned to viewport bottom:
- Total accumulated time bonus (e.g., "Score: +45 Mins")
- Scrollable row of individual kept bonus cards

Time bonus cards go directly to score ledger during drafting (never enter hand).

---

## 4. Draft Overlay (Fullscreen Modal)

### Flow
1. Draw `pick` cards from top of shuffled deck
2. Fullscreen overlay shows all drawn cards as selectable tiles
3. Tap to toggle selection (checkbox visual)
4. Must select exactly `draw` number of cards
5. "Confirm Selection" button disabled until correct count selected
6. On confirm:
   - Time bonus cards → score ledger
   - Curses/powerups → hand
   - **Unselected cards → shuffled back into draw pile** (not discard)
   - Overlay closes

### Card Display in Draft
Type badge, name, effect text. Selected: highlighted border + checkmark. Unselected: dimmer.

### Deck Exhaustion
If draw pile insufficient, discard pile reshuffled and added back. If entire deck exhausted (all in hand + ledger), draft button disabled with "No cards available" message.

---

## 5. Data Model

### GameState
```typescript
interface GameState {
  role: null | 'hider' | 'seeker';

  // Seeker
  activeHint: string | null;
  timerSecondsLeft: number | null;
  usedHints: { hintId: string; timestamp: string }[];

  // Hider
  drawPile: Card[];
  discardPile: Card[];
  hand: Card[];
  scoreLedger: Card[];
  draftPool: Card[];
  draftSelections: Set<string>;
  draftDrawCount: number;
}
```

### Card
```typescript
interface Card {
  id: string;
  type: 'curse' | 'time_bonus' | 'veto' | 'randomize';
  name: string;
  castingCost?: string;
  effect: string;
  value?: number;
}
```

### Hint
```typescript
interface Hint {
  id: string;
  category: 'radar' | 'thermometer' | 'photo' | 'location' | 'creative';
  text: string;
  pickCount: number;
  drawCount: number;
  timerSeconds: number | null;
  timerLabel: string;
}
```

---

## 6. Hint Data

| # | Category | Text | Pick | Draw | Timer |
|---|----------|------|------|------|-------|
| 1 | Radar | Radar 5km — is hider inside 5km zone? | 3 | 2 | 5 min |
| 2 | Radar | Radar 1500m — is hider inside 1500m zone? | 2 | 1 | 5 min |
| 3 | Radar | Radar 500m — is hider inside 500m zone? | 2 | 1 | 5 min |
| 4 | Thermometer | Thermometer 1km — walk 1km, is point B closer to hider? | 3 | 2 | Location reached |
| 5 | Thermometer | Thermometer 300m — walk 300m, is point B closer to hider? | 2 | 1 | Location reached |
| 6 | Thermometer | Thermometer 3 min — walk for 3 minutes, is point B closer to hider? | 2 | 1 | 3 min |
| 7 | Photo | Photo of highest building from hiding location | 2 | 1 | 5 min |
| 8 | Photo | Selfie with something in background (not sky) | 2 | 1 | 5 min |
| 9 | Photo | Photo of closest red-and-white shop (door and entry exposed) | 2 | 1 | 10 min |
| 10 | Location | Cinema radar — all cinemas create 800m radius radar | 3 | 2 | 5 min |
| 11 | Location | Is hider in the same district as seekers? | 2 | 1 | 5 min |
| 12 | Location | Closest building's street — does it have electric transport? | 2 | 1 | 5 min |
| 13 | Location | Is your closest Lenta shop the same as mine? | 2 | 1 | 3 min |
| 14 | Location | Is your closest runway the same as mine? | 2 | 1 | 5 min |
| 15 | Location | Does your street name start with the same letter as mine? | 2 | 1 | 3 min |
| 16 | Creative | Draw the closest non-square building | 2 | 1 | 5 min |

---

## 7. Card Deck (29 cards)

### Curses (14)
| Name | Casting Cost | Effect |
|------|-------------|--------|
| Curse of the Move Card | Discard 2 cards | Hider gets 45–60 min to change locations |
| Curse of the Hide-and-Seek-Ception | Seekers off-transit, 500ft from station | One seeker hides 500ft away; other must find them |
| Curse of the Drained Brain | Discard entire hand | Hider picks 3 questions; seekers banned from asking them |
| Curse of the Gilded Inquiry | Seekers' next question is free | Hider picks a question; if seekers ask it, auto-vetoed + hider draws 3 |
| Curse of the Prosperous Home | Discard 20+ min of time bonuses | Expands hider's zone radius by 50% (removed in endgame) |
| Curse of the Gambler's Feet | Roll die (even = fails) | 1 hour: seekers roll die before steps, move only that many paces |
| Curse of the Bird Guide | Film a bird | Seekers film a wild bird for up to 15 min continuous |
| Curse of the Zoologist | Photo of a wild animal | Seekers find/photograph animal in same biological category |
| Curse of the Frozen Dot | Seekers 10+ miles away | Pin 1000ft from seekers; if within 250ft in 15 min, freeze 30 min |
| Curse of the Hidden Hangman | Discard 2 cards | Seekers beat hider in 5-letter Hangman before moving/asking |
| Curse of the Overflowing Chalice | Discard 1 card | Next 3 questions: hider draws extra card |
| Curse of the Impressionable Consumer | Seekers' next question free | Seekers buy product/enter location from real-world ad |
| Town Hall Census Curse | Seekers' next question free | Seekers go to town hall, guess population within 25% |
| Long-Distance Die Roll | None | Roll die 100ft away using gravity/momentum, land 5 or 6 |

### Powerups (15 — 3 copies each)
| Name | Type | Value | Effect |
|------|------|-------|--------|
| +5 Minutes | time_bonus | 5 | Adds 5 minutes to score |
| +10 Minutes | time_bonus | 10 | Adds 10 minutes to score |
| +15 Minutes | time_bonus | 15 | Adds 15 minutes to score |
| Veto Question | veto | — | Refuse to answer a question; still receive card rewards |
| Randomize Question | randomize | — | Seekers must re-roll and pick a different hint |

---

## 8. File Structure

```
src/
├── App.tsx
├── index.tsx
├── index.css
├── data/
│   ├── hints.ts
│   ├── cards.ts
│   └── types.ts
├── components/
│   ├── GateScreen.tsx
│   ├── seeker/
│   │   ├── SeekerDashboard.tsx
│   │   ├── HintCard.tsx
│   │   ├── TimerOverlay.tsx
│   │   └── UsedHintsLog.tsx
│   └── hider/
│       ├── HiderDashboard.tsx
│       ├── CardInHand.tsx
│       ├── DraftOverlay.tsx
│       ├── DraftTrigger.tsx
│       └── ScoreLedger.tsx
└── hooks/
    └── useTimer.ts
```

---

## 9. State Persistence

### localStorage
All game state is saved to `localStorage` under a single key (`hunt-game-state`) on every state change. On app load, the app checks for a saved state and restores it — role, hand, deck, score ledger, active timer, used hints, etc.

Timer state is persisted by storing the **target end timestamp** (not seconds remaining), so a page reload mid-countdown resumes accurately.

The `Set<string>` for draft selections is serialized as an array.

### Force Reset
A **"Force Reset"** button is available on every screen (gate, seeker, hider). It clears localStorage and resets to the initial gate screen. Requires a confirmation dialog ("This will end the current game. Are you sure?") to prevent accidental taps.

---

## 10. Build & Output

- `npm run build` produces static `build/` folder
- Tailwind CSS configured via CRA-compatible setup
- No routing library, no state management library
- State managed with React useState/useReducer at dashboard level
- `useTimer` custom hook for countdown logic
