import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { winnerId, loserId } = await request.json();

    if (!winnerId || !loserId) {
      return NextResponse.json({ error: 'Missing winnerId or loserId' }, { status: 400 });
    }

    const [ratings, ] = await Promise.all([
      kv.hgetall('pokemon_ratings'),
    ]);

    const currentW = (ratings && ratings[winnerId]) || 1200;
    const currentL = (ratings && ratings[loserId]) || 1200;

    const K = 32;
    const expectedW = 1 / (1 + Math.pow(10, (currentL - currentW) / 400));
    const expectedL = 1 / (1 + Math.pow(10, (currentW - currentL) / 400));

    const newW = Math.round(currentW + K * (1 - expectedW));
    const newL = Math.round(currentL + K * (0 - expectedL));

    await Promise.all([
      kv.hset('pokemon_ratings', { [winnerId]: newW, [loserId]: newL }),
      kv.incr('pokemon_matchCount'),
      kv.hincrby('pokemon_wins', winnerId, 1),
      kv.hincrby('pokemon_matches', winnerId, 1),
      kv.hincrby('pokemon_matches', loserId, 1),
    ]);

    return NextResponse.json({ success: true, newRatings: { [winnerId]: newW, [loserId]: newL } });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
