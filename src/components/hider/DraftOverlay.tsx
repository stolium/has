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
