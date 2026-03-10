'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, housingMetrics, timelineEvents, PRESIDENCY_START_LABEL, regionalGasPrices } from '@/lib/data';
import MetricCard from '@/components/MetricCard';
import CausalChain from '@/components/CausalChain';
import CompareTable from '@/components/CompareTable';
import Timeline from '@/components/Timeline';
import GasMap from '@/components/GasMap';
import LiveExchangeRate from '@/components/LiveExchangeRate';
import PresidencyComparison from '@/components/PresidencyComparison';

const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

export default function Dashboard() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeImpact, setActiveImpact] = useState<string | null>(null);

  const handleImpactClick = (impact: string) => {
    setActiveImpact(prev => prev === impact ? null : impact);
  };

  // Food & essentials
  const walletCards = [
    { key: 'gasPrice', labelKey: 'gasPrice', unitKey: 'perLiter', color: '#ef4444' },
    { key: 'ricePrice', labelKey: 'ricePrice', unitKey: 'per10kg', color: '#f97316' },
    { key: 'eggsPrice', labelKey: 'eggsPrice', unitKey: 'per30pack', color: '#eab308' },
    { key: 'porkBellyPrice', labelKey: 'porkBellyPrice', unitKey: 'per100g', color: '#f43f5e' },
    { key: 'electricityBill', labelKey: 'electricityBill', unitKey: 'perMonth', color: '#a855f7' },
    { key: 'seoulRent', labelKey: 'seoulRent', unitKey: 'perMonth', color: '#6366f1' },
  ];

  // Everyday life items
  const everydayCards = [
    { key: 'sojuPrice', labelKey: 'sojuPrice', unitKey: 'perBottle', color: '#22c55e' },
    { key: 'coffeePrice', labelKey: 'coffeePrice', unitKey: 'perCup', color: '#8b5cf6' },
    { key: 'chickenPrice', labelKey: 'chickenPrice', unitKey: 'perOrder', color: '#f59e0b' },
    { key: 'subwayFare', labelKey: 'subwayFare', unitKey: 'perRide', color: '#06b6d4' },
    { key: 'ramenPrice', labelKey: 'ramenPrice', unitKey: 'perPack', color: '#ec4899' },
  ];

  // Housing
  const housingCards = [
    { key: 'seoulAptPrice', labelKey: 'seoulAptPrice', unitKey: 'perPyeong', color: '#ef4444' },
    { key: 'jeonseDeposit', labelKey: 'jeonseDeposit', unitKey: 'manWon', color: '#f97316' },
    { key: 'housingIncomeRatio', labelKey: 'housingIncomeRatio', unitKey: 'years', color: '#dc2626' },
  ];

  // Macro
  const macroCards = [
    { key: 'usdKrw', labelKey: 'usdKrw', color: '#3b82f6' },
    { key: 'householdDebt', labelKey: 'householdDebt', color: '#ef4444' },
    { key: 'nationalDebt', labelKey: 'nationalDebt', color: '#f97316' },
    { key: 'inflation', labelKey: 'inflation', color: '#eab308' },
    { key: 'youthUnemployment', labelKey: 'youthUnemployment', color: '#a855f7' },
    { key: 'interestRate', labelKey: 'interestRate', color: '#22d3ee' },
  ];

  const compareRows = [
    ...walletCards.map(c => ({ label: t(locale, c.labelKey), metric: walletMetrics[c.key] })),
    ...everydayCards.map(c => ({ label: t(locale, c.labelKey), metric: walletMetrics[c.key] })),
    ...housingCards.map(c => ({ label: t(locale, c.labelKey), metric: housingMetrics[c.key] })),
    ...macroCards.map(c => ({ label: t(locale, c.labelKey), metric: macroMetrics[c.key] })),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">M</div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">{t(locale, 'siteTitle')}</h1>
              <p className="text-[10px] text-[#666666] tracking-wider uppercase">{t(locale, 'siteSubtitle')}</p>
            </div>
          </a>
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-1 text-xs">
              <a href="#wallet" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_wallet')}</a>
              <a href="#housing" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'housing')}</a>
              <a href="#gas-map" className="px-2 py-1 text-[#888] hover:text-white transition-colors">
                {locale === 'ko' ? '주유소' : locale === 'ja' ? 'ガソリン' : 'Gas'}
              </a>
              <a href="#macro" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_macro')}</a>
              <a href="#why" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_why')}</a>
              <a href="#presidents" className="px-2 py-1 text-[#888] hover:text-white transition-colors">
                {locale === 'ko' ? '대통령별' : locale === 'ja' ? '大統領別' : 'Presidents'}
              </a>
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

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{t(locale, 'siteDescription')}</h2>
            <p className="text-[#666666] text-sm">{t(locale, 'asOf')} 2026.03.10 · {t(locale, 'presidencyStart')}: {PRESIDENCY_START_LABEL}</p>
          </div>
          <LiveExchangeRate locale={locale} />
        </div>
      </section>

      {/* Section: Your Wallet — essentials */}
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
            <MetricCard key={card.key} metric={walletMetrics[card.key]} label={t(locale, card.labelKey)} unitLabel={t(locale, card.unitKey)} locale={locale} accentColor={card.color} />
          ))}
        </div>
      </section>

      {/* Section: Everyday Life — soju, coffee, chicken, subway, ramen */}
      <section id="everyday" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'everyday')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'everydayDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {everydayCards.map((card) => (
            <MetricCard key={card.key} metric={walletMetrics[card.key]} label={t(locale, card.labelKey)} unitLabel={t(locale, card.unitKey)} locale={locale} accentColor={card.color} />
          ))}
        </div>
      </section>

      {/* Section: Housing Crisis */}
      <section id="housing" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-rose-600 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'housing')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'housingDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {housingCards.map((card) => (
            <MetricCard key={card.key} metric={housingMetrics[card.key]} label={t(locale, card.labelKey)} unitLabel={t(locale, card.unitKey)} locale={locale} accentColor={card.color} />
          ))}
        </div>
        {/* Housing context callout */}
        <div className="mt-4 bg-[#111] border border-[#2a1515] rounded-lg p-4">
          <p className="text-sm font-mono text-[#cc6666]">
            {locale === 'ko'
              ? `서울 평균 아파트 구매까지 소득 대비 ${housingMetrics.housingIncomeRatio.currentValue}년 — 2008년 ${8.2}년에서 2.5배 증가. 전세 보증금은 같은 기간 ₩1.85억에서 ₩4.75억으로 상승.`
              : locale === 'ja'
              ? `ソウルの平均マンション購入まで所得比${housingMetrics.housingIncomeRatio.currentValue}年 — 2008年の${8.2}年から2.5倍増加。伝貰保証金は同期間1.85億ウォンから4.75億ウォンに上昇。`
              : `It takes ${housingMetrics.housingIncomeRatio.currentValue} years of income to buy a Seoul apartment — up 2.5x from ${8.2} years in 2008. Average jeonse deposit went from ₩185M to ₩475M in the same period.`}
          </p>
        </div>
      </section>

      {/* Section: Gas Price Map */}
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
                    <div className="flex-1 h-4 bg-[#1a1a1a] rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${Math.min(barWidth, 100)}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-mono font-bold w-16 text-right" style={{ color }}>₩{r.avgPrice.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Big Picture */}
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
            <MetricCard key={card.key} metric={macroMetrics[card.key]} label={t(locale, card.labelKey)} unitLabel="" locale={locale} accentColor={card.color} />
          ))}
        </div>
      </section>

      {/* Section: Why It's Happening */}
      <section id="why" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-yellow-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'whyHappening')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'whyHappeningDesc')}</p>
          </div>
        </div>

        {/* Impact indicator bar */}
        {activeImpact && (() => {
          const impactMetric = { ...walletMetrics, ...macroMetrics, ...housingMetrics }[activeImpact];
          if (!impactMetric) return null;
          const impactLabel = t(locale, activeImpact);
          const impactColor = impactMetric.trend === 'rising' ? '#ef4444' : impactMetric.trend === 'falling' ? '#22c55e' : '#eab308';
          return (
            <div className="mb-6 bg-[#111] border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: `${impactColor}40` }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: impactColor }} />
                <div>
                  <p className="text-[#888] text-[10px] font-mono uppercase">{locale === 'ko' ? '영향받는 지표' : locale === 'ja' ? '影響を受ける指標' : 'Impacted Metric'}</p>
                  <p className="text-white font-mono text-sm font-bold">{impactLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[#888] text-[10px] font-mono">{t(locale, 'presidencyStart')}</p>
                  <p className="text-[#666] font-mono text-sm">
                    {impactMetric.unit === '₩' ? `₩${impactMetric.presidencyStartValue.toLocaleString()}` : `${impactMetric.presidencyStartValue}${impactMetric.unit}`}
                  </p>
                </div>
                <div className="text-xl text-[#555]">→</div>
                <div className="text-right">
                  <p className="text-[#888] text-[10px] font-mono">{t(locale, 'today')}</p>
                  <p className="font-mono text-sm font-bold" style={{ color: impactColor }}>
                    {impactMetric.unit === '₩' ? `₩${impactMetric.currentValue.toLocaleString()}` : `${impactMetric.currentValue}${impactMetric.unit}`}
                  </p>
                </div>
                <span className="font-mono text-sm font-bold px-2 py-1 rounded" style={{ color: impactColor, backgroundColor: `${impactColor}15` }}>
                  {impactMetric.changePercent > 0 ? '↑' : '↓'} {Math.abs(impactMetric.changePercent)}%
                </span>
              </div>
              <button onClick={() => setActiveImpact(null)} className="text-[#555] hover:text-white text-xs font-mono transition-colors">✕</button>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CausalChain titleKey="gasChainTitle" stepKeys={['gasChainStep1', 'gasChainStep2', 'gasChainStep3', 'gasChainStep4', 'gasChainStep5']} locale={locale} color="#f59e0b" relatedMetric="gasPrice" activeImpact={activeImpact} onChainClick={handleImpactClick} />
            <CausalChain titleKey="exchangeChainTitle" stepKeys={['exchangeChainStep1', 'exchangeChainStep2', 'exchangeChainStep3', 'exchangeChainStep4', 'exchangeChainStep5']} locale={locale} color="#3b82f6" relatedMetric="usdKrw" activeImpact={activeImpact} onChainClick={handleImpactClick} />
            <CausalChain titleKey="debtChainTitle" stepKeys={['debtChainStep1', 'debtChainStep2', 'debtChainStep3', 'debtChainStep4', 'debtChainStep5']} locale={locale} color="#ef4444" relatedMetric="householdDebt" activeImpact={activeImpact} onChainClick={handleImpactClick} />
          </div>
          <Timeline events={timelineEvents} locale={locale} activeImpact={activeImpact} onEventClick={handleImpactClick} />
        </div>
      </section>

      {/* Section: Across Five Presidencies */}
      <section id="presidents" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 via-purple-500 to-yellow-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{t(locale, 'acrossPresidents')}</h2>
            <p className="text-[#666666] text-xs">{t(locale, 'acrossPresidentsDesc')}</p>
          </div>
        </div>
        <PresidencyComparison locale={locale} />
      </section>

      {/* Section: Current Presidency Compare */}
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
          <p className="text-[10px] text-[#444]">themonarchreport.org</p>
        </div>
      </footer>
    </div>
  );
}
