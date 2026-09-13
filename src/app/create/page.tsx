'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGiftSchema, type CreateGiftInput } from '@/lib/validation/schemas';
import { getCurrentDate } from '@/lib/time/date';
import type { FlowerType } from '@/types';

const FLOWER_OPTIONS: { type: FlowerType; label: string; icon: string }[] = [
  { type: 'rose', label: 'Rose', icon: '🌹' },
  { type: 'sunflower', label: 'Sunflower', icon: '🌻' },
  { type: 'tulip', label: 'Tulip', icon: '🌷' },
  { type: 'daisy', label: 'Daisy', icon: '🌼' },
  { type: 'lavender', label: 'Lavender', icon: '💜' },
];

export default function CreatePage() {
  const router = useRouter();
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

  const updateField = <K extends keyof CreateGiftInput>(field: K, value: CreateGiftInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createGiftSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CreateGiftInput, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof CreateGiftInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    sessionStorage.setItem('giftPreview', JSON.stringify(parsed.data));
    router.push('/preview');
  };

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a Flower</h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Flower Type */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-600 mb-3">Choose a flower</legend>
            <div className="grid grid-cols-5 gap-2">
              {FLOWER_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => updateField('flowerType', opt.type)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                    form.flowerType === opt.type
                      ? 'border-[#E8637A] bg-pink-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                  aria-label={`Select ${opt.label}`}
                  aria-pressed={form.flowerType === opt.type}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[10px] text-gray-500">{opt.label}</span>
                </button>
              ))}
            </div>
            {errors.flowerType && <p className="text-red-500 text-xs mt-1">{errors.flowerType}</p>}
          </fieldset>

          {/* Flower Name */}
          <div>
            <label htmlFor="flowerName" className="block text-sm font-medium text-gray-600 mb-1">
              Flower name
            </label>
            <input
              id="flowerName"
              type="text"
              value={form.flowerName}
              onChange={(e) => updateField('flowerName', e.target.value)}
              placeholder="e.g. Sunny, Rosie, Luna"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 min-h-[44px]"
            />
            <div className="flex justify-between mt-1">
              {errors.flowerName && <p className="text-red-500 text-xs">{errors.flowerName}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.flowerName.length}/50</p>
            </div>
          </div>

          {/* Recipient Name */}
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-600 mb-1">
              Recipient&apos;s name
            </label>
            <input
              id="recipientName"
              type="text"
              value={form.recipientName}
              onChange={(e) => updateField('recipientName', e.target.value)}
              placeholder="Who is this flower for?"
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 min-h-[44px]"
            />
            <div className="flex justify-between mt-1">
              {errors.recipientName && <p className="text-red-500 text-xs">{errors.recipientName}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.recipientName.length}/80</p>
            </div>
          </div>

          {/* Giver Name */}
          <div>
            <label htmlFor="giverName" className="block text-sm font-medium text-gray-600 mb-1">
              Your name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="giverName"
              type="text"
              value={form.giverName}
              onChange={(e) => updateField('giverName', e.target.value)}
              placeholder="From..."
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 min-h-[44px]"
            />
          </div>

          {/* Personal Message */}
          <div>
            <label htmlFor="personalMessage" className="block text-sm font-medium text-gray-600 mb-1">
              Personal message
            </label>
            <textarea
              id="personalMessage"
              value={form.personalMessage}
              onChange={(e) => updateField('personalMessage', e.target.value)}
              placeholder="Write something meaningful..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 resize-none min-h-[88px]"
            />
            <div className="flex justify-between mt-1">
              {errors.personalMessage && <p className="text-red-500 text-xs">{errors.personalMessage}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.personalMessage.length}/500</p>
            </div>
          </div>

          {/* Bloom Message */}
          <div>
            <label htmlFor="bloomMessage" className="block text-sm font-medium text-gray-600 mb-1">
              Bloom message
            </label>
            <p className="text-xs text-gray-400 mb-2">This will be revealed when the flower blooms on Day 30.</p>
            <textarea
              id="bloomMessage"
              value={form.bloomMessage}
              onChange={(e) => updateField('bloomMessage', e.target.value)}
              placeholder="What will they see when it blooms?"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 resize-none min-h-[88px]"
            />
            <div className="flex justify-between mt-1">
              {errors.bloomMessage && <p className="text-red-500 text-xs">{errors.bloomMessage}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.bloomMessage.length}/500</p>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              min={getCurrentDate()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8637A] focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 min-h-[44px]"
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-[#E8637A] hover:bg-[#C94862] text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-lg min-h-[56px]"
          >
            Preview Flower
          </button>
        </form>
      </div>
    </main>
  );
}
