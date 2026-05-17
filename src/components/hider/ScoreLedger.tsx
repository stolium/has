import { Card } from '../../data/types';
import { useI18n } from '../../i18n/context';

interface ScoreLedgerProps {
  scoreLedger: Card[];
}

export function ScoreLedger({ scoreLedger }: ScoreLedgerProps) {
  const { t } = useI18n();
  const totalScore = scoreLedger.reduce((sum, c) => sum + (c.value ?? 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto bg-slate-950 border-t border-slate-800 p-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {t('score.title')}
            </div>
            <div className="text-2xl font-black text-emerald-400">
              +{totalScore}{' '}
              <span className="text-xs text-slate-300 font-normal">{t('score.mins')}</span>
            </div>
          </div>
        </div>
        {scoreLedger.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-2 pb-1 no-scrollbar">
            {scoreLedger.map((card, i) => (
              <div
                key={`${card.id}-${i}`}
                className="bg-emerald-950/30 border border-emerald-900/60 rounded-lg p-1.5 text-center min-w-[60px] shrink-0"
              >
                <span className="text-emerald-400 text-sm font-black block">
                  {t(`card.${card.id}.name`)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
