'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import FlowerVisual from '@/components/flower/FlowerVisual';
import HealthBadge from '@/components/ui/HealthBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import RewardsList from '@/components/ui/RewardsList';
import CareActions from '@/components/care/CareActions';
import { calculateFlowerDay, getGrowthStage } from '@/lib/flower/day';
import { getHealthState, getRevivingHealth } from '@/lib/flower/health';
import type { FlowerType, GrowthStage, HealthState } from '@/types';

export default function GiftPage() {
  const params = useParams<{ token: string }>();
  const [gift, setGift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/gift/${params.token}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setGift(data.gift);
      } catch (err: any) {
        setError(err.message || 'Failed to load gift');
      } finally {
        setLoading(false);
      }
    }
    if (params.token) load();
  }, [params.token]);

  const { currentDay, growthStage, healthState, progress, bloomMessage, hasOpenedBloom, personalMessage } = useMemo(() => {
    if (!gift) return { currentDay: 0, growthStage: 'seed' as GrowthStage, healthState: 'healthy' as HealthState, progress: 0, bloomMessage: '', hasOpenedBloom: false, personalMessage: '' };
    const now = new Date().toISOString().slice(0, 10);
    const currentDay = calculateFlowerDay(gift.startDate, now);
    const growthStage = getGrowthStage(currentDay);
    const lastCare = gift.lastWateredAt || gift.last_care_date || null;
    const prevHealth = (gift.healthState || gift.health || 'healthy') as HealthState;
    const healthState = lastCare
      ? getRevivingHealth(lastCare, now, prevHealth)
      : getHealthState(null, now);
    const progress = Math.min(100, Math.max(0, (currentDay / 30) * 100));
    const bloomMessage = gift.bloomMessage || gift.bloom_message || '';
    const hasOpenedBloom = gift.hasOpenedBloom || false;
    const personalMessage = gift.personalMessage || gift.personal_message || '';
    return { currentDay, growthStage, healthState, progress, bloomMessage, hasOpenedBloom, personalMessage };
  }, [gift]);

  const showBloom = hasOpenedBloom || currentDay >= 30;
  const flowerType = gift?.flowerType || gift?.flower_type || 'rose';
  const rewardKeys = useMemo(() => {
    if (!gift?.rewards) return [];
    return gift.rewards.map((r: any) => r.reward_key || r.rewardKey);
  }, [gift]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-6 h-6 border-2 border-blush border-t-rose rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-taupe">Loading your flower...</p>
        </div>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="text-4xl">🥀</div>
          <h1 className="font-serif text-2xl text-charcoal">This flower couldn&apos;t be found</h1>
          <p className="text-sm text-taupe leading-relaxed">It may have been removed, or the link may be incorrect.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-6 pt-10 sm:pt-14 pb-10 flex flex-col items-center text-center space-y-4">
        <div className="animate-float">
          <FlowerVisual stage={growthStage} health={healthState} flowerType={flowerType as FlowerType} size="lg" showParticles={currentDay >= 30} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">{gift.flowerName || gift.flower_name}</h1>
        <p className="text-sm text-taupe">For <span className="text-rose font-medium">{gift.recipientName || gift.recipient_name}</span> from {gift.giverName || gift.giver_name || 'someone special'}</p>
        <HealthBadge health={healthState} />
      </section>

      <div className="max-w-lg mx-auto px-6 pb-20 space-y-6">
        {/* Personal Message */}
        {personalMessage && (
          <section className="p-5 rounded-2xl bg-warm-blush/50 border border-blush/20 text-center animate-fade-in space-y-2">
            <p className="font-serif text-charcoal italic leading-relaxed">&ldquo;{personalMessage}&rdquo;</p>
          </section>
        )}

        {/* Growth Timeline */}
        <section className="p-5 rounded-2xl bg-white border border-blush-soft/30 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-charcoal">Growth</h2>
            <p className="text-xs text-taupe">Day {currentDay} of 30</p>
          </div>
          <ProgressBar current={currentDay} total={30} />
        </section>

        {/* Bloom Message (Day 30) */}
        {showBloom && bloomMessage && (
          <section className="p-5 rounded-2xl bg-warm-blush/50 border border-blush/20 text-center space-y-2 animate-fade-in">
            <p className="text-xs text-taupe uppercase tracking-widest">Bloom Message</p>
            <p className="font-serif text-charcoal italic leading-relaxed">&ldquo;{bloomMessage}&rdquo;</p>
          </section>
        )}

        {/* Rewards */}
        {rewardKeys.length > 0 && (
          <section className="space-y-3">
            <RewardsList rewards={rewardKeys} />
          </section>
        )}

        {/* Care Actions */}
        <section>
          <CareActions
            recipientTimezone={gift.recipientTimezone || gift.recipient_timezone || 'Asia/Manila'}
            lastWateredAt={gift.lastWateredAt || gift.last_care_date || null}
            flowerHealth={gift.health || 80}
            giftToken={params.token}
          />
        </section>
      </div>
    </main>
  );
}
