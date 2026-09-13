import { getSupabaseAdmin } from './client';
import { generateSecureToken } from '@/lib/security/token';
import type { CreateGiftInput } from '@/lib/validation/schemas';
import type { Gift } from '@/types';

export async function createGift(input: CreateGiftInput): Promise<Gift> {
  const supabase = getSupabaseAdmin();
  const token = generateSecureToken(32);

  const { data, error } = await supabase
    .from('gifts')
    .insert({
      public_token: token,
      recipient_name: input.recipientName,
      giver_name: input.giverName || null,
      flower_type: input.flowerType,
      flower_name: input.flowerName,
      personal_message: input.personalMessage,
      bloom_message: input.bloomMessage,
      start_date: input.startDate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating gift:', error);
    throw new Error('We couldn\'t save that right now. Please try again.');
  }

  return data as Gift;
}

export async function getGiftByToken(token: string): Promise<Gift | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('public_token', token)
    .single();

  if (error || !data) return null;

  return data as Gift;
}
