'use client';

import { useState, useEffect } from 'react';
import FlowerVisual from '@/components/flower/FlowerVisual';
import CareActions from '@/components/care/CareActions';
import HealthBadge from '@/components/ui/HealthBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import RewardsList from '@/components/ui/RewardsList';
import Card from '@/components/ui/Card';

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

function getHealthMessage(health: string): string {
  switch (health) {
    case 'healthy': return "She's doing well.";
    case 'thirsty': return "She could use some water.";
    case 'wilting': return "She needs your care.";
    case 'reviving': return "She's recovering.";
    default: return "She's doing well.";
  }
}

export default function RecipientPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState('');
  const [data, setData] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careMessage, setCareMessage] = useState<string | null>(null);
  const [newReward, setNewReward] = useState<GiftData['newlyUnlocked'][0] | null>(null);
  const [showCarePanel, setShowCarePanel] = useState(false);

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

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <FlowerVisual stage="seed" health="healthy" flowerType="rose" size="sm" />
          <p className="text-taupe">Loading your flower...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-warm-blush flex items-center justify-center">
            <span className="text-2xl" aria-hidden="true">🥀</span>
          </div>
          <h1 className="font-serif text-xl text-charcoal">This flower could not be found.</h1>
          <p className="text-taupe text-sm">The link may be incorrect or the flower may have been removed.</p>
        </div>
      </main>
    );
  }

  // Future state
  if (data.isFuture) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-sm animate-fade-in">
          <FlowerVisual stage="seed" health="healthy" flowerType={data.gift.flowerType as never} size="md" />
          <div>
            <h1 className="font-serif text-xl text-charcoal mb-2">
              {data.gift.flowerName} is waiting to be planted.
            </h1>
            <p className="text-taupe text-sm">This flower will begin growing on {data.gift.startDate}.</p>
          </div>
        </div>
      </main>
    );
  }

  const isBloomingDay = data.isBlooming || data.currentDay >= 30;

  return (
    <main className="min-h-screen bg-cream pb-24 sm:pb-8">
      <div className="max-w-lg mx-auto px-6 py-6 sm:py-10">
        {/* Greeting */}
        <div className="text-center space-y-1 mb-6 animate-fade-in">
          <p className="text-sm text-taupe-light">For</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">{data.gift.recipientName} ♡</h1>
        </div>

        {/* Flower hero — full width, dominant */}
        <div className={`flex justify-center mb-6 ${isBloomingDay ? 'animate-bloom' : 'animate-float'}`}>
          <FlowerVisual
            stage={data.stage as never}
            health={data.health as never}
            flowerType={data.gift.flowerType as never}
            isBlooming={data.isBlooming}
            size="xl"
            showParticles={isBloomingDay}
          />
        </div>

        {/* Flower name + status */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="font-serif text-xl text-charcoal">{data.gift.flowerName}</h2>
          <p className="text-sm text-taupe">Day {data.currentDay} of 30</p>
          <HealthBadge health={data.health as never} />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar current={data.currentDay} total={30} />
        </div>

        {/* Personal message */}
        {data.gift.personalMessage && (
          <Card className="p-5 mb-6 text-center">
            <p className="font-serif text-charcoal italic leading-relaxed">
              &ldquo;{data.gift.personalMessage}&rdquo;
            </p>
          </Card>
        )}

        {/* Care panel */}
        <div className="mb-6">
          <Card className="p-5">
            <CareActions
              todayCare={data.todayCare}
              onCare={handleCare}
              isLoading={loading}
            />
          </Card>
        </div>

        {/* Care feedback */}
        {careMessage && (
          <div
            className="mb-6 bg-sage/10 border border-sage-light/30 text-sage text-center py-3 px-4 rounded-xl text-sm font-medium animate-slide-in"
            role="status"
            aria-live="polite"
          >
            {careMessage}
          </div>
        )}

        {/* New reward popup */}
        {newReward && (
          <div
            className="mb-6 bg-gold/10 border border-gold-light/30 text-center py-4 px-5 rounded-2xl shadow-md animate-slide-in"
            role="alert"
          >
            <p className="text-2xl mb-1" aria-hidden="true">{newReward.icon}</p>
            <p className="font-serif font-bold text-charcoal">{newReward.title}</p>
            <p className="text-sm text-taupe">{newReward.description}</p>
          </div>
        )}

        {/* Stats — subtle, emotional */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="font-serif text-2xl text-charcoal">{data.streak}</p>
            <p className="text-xs text-taupe-light">days together</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="font-serif text-2xl text-charcoal">{data.totalXp}</p>
            <p className="text-xs text-taupe-light">total care</p>
          </Card>
        </div>

        {/* Streak encouragement */}
        {data.streak >= 3 && (
          <Card className="p-4 mb-6 text-center bg-warm-blush/30 border-blush/20">
            <p className="text-sm text-taupe">
              You&apos;re taking good care of {data.gift.flowerName}.
            </p>
          </Card>
        )}

        {/* Milestones */}
        <Card className="p-5 mb-6">
          <RewardsList rewards={data.rewards} />
        </Card>

        {/* Bloom message — Day 30 */}
        {isBloomingDay && (
          <Card className="p-6 mb-6 bg-warm-blush/50 border-blush/30 text-center space-y-3 animate-bloom">
            <p className="text-3xl" aria-hidden="true">🌸</p>
            <h2 className="font-serif text-lg text-charcoal">
              {data.gift.flowerName} has bloomed.
            </h2>
            <p className="font-serif text-charcoal italic leading-relaxed">
              &ldquo;{data.gift.bloomMessage}&rdquo;
            </p>
            {data.gift.giverName && (
              <p className="text-sm text-taupe-light">With love, {data.gift.giverName}</p>
            )}
          </Card>
        )}

        {/* Footer */}
        <p className="text-xs text-taupe-light text-center pt-4">
          Digital Flower
        </p>
      </div>

      {/* Sticky mobile care bar */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden bg-white/95 backdrop-blur-sm border-t border-blush-soft/30 px-6 py-3 safe-area-bottom">
        <button
          onClick={() => setShowCarePanel(!showCarePanel)}
          className="w-full py-3.5 bg-rose text-white font-medium rounded-xl active:scale-[0.97] transition-all min-h-[48px]"
        >
          {data.todayCare.length >= 3 ? 'All care done today ✓' : 'Give care 💧'}
        </button>
      </div>
    </main>
  );
}
