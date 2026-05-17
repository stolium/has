import { Hint } from '../../data/types';
import { useI18n } from '../../i18n/context';

interface HintCardProps {
  hint: Hint;
  disabled: boolean;
  used: boolean;
  onAsk: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  radar: 'bg-blue-900 text-blue-300',
  thermometer: 'bg-orange-900 text-orange-300',
  photo: 'bg-pink-900 text-pink-300',
  location: 'bg-emerald-900 text-emerald-300',
  creative: 'bg-purple-900 text-purple-300',
};

export function HintCard({ hint, disabled, used, onAsk }: HintCardProps) {
  const { t } = useI18n();

  const hintText = t(`hint.${hint.id}`);
  const isDisabled = disabled || used;

  return (
    <div className={`rounded-xl p-4 shadow-md border ${used ? 'bg-slate-900/60 border-slate-800/30 opacity-50' : 'bg-slate-800/80 border-slate-700/50'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[hint.category] ?? 'bg-slate-700 text-slate-300'}`}
        >
          {t(`category.${hint.category}`)}
        </span>
        <span className="text-[10px] text-slate-500 whitespace-nowrap">
          {used ? t('seeker.hintUsed') : t(`timerLabel.${hint.timerLabel}`)}
        </span>
      </div>
      <p className={`font-medium text-sm mt-1 ${used ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{hintText}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          {t('seeker.pickDraw', { pick: hint.pickCount, draw: hint.drawCount })}
        </span>
        <button
          onClick={onAsk}
          disabled={isDisabled}
          className={`text-xs font-extrabold py-2 px-4 rounded-lg uppercase tracking-wider transition ${
            isDisabled
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-slate-900'
          }`}
        >
          {used ? t('seeker.hintUsed') : t('seeker.askHint')}
        </button>
      </div>
    </div>
  );
}
