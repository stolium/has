import { useState } from 'react';
import { Card, CastingCostAction } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { useI18n } from '../../i18n/context';

interface DiscardOverlayProps {
  playCard: Card;
  castingCostAction: CastingCostAction;
  hand: Card[];
  dispatch: React.Dispatch<GameAction>;
  onCancel: () => void;
  onShowcase: (card: Card) => void;
}

export function DiscardOverlay({ playCard, castingCostAction, hand, dispatch, onCancel, onShowcase }: DiscardOverlayProps) {
  const { t } = useI18n();

  const otherCards = hand.filter((c) => c.id !== playCard.id);
  const isTimeBonusMode = castingCostAction.kind === 'time_bonus_minutes';
  const candidates = isTimeBonusMode
    ? otherCards.filter((c) => c.type === 'time_bonus')
    : otherCards;

  const [selected, setSelected] = useState<string[]>(() => {
    if (castingCostAction.kind === 'all') {
      return candidates.map((c) => c.id);
    }
    return [];
  });

  const requiredCount = castingCostAction.kind === 'cards'
    ? castingCostAction.count
    : castingCostAction.kind === 'all'
      ? candidates.length
      : null;

  const selectedMinutes = isTimeBonusMode
    ? selected.reduce((sum, id) => {
        const card = candidates.find((c) => c.id === id);
        return sum + (card?.value ?? 0);
      }, 0)
    : 0;

  const canConfirm = castingCostAction.kind === 'time_bonus_minutes'
    ? selectedMinutes >= castingCostAction.minMinutes
    : requiredCount !== null && selected.length === requiredCount;

  const isAutoAll = castingCostAction.kind === 'all';

  const toggle = (id: string) => {
    if (isAutoAll) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (requiredCount !== null && selected.length >= requiredCount) return;
      setSelected([...selected, id]);
    }
  };

  const handleConfirm = () => {
    onShowcase(playCard);
    dispatch({ type: 'PLAY_CARD_WITH_DISCARD', cardId: playCard.id, discardCardIds: selected });
    onCancel();
  };

  const playCardName = t(`card.${playCard.id}.name`);
  const playCardEffect = t(`card.${playCard.id}.effect`);

  const subtitle = isTimeBonusMode
    ? t('discard.selectTimeBonuses', { min: (castingCostAction as { minMinutes: number }).minMinutes })
    : castingCostAction.kind === 'all'
      ? t('discard.allCards')
      : t('discard.selectCards', { count: requiredCount! });

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col p-4 overflow-y-auto">
      <div className="text-center mb-4 mt-4">
        <span className="text-[10px] font-bold tracking-widest text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-900/60 uppercase">
          {t('discard.phase')}
        </span>
        <h2 className="text-xl font-black text-slate-100 mt-3">{playCardName}</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{playCardEffect}</p>
        <p className="text-xs text-amber-400 mt-2 font-bold">{subtitle}</p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm italic">{t('discard.noCards')}</p>
        </div>
      ) : (
        <div className="space-y-2 mb-6 flex-1">
          {candidates.map((card) => {
            const isSelected = selected.includes(card.id);
            const cardName = t(`card.${card.id}.name`);
            const cardEffect = t(`card.${card.id}.effect`);
            return (
              <div
                key={card.id}
                onClick={() => toggle(card.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-red-950/60 border-red-500 shadow-md shadow-red-950/50'
                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                } ${isAutoAll ? 'cursor-default' : ''}`}
              >
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700">
                    {t(`type.${card.type}`)}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-100 mt-1">{cardName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{cardEffect}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4 border-t border-slate-900 sticky bottom-0 bg-slate-950/90 backdrop-blur-md flex gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-4 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
        >
          {t('discard.cancel')}
        </button>
        <button
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={`flex-1 py-4 rounded-xl font-bold text-center uppercase tracking-wide text-sm transition ${
            canConfirm
              ? 'bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-950/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isTimeBonusMode
            ? t('discard.confirmTimeBonuses', { mins: selectedMinutes })
            : t('discard.confirmDiscard', { count: selected.length })}
        </button>
      </div>
    </div>
  );
}
