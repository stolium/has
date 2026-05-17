import { Hint } from '../../data/types';
import { useI18n } from '../../i18n/context';

interface HintShowcaseOverlayProps {
  hint: Hint;
  onConfirm: () => void;
}

const CATEGORY_COLORS: Record<string, { badge: string; border: string }> = {
  radar: { badge: 'bg-blue-900 text-blue-300 border-blue-800', border: 'border-blue-900/60' },
  thermometer: { badge: 'bg-orange-900 text-orange-300 border-orange-800', border: 'border-orange-900/60' },
  photo: { badge: 'bg-pink-900 text-pink-300 border-pink-800', border: 'border-pink-900/60' },
  location: { badge: 'bg-emerald-900 text-emerald-300 border-emerald-800', border: 'border-emerald-900/60' },
  creative: { badge: 'bg-purple-900 text-purple-300 border-purple-800', border: 'border-purple-900/60' },
};

export function HintShowcaseOverlay({ hint, onConfirm }: HintShowcaseOverlayProps) {
  const { t } = useI18n();

  const hintText = t(`hint.${hint.id}`);
  const colors = CATEGORY_COLORS[hint.category] ?? { badge: 'bg-slate-800 text-slate-300 border-slate-700', border: 'border-slate-700' };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`bg-slate-900 border-2 ${colors.border} rounded-2xl p-8 max-w-sm w-full shadow-2xl`}>
          <div className="text-center">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${colors.badge}`}>
              {t(`category.${hint.category}`)}
            </span>
            <div className="w-12 h-0.5 bg-slate-700 mx-auto my-5" />
            <p className="text-slate-100 text-lg leading-relaxed font-medium">{hintText}</p>
            <div className="w-12 h-0.5 bg-slate-700 mx-auto my-5" />
            <div className="flex justify-center gap-6 text-xs text-slate-400 uppercase tracking-wider font-bold">
              <span>{t('seeker.pickDraw', { pick: hint.pickCount, draw: hint.drawCount })}</span>
              <span>{t(`timerLabel.${hint.timerLabel}`)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full max-w-sm py-4 rounded-xl font-black text-center uppercase tracking-wide text-sm bg-amber-600 hover:bg-amber-500 text-slate-900 transition mt-6"
      >
        {t('showcase.close')}
      </button>
    </div>
  );
}
