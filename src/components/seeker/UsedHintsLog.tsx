import { useState } from 'react';
import { HINTS } from '../../data/hints';

interface UsedHintsLogProps {
  usedHints: { hintId: string; timestamp: string }[];
}

export function UsedHintsLog({ usedHints }: UsedHintsLogProps) {
  const [expanded, setExpanded] = useState(false);

  if (usedHints.length === 0) return null;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Hint History ({usedHints.length})
        </h3>
        <span className="text-slate-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <ul className="mt-3 space-y-2 text-xs divide-y divide-slate-800/50">
          {usedHints.map((entry, i) => {
            const hint = HINTS.find((h) => h.id === entry.hintId);
            return (
              <li key={i} className="pt-2 first:pt-0 text-slate-300 flex justify-between gap-2">
                <span className="truncate">{hint?.text ?? entry.hintId}</span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {entry.timestamp}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
