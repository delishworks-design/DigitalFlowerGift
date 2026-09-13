'use client';

import { useState, useEffect } from 'react';
import FlowerVisual from '@/components/flower/FlowerVisual';
import CareActions from '@/components/care/CareActions';
import HealthBadge from '@/components/ui/HealthBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import RewardsList from '@/components/ui/RewardsList';

interface GiftData {
  gift: {
    id: string;
    recipientName: string;
    giverName: string | null;
    flowerType: string;
    flowerName: string;
    personalMessage: string;
    bloomMessage: string;
    startDate: string;
  };
  currentDay: number;
  stage: string;
  stageLabel: string;
  health: string;
  totalXp: number;
  streak: number;
  todayCare: string[];
  todayXp: number;
  isBlooming: boolean;
  isFuture: boolean;
  rewards: string[];
  newlyUnlocked: { key: string; title: string; description: string; icon: string }[];
}

async function fetchGiftData(token: string): Promise<{ data: GiftData | null; error: string | null }> {
  try {
    const res = await fetch(`/api/gifts/${token}`);
    if (!res.ok) {
      const errData = await res.json();
      return { data: null, error: errData.error || 'This flower could not be found.' };
    }
    return { data: await res.json(), error: null };
  } catch {
    return { data: null, error: 'Something went wrong. Please try again.' };
  }
}

export default function RecipientPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>('');
  const [data, setData] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careMessage, setCareMessage] = useState<string | null>(null);
  const [newReward, setNewReward] = useState<GiftData['newlyUnlocked'][0] | null>(null);

  useEffect(() => {
    let cancelled = false;
    params.then((p) => {
      if (cancelled) return;
      setToken(p.token);
      fetchGiftData(p.token).then(({ data: giftData, error: err }) => {
        if (cancelled) return;
        if (err) setError(err);
        else setData(giftData);
        setLoading(false);
      });
    });
    return () => { cancelled = true; };
  }, [params]);

  const handleCare = async (type: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/gifts/${token}/care`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const result = await res.json();

      if (!res.ok) {
        setCareMessage(result.error || 'Something went wrong.');
        setTimeout(() => setCareMessage(null), 3000);
        return;
      }

      setCareMessage(`+${result.xpAwarded} XP — ${result.message}`);
      setTimeout(() => setCareMessage(null), 3000);

      if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
        setNewReward(result.newlyUnlocked[0]);
        setTimeout(() => setNewReward(null), 5000);
      }

      const { data: newData, error: fetchError } = await fetchGiftData(token);
      if (fetchError) setError(fetchError);
      else setData(newData);
    } catch {
      setCareMessage("Couldn't save that right now. Please try again.");
      setTimeout(() => setCareMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-float" aria-hidden="true">🌱</div>
          <p className="text-gray-400">Loading your flower...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-4xl" aria-hidden="true">🥀</div>
          <h1 className="text-xl font-bold text-gray-800">This flower could not be found.</h1>
          <p className="text-gray-500">The link may be incorrect or the flower may have been removed.</p>
        </div>
      </main>
    );
  }

  if (data.isFuture) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <FlowerVisual stage="seed" health="healthy" flowerType={data.gift.flowerType as never} />
          <h1 className="text-xl font-bold text-gray-800">
            {data.gift.flowerName} is waiting to be planted.
          </h1>
          <p className="text-gray-500">
            This flower will begin growing on {data.gift.startDate}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFE4E6] pb-8">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Greeting */}
        <div className="text-center space-y-1">
          <h1 className="text-xl text-gray-500">A flower for</h1>
          <p className="text-2xl font-bold text-gray-800">{data.gift.recipientName}</p>
        </div>

        {/* Flower */}
        <div className="bg-white/60 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
          <FlowerVisual
            stage={data.currentDay >= 30 ? 'mature' : data.stage as never}
            health={data.health as never}
            flowerType={data.gift.flowerType as never}
            isBlooming={data.isBlooming}
          />
        </div>

        {/* Flower Info */}
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-800">{data.gift.flowerName}</p>
          <p className="text-sm text-gray-500">
            Day {data.currentDay} · {data.stageLabel}
          </p>
          <HealthBadge health={data.health as never} />
        </div>

        {/* Personal Message */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 italic leading-relaxed">
            &ldquo;{data.gift.personalMessage}&rdquo;
          </p>
        </div>

        {/* Progress */}
        <ProgressBar current={data.currentDay} total={30} />

        {/* Care Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <CareActions
            todayCare={data.todayCare}
            onCare={handleCare}
            isLoading={loading}
          />
        </div>

        {/* Care feedback */}
        {careMessage && (
          <div
            className="bg-green-50 border border-green-200 text-green-700 text-center py-3 px-4 rounded-xl text-sm font-medium animate-in"
            role="status"
            aria-live="polite"
          >
            {careMessage}
          </div>
        )}

        {/* New reward popup */}
        {newReward && (
          <div
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center py-4 px-5 rounded-2xl shadow-lg animate-in"
            role="alert"
          >
            <p className="text-2xl mb-1">{newReward.icon}</p>
            <p className="font-bold text-amber-800">{newReward.title}</p>
            <p className="text-sm text-amber-600">{newReward.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-800">{data.streak}</p>
            <p className="text-xs text-gray-500">🔥 Day Streak</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-800">{data.totalXp}</p>
            <p className="text-xs text-gray-500">⭐ Total XP</p>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <RewardsList rewards={data.rewards} />
        </div>

        {/* Bloom Message */}
        {data.currentDay >= 30 && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 text-center space-y-3">
            <p className="text-3xl" aria-hidden="true">🌸</p>
            <h2 className="text-lg font-bold text-gray-800">
              {data.gift.flowerName} has bloomed!
            </h2>
            <p className="text-gray-600 italic leading-relaxed">
              &ldquo;{data.gift.bloomMessage}&rdquo;
            </p>
            {data.gift.giverName && (
              <p className="text-sm text-gray-500">With love, {data.gift.giverName}</p>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center pt-4">
          Digital Flower Gift 🌸
        </p>
      </div>
    </main>
  );
}
