import { GameAction } from '../../hooks/useGameState';
import { useI18n } from '../../i18n/context';

interface DraftTriggerProps {
  canDraft: boolean;
  dispatch: React.Dispatch<GameAction>;
}

export function DraftTrigger({ canDraft, dispatch }: DraftTriggerProps) {
  const { t } = useI18n();

  const handleDraft = (pickCount: number, drawCount: number) => {
    dispatch({ type: 'START_DRAFT', pickCount, drawCount });
  };

  if (!canDraft) {
    return (
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 italic">
        {t('draft.noCards')}
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        {t('draft.title')}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        {t('draft.description')}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleDraft(3, 2)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition"
        >
          {t('draft.pick3draw2')}
        </button>
        <button
          onClick={() => handleDraft(2, 1)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition"
        >
          {t('draft.pick2draw1')}
        </button>
      </div>
    </div>
  );
}
