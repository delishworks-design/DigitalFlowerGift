'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateGiftInput } from '@/lib/validation/schemas';
import type { FlowerType } from '@/types';
import { FLOWER_CONFIGS } from '@/lib/flower/config';
import { calculateFlowerDay, getGrowthStage } from '@/lib/flower/day';
import FlowerVisual from '@/components/flower/FlowerVisual';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function PreviewPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<CreateGiftInput | null>(null);
  const [days, setDays] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('giftPreview');
    if (!raw) { router.replace('/create'); return; }
    const parsed = JSON.parse(raw) as CreateGiftInput;
    setPreview(parsed);

    const start = new Date(parsed.startDate);
    const diff = Math.floor((Date.now() - start.getTime()) / 86400000);
    setDays(Math.max(0, Math.min(30, diff)));

    return () => sessionStorage.removeItem('giftPreview');
  }, [router]);

  const stage = useMemo(() => {
    if (!preview) return 'seed';
    return getGrowthStage(days);
  }, [days, preview]);

  const flowerName = preview?.flowerName || '';
  const previewFlowerType = (preview?.flowerType as FlowerType) || 'rose';
  const pct = Math.min(100, Math.max(0, (days / 30) * 100));
  const previewStage = days === 30 ? 'bloom' : stage;

  const handleConfirm = async () => {
    if (!preview || isCreating) return;
    setIsCreating(true);
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preview),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to create gift');
      const token = result.gift.token || result.gift.secureToken;
      const url = `${window.location.origin}/g/${token}`;
      setShareUrl(url);
      sessionStorage.removeItem('giftPreview');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const share = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ text: `A flower is growing for you — open when you're ready 🌱` });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied!');
      }
    } catch { /* ignore */ }
  };

  if (!preview || !shareUrl) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center text-taupe animate-fade-in">
          <div className="w-6 h-6 border-2 border-blush border-t-rose rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading preview...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 pt-10 sm:pt-16 pb-20 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-sm text-taupe-light uppercase tracking-widest">Preview</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Here&apos;s your flower</h1>
        </div>

        {/* Hero Flower */}
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <FlowerVisual stage={previewStage} health="healthy" flowerType={previewFlowerType} size="lg" />
          <div className="text-center space-y-1">
            <p className="font-serif text-2xl text-charcoal">{flowerName}</p>
            <p className="text-sm text-taupe">For <span className="text-rose font-medium">{preview.recipientName}</span></p>
          </div>
        </div>

        {/* Growth Timeline */}
        <Card className="p-6 space-y-5">
          <h3 className="font-serif text-lg text-charcoal text-center">Growth Timeline</h3>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-3 bg-cream-deep rounded-full overflow-hidden">
              <div className="h-full bg-rose rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-taupe">
              <span>Day 0</span>
              <span className="font-medium text-rose">{days} of 30</span>
              <span>Day 30</span>
            </div>
          </div>

          {/* Stage milestones */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Days 1–8', stage: 'Seed', icon: '·' },
              { label: 'Days 9–21', stage: 'Growing', icon: '↑' },
              { label: 'Days 22–29', stage: 'Budding', icon: '◉' },
            ].map((m) => (
              <div key={m.stage} className={`p-3 rounded-xl border transition-colors ${
                stage === m.stage.toLowerCase().replace('ing', '').replace('seed', 'seed').replace('bud', 'bud')
                  ? 'border-rose bg-rose/5 text-rose'
                  : 'border-blush-soft/30 text-taupe-light'
              }`}>
                <p className="text-lg mb-0.5">{m.icon}</p>
                <p className="text-xs font-medium">{m.stage}</p>
                <p className="text-xs">{m.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Bloom Message (secret) */}
        {preview.bloomMessage && (
          <Card className="p-6 bg-warm-blush/50 border-blush/30 text-center space-y-2">
            <p className="text-xs text-taupe uppercase tracking-widest">Bloom Message (hidden until Day 30)</p>
            <p className="font-serif text-charcoal italic leading-relaxed">&ldquo;{preview.bloomMessage}&rdquo;</p>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleConfirm} size="lg" disabled={isCreating} className="w-full" arrow={!isCreating}>
            {isCreating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Planting...
              </span>
            ) : (
              'Plant the Flower'
            )}
          </Button>
          <Button onClick={share} size="lg" variant="secondary" className="w-full">
            {shareUrl ? 'Share Link' : 'Copy Link'}
          </Button>
          <p className="text-center text-xs text-taupe-light">Don&apos;t close this — the link won&apos;t show again.</p>
          <button
            onClick={() => router.push('/create')}
            className="block w-full text-center text-sm text-taupe hover:text-charcoal py-2 transition-colors cursor-pointer"
          >
            ← Back to edit
          </button>
        </div>
      </div>
    </main>
  );
}
