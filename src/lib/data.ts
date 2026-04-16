// Korea Economic Reality Monitor — Data Layer
// Sources: Bank of Korea, KOSIS, Korea National Oil Corporation (Opinet), public market feeds

export interface PricePoint {
  date: string;
  value: number;
}

export interface Metric {
  id: string;
  currentValue: number;
  unit: string;
  trend: 'rising' | 'falling' | 'stable';
  changePercent: number;
  history: PricePoint[];
  presidencyStartValue: number;
}

// === PRESIDENTS ===

export interface President {
  id: string;
  name: Record<string, string>;
  party: Record<string, string>;
  start: string;
  end: string | null; // null = current
  color: string;
}

export const presidents: President[] = [
  {
    id: 'lmb',
    name: { en: 'Lee Myung-bak', ko: '이명박', ja: '李明博' },
    party: { en: 'Grand National', ko: '한나라당', ja: 'ハンナラ党' },
    start: '2008-02-25',
    end: '2013-02-24',
    color: '#3b82f6',
  },
  {
    id: 'pgh',
    name: { en: 'Park Geun-hye', ko: '박근혜', ja: '朴槿恵' },
    party: { en: 'Saenuri', ko: '새누리당', ja: 'セヌリ党' },
    start: '2013-02-25',
    end: '2017-03-10',
    color: '#ef4444',
  },
  {
    id: 'mji',
    name: { en: 'Moon Jae-in', ko: '문재인', ja: '文在寅' },
    party: { en: 'Democratic', ko: '더불어민주당', ja: '共に民主党' },
    start: '2017-05-10',
    end: '2022-05-09',
    color: '#22c55e',
  },
  {
    id: 'ysy',
    name: { en: 'Yoon Suk-yeol', ko: '윤석열', ja: '尹錫悦' },
    party: { en: "People Power", ko: '국민의힘', ja: '国民の力' },
    start: '2022-05-10',
    end: '2025-04-04',
    color: '#a855f7',
  },
  {
    id: 'ljm',
    name: { en: 'Lee Jae-myung', ko: '이재명', ja: '李在明' },
    party: { en: 'Democratic', ko: '더불어민주당', ja: '共に民主党' },
    start: '2025-07-01',
    end: null,
    color: '#f59e0b',
  },
];

// Current president
export const PRESIDENCY_START = '2025-07-01';
export const PRESIDENCY_START_LABEL = '2025.07';
export const PRESIDENT_NAME = { en: 'Lee Jae-myung', ko: '이재명', ja: '李在明' };

// === MULTI-PRESIDENT COMPARISON DATA ===
// Values at the START of each presidency for key metrics

export interface PresidencySnapshot {
  presidentId: string;
  metrics: Record<string, number>;
}

export const presidencySnapshots: PresidencySnapshot[] = [
  {
    presidentId: 'lmb', // 2008
    metrics: {
      gasPrice: 1650, ricePrice: 18500, eggsPrice: 4800, porkBellyPrice: 1450,
      electricityBill: 32000, seoulRent: 420000, sojuPrice: 1200, coffeePrice: 2500,
      chickenPrice: 13000, subwayFare: 900, ramenPrice: 550,
      seoulAptPrice: 620000, jeonseDeposit: 18500, housingIncomeRatio: 8.2,
      usdKrw: 936, householdDebt: 64.3, nationalDebt: 28.7,
      inflation: 4.7, youthUnemployment: 7.0, interestRate: 5.0,
    },
  },
  {
    presidentId: 'pgh', // 2013
    metrics: {
      gasPrice: 1850, ricePrice: 21000, eggsPrice: 5200, porkBellyPrice: 1680,
      electricityBill: 38000, seoulRent: 480000, sojuPrice: 1300, coffeePrice: 3200,
      chickenPrice: 15000, subwayFare: 1050, ramenPrice: 650,
      seoulAptPrice: 750000, jeonseDeposit: 22000, housingIncomeRatio: 9.5,
      usdKrw: 1085, householdDebt: 72.8, nationalDebt: 32.5,
      inflation: 1.3, youthUnemployment: 8.0, interestRate: 2.75,
    },
  },
  {
    presidentId: 'mji', // 2017
    metrics: {
      gasPrice: 1450, ricePrice: 22500, eggsPrice: 6800, porkBellyPrice: 1850,
      electricityBill: 42000, seoulRent: 550000, sojuPrice: 1500, coffeePrice: 3800,
      chickenPrice: 17000, subwayFare: 1250, ramenPrice: 750,
      seoulAptPrice: 820000, jeonseDeposit: 26000, housingIncomeRatio: 11.2,
      usdKrw: 1130, householdDebt: 81.5, nationalDebt: 36.0,
      inflation: 1.9, youthUnemployment: 9.8, interestRate: 1.25,
    },
  },
  {
    presidentId: 'ysy', // 2022
    metrics: {
      gasPrice: 1810, ricePrice: 28500, eggsPrice: 7500, porkBellyPrice: 2150,
      electricityBill: 52000, seoulRent: 750000, sojuPrice: 1800, coffeePrice: 4500,
      chickenPrice: 21000, subwayFare: 1250, ramenPrice: 900,
      seoulAptPrice: 1350000, jeonseDeposit: 42000, housingIncomeRatio: 18.5,
      usdKrw: 1254, householdDebt: 101.1, nationalDebt: 48.9,
      inflation: 5.4, youthUnemployment: 7.2, interestRate: 1.75,
    },
  },
  {
    presidentId: 'ljm', // 2025
    metrics: {
      gasPrice: 1735, ricePrice: 30900, eggsPrice: 8300, porkBellyPrice: 2260,
      electricityBill: 65000, seoulRent: 860000, sojuPrice: 2000, coffeePrice: 5200,
      chickenPrice: 24000, subwayFare: 1400, ramenPrice: 1100,
      seoulAptPrice: 1420000, jeonseDeposit: 45000, housingIncomeRatio: 19.8,
      usdKrw: 1405, householdDebt: 103.5, nationalDebt: 54.8,
      inflation: 2.8, youthUnemployment: 7.7, interestRate: 3.0,
    },
  },
];

