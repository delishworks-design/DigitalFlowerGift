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
    { type: 'water', icon: '💧', label: 'Water', xp: '+10 XP' },
    { type: 'sunlight', icon: '☀️', label: 'Sunshine', xp: '+5 XP' },
    { type: 'love', icon: '❤️', label: 'Love', xp: '+5 XP' },
  ];

  const handleCare = async (type: string) => {
    setLoadingType(type);
    try {
      await onCare(type);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 text-center">Daily Care</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const done = todayCare.includes(action.type);
          const loading = loadingType === action.type;

          return (
            <button
              key={action.type}
              onClick={() => handleCare(action.type)}
              disabled={done || loading || isLoading}
              className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all duration-200 min-h-[44px] ${
                done
                  ? 'bg-green-50 border-2 border-green-200 text-green-700'
                  : 'bg-white border-2 border-gray-100 hover:border-[#6BA368] hover:bg-green-50 active:scale-95 text-gray-700'
              } disabled:cursor-not-allowed shadow-sm`}
              aria-label={done ? `${action.label} completed today` : `Give ${action.label}`}
            >
              <span className="text-2xl" aria-hidden="true">{action.icon}</span>
              <span className="text-xs font-medium">
                {done ? 'Done' : loading ? '...' : action.label}
              </span>
              {!done && <span className="text-[10px] text-gray-400">{action.xp}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
