import { useGameState } from './hooks/useGameState';
import { GateScreen } from './components/GateScreen';
import { SeekerDashboard } from './components/seeker/SeekerDashboard';
import { HiderDashboard } from './components/hider/HiderDashboard';

export default function App() {
  const { state, dispatch } = useGameState();

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
        {state.role === null && <GateScreen dispatch={dispatch} />}
        {state.role === 'seeker' && (
          <SeekerDashboard state={state} dispatch={dispatch} />
        )}
        {state.role === 'hider' && (
          <HiderDashboard state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}
