import { useState } from 'react';
import { Card, MAX_HAND_SIZE } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { useI18n } from '../../i18n/context';

interface HandOverflowOverlayProps {
  hand: Card[];
  discardCount: number;
  dispatch: React.Dispatch<GameAction>;
}

export function HandOverflowOverlay({ hand, discardCount, dispatch }: HandOverflowOverlayProps) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= discardCount) return;
      setSelected([...selected, id]);
    }
  };

  const canConfirm = selected.length === discardCount;

  const handleConfirm = () => {
    dispatch({ type: 'DISCARD_OVERFLOW', discardCardIds: selected });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col p-4 overflow-y-auto">
      <div className="text-center mb-4 mt-4">
        <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-900/60 uppercase">
          {t('overflow.phase')}
        </span>
        <p className="text-xs text-amber-400 mt-3 font-bold">
          {t('overflow.subtitle', { count: discardCount, max: MAX_HAND_SIZE })}
        </p>
      </div>

      <div className="space-y-2 mb-6 flex-1">
        {hand.map((card) => {
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
              }`}
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

      <div className="pt-4 border-t border-slate-900 sticky bottom-0 bg-slate-950/90 backdrop-blur-md">
        <button
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={`w-full py-4 rounded-xl font-bold text-center uppercase tracking-wide text-sm transition ${
            canConfirm
              ? 'bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-950/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {t('overflow.confirm', { count: selected.length })}
        </button>
      </div>
    </div>
  );
}