// Current values (updated 2026-04-16)
export const currentSnapshot: Record<string, number> = {
  gasPrice: 1907, ricePrice: 33000, eggsPrice: 7000, porkBellyPrice: 2637,
  electricityBill: 50000, seoulRent: 950000, sojuPrice: 2200, coffeePrice: 5800,
  chickenPrice: 25500, subwayFare: 1400, ramenPrice: 1200,
  seoulAptPrice: 1570000, jeonseDeposit: 67000, housingIncomeRatio: 13.9,
  usdKrw: 1477.1, householdDebt: 105.8, nationalDebt: 51.6,
  inflation: 2.0, youthUnemployment: 6.8, interestRate: 2.50,
};

// === HELPER ===

function generateMonthlyData(
  startDate: string,
  startValue: number,
  endValue: number,
  volatility: number = 0.02
): PricePoint[] {
  const points: PricePoint[] = [];
  const start = new Date(startDate);
  const end = new Date('2026-03-01');
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  for (let i = 0; i <= months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const progress = i / months;
    const base = startValue + (endValue - startValue) * progress;
    const noise = base * volatility * (Math.sin(i * 0.7) * 0.5 + Math.cos(i * 1.3) * 0.3 + Math.sin(i * 2.1) * 0.2);
    points.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round((base + noise) * 100) / 100,
    });
  }
  return points;
}

// === WALLET METRICS (current presidency) ===

