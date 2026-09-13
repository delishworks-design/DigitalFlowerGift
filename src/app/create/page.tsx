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

const FLOWERS: { type: FlowerType; name: string; personality: string }[] = [
  { type: 'rose', name: 'Rose', personality: 'Romantic & timeless' },
  { type: 'sunflower', name: 'Sunflower', personality: 'Bright & joyful' },
  { type: 'tulip', name: 'Tulip', personality: 'Sweet & sincere' },
  { type: 'daisy', name: 'Daisy', personality: 'Simple & cheerful' },
  { type: 'lavender', name: 'Lavender', personality: 'Calm & gentle' },
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
      case 2: if (!form.flowerName.trim()) newErrors.flowerName = 'Please give your flower a name.'; break;
      case 3: if (!form.recipientName.trim()) newErrors.recipientName = "Please enter their name."; break;
      case 4: if (!form.personalMessage.trim()) newErrors.personalMessage = 'Please write a message.'; break;
      case 5: if (!form.bloomMessage.trim()) newErrors.bloomMessage = 'Please write a bloom message.'; break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => { if (step < totalSteps && validateStep(step)) setStep((s) => s + 1); };
  const goBack = () => { if (step > 1) setStep((s) => s - 1); };

  const handlePreview = () => {
    const fullParse = createGiftSchema.safeParse(form);
    if (!fullParse.success) {
      const fieldErrors: Partial<Record<keyof CreateGiftInput, string>> = {};
      fullParse.error.issues.forEach((err) => { fieldErrors[err.path[0] as keyof CreateGiftInput] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    sessionStorage.setItem('giftPreview', JSON.stringify(fullParse.data));
    router.push('/preview');
  };

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 pt-6 sm:pt-10 pb-28">
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-sm text-taupe-light mb-1">Step {step} of {totalSteps}</p>
          <h1 className="font-serif text-2xl text-charcoal">Create a Flower</h1>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} totalSteps={totalSteps} labels={STEP_LABELS} />
        </div>

        {/* Steps */}
        <div className="min-h-[320px]">
          {/* STEP 1 — Choose Flower */}
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center">
                <h2 className="font-serif text-xl text-charcoal">Choose your flower</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {FLOWERS.map((flower) => {
                  const selected = form.flowerType === flower.type;
                  return (
                    <button
                      key={flower.type}
                      type="button"
                      onClick={() => updateField('flowerType', flower.type)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                        selected
                          ? 'border-rose bg-rose/5 shadow-md shadow-rose/10 ring-1 ring-rose/20'
                          : 'border-blush-soft/40 hover:border-blush hover:bg-white bg-white shadow-sm'
                      }`}
                      aria-pressed={selected}
                    >
                      <div className="flex-shrink-0 w-20 h-24">
                        <FlowerVisual stage="bloom" health="healthy" flowerType={flower.type} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg text-charcoal">{flower.name}</p>
                        <p className="text-sm text-taupe">{flower.personality}</p>
                      </div>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'bg-rose border-rose' : 'border-blush-soft bg-white'
                      }`}>
                        {selected && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Name Flower */}
          {step === 2 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-xl text-charcoal">Give your flower a name</h2>
                <p className="text-sm text-taupe">Make it theirs.</p>
              </div>
              <div className="flex justify-center">
                <FlowerVisual stage="sprout" health="healthy" flowerType={form.flowerType as FlowerType} size="sm" />
              </div>
              <Input
                id="flowerName"
                value={form.flowerName}
                onChange={(e) => updateField('flowerName', e.target.value)}
                placeholder="e.g. Luna, Rosie, Sunny"
                maxLength={50}
                error={errors.flowerName}
              />
              {form.flowerName && (
                <Card className="p-4 text-center bg-warm-blush/30 border-blush/20 animate-fade-in">
                  <p className="text-sm text-taupe">Meet</p>
                  <p className="font-serif text-xl text-charcoal">{form.flowerName} 🌱</p>
                </Card>
              )}
            </div>
          )}

          {/* STEP 3 — Recipient */}
          {step === 3 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-xl text-charcoal">Who is this flower for?</h2>
                <p className="text-sm text-taupe">The person who will receive it.</p>
              </div>
              <Input
                id="recipientName"
                label="Their name"
                value={form.recipientName}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="e.g. Ana"
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
              {form.recipientName && (
                <Card className="p-4 text-center bg-warm-blush/30 border-blush/20 animate-fade-in">
                  <p className="font-serif text-lg text-charcoal">For {form.recipientName} ♡</p>
                </Card>
              )}
            </div>
          )}

          {/* STEP 4 — Personal Message */}
          {step === 4 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-xl text-charcoal">Write something from your heart</h2>
                <p className="text-sm text-taupe">This message will be waiting for them from the very beginning.</p>
              </div>
              <Textarea
                id="personalMessage"
                value={form.personalMessage}
                onChange={(e) => updateField('personalMessage', e.target.value)}
                placeholder="Something they&apos;ll want to read again..."
                maxLength={500}
                charCount
                error={errors.personalMessage}
              />
              {form.personalMessage && (
                <Card className="p-5 text-center bg-warm-blush/30 border-blush/20 animate-fade-in">
                  <p className="font-serif text-charcoal italic leading-relaxed">&ldquo;{form.personalMessage}&rdquo;</p>
                </Card>
              )}
            </div>
          )}

          {/* STEP 5 — Bloom Message */}
          {step === 5 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-xl text-charcoal">Write the bloom surprise</h2>
                <p className="text-sm text-taupe">Keep it secret until Day 30.</p>
              </div>
              <Card className="p-5 bg-warm-blush/50 border-blush/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-taupe" aria-hidden="true">
                    <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-xs text-taupe font-medium uppercase tracking-wide">Secret</p>
                </div>
                <p className="text-sm text-taupe">Your message stays hidden until the first bloom.</p>
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
            <div className="animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-xl text-charcoal">When should it begin?</h2>
                <p className="text-sm text-taupe">The flower will start growing on this day.</p>
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
      </div>

      {/* ─── STICKY BOTTOM NAV ─── */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <div className="bg-white/95 backdrop-blur-sm border-t border-blush-soft/30 px-6 py-3 sm:py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1 px-4 py-3 text-taupe font-semibold rounded-xl hover:bg-cream-deep transition-all min-h-[48px] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13 8H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button onClick={goNext} size="lg" arrow>
                Continue
              </Button>
            ) : (
              <Button onClick={handlePreview} size="lg">
                Preview My Flower
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
