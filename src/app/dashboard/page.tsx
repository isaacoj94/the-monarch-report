'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { walletMetrics, macroMetrics, housingMetrics, timelineEvents, PRESIDENCY_START_LABEL, regionalGasPrices, LAST_UPDATED_LABEL } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';
import CausalChain from '@/components/CausalChain';
import CompareTable from '@/components/CompareTable';
import Timeline from '@/components/Timeline';
import GasMap from '@/components/GasMap';
import LiveExchangeRate from '@/components/LiveExchangeRate';
import PresidencyComparison from '@/components/PresidencyComparison';
import { useLocale } from '@/components/LocaleProvider';

const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

export default function Dashboard() {
  const { locale, setLocale } = useLocale();
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
    <div data-theme="light" className="min-h-screen bg-[#f5f2ec] text-[#241c24]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f5f2ec]/95 backdrop-blur-sm border-b border-[#d9d2ca]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" />
            </Link>
            <span className="text-[#b4aaa2] text-xs">|</span>
            <span className="text-[10px] text-[#6f666d] font-sans font-semibold uppercase tracking-wider">{t(locale, 'siteSubtitle')}</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-1 text-xs">
              <Link href="/" className="px-2 py-1 text-[#b8860b] hover:text-[#d4a017] transition-colors font-bold">← Home</Link>
              <a href="#wallet" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'nav_wallet')}</a>
              <a href="#housing" className="px-2 py-1 text-[#888] hover:text-white transition-colors">{t(locale, 'housing')}</a>
              <a href="#gas-map" className="px-2 py-1 text-[#888] hover:text-white transition-colors">
                {locale === 'ko' ? '유가' : locale === 'ja' ? 'ガソリン' : 'Gas'}
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
            <span className="block text-[#7b4d82] text-[10px] font-sans font-bold uppercase tracking-[.16em] mb-4">Korea data desk</span>
            <h2 className="text-4xl md:text-6xl font-serif font-semibold mb-4 leading-[.98] tracking-tight">{t(locale, 'siteDescription')}</h2>
            <p className="text-[#756c73] text-sm leading-relaxed">{t(locale, 'asOf')} {LAST_UPDATED_LABEL} · {t(locale, 'presidencyStart')}: {PRESIDENCY_START_LABEL}</p>
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
              {locale === 'ko' ? '숫자로 본 현실' : locale === 'ja' ? '数字で見る現実' : 'The Real Picture'}
            </h2>
            <p className="text-[#666666] text-xs">
              {locale === 'ko' ? '지표가 가계에 의미하는 바' : locale === 'ja' ? '指標が家計に意味すること' : 'What these numbers actually mean for everyday Koreans'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPI / Inflation */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '소비자물가지수 (CPI)' : locale === 'ja' ? '消費者物価指数 (CPI)' : 'Consumer Price Index (CPI)'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#eab308]">{macroMetrics.inflation.currentValue}%</span>
              <span className="text-xs text-[#666] font-sans">
                {locale === 'ko' ? '전년 대비' : locale === 'ja' ? '前年比' : 'year-over-year'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `소비자물가(CPI) ${macroMetrics.inflation.currentValue}%는 지난해 같은 장바구니를 올해 ${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()}원에 사야 한다는 뜻이다.`
                : locale === 'ja'
                ? `消費者物価（CPI）${macroMetrics.inflation.currentValue}%は、昨年10万ウォンで揃えた買い物かごが、今年は${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()}ウォンになる、ということだ。`
                : `CPI at ${macroMetrics.inflation.currentValue}% means everyday goods cost that much more than last year. If your grocery bill was ₩100,000, you now need ₩${(100000 * (1 + macroMetrics.inflation.currentValue / 100)).toLocaleString()} for the exact same items.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 공식 물가는 체감보다 낮다. 외식·교육·전세 부담은 지수에 다 잡히지 않는다.'
                  : locale === 'ja'
                  ? '⚠ 公式の物価は実感より低い。外食、教育、伝貰の負担は指数に乗り切れない。'
                  : '⚠ Official CPI understates real pain. Dining out, education, and housing costs rise faster than headline CPI captures — actual cost-of-living burden for families is significantly higher.'}
              </p>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💱</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '원/달러 환율' : locale === 'ja' ? 'ウォン/ドル為替' : 'Won-Dollar Exchange Rate'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#3b82f6]">₩{macroMetrics.usdKrw.currentValue.toLocaleString()}</span>
              <span className="text-xs text-[#666] font-sans">/ $1 USD</span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `원화가 약하면 수입품이 비싸다. 원유·밀·반도체 원자재는 달러로 산다. ₩${macroMetrics.usdKrw.currentValue}은 수입 물가 전반을 끌어올린다. 이명박 정부 때 ₩1,100대와 견주면 ${Math.round((macroMetrics.usdKrw.currentValue - 1100) / 1100 * 100)}% 올랐다.`
                : locale === 'ja'
                ? `ウォンが弱いと輸入品は高い。原油、小麦、半導体の原料はドルで買う。₩${macroMetrics.usdKrw.currentValue}は輸入物価全体を押し上げる。`
                : `A weaker won makes everything imported more expensive — oil, wheat, semiconductors, raw materials are all priced in dollars. At ₩${macroMetrics.usdKrw.currentValue}, import costs are ${Math.round((macroMetrics.usdKrw.currentValue - 1100) / 1100 * 100)}% higher than the ₩1,100 level seen under Lee Myung-bak.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 약세가 이어지면 외국인 자금 이탈, 주가 하락, 연기금 수익 악화로 번질 수 있다. 수출에는 이롭다는 말이 있으나, 내수 비중이 큰 한국에서는 서민 물가가 먼저 맞는다.'
                  : locale === 'ja'
                  ? '⚠ 安値が続けば、海外資金の流出、株安、年金運用の悪化へと広がりうる。輸出には追い風だという声もあるが、内需の大きい韓国では家計の物価が先に直撃する。'
                  : '⚠ Sustained won weakness risks a vicious cycle: foreign capital flight → stock market decline → pension fund losses. While exporters benefit from a cheap won, Korea\'s domestic-heavy economy means ordinary citizens bear the brunt through higher prices on everything.'}
              </p>
            </div>
          </div>

          {/* Household Debt */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏦</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '가계부채 / GDP' : locale === 'ja' ? '家計負債 / GDP' : 'Household Debt / GDP'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#ef4444]">{macroMetrics.householdDebt.currentValue}%</span>
              <span className="text-xs text-[#666] font-sans">
                {locale === 'ko' ? 'GDP 대비' : locale === 'ja' ? 'GDP比' : 'of GDP'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `가계부채는 GDP의 ${macroMetrics.householdDebt.currentValue}%로 세계 최고 수준이다. 나라 전체가 1년 버는 돈보다, 가계가 진 빚이 많다. OECD 평균은 60% 안팎이다.`
                : locale === 'ja'
                ? `家計負債はGDP比${macroMetrics.householdDebt.currentValue}%で世界最高水準。国が1年で稼ぐ額より、家計の借金のほうが多い。OECD平均はおよそ60%。`
                : `Korea's household debt is ${macroMetrics.householdDebt.currentValue}% of GDP — among the highest in the world. This means Korean families collectively owe more than the entire country earns in a year. The OECD average is around 60%.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 금리가 오르면 이자, 소비, 집값이 한꺼번에 맞는다. 이 부채 수준에서는 올려도 내려도 운신의 폭이 좁다.'
                  : locale === 'ja'
                  ? '⚠ 金利が上がれば利子、消費、住宅価格が同時にやられる。この負債水準では、上げても下げても余地が狭い。'
                  : '⚠ If rates rise, families face a triple shock: surging interest payments, consumption collapse, and falling home prices. At this debt level, the central bank is trapped — raising rates crushes households, cutting rates fuels more borrowing.'}
              </p>
            </div>
          </div>

          {/* Housing PIR */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏠</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '소득 대비 집값 (PIR)' : locale === 'ja' ? '所得対住宅価格比 (PIR)' : 'Price-to-Income Ratio (PIR)'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#dc2626]">{housingMetrics.housingIncomeRatio.currentValue}</span>
              <span className="text-xs text-[#666] font-sans">
                {locale === 'ko' ? '년 소득' : locale === 'ja' ? '年の所得' : 'years of income'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `서울 평균 아파트를 사려면 소득을 한 푼도 안 쓰고 ${housingMetrics.housingIncomeRatio.currentValue}년을 모아야 한다. 뉴욕은 8년, 도쿄는 10년 안팎. 2008년 서울은 8.2년이었다.`
                : locale === 'ja'
                ? `ソウルの平均マンションを買うには、所得を一切使わず${housingMetrics.housingIncomeRatio.currentValue}年貯める必要がある。ニューヨークは約8年、東京は約10年。`
                : `To buy an average Seoul apartment, you'd need to save every penny of your income for ${housingMetrics.housingIncomeRatio.currentValue} years. New York is ~8 years, Tokyo ~10 years. In 2008, Seoul was 8.2 years.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 청년의 내 집 마련은 사실상 막혔다. 전세 보증금도 뛰어 주거 사다리가 부러졌다. 출산율 급락의 한 축이다.'
                  : locale === 'ja'
                  ? '⚠ 若者の持ち家は事実上、閉ざされた。伝貰保証金も跳ね、住まいの梯子は折れた。出生率急落の一因だ。'
                  : '⚠ Homeownership has become virtually impossible for young Koreans. Jeonse deposits have also skyrocketed, destroying the housing ladder. This is a key driver of Korea\'s record-low birth rate.'}
              </p>
            </div>
          </div>

          {/* Youth Unemployment */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👤</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '청년실업률' : locale === 'ja' ? '若年失業率' : 'Youth Unemployment'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#a855f7]">{macroMetrics.youthUnemployment.currentValue}%</span>
              <span className="text-xs text-[#666] font-sans">
                {locale === 'ko' ? '15-29세' : locale === 'ja' ? '15-29歳' : 'ages 15-29'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `공식 수치는 ${macroMetrics.youthUnemployment.currentValue}%다. 아르바이트·단기직·구직 포기를 넣으면 체감 실업은 20%를 넘는다는 분석이 있다. ‘쉬었음’ 인구는 사상 최대다.`
                : locale === 'ja'
                ? `公式は${macroMetrics.youthUnemployment.currentValue}%。バイト、短期、就職を諦めた人を含めれば、実感の失業は20%を超えるという分析がある。`
                : `The official ${macroMetrics.youthUnemployment.currentValue}% understates the problem. Including part-timers, gig workers, and those who've given up job searching, the effective rate is estimated above 20%. The "resting" (not seeking work) population is at an all-time high.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 괜찮은 일자리 부족, 집값, 교육비가 겹치면 결혼과 출산이 밀린다. 합계출산율 0.72는 OECD 최저.'
                  : locale === 'ja'
                  ? '⚠ まともな仕事不足、住宅価格、教育費が重なれば、結婚も出産も後回しになる。合計出生率0.72はOECD最低。'
                  : '⚠ No good jobs + unaffordable housing + crushing education costs = young people not marrying or having children. Korea\'s fertility rate of 0.72 is the lowest in the OECD by far.'}
              </p>
            </div>
          </div>

          {/* National Debt */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏛️</span>
              <h3 className="text-white font-sans text-sm font-bold">
                {locale === 'ko' ? '국가부채 / GDP' : locale === 'ja' ? '国家負債 / GDP' : 'National Debt / GDP'}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-[#f97316]">{macroMetrics.nationalDebt.currentValue}%</span>
              <span className="text-xs text-[#666] font-sans">
                {locale === 'ko' ? 'GDP 대비' : locale === 'ja' ? 'GDP比' : 'of GDP'}
              </span>
            </div>
            <p className="text-[#999] text-xs font-sans leading-relaxed mb-3">
              {locale === 'ko'
                ? `국가부채는 GDP의 ${macroMetrics.nationalDebt.currentValue}%다. 2008년 28%에서 두 배 가까이 늘었다. 정부가 경기를 살리려 빚을 지면, 세금으로 갚는 쪽은 국민이다.`
                : locale === 'ja'
                ? `国家負債はGDP比${macroMetrics.nationalDebt.currentValue}%。2008年の28%からほぼ倍増した。政府が景気を支えるために借りれば、税で返すのは国民だ。`
                : `National debt has hit ${macroMetrics.nationalDebt.currentValue}% of GDP, nearly doubling from 28% in 2008. When the government borrows to stimulate the economy, taxpayers ultimately foot the bill through future tax hikes or reduced services.`}
            </p>
            <div className="border-t border-[#1a1a1a] pt-3">
              <p className="text-[#b8860b] text-[11px] font-sans leading-relaxed">
                {locale === 'ko'
                  ? '⚠ 고령화와 저출산으로 복지지출은 늘고 있다. 그 위에 국가부채가 커지면 다음 세대가 진다. 신용등급이 떨어지면 외채 이자까지 오른다.'
                  : locale === 'ja'
                  ? '⚠ 高齢化と少子化で福祉支出は増えている。その上に国家負債が膨らめば、次の世代が担う。格付けが落ちれば、対外債務の利子まで上がる。'
                  : '⚠ With an aging population and rock-bottom birth rate, welfare spending is ballooning. Rising national debt on top of this means future generations face higher taxes and fewer services. A credit downgrade would raise borrowing costs across the entire economy.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line callout */}
        <div className="mt-6 bg-[#111] border border-[#b8860b30] rounded-lg p-5">
          <h3 className="text-[#b8860b] font-sans text-sm font-bold mb-2">
            {locale === 'ko' ? '한 줄로' : locale === 'ja' ? '要するに' : '📌 The Bottom Line'}
          </h3>
          <p className="text-[#ccc] text-sm font-sans leading-relaxed">
            {locale === 'ko'
              ? '물가는 오르고 임금은 제자리다. 집은 더 멀어졌고 빚은 사상 최대다. 지지율 뉴스가 가리지 못하는 현실이다. 아래 지표에서 직접 확인하면 된다.'
              : locale === 'ja'
              ? '物価は上がり、賃金は横ばい。住まいは遠のき、借金は過去最高だ。支持率ニュースが覆い隠す現実である。下の指標で直接当たればよい。'
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
          <p className="text-sm font-sans text-[#cc6666]">
            {locale === 'ko'
              ? `서울 아파트, 소득 대비 ${housingMetrics.housingIncomeRatio.currentValue}년. 2008년 8.2년에서 2.5배로 늘었다. 전세 보증금은 같은 기간 1억 8500만 원에서 4억 7500만 원.`
              : locale === 'ja'
              ? `ソウルのマンションは所得比${housingMetrics.housingIncomeRatio.currentValue}年。2008年の8.2年から2.5倍。伝貰保証金は同期間、1億8500万ウォンから4億7500万ウォン。`
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
              {locale === 'ko' ? '전국 휘발유 가격' : locale === 'ja' ? '全国のガソリン価格' : 'Gas Prices Nationwide'}
            </h2>
            <p className="text-[#666666] text-xs">
              {locale === 'ko' ? '지역별 보통휘발유' : locale === 'ja' ? '地域別レギュラー' : 'Regional gasoline price overview'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GasMap locale={locale} />
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
            <h3 className="text-white font-sans text-sm font-bold mb-4">
              {locale === 'ko' ? '지역별 가격 (높은 순)' : locale === 'ja' ? '地域別価格（高い順）' : 'Price Ranking (Highest First)'}
            </h3>
            <div className="space-y-2">
              {[...regionalGasPrices].sort((a, b) => b.avgPrice - a.avgPrice).map((r, i) => {
                const name = locale === 'ko' ? r.regionKo : locale === 'ja' ? r.regionJa : r.region;
                const color = r.avgPrice >= 2000 ? '#ef4444' : r.avgPrice >= 1970 ? '#f97316' : r.avgPrice >= 1940 ? '#eab308' : '#22c55e';
                const barWidth = ((r.avgPrice - 1800) / (2150 - 1800)) * 100;
                return (
                  <div key={r.region} className="flex items-center gap-3">
                    <span className="text-[#555] text-xs font-sans w-5 text-right">{i + 1}</span>
                    <span className="text-[#ccc] text-xs font-sans w-20 truncate">{name}</span>
                    <div className="flex-1 h-4 bg-[#1a1a1a] rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${Math.min(barWidth, 100)}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-sans font-bold w-16 text-right" style={{ color }}>₩{r.avgPrice.toLocaleString()}</span>
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
                  <p className="text-[#888] text-[10px] font-sans uppercase">{locale === 'ko' ? '관련 지표' : locale === 'ja' ? '関連指標' : 'Impacted Metric'}</p>
                  <p className="text-white font-sans text-sm font-bold">{impactLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[#888] text-[10px] font-sans">{t(locale, 'presidencyStart')}</p>
                  <p className="text-[#666] font-sans text-sm">
                    {impactMetric.unit === '₩' ? `₩${impactMetric.presidencyStartValue.toLocaleString()}` : `${impactMetric.presidencyStartValue}${impactMetric.unit}`}
                  </p>
                </div>
                <div className="text-xl text-[#555]">→</div>
                <div className="text-right">
                  <p className="text-[#888] text-[10px] font-sans">{t(locale, 'today')}</p>
                  <p className="font-sans text-sm font-bold" style={{ color: impactColor }}>
                    {impactMetric.unit === '₩' ? `₩${impactMetric.currentValue.toLocaleString()}` : `${impactMetric.currentValue}${impactMetric.unit}`}
                  </p>
                </div>
                <span className="font-sans text-sm font-bold px-2 py-1 rounded" style={{ color: impactColor, backgroundColor: `${impactColor}15` }}>
                  {impactMetric.changePercent > 0 ? '↑' : '↓'} {Math.abs(impactMetric.changePercent)}%
                </span>
              </div>
              <button onClick={() => setActiveImpact(null)} className="text-[#555] hover:text-white text-xs font-sans transition-colors">✕</button>
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
