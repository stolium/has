import { useState } from 'react';
import { GameState, Hint } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { HINTS } from '../../data/hints';
import { HintCard } from './HintCard';
import { HintShowcaseOverlay } from './HintShowcaseOverlay';
import { TimerFooter } from './TimerOverlay';
import { UsedHintsLog } from './UsedHintsLog';
import { useI18n } from '../../i18n/context';
import { LanguageToggle } from '../LanguageToggle';

interface SeekerDashboardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const CATEGORY_ORDER = ['radar', 'thermometer', 'photo', 'location', 'creative'];

export function SeekerDashboard({ state, dispatch }: SeekerDashboardProps) {
  const { t } = useI18n();
  const [showcaseHint, setShowcaseHint] = useState<Hint | null>(null);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: t(`category.${cat}`),
    hints: HINTS.filter((h) => h.category === cat),
  }));

  const hasActiveHint = state.activeHint !== null;
  const usedHintIds = new Set(state.usedHints.map((h) => h.hintId));

  const handleAskHint = (hint: Hint) => {
    setShowcaseHint(hint);
  };

  const handleShowcaseConfirm = () => {
    if (!showcaseHint) return;
    const timerEndTimestamp = showcaseHint.timerSeconds !== null ? Date.now() + showcaseHint.timerSeconds * 1000 : null;
    dispatch({ type: 'ACTIVATE_HINT', hintId: showcaseHint.id, timerEndTimestamp });
    setShowcaseHint(null);
  };

  const handleForceReset = () => {
    if (window.confirm(t('gate.confirmReset'))) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${hasActiveHint ? 'pb-28' : 'pb-8'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tight">
          {t('seeker.menu')}
        </h2>
        <div className="flex gap-2">
          <LanguageToggle />
          <button
            onClick={() => dispatch({ type: 'SET_ROLE', role: null })}
            className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded hover:bg-slate-700 transition"
          >
            {t('back')}
          </button>
          <button
            onClick={handleForceReset}
            className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded hover:bg-rose-950/60 transition"
          >
            {t('gate.forceReset')}
          </button>
        </div>
      </div>

      {hasActiveHint && (
        <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-900/50 p-2 rounded-lg">
          {t('seeker.hintActive')}
        </p>
      )}

      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.hints.map((hint) => (
              <HintCard
                key={hint.id}
                hint={hint}
                disabled={hasActiveHint}
                used={usedHintIds.has(hint.id)}
                onAsk={() => handleAskHint(hint)}
              />
            ))}
          </div>
        </div>
      ))}
      <UsedHintsLog usedHints={state.usedHints} />

      {state.activeHint && (() => {
        const activeHintData = HINTS.find((h) => h.id === state.activeHint);
        if (!activeHintData) return null;
        return (
          <TimerFooter
            hint={activeHintData}
            timerEndTimestamp={state.timerEndTimestamp}
            dispatch={dispatch}
          />
        );
      })()}

      {showcaseHint && (
        <HintShowcaseOverlay hint={showcaseHint} onConfirm={handleShowcaseConfirm} />
      )}
    </div>
  );
}
