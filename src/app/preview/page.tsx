'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowerVisual from '@/components/flower/FlowerVisual';
import { getFlowerConfig } from '@/lib/flower/config';
import type { CreateGiftInput } from '@/lib/validation/schemas';
import type { FlowerType } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

function getInitialPreview(): CreateGiftInput | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('giftPreview');
  return stored ? JSON.parse(stored) : null;
}

const GROWTH_STAGES = [
  { day: 1, emoji: '🌱', label: 'Day 1' },
  { day: 7, emoji: '🌿', label: 'Day 7' },
  { day: 14, emoji: '🌿', label: 'Day 14' },
  { day: 21, emoji: '🌷', label: 'Day 21' },
  { day: 30, emoji: '🌸', label: 'Day 30' },
];

export default function PreviewPage() {
  const router = useRouter();
  const [previewData] = useState<CreateGiftInput | null>(getInitialPreview);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBloomMessage, setShowBloomMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!previewData) {
    if (typeof window !== 'undefined') router.replace('/create');
    return null;
  }

  const config = getFlowerConfig(previewData.flowerType as FlowerType);

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      sessionStorage.removeItem('giftPreview');
      sessionStorage.setItem('giftCreated', JSON.stringify({
        url: data.url, token: data.token,
        flowerName: previewData.flowerName, recipientName: previewData.recipientName,
      }));
      router.push('/preview?created=true');
    } catch { setError('Network error. Please try again.'); }
    finally { setIsCreating(false); }
  };

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isCreated = params?.get('created') === 'true';

  if (isCreated) {
    const created = JSON.parse(sessionStorage.getItem('giftCreated') || '{}');
    const fullUrl = `${window.location.origin}${created.url}`;

    const handleCopy = async () => {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
      if (navigator.share) {
        await navigator.share({ title: `A flower for ${created.recipientName}`, text: `I made a flower for you 🌸`, url: fullUrl });
      }
    };

    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <FlowerVisual stage="bloom" health="healthy" flowerType={previewData.flowerType as FlowerType} size="lg" showParticles />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-charcoal">Your flower is ready.</h1>
            <p className="text-taupe">Now all it needs is someone to care for it.</p>
          </div>

          <Card className="p-5 space-y-3">
            <p className="text-xs text-taupe-light uppercase tracking-wide">Private gift link</p>
            <p className="text-sm font-mono text-taupe break-all bg-cream-deep rounded-lg p-3">{fullUrl}</p>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleCopy}>
              {copied ? 'Copied ✓' : 'Copy Link'}
            </Button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button className="flex-1" onClick={handleShare}>
                Share the Flower
              </Button>
            )}
          </div>

          <p className="text-xs text-taupe-light">
            This link is private. Anyone who has it can view and care for this flower.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 py-8 sm:py-12">
        <button onClick={() => router.back()} className="text-sm text-taupe hover:text-charcoal mb-8 min-h-[44px] inline-flex items-center transition-colors">
          ← Back to edit
        </button>

        <div className="space-y-6">
          {/* Hero preview */}
          <div className="text-center space-y-4">
            <FlowerVisual stage="sprout" health="healthy" flowerType={previewData.flowerType as FlowerType} size="md" />
            <div>
              <p className="text-xs text-taupe-light uppercase tracking-wide mb-1">A flower for</p>
              <p className="font-serif text-2xl text-charcoal">{previewData.recipientName}</p>
            </div>
          </div>

          {/* Message */}
          <Card className="p-6 text-center">
            <p className="font-serif text-lg text-charcoal italic leading-relaxed">
              &ldquo;{previewData.personalMessage}&rdquo;
            </p>
          </Card>

          {/* Details */}
          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-taupe-light text-xs uppercase tracking-wide">Flower</p>
                <p className="font-medium text-charcoal">{config.name}</p>
              </div>
              <div>
                <p className="text-taupe-light text-xs uppercase tracking-wide">Name</p>
                <p className="font-medium text-charcoal">{previewData.flowerName}</p>
              </div>
              <div>
                <p className="text-taupe-light text-xs uppercase tracking-wide">Start</p>
                <p className="font-medium text-charcoal">{previewData.startDate}</p>
              </div>
              {previewData.giverName && (
                <div>
                  <p className="text-taupe-light text-xs uppercase tracking-wide">From</p>
                  <p className="font-medium text-charcoal">{previewData.giverName}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Growth timeline */}
          <div className="space-y-3">
            <p className="text-sm text-taupe text-center">30 days from now...</p>
            <div className="flex items-center justify-between px-2">
              {GROWTH_STAGES.map((s, i) => (
                <div key={s.day} className="flex flex-col items-center gap-1">
                  <span className="text-xl" aria-hidden="true">{s.emoji}</span>
                  <span className="text-[10px] text-taupe-light">{s.label}</span>
                </div>
              ))}
            </div>
            {/* Connecting line */}
            <div className="relative h-0.5 bg-blush-soft/40 rounded-full mx-8 -mt-6 mb-2">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-sage to-rose rounded-full" />
            </div>
          </div>

          {/* Bloom message */}
          <Card className="p-5">
            <button
              onClick={() => setShowBloomMessage(!showBloomMessage)}
              className="w-full flex items-center justify-between text-left min-h-[44px]"
            >
              <div>
                <p className="text-sm font-medium text-charcoal">Bloom message</p>
                <p className="text-xs text-taupe-light">Hidden until Day 30</p>
              </div>
              <span className="text-taupe-light text-sm">{showBloomMessage ? '▲' : '▼'}</span>
            </button>
            {showBloomMessage && (
              <div className="mt-3 pt-3 border-t border-blush-soft/30 animate-fade-in">
                <p className="font-serif text-charcoal italic">&ldquo;{previewData.bloomMessage}&rdquo;</p>
              </div>
            )}
          </Card>

          {error && (
            <Card className="p-4 bg-rose/5 border-rose/20 text-center">
              <p className="text-sm text-rose">{error}</p>
            </Card>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => router.push('/create')}>
              Edit
            </Button>
            <Button className="flex-1" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create My Flower'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
