import { z } from 'zod';
import type { FlowerType, CareType } from '@/types';
import { isValidTimezone } from '@/lib/time/date';

const FLOWER_TYPES: FlowerType[] = ['rose', 'sunflower', 'tulip', 'daisy', 'lavender'];
const CARE_TYPES: CareType[] = ['water', 'sunlight', 'love'];

export const createGiftSchema = z.object({
  flowerType: z.enum(FLOWER_TYPES as [string, ...string[]]),
  flowerName: z.string().trim().min(1, 'Please enter a flower name.').max(50),
  recipientName: z.string().trim().min(1, "Please enter the recipient's name.").max(80),
  giverName: z.string().trim().max(80).optional().default(''),
  personalMessage: z.string().trim().min(1, 'Please enter a personal message.').max(500),
  bloomMessage: z.string().trim().min(1, 'Please enter a bloom message.').max(500),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format.'),
  recipientTimezone: z.string().refine(
    (val) => isValidTimezone(val),
    { message: 'Invalid timezone.' }
  ).optional().default('Asia/Manila'),
});

export const careActionSchema = z.object({
  type: z.enum(CARE_TYPES as [string, ...string[]]),
});

export type CreateGiftInput = z.infer<typeof createGiftSchema>;
export type CareActionInput = z.infer<typeof careActionSchema>;