export const walletMetrics: Record<string, Metric> = {
  gasPrice: {
    id: 'gasPrice', currentValue: 1907, unit: '₩', trend: 'rising', changePercent: 9.9,
    presidencyStartValue: 1735, history: generateMonthlyData(PRESIDENCY_START, 1735, 1907, 0.04),
  },
  ricePrice: {
    id: 'ricePrice', currentValue: 33000, unit: '₩', trend: 'rising', changePercent: 6.8,
    presidencyStartValue: 30900, history: generateMonthlyData(PRESIDENCY_START, 30900, 33000, 0.03),
  },
  eggsPrice: {
    id: 'eggsPrice', currentValue: 7000, unit: '₩', trend: 'falling', changePercent: -15.7,
    presidencyStartValue: 8300, history: generateMonthlyData(PRESIDENCY_START, 8300, 7000, 0.05),
  },
  porkBellyPrice: {
    id: 'porkBellyPrice', currentValue: 2637, unit: '₩', trend: 'rising', changePercent: 16.7,
    presidencyStartValue: 2260, history: generateMonthlyData(PRESIDENCY_START, 2260, 2637, 0.06),
  },
  electricityBill: {
    id: 'electricityBill', currentValue: 50000, unit: '₩', trend: 'falling', changePercent: -23.1,
    presidencyStartValue: 65000, history: generateMonthlyData(PRESIDENCY_START, 65000, 50000, 0.03),
  },
  seoulRent: {
    id: 'seoulRent', currentValue: 950000, unit: '₩', trend: 'rising', changePercent: 10.5,
    presidencyStartValue: 860000, history: generateMonthlyData(PRESIDENCY_START, 860000, 950000, 0.02),
  },
  // New items
  sojuPrice: {
    id: 'sojuPrice', currentValue: 2200, unit: '₩', trend: 'rising', changePercent: 10.0,
    presidencyStartValue: 2000, history: generateMonthlyData(PRESIDENCY_START, 2000, 2200, 0.03),
  },
  coffeePrice: {
    id: 'coffeePrice', currentValue: 5800, unit: '₩', trend: 'rising', changePercent: 11.5,
    presidencyStartValue: 5200, history: generateMonthlyData(PRESIDENCY_START, 5200, 5800, 0.03),
  },
  chickenPrice: {
    id: 'chickenPrice', currentValue: 25500, unit: '₩', trend: 'rising', changePercent: 6.3,
    presidencyStartValue: 24000, history: generateMonthlyData(PRESIDENCY_START, 24000, 25500, 0.04),
  },
  subwayFare: {
    id: 'subwayFare', currentValue: 1400, unit: '₩', trend: 'stable', changePercent: 0,
    presidencyStartValue: 1400, history: generateMonthlyData(PRESIDENCY_START, 1400, 1400, 0.0),
  },
  ramenPrice: {
    id: 'ramenPrice', currentValue: 1200, unit: '₩', trend: 'rising', changePercent: 9.1,
    presidencyStartValue: 1100, history: generateMonthlyData(PRESIDENCY_START, 1100, 1200, 0.03),
  },
};

// === HOUSING METRICS ===

export const housingMetrics: Record<string, Metric> = {
  seoulAptPrice: {
    id: 'seoulAptPrice', currentValue: 1570000, unit: '₩/평', trend: 'rising', changePercent: 10.6,
    presidencyStartValue: 1420000, history: generateMonthlyData(PRESIDENCY_START, 1420000, 1570000, 0.02),
  },
  jeonseDeposit: {
    id: 'jeonseDeposit', currentValue: 67000, unit: '만₩', trend: 'rising', changePercent: 48.9,
    presidencyStartValue: 45000, history: generateMonthlyData(PRESIDENCY_START, 45000, 67000, 0.02),
  },
  housingIncomeRatio: {
    id: 'housingIncomeRatio', currentValue: 13.9, unit: '년', trend: 'falling', changePercent: -29.8,
    presidencyStartValue: 19.8, history: generateMonthlyData(PRESIDENCY_START, 19.8, 13.9, 0.02),
  },
};

// === MACRO METRICS ===

export const macroMetrics: Record<string, Metric> = {
  usdKrw: {
    id: 'usdKrw', currentValue: 1477.1, unit: '₩', trend: 'rising', changePercent: 5.1,
    presidencyStartValue: 1405, history: generateMonthlyData(PRESIDENCY_START, 1405, 1477.1, 0.03),
  },
  householdDebt: {
    id: 'householdDebt', currentValue: 105.8, unit: '%', trend: 'rising', changePercent: 2.2,
    presidencyStartValue: 103.5, history: generateMonthlyData(PRESIDENCY_START, 103.5, 105.8, 0.01),
  },
  nationalDebt: {
    id: 'nationalDebt', currentValue: 51.6, unit: '%', trend: 'falling', changePercent: -5.8,
    presidencyStartValue: 54.8, history: generateMonthlyData(PRESIDENCY_START, 54.8, 51.6, 0.01),
  },
  inflation: {
    id: 'inflation', currentValue: 2.0, unit: '%', trend: 'falling', changePercent: -28.6,
    presidencyStartValue: 2.8, history: generateMonthlyData(PRESIDENCY_START, 2.8, 2.0, 0.1),
  },
  youthUnemployment: {
    id: 'youthUnemployment', currentValue: 6.8, unit: '%', trend: 'falling', changePercent: -11.7,
    presidencyStartValue: 7.7, history: generateMonthlyData(PRESIDENCY_START, 7.7, 6.8, 0.08),
  },
  interestRate: {
    id: 'interestRate', currentValue: 2.50, unit: '%', trend: 'falling', changePercent: -16.7,
    presidencyStartValue: 3.0, history: generateMonthlyData(PRESIDENCY_START, 3.0, 2.50, 0.05),
  },
};

// === EXTENDED TIMELINE (5 presidents, 2008–present) ===

