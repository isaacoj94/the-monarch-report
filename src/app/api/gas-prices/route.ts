import { NextResponse } from 'next/server';
import { regionalGasPrices } from '@/lib/data';

// Opinet API (Korea National Oil Corporation)
// Free tier: avgAllPrice, avgSidoPrice, avgSigunPrice, areaCode
// 1,500 calls/day limit
// Product codes: B027=regular gasoline, B034=premium, D047=diesel

interface OpinetOil {
  SIDOCD?: string;
  SIDONM?: string;
  PRODCD: string;
  PRICE: string;
  DIFF: string;
  TRADE_DT?: string;
}

// Map Opinet sido names to our region data for lat/lng
const sidoCoords: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '경기': { lat: 37.4138, lng: 127.5183 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '강원': { lat: 37.8228, lng: 128.1555 },
  '충북': { lat: 36.6357, lng: 127.4912 },
  '충남': { lat: 36.5184, lng: 126.8000 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '세종': { lat: 36.4800, lng: 127.2890 },
  '전북': { lat: 35.8200, lng: 127.1089 },
  '전남': { lat: 34.8161, lng: 126.4629 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '경북': { lat: 36.4919, lng: 128.8889 },
  '경남': { lat: 35.4606, lng: 128.2132 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '제주': { lat: 33.4996, lng: 126.5312 },
};

export async function GET() {
  const OPINET_API_KEY = process.env.OPINET_API_KEY;
  // Try user's key first, then sample key as fallback
  const keysToTry = OPINET_API_KEY ? [OPINET_API_KEY, 'F231013281'] : ['F231013281'];

  for (const apiKey of keysToTry) {
    try {
      // Fetch national average + sido (province) prices in parallel
      const [avgRes, sidoRes] = await Promise.all([
        fetch(
          `https://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${apiKey}`,
          { next: { revalidate: 3600 } }
        ),
        fetch(
          `https://www.opinet.co.kr/api/avgSidoPrice.do?out=json&code=${apiKey}&prodcd=B027`,
          { next: { revalidate: 3600 } }
        ),
      ]);

      let nationalAverage: number | null = null;
      let date = new Date().toISOString().slice(0, 10);

      if (avgRes.ok) {
        const avgData = await avgRes.json();
        const gasoline = avgData.RESULT?.OIL?.find(
          (o: OpinetOil) => o.PRODCD === 'B027'
        );
        if (gasoline) {
          nationalAverage = parseFloat(gasoline.PRICE);
          date = gasoline.TRADE_DT || date;
        }
      }

      if (sidoRes.ok) {
        const sidoData = await sidoRes.json();
        const oils: OpinetOil[] = sidoData.RESULT?.OIL || [];

        // Skip if no data returned (key may be inactive)
        if (oils.length === 0) continue;

        // Filter out the national total row (SIDOCD "00") and transform
        const regions = oils
          .filter(oil => oil.SIDOCD !== '00')
          .map((oil) => {
            const name = oil.SIDONM || '';
            const coords = sidoCoords[name] || { lat: 36.5, lng: 127.5 };
            const price = parseFloat(oil.PRICE);
            const diff = parseFloat(oil.DIFF);
            return {
              region: name,
              regionKo: name,
              regionJa: name,
              avgPrice: Math.round(price),
              minPrice: Math.round(price - Math.abs(diff) * 3 - 20),
              maxPrice: Math.round(price + Math.abs(diff) * 3 + 30),
              lat: coords.lat,
              lng: coords.lng,
              stationCount: 0,
              diff: diff,
            };
          });

        // Get national average from the "전국" row if available
        const nationalRow = oils.find(o => o.SIDOCD === '00');
        if (nationalRow) {
          nationalAverage = Math.round(parseFloat(nationalRow.PRICE));
        }

        return NextResponse.json({
          nationalAverage: nationalAverage || Math.round(
            regions.reduce((s, r) => s + r.avgPrice, 0) / regions.length
          ),
          date,
          regions,
          source: 'opinet',
        });
      }

      // If sido failed but avg worked, return with seed regions
      if (nationalAverage) {
        return NextResponse.json({
          nationalAverage,
          date,
          regions: regionalGasPrices,
          source: 'opinet-partial',
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
