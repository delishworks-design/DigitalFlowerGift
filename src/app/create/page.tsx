'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createGiftSchema, type CreateGiftInput } from '@/lib/validation/schemas';
import { getCurrentDate } from '@/lib/time/date';
import type { FlowerType } from '@/types';
import FlowerVisual from '@/components/flower/FlowerVisual';
import StepIndicator from '@/components/ui/StepIndicator';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

const FLOWERS: { type: FlowerType; name: string; personality: string; colors: string[] }[] = [
  { type: 'rose', name: 'Rose', personality: 'Warm & heartfelt', colors: ['bg-rose-petal/10 border-rose-petal/20'] },
  { type: 'sunflower', name: 'Sunflower', personality: 'Bright & joyful', colors: ['bg-sunflower-petal/10 border-sunflower-petal/20'] },
  { type: 'tulip', name: 'Tulip', personality: 'Sweet & sincere', colors: ['bg-tulip-petal/10 border-tulip-petal/20'] },
  { type: 'daisy', name: 'Daisy', personality: 'Simple & cheerful', colors: ['bg-gray-50 border-gray-200'] },
  { type: 'lavender', name: 'Lavender', personality: 'Calm & gentle', colors: ['bg-lavender-petal/10 border-lavender-petal/20'] },
];

const STEP_LABELS = ['Flower', 'Name', 'For', 'Message', 'Bloom', 'Date'];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateGiftInput>({
    flowerType: 'rose',
    flowerName: '',
    recipientName: '',
    giverName: '',
    personalMessage: '',
    bloomMessage: '',
    startDate: getCurrentDate(),
    recipientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateGiftInput, string>>>({});

  const totalSteps = 6;

  const updateField = useCallback(<K extends keyof CreateGiftInput>(field: K, value: CreateGiftInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, [errors]);

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof CreateGiftInput, string>> = {};
    switch (s) {
      case 2:
        if (!form.flowerName.trim()) newErrors.flowerName = 'Please give your flower a name.';
        break;
      case 3:
        if (!form.recipientName.trim()) newErrors.recipientName = "Please enter their name.";
        break;
      case 4:
        if (!form.personalMessage.trim()) newErrors.personalMessage = 'Please write a message.';
        break;
      case 5:
        if (!form.bloomMessage.trim()) newErrors.bloomMessage = 'Please write a bloom message.';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step < totalSteps && validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handlePreview = () => {
    const fullParse = createGiftSchema.safeParse(form);
    if (!fullParse.success) {
      const fieldErrors: Partial<Record<keyof CreateGiftInput, string>> = {};
      fullParse.error.issues.forEach((err) => {
        const field = err.path[0] as keyof CreateGiftInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    sessionStorage.setItem('giftPreview', JSON.stringify(fullParse.data));
    router.push('/preview');
  };

  const selectedFlower = FLOWERS.find((f) => f.type === form.flowerType)!;

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-taupe-light mb-1">Your flower is growing</p>
          <h1 className="font-serif text-2xl text-charcoal">Create a Flower</h1>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator
            currentStep={step}
            totalSteps={totalSteps}
            labels={STEP_LABELS}
          />
        </div>

        {/* Steps */}
        <div className="min-h-[360px]">
          {/* STEP 1 — Choose Flower */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2 className="font-serif text-xl text-charcoal">Choose your flower</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.type}
                    type="button"
                    onClick={() => updateField('flowerType', flower.type)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      form.flowerType === flower.type
                        ? 'border-rose bg-rose/5 shadow-sm'
                        : 'border-blush-soft/40 hover:border-blush bg-white'
                    }`}
                    aria-pressed={form.flowerType === flower.type}
                  >
                    <div className="flex-shrink-0">
                      <FlowerVisual stage="bloom" health="healthy" flowerType={flower.type} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-charcoal">{flower.name}</p>
                      <p className="text-sm text-taupe">{flower.personality}</p>
                    </div>
                    {form.flowerType === flower.type && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Name Flower */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl text-charcoal">Give your flower a name</h2>
                <p className="text-sm text-taupe">Something that feels right for them.</p>
              </div>

              <div className="flex justify-center">
                <FlowerVisual stage="sprout" health="healthy" flowerType={form.flowerType as FlowerType} size="sm" />
              </div>

              <Input
                id="flowerName"
                label=""
                value={form.flowerName}
                onChange={(e) => updateField('flowerName', e.target.value)}
                placeholder="e.g. Luna, Rosie, Sunny"
                maxLength={50}
                error={errors.flowerName}
              />

              {form.flowerName && (
                <Card className="p-4 text-center">
                  <p className="text-sm text-taupe">Meet</p>
                  <p className="font-serif text-xl text-charcoal">{form.flowerName} 🌱</p>
                </Card>
              )}
            </div>
          )}

          {/* STEP 3 — Recipient */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl text-charcoal">Who are you growing this for?</h2>
                <p className="text-sm text-taupe">The person who will receive this flower.</p>
              </div>

              <Input
                id="recipientName"
                label="Their name"
                value={form.recipientName}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="Who is this flower for?"
                maxLength={80}
                error={errors.recipientName}
              />

              <Input
                id="giverName"
                label="Your name (optional)"
                value={form.giverName}
                onChange={(e) => updateField('giverName', e.target.value)}
                placeholder="From..."
                maxLength={80}
              />
            </div>
          )}

          {/* STEP 4 — Personal Message */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl text-charcoal">What would you like to tell them?</h2>
                <p className="text-sm text-taupe">Something they&apos;ll want to read again.</p>
              </div>

              <Textarea
                id="personalMessage"
                value={form.personalMessage}
                onChange={(e) => updateField('personalMessage', e.target.value)}
                placeholder="Write something meaningful..."
                maxLength={500}
                charCount
                error={errors.personalMessage}
              />
            </div>
          )}

          {/* STEP 5 — Bloom Message */}
          {step === 5 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl text-charcoal">Save something for the bloom.</h2>
                <p className="text-sm text-taupe">This message stays hidden until the flower blooms.</p>
              </div>

              <Card className="p-4 bg-warm-blush/50 border-blush/30 text-center space-y-1">
                <p className="text-xs text-taupe-light uppercase tracking-wide">Day 30</p>
                <p className="text-lg" aria-hidden="true">🌸</p>
                <p className="text-xs text-taupe-light">Your message appears here.</p>
              </Card>

              <Textarea
                id="bloomMessage"
                value={form.bloomMessage}
                onChange={(e) => updateField('bloomMessage', e.target.value)}
                placeholder="What will they see when it blooms?"
                maxLength={500}
                charCount
                error={errors.bloomMessage}
              />
            </div>
          )}

          {/* STEP 6 — Start Date */}
          {step === 6 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl text-charcoal">When should it start growing?</h2>
                <p className="text-sm text-taupe">The flower will begin growing on this day.</p>
              </div>

              <div className="flex justify-center">
                <FlowerVisual stage="seed" health="healthy" flowerType={form.flowerType as FlowerType} size="sm" />
              </div>

              <Input
                id="startDate"
                type="date"
                label="Start date"
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                min={getCurrentDate()}
                error={errors.startDate}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-blush-soft/30">
          {step > 1 ? (
            <Button variant="ghost" onClick={goBack}>
              ← Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button onClick={goNext}>
              Continue →
            </Button>
          ) : (
            <Button onClick={handlePreview}>
              Preview My Flower
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
