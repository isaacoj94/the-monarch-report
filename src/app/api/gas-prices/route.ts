import { NextResponse } from 'next/server';
import { regionalGasPrices } from '@/lib/data';

// Opinet API requires a registered API key from Korea National Oil Corporation
// For now, we serve seed data and will integrate Opinet when key is obtained
// Opinet endpoint: http://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=YOUR_KEY
// Also available: avgSidoPrice (by province), lowTop10 (cheapest stations)

export async function GET() {
  const OPINET_API_KEY = process.env.OPINET_API_KEY;

  if (OPINET_API_KEY) {
    try {
      // Fetch national average
      const avgRes = await fetch(
        `https://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${OPINET_API_KEY}`,
        { next: { revalidate: 3600 } } // cache 1 hour
      );

      if (avgRes.ok) {
        const avgData = await avgRes.json();
        const gasoline = avgData.RESULT?.OIL?.find(
          (o: { PRODCD: string }) => o.PRODCD === 'B027' // Regular gasoline
        );

        // Fetch by province (sido)
        const sidoRes = await fetch(
          `https://www.opinet.co.kr/api/avgSidoPrice.do?out=json&code=${OPINET_API_KEY}&prodcd=B027`,
          { next: { revalidate: 3600 } }
        );

        let sidoData = null;
        if (sidoRes.ok) {
          sidoData = await sidoRes.json();
        }

        return NextResponse.json({
          nationalAverage: gasoline ? parseFloat(gasoline.PRICE) : null,
          date: gasoline?.TRADE_DT || new Date().toISOString().slice(0, 10),
          regions: sidoData?.RESULT?.OIL || [],
          source: 'opinet',
        });
      }
    } catch (error) {
      console.error('Opinet API error:', error);
    }
  }

  // Seed data fallback
  const nationalAvg = Math.round(
    regionalGasPrices.reduce((sum, r) => sum + r.avgPrice, 0) / regionalGasPrices.length
  );

  return NextResponse.json({
    nationalAverage: nationalAvg,
    date: new Date().toISOString().slice(0, 10),
    regions: regionalGasPrices,
    source: 'seed',
  });
}
