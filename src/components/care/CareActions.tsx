'use client';

import { useState } from 'react';

interface CareActionsProps {
  todayCare: string[];
  onCare: (type: string) => Promise<void>;
  isLoading: boolean;
}

export default function CareActions({ todayCare, onCare, isLoading }: CareActionsProps) {
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const actions = [
    { type: 'water', label: 'Water', xp: '+10', color: 'hover:border-sage hover:bg-sage/5 active:bg-sage/10' },
    { type: 'sunlight', label: 'Sunshine', xp: '+5', color: 'hover:border-gold hover:bg-gold/5 active:bg-gold/10' },
    { type: 'love', label: 'Love', xp: '+5', color: 'hover:border-rose hover:bg-rose/5 active:bg-rose/10' },
  ];

  const handleCare = async (type: string) => {
    setLoadingType(type);
    try { await onCare(type); } finally { setLoadingType(null); }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs text-taupe-light uppercase tracking-wide text-center">Daily Care</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const done = todayCare.includes(action.type);
          const loading = loadingType === action.type;
          const icons: Record<string, string> = { water: '💧', sunlight: '☀️', love: '❤️' };

          return (
            <button
              key={action.type}
              onClick={() => handleCare(action.type)}
              disabled={done || loading || isLoading}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 min-h-[44px] ${
                done
                  ? 'bg-sage/10 border-sage-light/30 text-sage'
                  : `bg-white border-blush-soft/40 text-charcoal ${action.color}`
              } disabled:cursor-not-allowed`}
              aria-label={done ? `${action.label} completed today` : `Give ${action.label}`}
            >
              <span className="text-xl" aria-hidden="true">{icons[action.type]}</span>
              <span className="text-xs font-medium">
                {done ? 'Done' : loading ? '...' : action.label}
              </span>
              {!done && <span className="text-[10px] text-taupe-light">{action.xp}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
