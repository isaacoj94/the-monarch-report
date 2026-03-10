import { NextResponse } from 'next/server';

// Fetches live USD/KRW rate from Frankfurter API (free, no key needed)
// Falls back to ExchangeRate-API free tier
export async function GET() {
  try {
    // Primary: Frankfurter API
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW', {
      next: { revalidate: 300 }, // cache 5 min
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        rate: data.rates.KRW,
        base: 'USD',
        target: 'KRW',
        date: data.date,
        source: 'frankfurter',
      });
    }

    // Fallback: ExchangeRate-API free tier
    const fallback = await fetch('https://open.er-api.com/v6/latest/USD');
    if (fallback.ok) {
      const data = await fallback.json();
      return NextResponse.json({
        rate: data.rates.KRW,
        base: 'USD',
        target: 'KRW',
        date: data.time_last_update_utc,
        source: 'exchangerate-api',
      });
    }

    throw new Error('All exchange rate APIs failed');
  } catch (error) {
    // Return seed data as ultimate fallback
    return NextResponse.json({
      rate: 1465,
      base: 'USD',
      target: 'KRW',
      date: new Date().toISOString().slice(0, 10),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
