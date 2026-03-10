'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, timelineEvents, PRESIDENCY_START_LABEL, regionalGasPrices } from '@/lib/data';
import MetricCard from '@/components/MetricCard';
import CausalChain from '@/components/CausalChain';
import CompareTable from '@/components/CompareTable';
import Timeline from '@/components/Timeline';
import GasMap from '@/components/GasMap';
import LiveExchangeRate from '@/components/LiveExchangeRate';

const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

export default function Dashboard() {
  const [locale, setLocale] = useState<Locale>('en');

  const walletCards: { key: string; labelKey: string; unitKey: string; color: string }[] = [
    { key: 'gasPrice', labelKey: 'gasPrice', unitKey: 'perLiter', color: '#ef4444' },
    { key: 'ricePrice', labelKey: 'ricePrice', unitKey: 'per10kg', color: '#f97316' },
    { key: 'eggsPrice', labelKey: 'eggsPrice', unitKey: 'per30pack', color: '#eab308' },
    { key: 'porkBellyPrice', labelKey: 'porkBellyPrice', unitKey: 'per100g', color: '#f43f5e' },
    { key: 'electricityBill', labelKey: 'electricityBill', unitKey: 'perMonth', color: '#a855f7' },
    { key: 'seoulRent', labelKey: 'seoulRent', unitKey: 'perMonth', color: '#6366f1' },
  ];

  const macroCards: { key: string; labelKey: string; color: string }[] = [
    { key: 'usdKrw', labelKey: 'usdKrw', color: '#3b82f6' },
    { key: 'householdDebt', labelKey: 'householdDebt', color: '#ef4444' },
    { key: 'nationalDebt', labelKey: 'nationalDebt', color: '#f97316' },
    { key: 'inflation', labelKey: 'inflation', color: '#eab308' },
    { key: 'youthUnemployment', labelKey: 'youthUnemployment', color: '#a855f7' },
    { key: 'interestRate', labelKey: 'interestRate', color: '#22d3ee' },
  ];

  const compareRows = [
    ...walletCards.map(c => ({ label: t(locale, c.labelKey), metric: walletMetrics[c.key] })),
    ...macroCards.map(c => ({ label: t(locale, c.labelKey), metric: macroMetrics[c.key] })),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">M</div>
              <div>
                <h1 className="text-sm font-bold tracking-wide">{t(locale, 'siteTitle')}</h1>
                <p className="text-[10px] text-[#666666] tracking-wider uppercase">{t(locale, 'siteSubtitle')}</p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <a href="#wallet" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_wallet')}</a>
              <a href="#gas-map" className="px-2 py-1 text-[#888] hover:text-white transition-colors">
                {locale === 'ko' ? '주유소' : locale === 'ja' ? 'ガソリン' : 'Gas Map'}
              </a>
              <a href="#macro" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_macro')}</a>
              <a href="#why" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_why')}</a>
              <a href="#compare" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_compare')}</a>
            </nav>
            <div className="flex items-center gap-1 border border-[#222] rounded-md p-0.5">
              {(Object.keys(localeLabels) as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 text-[10px] rounded transition-colors ${locale === l ? 'bg-[#222] text-white' : 'text-[#666] hover:text-white'}`}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero + Live Exchange Rate */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {t(locale, 'siteDescription')}
            </h2>
            <p className="text-[#666666] text-sm">
              {t(locale, 'asOf')} 2026.03.10 · {t(locale, 'presidencyStart')}: {PRESIDENCY_START_LABEL}
            </p>
          </div>
          <LiveExchangeRate locale={locale} />
        </div>
      </section>

      {/* Section 1: Your Wallet */}
      <section id="wallet" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'yourWallet')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'yourWalletDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {walletCards.map((card) => (
            <MetricCard
              key={card.key}
              metric={walletMetrics[card.key]}
              label={t(locale, card.labelKey)}
              unitLabel={t(locale, card.unitKey)}
              locale={locale}
              accentColor={card.color}
            />
          ))}
        </div>
      </section>

      {/* Section 1.5: Gas Price Map */}
      <section id="gas-map" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-orange-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">
              {locale === 'ko' ? '전국 주유소 가격' : locale === 'ja' ? '全国ガソリン価格' : 'Gas Prices Nationwide'}
            </h2>
            <p className="text-[#666666] text-xs">
              {locale === 'ko' ? '지역별 휘발유 가격 현황' : locale === 'ja' ? '地域別ガソリン価格状況' : 'Regional gasoline price overview'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GasMap locale={locale} />
          {/* Price ranking list */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
            <h3 className="text-white font-mono text-sm font-bold mb-4">
              {locale === 'ko' ? '지역별 가격 순위 (비싼 순)' : locale === 'ja' ? '地域別価格ランキング（高い順）' : 'Price Ranking (Highest First)'}
            </h3>
            <div className="space-y-2">
              {[...regionalGasPrices].sort((a, b) => b.avgPrice - a.avgPrice).map((r, i) => {
                const name = locale === 'ko' ? r.regionKo : locale === 'ja' ? r.regionJa : r.region;
                const color = r.avgPrice >= 2000 ? '#ef4444' : r.avgPrice >= 1970 ? '#f97316' : r.avgPrice >= 1940 ? '#eab308' : '#22c55e';
                const barWidth = ((r.avgPrice - 1800) / (2150 - 1800)) * 100;
                return (
                  <div key={r.region} className="flex items-center gap-3">
                    <span className="text-[#555] text-xs font-mono w-5 text-right">{i + 1}</span>
                    <span className="text-[#ccc] text-xs font-mono w-20 truncate">{name}</span>
                    <div className="flex-1 h-4 bg-[#1a1a1a] rounded-sm overflow-hidden relative">
                      <div
                        className="h-full rounded-sm transition-all duration-500"
                        style={{ width: `${Math.min(barWidth, 100)}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold w-16 text-right" style={{ color }}>
                      ₩{r.avgPrice.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Big Picture */}
      <section id="macro" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'bigPicture')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'bigPictureDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {macroCards.map((card) => (
            <MetricCard
              key={card.key}
              metric={macroMetrics[card.key]}
              label={t(locale, card.labelKey)}
              unitLabel=""
              locale={locale}
              accentColor={card.color}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Why It's Happening */}
      <section id="why" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-yellow-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'whyHappening')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'whyHappeningDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CausalChain
              titleKey="gasChainTitle"
              stepKeys={['gasChainStep1', 'gasChainStep2', 'gasChainStep3', 'gasChainStep4', 'gasChainStep5']}
              locale={locale}
              color="#f59e0b"
            />
            <CausalChain
              titleKey="exchangeChainTitle"
              stepKeys={['exchangeChainStep1', 'exchangeChainStep2', 'exchangeChainStep3', 'exchangeChainStep4', 'exchangeChainStep5']}
              locale={locale}
              color="#3b82f6"
            />
            <CausalChain
              titleKey="debtChainTitle"
              stepKeys={['debtChainStep1', 'debtChainStep2', 'debtChainStep3', 'debtChainStep4', 'debtChainStep5']}
              locale={locale}
              color="#ef4444"
            />
          </div>
          <Timeline events={timelineEvents} locale={locale} />
        </div>
      </section>

      {/* Section 4: Then vs Now */}
      <section id="compare" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-purple-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'thenVsNow')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'thenVsNowDesc')}</p>
          </div>
        </div>
        <CompareTable rows={compareRows} locale={locale} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-[8px] font-bold">M</div>
            <span className="text-xs text-[#666]">{t(locale, 'siteTitle')} — {t(locale, 'siteSubtitle')}</span>
          </div>
          <p className="text-[10px] text-[#444] text-center max-w-md">{t(locale, 'disclaimer')}</p>
          <p className="text-[10px] text-[#444]">{t(locale, 'lastUpdated')}: 2026.03.10</p>
        </div>
      </footer>
    </div>
  );
}
