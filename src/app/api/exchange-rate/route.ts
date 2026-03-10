import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Fetches live + historical USD/KRW from Frankfurter API (free, no key)
// Also supports Korea Eximbank for official banking rates (needs key)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const includeHistory = searchParams.get('history') === 'true';

  try {
    // Primary: Frankfurter API — latest rate
    const latestRes = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW', {
      next: { revalidate: 300 },
    });

    let rate: number | null = null;
    let date = '';
    let source = '';

    if (latestRes.ok) {
      const data = await latestRes.json();
      rate = data.rates.KRW;
      date = data.date;
      source = 'frankfurter';
    } else {
      // Fallback: ExchangeRate-API
      const fallback = await fetch('https://open.er-api.com/v6/latest/USD');
      if (fallback.ok) {
        const data = await fallback.json();
        rate = data.rates.KRW;
        date = data.time_last_update_utc;
        source = 'exchangerate-api';
      }
    }

    // Fallback: fawazahmed0 CDN
    if (!rate) {
      const cdnRes = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      if (cdnRes.ok) {
        const data = await cdnRes.json();
        rate = data.usd?.krw;
        date = data.date || new Date().toISOString().slice(0, 10);
        source = 'fawazahmed0';
      }
    }

    if (!rate) {
      throw new Error('All exchange rate APIs failed');
    }

    const result: {
      rate: number;
      base: string;
      target: string;
      date: string;
      source: string;
      history?: { date: string; rate: number }[];
    } = {
      rate,
      base: 'USD',
      target: 'KRW',
      date,
      source,
    };

    // Fetch historical data if requested (for sparkline charts)
    if (includeHistory) {
      try {
        // Last 9 months (since presidency start)
        const histRes = await fetch(
          'https://api.frankfurter.dev/v1/2025-07-01..?base=USD&symbols=KRW',
          { next: { revalidate: 86400 } } // cache 24h
        );
        if (histRes.ok) {
          const histData = await histRes.json();
          const rates = histData.rates || {};
          result.history = Object.entries(rates).map(([d, r]) => ({
            date: d,
            rate: (r as { KRW: number }).KRW,
          }));
        }
      } catch {
        // Historical data is optional, don't fail
      }
    }

    return NextResponse.json(result);
  } catch (error) {
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
