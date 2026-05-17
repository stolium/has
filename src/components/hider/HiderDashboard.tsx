import { useState } from 'react';
import { Card, GameState } from '../../data/types';
import { GameAction } from '../../hooks/useGameState';
import { DraftTrigger } from './DraftTrigger';
import { DraftOverlay } from './DraftOverlay';
import { DiscardOverlay } from './DiscardOverlay';
import { HandOverflowOverlay } from './HandOverflowOverlay';
import { CardShowcaseOverlay } from './CardShowcaseOverlay';
import { CardInHand } from './CardInHand';
import { useI18n } from '../../i18n/context';
import { LanguageToggle } from '../LanguageToggle';

interface HiderDashboardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function HiderDashboard({ state, dispatch }: HiderDashboardProps) {
  const { t } = useI18n();
  const [discardingCard, setDiscardingCard] = useState<Card | null>(null);
  const [showcaseCard, setShowcaseCard] = useState<Card | null>(null);
  const canDraft = state.drawPile.length + state.discardPile.length > 0;

  const handleForceReset = () => {
    if (window.confirm(t('gate.confirmReset'))) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-indigo-400 uppercase tracking-tight">
          {t('hider.deck')}
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

      {/* Deck Stats */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-slate-800/40 border border-slate-800 p-2 rounded-lg">
          <span className="text-slate-400 block font-medium">{t('hider.drawPile')}</span>
          <strong className="text-base text-indigo-300 font-bold">
            {t('hider.left', { count: state.drawPile.length })}
          </strong>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-2 rounded-lg">
          <span className="text-slate-400 block font-medium">{t('hider.discardPile')}</span>
          <strong className="text-base text-slate-500 font-bold">
            {t('hider.cards', { count: state.discardPile.length })}
          </strong>
        </div>
      </div>

      <DraftTrigger canDraft={canDraft} dispatch={dispatch} />

      {/* Hand Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          {t('hider.activeHand', { count: state.hand.length })}
        </h3>
        {state.hand.length === 0 ? (
          <div className="border border-dashed border-slate-800 text-slate-500 rounded-xl p-8 text-center text-xs italic">
            {t('hider.emptyHand')}
          </div>
        ) : (
          <div className="space-y-2">
            {state.hand.map((card) => (
              <CardInHand key={card.id} card={card} dispatch={dispatch} onPlayWithDiscard={setDiscardingCard} onShowcase={setShowcaseCard} />
            ))}
          </div>
        )}
      </div>

      {state.draftPool.length > 0 && (
        <DraftOverlay
          draftPool={state.draftPool}
          draftSelections={state.draftSelections}
          draftDrawCount={state.draftDrawCount}
          dispatch={dispatch}
        />
      )}

      {state.pendingHandDiscard > 0 && (
        <HandOverflowOverlay
          hand={state.hand}
          discardCount={state.pendingHandDiscard}
          dispatch={dispatch}
        />
      )}

      {discardingCard && discardingCard.castingCost?.action && (
        <DiscardOverlay
          playCard={discardingCard}
          castingCostAction={discardingCard.castingCost.action}
          hand={state.hand}
          dispatch={dispatch}
          onCancel={() => setDiscardingCard(null)}
          onShowcase={setShowcaseCard}
        />
      )}

      {showcaseCard && (
        <CardShowcaseOverlay card={showcaseCard} onClose={() => setShowcaseCard(null)} />
      )}

    </div>
  );
}
