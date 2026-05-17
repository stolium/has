import { useGameState } from './hooks/useGameState';
import { GateScreen } from './components/GateScreen';

export default function App() {
  const { state, dispatch } = useGameState();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        {state.role === null && <GateScreen dispatch={dispatch} />}
        {state.role === 'seeker' && (
          <div className="text-center mt-8">Seeker Dashboard (coming soon)</div>
        )}
        {state.role === 'hider' && (
          <div className="text-center mt-8">Hider Dashboard (coming soon)</div>
        )}
      </div>
    </div>
  );
}
