'use client';

import { useState } from 'react';
import type { HealthState } from '@/types';
import Button from '@/components/ui/Button';

interface CareActionsProps {
  recipientTimezone: string;
  lastWateredAt: string | null;
  flowerHealth: number;
  giftToken: string;
}

export default function CareActions({ recipientTimezone, lastWateredAt, flowerHealth, giftToken }: CareActionsProps) {
  const [canWater, setCanWater] = useState(() => {
    if (!lastWateredAt) return true;
    const last = new Date(lastWateredAt);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= 20;
  });
  const [watering, setWatering] = useState(false);
  const [careResult, setCareResult] = useState<{ success: boolean; xpEarned: number; streak?: number } | null>(null);
  const [encouragement, setEncouragement] = useState('');

  const healthState: HealthState = flowerHealth >= 70 ? 'healthy' : flowerHealth >= 40 ? 'thirsty' : 'wilting';

  const water = async () => {
    if (watering || !canWater) return;
    setWatering(true);
    setCareResult(null);
    setEncouragement('');

    try {
      const response = await fetch('/api/care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftToken, careType: 'water', recipientTimezone }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      setCareResult({ success: true, xpEarned: result.xpEarned || 10, streak: result.streak });
      setCanWater(false);
      setEncouragement(getEncouragement(result.streak || 0));
    } catch {
      setCareResult({ success: false, xpEarned: 0 });
      setEncouragement('');
    } finally {
      setWatering(false);
    }
  };

  const getEncouragement = (streak: number): string => {
    if (streak >= 7) return 'A whole week of love. Your flower is thriving. 🌻';
    if (streak >= 3) return 'Beautiful consistency. Keep going. 🌱';
    return 'A little love goes a long way. 💛';
  };

  return (
    <div className="space-y-5">
      {/* Primary Action: Water */}
      <div className="text-center space-y-3">
        {canWater ? (
          <Button
            onClick={water}
            disabled={watering}
            size="lg"
            className="w-full text-lg px-8 py-5 min-h-[60px]"
            arrow={!watering}
          >
            {watering ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Watering...
              </span>
            ) : (
              <>
                <span aria-hidden="true" className="text-xl">💧</span>
                Water {encouragement ? 'Again' : 'Your Flower'}
              </>
            )}
          </Button>
        ) : (
          <Button disabled size="lg" className="w-full text-lg px-8 py-5 min-h-[60px] opacity-60 cursor-not-allowed">
            <span aria-hidden="true" className="text-xl">✓</span>
            Watered Today
          </Button>
        )}
      </div>

      {/* Care Result Feedback */}
      {careResult && (
        <div className={`p-4 rounded-2xl text-center animate-fade-in ${
          careResult.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
        }`}>
          {careResult.success ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-800">+{careResult.xpEarned} XP earned</p>
              {careResult.streak !== undefined && (
                <p className="text-xs text-green-600">Streak: {careResult.streak} {careResult.streak === 1 ? 'day' : 'days'}</p>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-red-800">Couldn&apos;t water — please try again.</p>
          )}
        </div>
      )}

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ text: `A flower is growing for you 🌱` });
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blush-soft/60 rounded-2xl text-sm font-medium text-charcoal hover:border-blush hover:bg-cream-deep transition-all min-h-[48px] cursor-pointer"
        >
          <span aria-hidden="true">📤</span>
          Share
        </button>
        <button
          onClick={() => {
            if (navigator.clipboard && window.location.href) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blush-soft/60 rounded-2xl text-sm font-medium text-charcoal hover:border-blush hover:bg-cream-deep transition-all min-h-[48px] cursor-pointer"
        >
          <span aria-hidden="true">🔗</span>
          Copy Link
        </button>
      </div>

      {/* Status Messages */}
      {healthState === 'thirsty' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
          <p className="text-sm font-medium text-amber-800">This flower needs attention</p>
          <p className="text-xs text-amber-600 mt-1">Water it to help it recover.</p>
        </div>
      )}

      {healthState === 'wilting' && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-center">
          <p className="text-sm font-medium text-red-800">This flower is fading</p>
          <p className="text-xs text-red-600 mt-1">Water it now to help it recover.</p>
        </div>
      )}

      {/* Growth Milestones */}
      {careResult?.success && careResult.streak !== undefined && careResult.streak > 0 && (
        <div className="space-y-2">
          {[7, 14, 21, 28].filter(m => careResult.streak! >= m).reverse().slice(0, 1).map(milestone => (
            <div key={milestone} className="p-3 rounded-2xl bg-green-50 border border-green-100 text-center animate-fade-in">
              <p className="text-xs text-green-600">🎉 {milestone} day streak!</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
