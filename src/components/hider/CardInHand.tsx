import { Card } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { useI18n } from '../../i18n/context';

interface CardInHandProps {
  card: Card;
  dispatch: React.Dispatch<GameAction>;
  onPlayWithDiscard: (card: Card) => void;
  onShowcase: (card: Card) => void;
}

const TYPE_BADGE: Record<string, string> = {
  curse: 'bg-red-950 text-red-300 border-red-900',
  veto: 'bg-violet-950 text-violet-300 border-violet-900',
  randomize: 'bg-cyan-950 text-cyan-300 border-cyan-900',
};

export function CardInHand({ card, dispatch, onPlayWithDiscard, onShowcase }: CardInHandProps) {
  const { t } = useI18n();

  const cardName = t(`card.${card.id}.name`);
  const cardEffect = t(`card.${card.id}.effect`);
  const cardCost = card.castingCost ? t(`card.${card.id}.castingCost`) : undefined;

  const handlePlay = () => {
    if (card.castingCost?.action) {
      onPlayWithDiscard(card);
      return;
    }
    if (window.confirm(t('card.confirmPlay', { name: cardName, effect: cardEffect }))) {
      onShowcase(card);
      dispatch({ type: 'PLAY_CARD', cardId: card.id });
    }
  };

  const handleDiscard = () => {
    if (window.confirm(t('card.confirmDiscard', { name: cardName }))) {
      dispatch({ type: 'DISCARD_CARD', cardId: card.id });
    }
  };

  return (
    <div className="bg-slate-800 border border-indigo-950/40 rounded-xl p-4 shadow-md">
      <span
        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${TYPE_BADGE[card.type] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}
      >
        {t(`type.${card.type}`)}
      </span>
      <h4 className="font-bold text-slate-100 text-base mt-1.5">{cardName}</h4>
      {cardCost && (
        <p className="text-[10px] text-amber-400 mt-1 font-medium uppercase tracking-wider">
          {t('card.cost', { cost: cardCost })}
        </p>
      )}
      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{cardEffect}</p>
      <div className="flex gap-2 mt-3">
        {card.type !== 'time_bonus' && (
          <button
            onClick={handlePlay}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 rounded-lg text-white uppercase tracking-wider transition"
          >
            {t('card.play')}
          </button>
        )}
        <button
          onClick={handleDiscard}
          className={`${card.type === 'time_bonus' ? 'flex-1' : 'px-3'} bg-slate-700 hover:bg-slate-600 text-xs font-bold py-2 rounded-lg text-slate-300 transition`}
        >
          {t('card.discard')}
        </button>
      </div>
    </div>
  );
}
