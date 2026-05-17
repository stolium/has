import { useTimer } from '../../hooks/useTimer';
import { Hint } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';

interface TimerOverlayProps {
  hint: Hint;
  timerEndTimestamp: number | null;
  dispatch: React.Dispatch<GameAction>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TimerOverlay({ hint, timerEndTimestamp, dispatch }: TimerOverlayProps) {
  const { secondsLeft, isExpired } = useTimer(timerEndTimestamp);

  const isLocationBased = timerEndTimestamp === null;

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_TIMER' });
  };

  const handleLocationReached = () => {
    dispatch({ type: 'DISMISS_TIMER' });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-900/60 uppercase">
          Hint Active
        </span>

        <p className="text-slate-300 text-sm mt-6 mb-8 leading-relaxed">{hint.text}</p>

        {isLocationBased ? (
          <>
            <div className="text-6xl font-black text-amber-400 mb-2">📍</div>
            <p className="text-slate-400 text-sm mb-8">
              Walk to point B, then tap below when you arrive.
            </p>
            <button
              onClick={handleLocationReached}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-900 font-black py-4 rounded-xl text-lg uppercase tracking-wide transition shadow-lg shadow-amber-900/30"
            >
              Location Reached
            </button>
          </>
        ) : isExpired ? (
          <>
            <div className="text-6xl font-black text-emerald-400 mb-2">0:00</div>
            <p className="text-emerald-300 text-lg font-bold mb-8">
              Time's up! Ask the hider for their answer.
            </p>
            <button
              onClick={handleDismiss}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black py-4 rounded-xl text-lg uppercase tracking-wide transition shadow-lg shadow-emerald-950/30"
            >
              Dismiss
            </button>
          </>
        ) : (
          <>
            <div className="text-7xl font-black text-amber-400 tabular-nums mb-2">
              {secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}
            </div>
            <p className="text-slate-500 text-xs mb-8">Waiting for the hider to respond...</p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
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
          </>
        )}
      </div>
    </div>
  );
}