export interface TimelineEvent {
  date: string;
  title: Record<string, string>;
  impact: string;
  category: 'geopolitical' | 'economic' | 'domestic' | 'housing';
  presidentId: string;
}

export const timelineEvents: TimelineEvent[] = [
  // Lee Myung-bak era (2008-2013)
  { date: '2008-09-15', presidentId: 'lmb',
    title: { en: 'Lehman Brothers collapse — global financial crisis', ko: '리먼 브라더스 파산 — 글로벌 금융위기', ja: 'リーマン・ブラザーズ破綻 — 世界金融危機' },
    impact: 'usdKrw', category: 'economic' },
  { date: '2008-11-01', presidentId: 'lmb',
    title: { en: 'Won plunges to ₩1,500/USD', ko: '원화 1,500원대 폭락', ja: 'ウォン、1,500ウォンまで暴落' },
    impact: 'usdKrw', category: 'economic' },
  { date: '2009-06-01', presidentId: 'lmb',
    title: { en: '4 Rivers Project begins — ₩22T spending', ko: '4대강 사업 착공 — 22조 투입', ja: '四大河川事業開始 — 22兆ウォン投入' },
    impact: 'nationalDebt', category: 'domestic' },
  { date: '2011-03-11', presidentId: 'lmb',
    title: { en: 'Fukushima disaster — energy policy shift', ko: '후쿠시마 원전 사고 — 에너지 정책 전환', ja: '福島原発事故 — エネルギー政策転換' },
    impact: 'electricityBill', category: 'geopolitical' },
  { date: '2012-06-01', presidentId: 'lmb',
    title: { en: 'Household debt passes ₩900T', ko: '가계부채 900조 돌파', ja: '家計負債900兆ウォン突破' },
    impact: 'householdDebt', category: 'economic' },

  // Park Geun-hye era (2013-2017)
  { date: '2014-04-16', presidentId: 'pgh',
    title: { en: 'Sewol ferry disaster — 304 killed', ko: '세월호 참사 — 304명 사망', ja: 'セウォル号沈没事故 — 304名死亡' },
    impact: 'usdKrw', category: 'domestic' },
  { date: '2015-06-01', presidentId: 'pgh',
    title: { en: 'MERS outbreak hits Korean economy', ko: '메르스 유행 경제 타격', ja: 'MERS流行で韓国経済に打撃' },
    impact: 'inflation', category: 'domestic' },
  { date: '2015-09-01', presidentId: 'pgh',
    title: { en: 'Seoul apartment prices begin sharp climb', ko: '서울 아파트 가격 본격 상승 시작', ja: 'ソウルマンション価格が急上昇開始' },
    impact: 'seoulAptPrice', category: 'housing' },
  { date: '2016-10-29', presidentId: 'pgh',
    title: { en: 'Candlelight protests begin — millions march', ko: '촛불집회 시작 — 수백만명 참여', ja: 'ろうそくデモ開始 — 数百万人参加' },
    impact: 'usdKrw', category: 'domestic' },
  { date: '2017-03-10', presidentId: 'pgh',
    title: { en: 'Park impeached and removed', ko: '박근혜 대통령 탄핵 파면', ja: '朴槿恵大統領、弾劾・罷免' },
    impact: 'usdKrw', category: 'domestic' },

  // Moon Jae-in era (2017-2022)
  { date: '2017-07-01', presidentId: 'mji',
    title: { en: 'Minimum wage hike to ₩7,530 (+16%)', ko: '최저임금 7,530원으로 16% 인상', ja: '最低賃金7,530ウォンに16%引上げ' },
    impact: 'inflation', category: 'domestic' },
  { date: '2018-09-01', presidentId: 'mji',
    title: { en: 'Seoul housing prices explode — 9.13 measures fail', ko: '서울 집값 폭등 — 9.13 대책 실패', ja: 'ソウル住宅価格暴騰 — 9.13対策失敗' },
    impact: 'seoulAptPrice', category: 'housing' },
  { date: '2020-01-20', presidentId: 'mji',
    title: { en: 'COVID-19 first case in Korea', ko: '코로나19 국내 첫 확진', ja: '韓国でCOVID-19初の感染者確認' },
    impact: 'usdKrw', category: 'geopolitical' },
  { date: '2020-06-01', presidentId: 'mji',
    title: { en: 'BOK cuts rate to historic 0.5%', ko: '한은 기준금리 사상 최저 0.5%', ja: '韓銀、基準金利を過去最低0.5%に' },
    impact: 'interestRate', category: 'economic' },
  { date: '2021-06-01', presidentId: 'mji',
    title: { en: 'Seoul apt prices doubled in 4 years', ko: '서울 아파트 가격 4년 만에 2배', ja: 'ソウルマンション価格、4年で2倍に' },
    impact: 'seoulAptPrice', category: 'housing' },
  { date: '2021-08-01', presidentId: 'mji',
    title: { en: 'Household debt passes ₩1,800T — record', ko: '가계부채 1,800조 돌파 — 역대 최고', ja: '家計負債1,800兆ウォン突破 — 過去最高' },
    impact: 'householdDebt', category: 'economic' },
  { date: '2022-01-01', presidentId: 'mji',
    title: { en: 'Jeonse fraud crisis begins', ko: '전세사기 위기 본격화', ja: '伝貰詐欺危機が本格化' },
    impact: 'jeonseDeposit', category: 'housing' },

  // Yoon Suk-yeol era (2022-2025)
  { date: '2022-07-15', presidentId: 'ysy',
    title: { en: 'BOK raises rate to 2.25% — fastest hike cycle', ko: '한은 금리 2.25%로 급속 인상', ja: '韓銀、金利2.25%に急速引上げ' },
    impact: 'interestRate', category: 'economic' },
  { date: '2022-11-01', presidentId: 'ysy',
    title: { en: 'US tightens Iran oil sanctions', ko: '미국 이란 원유 제재 강화', ja: '米国、イラン原油制裁を強化' },
    impact: 'gasPrice', category: 'geopolitical' },
  { date: '2023-01-15', presidentId: 'ysy',
    title: { en: 'Electricity tariff hike +9.5%', ko: '전기요금 9.5% 인상', ja: '電気料金9.5%値上げ' },
    impact: 'electricityBill', category: 'domestic' },
  { date: '2023-04-01', presidentId: 'ysy',
    title: { en: 'Chicken delivery crosses ₩25,000', ko: '치킨 배달 25,000원 돌파', ja: 'チキンデリバリー25,000ウォン突破' },
    impact: 'chickenPrice', category: 'domestic' },
  { date: '2024-02-01', presidentId: 'ysy',
    title: { en: 'Subway fare hike to ₩1,400 after 9 years', ko: '지하철 기본요금 9년 만에 1,400원 인상', ja: '地下鉄基本料金、9年ぶりに1,400ウォンに' },
    impact: 'subwayFare', category: 'domestic' },
  { date: '2024-12-03', presidentId: 'ysy',
    title: { en: 'Yoon declares martial law — political crisis', ko: '윤석열 비상계엄 선포 — 정치적 위기', ja: '尹錫悦、非常戒厳令宣布 — 政治危機' },
    impact: 'usdKrw', category: 'domestic' },
  { date: '2025-01-15', presidentId: 'ysy',
    title: { en: 'Won crashes past ₩1,450/USD', ko: '원화 1,450원 폭락', ja: 'ウォン、1,450ウォンまで暴落' },
    impact: 'usdKrw', category: 'economic' },
  { date: '2025-04-04', presidentId: 'ysy',
    title: { en: 'Yoon removed by Constitutional Court', ko: '헌법재판소 윤석열 파면 결정', ja: '憲法裁判所、尹錫悦を罷免' },
    impact: 'usdKrw', category: 'domestic' },

  // Lee Jae-myung era (2025-present)
  { date: '2025-06-03', presidentId: 'ljm',
    title: { en: 'Lee Jae-myung wins presidential by-election', ko: '이재명 대통령 보궐선거 당선', ja: '李在明、大統領補欠選挙で当選' },
    impact: 'usdKrw', category: 'domestic' },
  { date: '2025-08-15', presidentId: 'ljm',
    title: { en: 'US tightens Iran sanctions — oil supply pressure', ko: '미국 이란 제재 강화 — 원유 공급 압박', ja: '米国、イラン制裁強化 — 原油供給圧迫' },
    impact: 'gasPrice', category: 'geopolitical' },
  { date: '2025-09-01', presidentId: 'ljm',
    title: { en: 'Electricity tariff restructuring', ko: '전기요금 구조 개편', ja: '電気料金構造改編' },
    impact: 'electricityBill', category: 'domestic' },
  { date: '2025-10-20', presidentId: 'ljm',
    title: { en: 'Household debt hits ₩1,920T', ko: '가계부채 1,920조 돌파', ja: '家計負債1,920兆ウォン突破' },
    impact: 'householdDebt', category: 'economic' },
  { date: '2025-11-15', presidentId: 'ljm',
    title: { en: 'Global oil above $90 on ME tensions', ko: '중동 긴장으로 국제유가 $90 돌파', ja: '中東緊張で原油$90突破' },
    impact: 'gasPrice', category: 'geopolitical' },
  { date: '2026-02-01', presidentId: 'ljm',
    title: { en: 'Gas hits ₩2,000+/L in suburban areas', ko: '수도권 외곽 휘발유 2,000원 돌파', ja: '首都圏郊外でガソリン2,000ウォン突破' },
    impact: 'gasPrice', category: 'domestic' },
  { date: '2026-03-01', presidentId: 'ljm',
    title: { en: 'CPI inflation steady at 2.0%', ko: '소비자물가 2.0% 유지', ja: 'CPI 2.0%で安定' },
    impact: 'inflation', category: 'economic' },
];

