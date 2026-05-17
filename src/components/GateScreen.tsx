import { GameAction } from '../hooks/useGameState';
import { useI18n } from '../i18n/context';
import { LanguageToggle } from './LanguageToggle';

interface GateScreenProps {
  dispatch: React.Dispatch<GameAction>;
}

export function GateScreen({ dispatch }: GateScreenProps) {
  const { t } = useI18n();

  const handleForceReset = () => {
    if (window.confirm(t('gate.confirmReset'))) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="my-auto text-center py-8">
      <div className="text-5xl mb-2">🔍</div>
      <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent uppercase">
        {t('gate.title')}
      </h1>
      <p className="text-sm text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
        {t('gate.subtitle')}
      </p>
      <div className="space-y-3">
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'hider' })}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-indigo-900/30"
        >
          {t('gate.hider')}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'seeker' })}
          className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-amber-900/30"
        >
          {t('gate.seeker')}
        </button>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={handleForceReset}
          className="text-xs text-slate-500 hover:text-rose-400 transition"
        >
          {t('gate.forceReset')}
        </button>
        <LanguageToggle />
      </div>
    </div>
  );
}
