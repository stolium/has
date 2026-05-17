import { GameState } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { HINTS } from '../../data/hints';
import { HintCard } from './HintCard';
import { TimerOverlay } from './TimerOverlay';

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
    </div>
  );
}
