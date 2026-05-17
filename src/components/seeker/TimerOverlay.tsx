import { useTimer } from '../../hooks/useTimer';
import { Hint } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { useI18n } from '../../i18n/context';

interface TimerFooterProps {
  hint: Hint;
  timerEndTimestamp: number | null;
  dispatch: React.Dispatch<GameAction>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TimerFooter({ hint, timerEndTimestamp, dispatch }: TimerFooterProps) {
  const { secondsLeft, isExpired } = useTimer(timerEndTimestamp);
  const { t } = useI18n();

  const isLocationBased = timerEndTimestamp === null;

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_TIMER' });
  };

  const hintText = t(`hint.${hint.id}`);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto bg-slate-950 border-t border-slate-800 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {t('timer.hintActive')}
            </div>
            <p className="text-slate-300 text-xs mt-0.5 truncate">{hintText}</p>
          </div>

          {isLocationBased ? (
            <button
              onClick={handleDismiss}
              className="shrink-0 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition"
            >
              {t('timer.locationReached')}
            </button>
          ) : isExpired ? (
            <button
              onClick={handleDismiss}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition"
            >
              {t('timer.dismiss')}
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={handleDismiss}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition"
              >
                {t('timer.answerReceived')}
              </button>
              <div className="text-2xl font-black text-amber-400 tabular-nums">
                {secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}
              </div>
            </div>
          )}
        </div>

        {!isLocationBased && !isExpired && (
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
              style={{
                width:
                  secondsLeft !== null && hint.timerSeconds
                    ? `${(secondsLeft / hint.timerSeconds) * 100}%`
                    : '100%',
              }}
            />
          </div>
        )}

        {isExpired && (
          <p className="text-emerald-300 text-xs font-bold mt-1">
            {t('timer.timesUp')}
          </p>
        )}
      </div>
    </div>
  );
}
