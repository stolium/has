import { Hint } from '../../data/types';

interface HintCardProps {
  hint: Hint;
  disabled: boolean;
  onAsk: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  radar: 'bg-blue-900 text-blue-300',
  thermometer: 'bg-orange-900 text-orange-300',
  photo: 'bg-pink-900 text-pink-300',
  location: 'bg-emerald-900 text-emerald-300',
  creative: 'bg-purple-900 text-purple-300',
};

export function HintCard({ hint, disabled, onAsk }: HintCardProps) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 shadow-md">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[hint.category] ?? 'bg-slate-700 text-slate-300'}`}
        >
          {hint.category}
        </span>
        <span className="text-[10px] text-slate-500 whitespace-nowrap">
          {hint.timerLabel}
        </span>
      </div>
      <p className="text-slate-100 font-medium text-sm mt-1">{hint.text}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          Pick {hint.pickCount}, Draw {hint.drawCount}
        </span>
        <button
          onClick={onAsk}
          disabled={disabled}
          className={`text-xs font-extrabold py-2 px-4 rounded-lg uppercase tracking-wider transition ${
            disabled
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-slate-900'
          }`}
        >
          Ask This Hint
        </button>
      </div>
    </div>
  );
}
