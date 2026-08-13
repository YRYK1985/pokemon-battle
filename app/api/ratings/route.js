import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [ratings, matchCount, wins, matches] = await Promise.all([
      kv.hgetall('pokemon_ratings'),
      kv.get('pokemon_matchCount'),
      kv.hgetall('pokemon_wins'),
      kv.hgetall('pokemon_matches'),
    ]);

    return NextResponse.json({
      ratings: ratings || {},
      matchCount: matchCount ?? 0,
      wins: wins || {},
      matches: matches || {},
    }, {
      headers: {
        // キャッシュを長めに取り、関数実行回数（Fluid Active CPU）を抑える
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Ratings error:', error);
    return NextResponse.json({
      ratings: {},
      matchCount: 0,
      wins: {},
      matches: {},
    });
  }
}
