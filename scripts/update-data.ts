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
 *  - Gas prices: Opinet API (requires OPINET_API_KEY)
 *  - BOK interest rate: Yahoo Finance (^KS11 not directly, but BOK press releases)
 *  - CPI / Inflation: FRED API (free, no key needed for basic access)
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '..', 'src', 'lib', 'data.ts');

interface UpdatedValues {
  usdKrw?: number;
  gasPrice?: number;
  interestRate?: number;
  inflation?: number;
}

// === FETCHERS ===

async function fetchUsdKrw(): Promise<number | null> {
  // Try Frankfurter first
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW');
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.KRW) return Math.round(data.rates.KRW * 100) / 100;
    }
  } catch {}

  // Fallback: Open Exchange Rates API
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.KRW) return Math.round(data.rates.KRW * 100) / 100;
    }
  } catch {}

  // Fallback: fawazahmed0
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
    if (res.ok) {
      const data = await res.json();
      if (data.usd?.krw) return Math.round(data.usd.krw * 100) / 100;
    }
  } catch {}

  return null;
}

async function fetchGasPrice(): Promise<number | null> {
  const apiKey = process.env.OPINET_API_KEY;
  if (!apiKey) {
    console.log('  ⚠ OPINET_API_KEY not set, skipping gas price');
    return null;
  }

  try {
    const res = await fetch(
      `https://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${apiKey}`
    );
    if (res.ok) {
      const data = await res.json();
      const gasoline = data.RESULT?.OIL?.find((o: { PRODCD: string }) => o.PRODCD === 'B027');
      if (gasoline?.PRICE) return Math.round(parseFloat(gasoline.PRICE));
    }
  } catch {}

  return null;
}

// === UPDATER ===

function updateDataFile(updates: UpdatedValues) {
  let content = fs.readFileSync(DATA_FILE, 'utf-8');
  const today = new Date().toISOString().slice(0, 10);
  let changeCount = 0;

  // Split file into sections to avoid modifying historical presidencySnapshots data
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

    // Update in currentSnapshot only
    const snapshotRegex = new RegExp(`(${key}:\\s*)([\\d.]+)`);
    if (snapshotRegex.test(snapshotSection)) {
      snapshotSection = snapshotSection.replace(snapshotRegex, `$1${value}`);
      changeCount++;
    }

    // Update currentValue in metrics objects (only in the section after currentSnapshot)
    const metricBlockRegex = new RegExp(
      `(${key}:\\s*\\{[^}]*?currentValue:\\s*)([\\d.]+)`,
      'g'
    );
    metricsSection = metricsSection.replace(metricBlockRegex, `$1${value}`);

    // Update trend and changePercent based on presidencyStartValue
    const startValueMatch = metricsSection.match(
      new RegExp(`${key}:\\s*\\{[^}]*?presidencyStartValue:\\s*([\\d.]+)`)
    );
    if (startValueMatch) {
      const startValue = parseFloat(startValueMatch[1]);
      const changePct = Math.round(((value - startValue) / startValue) * 1000) / 10;
      const trend = Math.abs(changePct) < 1 ? 'stable' : changePct > 0 ? 'rising' : 'falling';

      // Update changePercent
      const changePctRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?changePercent:\\s*)(-?[\\d.]+)`
      );
      metricsSection = metricsSection.replace(changePctRegex, `$1${changePct}`);

      // Update trend
      const trendRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?trend:\\s*')([^']+)(')`
      );
      metricsSection = metricsSection.replace(trendRegex, `$1${trend}$3`);

      // Update history end value
      const historyRegex = new RegExp(
        `(${key}:\\s*\\{[^}]*?generateMonthlyData\\(PRESIDENCY_START,\\s*[\\d.]+,\\s*)([\\d.]+)`
      );
      metricsSection = metricsSection.replace(historyRegex, `$1${value}`);
    }
  }

  // Reassemble
  const prefix = content.slice(0, snapshotStart);
  content = prefix + snapshotSection + metricsSection;

  // Update the date comment
  content = content.replace(
    /\/\/ Current values \(.*?\)/,
    `// Current values (updated ${today})`
  );

  if (changeCount > 0) {
    fs.writeFileSync(DATA_FILE, content, 'utf-8');
    console.log(`✅ Updated ${changeCount} values in data.ts`);
  } else {
    console.log('ℹ No values were updated');
  }
}

// === MAIN ===

async function main() {
  console.log('📊 The Monarch Report — Data Updater');
  console.log(`   ${new Date().toISOString()}\n`);

  const updates: UpdatedValues = {};

  // Fetch USD/KRW
  console.log('💱 Fetching USD/KRW exchange rate...');
  const usdKrw = await fetchUsdKrw();
  if (usdKrw) {
    updates.usdKrw = usdKrw;
    console.log(`   ✅ USD/KRW: ₩${usdKrw}`);
  } else {
    console.log('   ❌ Failed to fetch USD/KRW');
  }

  // Fetch gas price
  console.log('⛽ Fetching gas price...');
  const gasPrice = await fetchGasPrice();
  if (gasPrice) {
    updates.gasPrice = gasPrice;
    console.log(`   ✅ Gas: ₩${gasPrice}/L`);
  } else {
    console.log('   ❌ Failed to fetch gas price');
  }

  // Apply updates
  console.log('\n📝 Updating data.ts...');
  updateDataFile(updates);

  console.log('\nDone. Commit and push to trigger Vercel deploy.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
