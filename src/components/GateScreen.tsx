import { GameAction } from '../hooks/useGameState';

interface GateScreenProps {
  dispatch: React.Dispatch<GameAction>;
}

export function GateScreen({ dispatch }: GateScreenProps) {
  const handleForceReset = () => {
    if (window.confirm('This will end the current game. Are you sure?')) {
      dispatch({ type: 'FORCE_RESET' });
    }
  };

  return (
    <div className="my-auto text-center py-8">
      <div className="text-5xl mb-2">🔍</div>
      <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent uppercase">
        Hunt
      </h1>
      <p className="text-sm text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
        A companion app for hide-and-seek. Choose your role to begin.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'hider' })}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-indigo-900/30"
        >
          I'm the Hider
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: 'seeker' })}
          className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold transition-all text-lg shadow-lg shadow-amber-900/30"
        >
          I'm a Seeker
        </button>
      </div>
      <button
        onClick={handleForceReset}
        className="mt-6 text-xs text-slate-500 hover:text-rose-400 transition"
      >
        Force Reset
      </button>
    </div>
  );
}
