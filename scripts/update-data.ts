#!/usr/bin/env tsx
/**
 * Automated data updater for The Monarch Report
 * Fetches latest economic indicators from free APIs and updates src/lib/data.ts
 *
 * Run: npm run update-data
 * Scheduled: GitHub Actions every 3 days
 *
 * Data sources:
 *  - USD/KRW: Frankfurter → Open Exchange Rates → fawazahmed0 CDN
 *  - Gas: Opinet (OPINET_API_KEY, falls back to sample key F231013281 when private key returns empty)
 *  - KOSPI: Yahoo Finance (unofficial, no key)
 *  - Inflation/interest rate: not implemented — needs KOSIS or BOK ECOS (API registration required)
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
const OPINET_SAMPLE_KEY = 'F231013281';

interface UpdatedValues {
  usdKrw?: number;
  gasPrice?: number;
  kospi?: number;
  interestRate?: number;
  inflation?: number;
}

async function fetchUsdKrw(): Promise<number | null> {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW');
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.KRW) return Math.round(data.rates.KRW * 100) / 100;
    }
  } catch (err) {
    console.log(`   ⚠ Frankfurter failed: ${err instanceof Error ? err.message : err}`);
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.KRW) return Math.round(data.rates.KRW * 100) / 100;
    }
  } catch (err) {
    console.log(`   ⚠ Open ER failed: ${err instanceof Error ? err.message : err}`);
  }

  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
    if (res.ok) {
      const data = await res.json();
      if (data.usd?.krw) return Math.round(data.usd.krw * 100) / 100;
    }
  } catch (err) {
    console.log(`   ⚠ fawazahmed0 failed: ${err instanceof Error ? err.message : err}`);
  }

  return null;
}

async function tryOpinet(apiKey: string, keyLabel: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${apiKey}`);
    if (!res.ok) {
      console.log(`   ⚠ Opinet (${keyLabel}) HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    const oil = data.RESULT?.OIL;
    if (!Array.isArray(oil) || oil.length === 0) {
      console.log(`   ⚠ Opinet (${keyLabel}) returned empty OIL array (key likely restricted/expired)`);
      return null;
    }
    const gasoline = oil.find((o: { PRODCD: string }) => o.PRODCD === 'B027');
    if (!gasoline?.PRICE) {
      console.log(`   ⚠ Opinet (${keyLabel}) had no B027 (gasoline) entry`);
      return null;
    }
    return Math.round(parseFloat(gasoline.PRICE));
  } catch (err) {
    console.log(`   ⚠ Opinet (${keyLabel}) threw: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

async function fetchGasPrice(): Promise<number | null> {
  const userKey = process.env.OPINET_API_KEY;

  if (userKey) {
    const result = await tryOpinet(userKey, 'private key');
    if (result !== null) return result;
    console.log('   ↳ falling back to public sample key');
  } else {
    console.log('   ⚠ OPINET_API_KEY not set, using public sample key');
  }

  return tryOpinet(OPINET_SAMPLE_KEY, 'sample key');
}

async function fetchKospi(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?interval=1d&range=5d',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    if (!res.ok) {
      console.log(`   ⚠ Yahoo Finance HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (typeof price !== 'number') {
      console.log('   ⚠ Yahoo Finance returned no regularMarketPrice');
      return null;
    }
    return Math.round(price * 100) / 100;
  } catch (err) {
    console.log(`   ⚠ Yahoo Finance threw: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

function updateDataFile(updates: UpdatedValues) {
  let content = fs.readFileSync(DATA_FILE, 'utf-8');
  const today = new Date().toISOString().slice(0, 10);
  let changeCount = 0;

  const snapshotStart = content.indexOf('export const currentSnapshot');
  const snapshotEnd = content.indexOf('};', snapshotStart) + 2;

  if (snapshotStart === -1) {
    console.error('❌ Could not find currentSnapshot in data.ts');
    return;
  }

  let snapshotSection = content.slice(snapshotStart, snapshotEnd);
  let metricsSection = content.slice(snapshotEnd);

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;

    const snapshotRegex = new RegExp(`(${key}:\\s*)([\\d.]+)`);
    if (snapshotRegex.test(snapshotSection)) {
      const before = snapshotSection;
      snapshotSection = snapshotSection.replace(snapshotRegex, `$1${value}`);
      if (before !== snapshotSection) changeCount++;
    } else {
      // currentSnapshot doesn't have this key yet, insert it before the closing brace
      const insertion = `  ${key}: ${value},\n`;
      snapshotSection = snapshotSection.replace(/\};\s*$/, `${insertion}};`);
      changeCount++;
    }

    const metricBlockRegex = new RegExp(
      `(${key}:\\s*\\{[^}]*?currentValue:\\s*)([\\d.]+)`,
      'g'
    );
    metricsSection = metricsSection.replace(metricBlockRegex, `$1${value}`);

    const startValueMatch = metricsSection.match(
      new RegExp(`${key}:\\s*\\{[^}]*?presidencyStartValue:\\s*([\\d.]+)`)
    );
    if (startValueMatch) {
      const startValue = parseFloat(startValueMatch[1]);
      const changePct = Math.round(((value - startValue) / startValue) * 1000) / 10;
      const trend = Math.abs(changePct) < 1 ? 'stable' : changePct > 0 ? 'rising' : 'falling';

      const changePctRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?changePercent:\\s*)(-?[\\d.]+)`
      );
      metricsSection = metricsSection.replace(changePctRegex, `$1${changePct}`);

      const trendRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?trend:\\s*')([^']+)(')`
      );
      metricsSection = metricsSection.replace(trendRegex, `$1${trend}$3`);

      const historyRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?generateMonthlyData\\(PRESIDENCY_START,\\s*[\\d.]+,\\s*)([\\d.]+)`
      );
      metricsSection = metricsSection.replace(historyRegex, `$1${value}`);
    }
  }

  const prefix = content.slice(0, snapshotStart);
  content = prefix + snapshotSection + metricsSection;

  content = content.replace(
    /\/\/ Current values \(.*?\)/,
    `// Current values (updated ${today})`
  );

  // Bump LAST_UPDATED constant if present
  content = content.replace(
    /(export const LAST_UPDATED\s*=\s*')[^']+(')/,
    `$1${today}$2`
  );

  if (changeCount > 0) {
    fs.writeFileSync(DATA_FILE, content, 'utf-8');
    console.log(`✅ Updated ${changeCount} values in data.ts`);
  } else {
    console.log('ℹ No values were updated');
  }
}

async function main() {
  console.log('📊 The Monarch Report — Data Updater');
  console.log(`   ${new Date().toISOString()}\n`);

  const updates: UpdatedValues = {};

  console.log('💱 Fetching USD/KRW exchange rate...');
  const usdKrw = await fetchUsdKrw();
  if (usdKrw) {
    updates.usdKrw = usdKrw;
    console.log(`   ✅ USD/KRW: ₩${usdKrw}`);
  } else {
    console.log('   ❌ Failed to fetch USD/KRW');
  }

  console.log('⛽ Fetching gas price...');
  const gasPrice = await fetchGasPrice();
  if (gasPrice) {
    updates.gasPrice = gasPrice;
    console.log(`   ✅ Gas: ₩${gasPrice}/L`);
  } else {
    console.log('   ❌ Failed to fetch gas price (both private + sample keys returned nothing)');
  }

  console.log('📈 Fetching KOSPI index...');
  const kospi = await fetchKospi();
  if (kospi) {
    updates.kospi = kospi;
    console.log(`   ✅ KOSPI: ${kospi}`);
  } else {
    console.log('   ❌ Failed to fetch KOSPI');
  }

  console.log('\n📝 Updating data.ts...');
  updateDataFile(updates);

  console.log('\nDone. Commit and push to trigger Vercel deploy.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
