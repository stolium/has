import { Card } from '../../data/types';
import { useI18n } from '../../i18n/context';

interface CardShowcaseOverlayProps {
  card: Card;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, { badge: string; border: string }> = {
  curse: { badge: 'bg-red-950 text-red-300 border-red-800', border: 'border-red-900/60' },
  veto: { badge: 'bg-violet-950 text-violet-300 border-violet-800', border: 'border-violet-900/60' },
  randomize: { badge: 'bg-cyan-950 text-cyan-300 border-cyan-800', border: 'border-cyan-900/60' },
};

export function CardShowcaseOverlay({ card, onClose }: CardShowcaseOverlayProps) {
  const { t } = useI18n();

  const cardName = t(`card.${card.id}.name`);
  const cardEffect = t(`card.${card.id}.effect`);
  const cardCost = card.castingCost ? t(`card.${card.id}.castingCost`) : undefined;
  const colors = TYPE_COLORS[card.type] ?? { badge: 'bg-slate-800 text-slate-300 border-slate-700', border: 'border-slate-700' };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`bg-slate-900 border-2 ${colors.border} rounded-2xl p-8 max-w-sm w-full shadow-2xl`}>
          <div className="text-center">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${colors.badge}`}>
              {t(`type.${card.type}`)}
            </span>
            <h2 className="text-2xl font-black text-slate-100 mt-4 leading-tight">{cardName}</h2>
            {cardCost && (
              <p className="text-sm text-amber-400 mt-3 font-bold uppercase tracking-wider">
                {t('card.cost', { cost: cardCost })}
              </p>
            )}
            <div className="w-12 h-0.5 bg-slate-700 mx-auto my-4" />
            <p className="text-slate-300 text-base leading-relaxed">{cardEffect}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full max-w-sm py-4 rounded-xl font-black text-center uppercase tracking-wide text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition mt-6"
      >
        {t('showcase.close')}
      </button>
    </div>
  );
}
