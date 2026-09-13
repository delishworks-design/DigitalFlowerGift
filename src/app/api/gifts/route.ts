import { NextRequest, NextResponse } from 'next/server';
import { createGiftSchema } from '@/lib/validation/schemas';
import { createGift } from '@/lib/db/gifts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createGiftSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const gift = await createGift(parsed.data);

    return NextResponse.json({
      id: gift.id,
      token: gift.public_token,
      url: `/g/${gift.public_token}`,
    });
  } catch {
    return NextResponse.json(
      { error: 'We couldn\'t save that right now. Please try again.' },
      { status: 500 }
    );
  }
}
