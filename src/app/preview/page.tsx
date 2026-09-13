'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowerVisual from '@/components/flower/FlowerVisual';
import { getFlowerConfig } from '@/lib/flower/config';
import type { CreateGiftInput } from '@/lib/validation/schemas';
import type { FlowerType } from '@/types';

function getInitialPreview(): CreateGiftInput | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('giftPreview');
  return stored ? JSON.parse(stored) : null;
}

export default function PreviewPage() {
  const router = useRouter();
  const [previewData] = useState<CreateGiftInput | null>(getInitialPreview);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!previewData) {
    if (typeof window !== 'undefined') {
      router.replace('/create');
    }
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

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      sessionStorage.removeItem('giftPreview');
      sessionStorage.setItem('giftCreated', JSON.stringify({
        url: data.url,
        token: data.token,
        flowerName: previewData.flowerName,
        recipientName: previewData.recipientName,
      }));
      router.push('/preview?created=true');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isCreated = params?.get('created') === 'true';

  if (isCreated) {
    const created = JSON.parse(sessionStorage.getItem('giftCreated') || '{}');
    const fullUrl = `${window.location.origin}${created.url}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(fullUrl);
    };

    const handleShare = async () => {
      if (navigator.share) {
        await navigator.share({
          title: `A flower for ${created.recipientName}`,
          text: `I made a flower for you 🌸`,
          url: fullUrl,
        });
      }
    };

    return (
      <main className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-5xl animate-float" aria-hidden="true">🌸</div>
          <h1 className="text-2xl font-bold text-gray-800">Your flower is ready!</h1>
          <p className="text-gray-500">Share this private link with {created.recipientName}.</p>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400 mb-2">Private gift link</p>
            <p className="text-sm font-mono text-gray-700 break-all">{fullUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all min-h-[44px]"
            >
              Copy Link
            </button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-[#E8637A] hover:bg-[#C94862] text-white font-medium rounded-xl transition-all min-h-[44px]"
              >
                Share
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400">
            This link is private. Anyone who has it can view and care for this flower.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 min-h-[44px] inline-flex items-center"
        >
          ← Back to edit
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Preview</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <FlowerVisual
              stage="sprout"
              health="healthy"
              flowerType={previewData.flowerType as FlowerType}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">A flower for</p>
              <p className="text-xl font-bold text-gray-800">{previewData.recipientName}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 italic">&ldquo;{previewData.personalMessage}&rdquo;</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Flower</p>
                <p className="font-medium text-gray-700">{config.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-medium text-gray-700">{previewData.flowerName}</p>
              </div>
              <div>
                <p className="text-gray-400">Start</p>
                <p className="font-medium text-gray-700">{previewData.startDate}</p>
              </div>
              {previewData.giverName && (
                <div>
                  <p className="text-gray-400">From</p>
                  <p className="font-medium text-gray-700">{previewData.giverName}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Bloom message (Day 30)</p>
              <p className="text-sm text-gray-600 italic">&ldquo;{previewData.bloomMessage}&rdquo;</p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full py-4 bg-[#E8637A] hover:bg-[#C94862] disabled:bg-gray-300 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-lg min-h-[56px]"
          >
            {isCreating ? 'Creating...' : 'Create Flower'}
          </button>
        </div>
      </div>
    </main>
  );
}