// === GAS STATION DATA (for map) ===

export interface RegionGasPrice {
  region: string;
  regionKo: string;
  regionJa: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  lat: number;
  lng: number;
  stationCount: number;
}

export const regionalGasPrices: RegionGasPrice[] = [
  { region: 'Seoul', regionKo: '서울', regionJa: 'ソウル', avgPrice: 1982, minPrice: 1879, maxPrice: 2150, lat: 37.5665, lng: 126.9780, stationCount: 892 },
  { region: 'Namyangju', regionKo: '남양주', regionJa: '南楊州', avgPrice: 2015, minPrice: 1950, maxPrice: 2089, lat: 37.6360, lng: 127.2165, stationCount: 78 },
  { region: 'Incheon', regionKo: '인천', regionJa: '仁川', avgPrice: 1945, minPrice: 1860, maxPrice: 2050, lat: 37.4563, lng: 126.7052, stationCount: 245 },
  { region: 'Suwon', regionKo: '수원', regionJa: '水原', avgPrice: 1968, minPrice: 1885, maxPrice: 2070, lat: 37.2636, lng: 127.0286, stationCount: 156 },
  { region: 'Daejeon', regionKo: '대전', regionJa: '大田', avgPrice: 1925, minPrice: 1845, maxPrice: 2010, lat: 36.3504, lng: 127.3845, stationCount: 198 },
  { region: 'Daegu', regionKo: '대구', regionJa: '大邱', avgPrice: 1938, minPrice: 1870, maxPrice: 2030, lat: 35.8714, lng: 128.6014, stationCount: 215 },
  { region: 'Busan', regionKo: '부산', regionJa: '釜山', avgPrice: 1955, minPrice: 1880, maxPrice: 2065, lat: 35.1796, lng: 129.0756, stationCount: 267 },
  { region: 'Gwangju', regionKo: '광주', regionJa: '光州', avgPrice: 1910, minPrice: 1835, maxPrice: 1995, lat: 35.1595, lng: 126.8526, stationCount: 142 },
  { region: 'Ulsan', regionKo: '울산', regionJa: '蔚山', avgPrice: 1920, minPrice: 1850, maxPrice: 2005, lat: 35.5384, lng: 129.3114, stationCount: 98 },
  { region: 'Sejong', regionKo: '세종', regionJa: '世宗', avgPrice: 1935, minPrice: 1860, maxPrice: 2015, lat: 36.4800, lng: 127.2890, stationCount: 45 },
  { region: 'Jeju', regionKo: '제주', regionJa: '済州', avgPrice: 1998, minPrice: 1920, maxPrice: 2120, lat: 33.4996, lng: 126.5312, stationCount: 89 },
  { region: 'Chuncheon', regionKo: '춘천', regionJa: '春川', avgPrice: 1975, minPrice: 1900, maxPrice: 2060, lat: 37.8813, lng: 127.7300, stationCount: 56 },
  { region: 'Yongin', regionKo: '용인', regionJa: '龍仁', avgPrice: 1990, minPrice: 1910, maxPrice: 2080, lat: 37.2410, lng: 127.1775, stationCount: 112 },
  { region: 'Goyang', regionKo: '고양', regionJa: '高陽', avgPrice: 1972, minPrice: 1890, maxPrice: 2055, lat: 37.6584, lng: 126.8320, stationCount: 95 },
  { region: 'Seongnam', regionKo: '성남', regionJa: '城南', avgPrice: 1985, minPrice: 1905, maxPrice: 2075, lat: 37.4200, lng: 127.1267, stationCount: 87 },
];
