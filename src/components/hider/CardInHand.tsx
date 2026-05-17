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
