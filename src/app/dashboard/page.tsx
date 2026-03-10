'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, housingMetrics, timelineEvents, PRESIDENCY_START_LABEL, regionalGasPrices } from '@/lib/data';
import Image from 'next/image';
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
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" />
            </a>
            <span className="text-[#333] text-xs">|</span>
            <span className="text-[10px] text-[#888] font-mono uppercase tracking-wider">{t(locale, 'siteSubtitle')}</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-1 text-xs">
              <a href="/" className="px-2 py-1 text-[#b8860b] hover:text-[#d4a017] transition-colors font-bold">← Home</a>
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

      {/* Section: Economic Reality Check — plain-language explainer */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#b8860b] rounded-full" />
          <div>
            <h2 className="text-xl font-bold">
              {locale === 'ko' ? '경제 현실 요약' : locale === 'ja' ? '経済の現実' : 'The Real Picture'}
            </h2>
            <p className="text-[#666666] text-xs">
              {locale === 'ko' ? '숫자 뒤에 숨겨진 의미 — 전문가 시각으로 쉽게 풀어드립니다' : locale === 'ja' ? '数字の裏にある真実 — 専門家の視点でわかりやすく解説' : 'What these numbers actually mean for everyday Koreans'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPI / Inflation */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '소비자물가지수 (CPI)' : locale === 'ja' ? '消費者物価指数 (CPI)' : 'Consumer Price Index (CPI)'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#eab308]">{macroMetrics.inflation.currentValue}%</span>
              <span className="text-xs text-[#666] font-mono">
                {locale === 'ko' ? '전년 대비' : locale === 'ja' ? '前年比' : 'year-over-year'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `CPI ${macroMetrics.inflation.currentValue}%는 지난해 대비 물가가 그만큼 올랐다는 뜻입니다. 내가 작년에 10만 원어치 장을 봤다면, 올해 같은 물건을 사려면 ${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()}원이 필요합니다.`
                : locale === 'ja'
                ? `CPI ${macroMetrics.inflation.currentValue}%は、昨年比で物価がそれだけ上がったことを意味します。昨年10万ウォンで買えた物は、今年${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()}ウォン必要です。`
                : `CPI at ${macroMetrics.inflation.currentValue}% means everyday goods cost that much more than last year. If your grocery bill was ₩100,000, you now need ₩${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()} for the exact same items.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 공식 CPI는 체감 물가보다 낮게 나옵니다. 외식비·교육비·전세값 상승은 CPI에 제대로 반영되지 않아 실제 생활비 부담은 훨씬 큽니다.'
                  : locale === 'ja'
                  ? '⚠ 公式CPIは実感より低く出ます。外食費・教育費・住居費の上昇はCPIに十分反映されず、実際の生活費負担はさらに大きいです。'
                  : '⚠ Official CPI understates real pain. Dining out, education, and housing costs rise faster than headline CPI captures — actual cost-of-living burden for families is significantly higher.'}
              </p>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💱</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '원/달러 환율' : locale === 'ja' ? 'ウォン/ドル為替' : 'Won-Dollar Exchange Rate'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#3b82f6]">₩{macroMetrics.usdKrw.currentValue.toLocaleString()}</span>
              <span className="text-xs text-[#666] font-mono">/ $1 USD</span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `환율이 높을수록 수입품이 비싸집니다. 원유·밀·반도체 원자재를 달러로 사야 하므로, ₩${macroMetrics.usdKrw.currentValue}은 모든 수입 물가를 끌어올립니다. 이명박 정부 시절 ₩1,100대였던 환율과 비교하면 ${Math.round((macroMetrics.usdKrw.currentValue - 1100) / 1100 * 100)}% 상승입니다.`
                : locale === 'ja'
                ? `為替が高いほど輸入品が高くなります。原油・小麦・半導体原材料をドルで購入するため、₩${macroMetrics.usdKrw.currentValue}は全輸入物価を押し上げます。`
                : `A weaker won makes everything imported more expensive — oil, wheat, semiconductors, raw materials are all priced in dollars. At ₩${macroMetrics.usdKrw.currentValue}, import costs are ${Math.round((macroMetrics.usdKrw.currentValue - 1100) / 1100 * 100)}% higher than the ₩1,100 level seen under Lee Myung-bak.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 원화 약세가 지속되면 외국인 투자 이탈 → 주가 하락 → 연기금 수익 악화의 악순환이 올 수 있습니다. 수출 기업에 유리하다는 주장도 있으나, 내수 의존도가 높은 한국 경제에서는 서민 물가 직격탄입니다.'
                  : locale === 'ja'
                  ? '⚠ ウォン安が続くと、外国人投資撤退→株価下落→年金収益悪化の悪循環の恐れがあります。'
                  : '⚠ Sustained won weakness risks a vicious cycle: foreign capital flight → stock market decline → pension fund losses. While exporters benefit from a cheap won, Korea\'s domestic-heavy economy means ordinary citizens bear the brunt through higher prices on everything.'}
              </p>
            </div>
          </div>

          {/* Household Debt */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏦</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '가계부채 / GDP' : locale === 'ja' ? '家計負債 / GDP' : 'Household Debt / GDP'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#ef4444]">{macroMetrics.householdDebt.currentValue}%</span>
              <span className="text-xs text-[#666] font-mono">
                {locale === 'ko' ? 'GDP 대비' : locale === 'ja' ? 'GDP比' : 'of GDP'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `한국의 가계부채는 GDP의 ${macroMetrics.householdDebt.currentValue}%로 세계 최고 수준입니다. 쉽게 말해, 나라 전체가 1년간 버는 돈보다 가계가 진 빚이 더 많다는 뜻입니다. OECD 평균은 약 60%입니다.`
                : locale === 'ja'
                ? `韓国の家計負債はGDPの${macroMetrics.householdDebt.currentValue}%で世界最高水準です。国全体の1年の収入より家計の借金が多いことを意味します。OECD平均は約60%です。`
                : `Korea's household debt is ${macroMetrics.householdDebt.currentValue}% of GDP — among the highest in the world. This means Korean families collectively owe more than the entire country earns in a year. The OECD average is around 60%.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 금리가 오르면 이자 부담 폭증, 소비 위축, 부동산 가격 하락의 트리플 충격이 옵니다. 가계부채 비율이 이 수준이면 금리를 올리기도, 내리기도 어려운 정책의 딜레마에 빠집니다.'
                  : locale === 'ja'
                  ? '⚠ 金利が上がれば利子負担急増、消費萎縮、不動産価格下落のトリプルショックが来ます。この負債水準では金利を上げることも下げることも難しい政策のジレンマに陥ります。'
                  : '⚠ If rates rise, families face a triple shock: surging interest payments, consumption collapse, and falling home prices. At this debt level, the central bank is trapped — raising rates crushes households, cutting rates fuels more borrowing.'}
              </p>
            </div>
          </div>

          {/* Housing PIR */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏠</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '소득 대비 집값 (PIR)' : locale === 'ja' ? '所得対住宅価格比 (PIR)' : 'Price-to-Income Ratio (PIR)'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#dc2626]">{housingMetrics.housingIncomeRatio.currentValue}</span>
              <span className="text-xs text-[#666] font-mono">
                {locale === 'ko' ? '년 소득' : locale === 'ja' ? '年の所得' : 'years of income'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `서울에서 평균 아파트를 사려면 한 푼도 안 쓰고 ${housingMetrics.housingIncomeRatio.currentValue}년을 모아야 합니다. 뉴욕은 약 8년, 도쿄는 약 10년입니다. 2008년에는 8.2년이었습니다.`
                : locale === 'ja'
                ? `ソウルで平均的なマンションを買うには、一銭も使わず${housingMetrics.housingIncomeRatio.currentValue}年貯金する必要があります。ニューヨークは約8年、東京は約10年です。`
                : `To buy an average Seoul apartment, you'd need to save every penny of your income for ${housingMetrics.housingIncomeRatio.currentValue} years. New York is ~8 years, Tokyo ~10 years. In 2008, Seoul was 8.2 years.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 청년층 내 집 마련이 사실상 불가능해졌습니다. 전세 보증금도 급등해 주거 사다리가 무너지고 있으며, 이는 출산율 급락의 핵심 원인 중 하나입니다.'
                  : locale === 'ja'
                  ? '⚠ 若者の持ち家取得が事実上不可能になっています。伝貰保証金も急騰し住居の梯子が崩壊、出生率急落の主因の一つです。'
                  : '⚠ Homeownership has become virtually impossible for young Koreans. Jeonse deposits have also skyrocketed, destroying the housing ladder. This is a key driver of Korea\'s record-low birth rate.'}
              </p>
            </div>
          </div>

          {/* Youth Unemployment */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👤</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '청년실업률' : locale === 'ja' ? '若年失業率' : 'Youth Unemployment'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#a855f7]">{macroMetrics.youthUnemployment.currentValue}%</span>
              <span className="text-xs text-[#666] font-mono">
                {locale === 'ko' ? '15-29세' : locale === 'ja' ? '15-29歳' : 'ages 15-29'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `공식 수치는 ${macroMetrics.youthUnemployment.currentValue}%이지만, 알바·단기직·취업 포기자를 포함한 체감실업률은 20%를 넘는다는 분석이 있습니다. "쉬었음" 인구가 역대 최고치를 기록 중입니다.`
                : locale === 'ja'
                ? `公式数値は${macroMetrics.youthUnemployment.currentValue}%ですが、アルバイト・短期職・就職断念者を含めた体感失業率は20%を超えるという分析があります。`
                : `The official ${macroMetrics.youthUnemployment.currentValue}% understates the problem. Including part-timers, gig workers, and those who've given up job searching, the effective rate is estimated above 20%. The "resting" (not seeking work) population is at an all-time high.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 양질의 일자리 부족 + 높은 집값 + 교육비 부담 = 결혼·출산 기피로 이어지며, 한국의 합계출산율 0.72는 OECD 최저입니다.'
                  : locale === 'ja'
                  ? '⚠ 良質な雇用不足+高い住宅価格+教育費負担=結婚・出産忌避につながり、韓国の合計出生率0.72はOECD最低です。'
                  : '⚠ No good jobs + unaffordable housing + crushing education costs = young people not marrying or having children. Korea\'s fertility rate of 0.72 is the lowest in the OECD by far.'}
              </p>
            </div>
          </div>

          {/* National Debt */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏛️</span>
              <h3 className="text-white font-mono text-sm font-bold">
                {locale === 'ko' ? '국가부채 / GDP' : locale === 'ja' ? '国家負債 / GDP' : 'National Debt / GDP'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#f97316]">{macroMetrics.nationalDebt.currentValue}%</span>
              <span className="text-xs text-[#666] font-mono">
                {locale === 'ko' ? 'GDP 대비' : locale === 'ja' ? 'GDP比' : 'of GDP'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-mono leading-relaxed mb-3">
              {locale === 'ko'
                ? `국가부채가 GDP의 ${macroMetrics.nationalDebt.currentValue}%입니다. 2008년 28%에서 2배 가까이 늘었습니다. 정부가 경기 부양을 위해 빚을 내면, 결국 세금으로 갚아야 하는 건 국민입니다.`
                : locale === 'ja'
                ? `国家負債がGDPの${macroMetrics.nationalDebt.currentValue}%です。2008年の28%から倍近く増えました。政府が景気刺激のために借金すれば、結局税金で返すのは国民です。`
                : `National debt has hit ${macroMetrics.nationalDebt.currentValue}% of GDP, nearly doubling from 28% in 2008. When the government borrows to stimulate the economy, taxpayers ultimately foot the bill through future tax hikes or reduced services.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-mono leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 고령화 + 저출산으로 복지 지출이 급증하는 상황에서 국가부채 확대는 미래 세대에 더 큰 부담을 지웁니다. 재정 건전성 악화 시 국가신용등급 하락 → 외채 이자 상승 리스크도 있습니다.'
                  : locale === 'ja'
                  ? '⚠ 高齢化+少子化で福祉支出が急増する状況で国家負債拡大は将来世代にさらなる負担を課します。'
                  : '⚠ With an aging population and rock-bottom birth rate, welfare spending is ballooning. Rising national debt on top of this means future generations face higher taxes and fewer services. A credit downgrade would raise borrowing costs across the entire economy.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line callout */}
        <div className="mt-6 bg-[#111] border border-[#b8860b30] rounded-lg p-5">
          <h3 className="text-[#b8860b] font-mono text-sm font-bold mb-2">
            {locale === 'ko' ? '📌 한눈에 보는 핵심' : locale === 'ja' ? '📌 一目でわかるポイント' : '📌 The Bottom Line'}
          </h3>
          <p className="text-[#ccc] text-sm font-mono leading-relaxed">
            {locale === 'ko'
              ? '물가는 오르고, 월급은 제자리이고, 집은 더 비싸졌고, 빚은 역대 최고입니다. 한국 뉴스에서는 대통령 지지율만 보도하지만, 이 숫자들이 국민이 실제로 느끼는 현실입니다. 아래 대시보드에서 각 지표를 직접 확인해 보세요.'
              : locale === 'ja'
              ? '物価は上がり、給料は横ばい、住宅はさらに高くなり、借金は過去最高です。韓国ニュースでは大統領支持率だけ報道されますが、これらの数字が国民が実際に感じている現実です。'
              : 'Prices are rising, wages are stagnant, homes are more unaffordable than ever, and debt is at record highs. Korean media focuses on presidential approval ratings, but these are the numbers that reflect what people actually experience. Explore the full dashboard below.'}
          </p>
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
            <Image src="/logos/icon-gold.png" alt="" width={20} height={20} className="w-5 h-5 opacity-60" />
            <span className="text-xs text-[#666]">{t(locale, 'siteTitle')} — {t(locale, 'siteSubtitle')}</span>
          </div>
          <p className="text-[10px] text-[#444] text-center max-w-md">{t(locale, 'disclaimer')}</p>
          <p className="text-[10px] text-[#444]">themonarchreport.org</p>
        </div>
      </footer>
    </div>
  );
}
