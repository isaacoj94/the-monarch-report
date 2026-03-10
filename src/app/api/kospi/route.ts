import { NextResponse } from 'next/server';

// Fetches KOSPI index data from Yahoo Finance (unofficial, no key needed)
// Symbol: ^KS11

export async function GET() {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?interval=1d&range=3mo',
      {
        next: { revalidate: 600 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    );

    if (!res.ok) {
      throw new Error(`Yahoo Finance returned ${res.status}`);
    }

    const data = await res.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      throw new Error('No chart data returned');
    }

    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const history = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      value: closes[i] ? Math.round(closes[i] * 100) / 100 : null,
    })).filter((p: { value: number | null }) => p.value !== null);

    return NextResponse.json({
      current: Math.round(meta.regularMarketPrice * 100) / 100,
      previousClose: Math.round(meta.chartPreviousClose * 100) / 100,
      change: Math.round((meta.regularMarketPrice - meta.chartPreviousClose) * 100) / 100,
      changePercent: Math.round(((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 10000) / 100,
      currency: meta.currency,
      history,
      source: 'yahoo',
    });
  } catch (error) {
    return NextResponse.json({
      current: 2550,
      previousClose: 2560,
      change: -10,
      changePercent: -0.39,
      history: [],
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Failed to fetch KOSPI',
    });
  }
}
