'use client';

import { useState, useEffect } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, PRESIDENT_NAME, PRESIDENCY_START_LABEL } from '@/lib/data';
import LiveExchangeRate from '@/components/LiveExchangeRate';

const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

interface ExchangeData {
  rate: number;
  date: string;
  source: string;
}

const heroText: Record<Locale, { headline: string; sub: string; cta: string; ctaSub: string }> = {
  en: {
    headline: 'Your government says the economy is fine.',
    sub: 'The numbers tell a different story.',
    cta: 'See the Full Dashboard',
    ctaSub: 'Real prices. Real data. Real impact.',
  },
  ko: {
    headline: '정부는 경제가 괜찮다고 말합니다.',
    sub: '숫자는 다른 이야기를 합니다.',
    cta: '전체 대시보드 보기',
    ctaSub: '실제 가격. 실제 데이터. 실제 영향.',
  },
  ja: {
    headline: '政府は経済は大丈夫だと言います。',
    sub: '数字は別の物語を語ります。',
    cta: 'フルダッシュボードを見る',
    ctaSub: 'リアルな価格。リアルなデータ。リアルな影響。',
  },
};

function HighlightCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-all hover:translate-y-[-2px]">
      <p className="text-[#777] text-[10px] font-mono uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-xl font-mono font-bold">{value}</p>
      <p className="text-xs font-mono mt-1" style={{ color }}>
        {change}
      </p>
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [liveRate, setLiveRate] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then(r => r.json())
      .then((d: ExchangeData) => setLiveRate(d.rate))
      .catch(() => {});
  }, []);

  const hero = heroText[locale];
  const presidentName = PRESIDENT_NAME[locale];

  const highlights = [
    {
      label: locale === 'ko' ? '휘발유' : locale === 'ja' ? 'ガソリン' : 'Gasoline',
      value: `₩${walletMetrics.gasPrice.currentValue.toLocaleString()}/L`,
      change: `↑ ${walletMetrics.gasPrice.changePercent}% ${locale === 'ko' ? '취임 이후' : locale === 'ja' ? '就任以降' : `since ${PRESIDENCY_START_LABEL}`}`,
      color: '#ef4444',
    },
    {
      label: 'USD/KRW',
      value: liveRate ? `₩${liveRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `₩${macroMetrics.usdKrw.currentValue.toLocaleString()}`,
      change: liveRate ? (locale === 'ko' ? '실시간' : locale === 'ja' ? 'ライブ' : 'Live') : `↑ ${macroMetrics.usdKrw.changePercent}%`,
      color: liveRate ? '#3b82f6' : '#ef4444',
    },
    {
      label: locale === 'ko' ? '가계부채/GDP' : locale === 'ja' ? '家計負債/GDP' : 'Household Debt/GDP',
      value: `${macroMetrics.householdDebt.currentValue}%`,
      change: `↑ ${macroMetrics.householdDebt.changePercent}%`,
      color: '#ef4444',
    },
    {
      label: locale === 'ko' ? '물가상승률' : locale === 'ja' ? 'インフレ率' : 'Inflation (CPI)',
      value: `${macroMetrics.inflation.currentValue}%`,
      change: `↑ ${macroMetrics.inflation.changePercent}%`,
      color: '#eab308',
    },
    {
      label: locale === 'ko' ? '전기 요금' : locale === 'ja' ? '電気代' : 'Electricity Bill',
      value: `₩${walletMetrics.electricityBill.currentValue.toLocaleString()}`,
      change: `↑ ${walletMetrics.electricityBill.changePercent}%`,
      color: '#a855f7',
    },
    {
      label: locale === 'ko' ? '서울 월세' : locale === 'ja' ? 'ソウル家賃' : 'Seoul Rent',
      value: `₩${(walletMetrics.seoulRent.currentValue / 10000).toFixed(1)}${locale === 'ko' ? '만' : locale === 'ja' ? '万' : '0k'}`,
      change: `↑ ${walletMetrics.seoulRent.changePercent}%`,
      color: '#6366f1',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">M</div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">{t(locale, 'siteTitle')}</h1>
              <p className="text-[10px] text-[#666666] tracking-wider uppercase">{t(locale, 'siteSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="hidden sm:block text-xs font-mono px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              {hero.cta} →
            </a>
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
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
          <div className="max-w-3xl">
            <p className="text-red-500 text-xs font-mono uppercase tracking-widest mb-4">
              {locale === 'ko' ? '대한민국' : locale === 'ja' ? '大韓民国' : 'Republic of Korea'} · {presidentName} · {PRESIDENCY_START_LABEL} —
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
              {hero.headline}
            </h2>
            <p className="text-[#888] text-xl md:text-2xl font-light">
              {hero.sub}
            </p>
          </div>

          {/* Live Exchange Rate */}
          <div className="mt-8">
            <LiveExchangeRate locale={locale} />
          </div>
        </section>

        {/* Highlight Grid */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {highlights.map((h) => (
              <HighlightCard key={h.label} {...h} />
            ))}
          </div>
        </section>

        {/* Why this matters */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-[#111] border border-[#222] rounded-lg p-6 md:p-8">
            <h3 className="text-white font-mono text-lg font-bold mb-4">
              {locale === 'ko' ? '왜 이것이 중요한가' : locale === 'ja' ? 'なぜこれが重要なのか' : 'Why This Matters'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm font-mono text-[#999] leading-relaxed">
              <div>
                <div className="w-8 h-1 bg-red-500 rounded mb-3" />
                <p>
                  {locale === 'ko'
                    ? '정부 발표 경제지표와 국민이 체감하는 현실 사이에는 큰 괴리가 있습니다. 이 대시보드는 그 격차를 보여줍니다.'
                    : locale === 'ja'
                    ? '政府発表の経済指標と国民が実感する現実には大きなギャップがあります。このダッシュボードはそのギャップを示します。'
                    : 'There is a growing gap between official economic indicators and the reality people experience. This dashboard shows that gap.'}
                </p>
              </div>
              <div>
                <div className="w-8 h-1 bg-blue-500 rounded mb-3" />
                <p>
                  {locale === 'ko'
                    ? '남양주 등 수도권 일부 지역에서 이미 휘발유가 리터당 2,000원을 넘었습니다. "배럴당 150달러"가 아닌 "리터당 2,000원"이 국민의 현실입니다.'
                    : locale === 'ja'
                    ? '南楊州など首都圏の一部地域ではすでにガソリンが1リットル2,000ウォンを超えています。「1バレル150ドル」ではなく「1リットル2,000ウォン」が国民の現実です。'
                    : 'In areas like Namyangju, gas has already crossed ₩2,000 per liter. "150 barrels of oil" means nothing — ₩2,000 per liter is what people actually feel.'}
                </p>
              </div>
              <div>
                <div className="w-8 h-1 bg-yellow-500 rounded mb-3" />
                <p>
                  {locale === 'ko'
                    ? '이란 제재, 원화 약세, 가계부채 — 이 모든 것이 여러분의 장바구니와 월세에 직접적으로 연결됩니다. 정책 결정의 실제 비용을 추적합니다.'
                    : locale === 'ja'
                    ? 'イラン制裁、ウォン安、家計負債 — これらすべてがあなたの買い物かごと家賃に直接つながっています。政策決定の実際のコストを追跡します。'
                    : 'Iran sanctions, a weak won, household debt — all of these connect directly to your grocery cart and your rent. We track the real cost of policy decisions.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 pb-20 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-mono px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {hero.cta} →
          </a>
          <p className="text-[#555] text-xs font-mono mt-3">{hero.ctaSub}</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-[8px] font-bold">M</div>
            <span className="text-xs text-[#666]">{t(locale, 'siteTitle')}</span>
          </div>
          <p className="text-[10px] text-[#444] text-center max-w-md">{t(locale, 'disclaimer')}</p>
          <p className="text-[10px] text-[#444]">themonarchreport.org</p>
        </div>
      </footer>
    </div>
  );
}
