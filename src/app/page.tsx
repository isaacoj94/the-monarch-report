'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, timelineEvents } from '@/lib/data';
import MetricCard from '@/components/MetricCard';
import CausalChain from '@/components/CausalChain';
import CompareTable from '@/components/CompareTable';
import Timeline from '@/components/Timeline';

const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

export default function Home() {
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
    ...walletCards.map(c => ({
      label: t(locale, c.labelKey),
      metric: walletMetrics[c.key],
    })),
    ...macroCards.map(c => ({
      label: t(locale, c.labelKey),
      metric: macroMetrics[c.key],
    })),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">{t(locale, 'siteTitle')}</h1>
              <p className="text-[10px] text-[#666666] tracking-wider uppercase">{t(locale, 'siteSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <a href="#wallet" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_wallet')}</a>
              <a href="#macro" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_macro')}</a>
              <a href="#why" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_why')}</a>
              <a href="#compare" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_compare')}</a>
            </nav>

            <div className="flex items-center gap-1 border border-[#222] rounded-md p-0.5">
              {(Object.keys(localeLabels) as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 text-[10px] rounded transition-colors ${
                    locale === l
                      ? 'bg-[#222] text-white'
                      : 'text-[#666] hover:text-white'
                  }`}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {t(locale, 'siteDescription')}
          </h2>
          <p className="text-[#666666] text-sm">
            {t(locale, 'asOf')} 2026.03.10 — {t(locale, 'disclaimer')}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[#666] text-xs">USD/KRW ₩{macroMetrics.usdKrw.currentValue.toLocaleString()}</span>
          <span className="text-[#333] text-xs">|</span>
          <span className="text-[#666] text-xs">{t(locale, 'gasPrice')} ₩{walletMetrics.gasPrice.currentValue.toLocaleString()}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          <div>
            <Timeline events={timelineEvents} locale={locale} />
          </div>
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
          <p className="text-[10px] text-[#444] text-center max-w-md">
            {t(locale, 'disclaimer')}
          </p>
          <p className="text-[10px] text-[#444]">{t(locale, 'lastUpdated')}: 2026.03.10</p>
        </div>
      </footer>
    </div>
  );
}
