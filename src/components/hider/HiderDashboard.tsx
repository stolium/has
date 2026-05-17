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
