// Seed data for the prototype
// In production, these would be fetched from APIs (Bank of Korea, KOSIS, Opinet, etc.)

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

// Lee Jae-myung inauguration: ~July 2025 (after by-election June 3, 2025)
export const PRESIDENCY_START = '2025-07-01';
export const PRESIDENCY_START_LABEL = '2025.07';
export const PRESIDENT_NAME = { en: 'Lee Jae-myung', ko: '이재명', ja: '李在明' };

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

// Gas prices: Namyangju area already over ₩2,000/liter.
// National average has risen sharply since mid-2025.
export const walletMetrics: Record<string, Metric> = {
  gasPrice: {
    id: 'gasPrice',
    currentValue: 1958,
    unit: '₩',
    trend: 'rising',
    changePercent: 12.8,
    presidencyStartValue: 1735,
    history: generateMonthlyData(PRESIDENCY_START, 1735, 1958, 0.04),
  },
  ricePrice: {
    id: 'ricePrice',
    currentValue: 33800,
    unit: '₩',
    trend: 'rising',
    changePercent: 9.4,
    presidencyStartValue: 30900,
    history: generateMonthlyData(PRESIDENCY_START, 30900, 33800, 0.03),
  },
  eggsPrice: {
    id: 'eggsPrice',
    currentValue: 9200,
    unit: '₩',
    trend: 'rising',
    changePercent: 10.8,
    presidencyStartValue: 8300,
    history: generateMonthlyData(PRESIDENCY_START, 8300, 9200, 0.05),
  },
  porkBellyPrice: {
    id: 'porkBellyPrice',
    currentValue: 2450,
    unit: '₩',
    trend: 'rising',
    changePercent: 8.4,
    presidencyStartValue: 2260,
    history: generateMonthlyData(PRESIDENCY_START, 2260, 2450, 0.06),
  },
  electricityBill: {
    id: 'electricityBill',
    currentValue: 72500,
    unit: '₩',
    trend: 'rising',
    changePercent: 11.5,
    presidencyStartValue: 65000,
    history: generateMonthlyData(PRESIDENCY_START, 65000, 72500, 0.03),
  },
  seoulRent: {
    id: 'seoulRent',
    currentValue: 920000,
    unit: '₩',
    trend: 'rising',
    changePercent: 7.0,
    presidencyStartValue: 860000,
    history: generateMonthlyData(PRESIDENCY_START, 860000, 920000, 0.02),
  },
};

export const macroMetrics: Record<string, Metric> = {
  usdKrw: {
    id: 'usdKrw',
    currentValue: 1465,
    unit: '₩',
    trend: 'rising',
    changePercent: 4.3,
    presidencyStartValue: 1405,
    history: generateMonthlyData(PRESIDENCY_START, 1405, 1465, 0.03),
  },
  householdDebt: {
    id: 'householdDebt',
    currentValue: 105.1,
    unit: '%',
    trend: 'rising',
    changePercent: 1.5,
    presidencyStartValue: 103.5,
    history: generateMonthlyData(PRESIDENCY_START, 103.5, 105.1, 0.01),
  },
  nationalDebt: {
    id: 'nationalDebt',
    currentValue: 56.8,
    unit: '%',
    trend: 'rising',
    changePercent: 3.7,
    presidencyStartValue: 54.8,
    history: generateMonthlyData(PRESIDENCY_START, 54.8, 56.8, 0.01),
  },
  inflation: {
    id: 'inflation',
    currentValue: 3.4,
    unit: '%',
    trend: 'rising',
    changePercent: 21.4,
    presidencyStartValue: 2.8,
    history: generateMonthlyData(PRESIDENCY_START, 2.8, 3.4, 0.1),
  },
  youthUnemployment: {
    id: 'youthUnemployment',
    currentValue: 8.1,
    unit: '%',
    trend: 'rising',
    changePercent: 5.2,
    presidencyStartValue: 7.7,
    history: generateMonthlyData(PRESIDENCY_START, 7.7, 8.1, 0.08),
  },
  interestRate: {
    id: 'interestRate',
    currentValue: 2.75,
    unit: '%',
    trend: 'stable',
    changePercent: -8.3,
    presidencyStartValue: 3.0,
    history: generateMonthlyData(PRESIDENCY_START, 3.0, 2.75, 0.05),
  },
};

export interface TimelineEvent {
  date: string;
  title: Record<string, string>;
  impact: string;
  category: 'geopolitical' | 'economic' | 'domestic';
}

export const timelineEvents: TimelineEvent[] = [
  {
    date: '2024-12-03',
    title: { en: 'Yoon declares martial law — political crisis begins', ko: '윤석열 비상계엄 선포 — 정치적 위기 시작', ja: '尹錫悦、非常戒厳令宣布 — 政治危機の始まり' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2025-01-15',
    title: { en: 'Won crashes past ₩1,450/USD amid instability', ko: '불안정 속 원화 1,450원 폭락', ja: '不安定の中、ウォン1,450ウォンまで暴落' },
    impact: 'usdKrw',
    category: 'economic',
  },
  {
    date: '2025-04-04',
    title: { en: 'Yoon removed from office by Constitutional Court', ko: '헌법재판소 윤석열 파면 결정', ja: '憲法裁判所、尹錫悦を罷免' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2025-06-03',
    title: { en: 'Lee Jae-myung wins presidential by-election', ko: '이재명 대통령 보궐선거 당선', ja: '李在明、大統領補欠選挙で当選' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2025-07-01',
    title: { en: 'Lee Jae-myung inaugurated as president', ko: '이재명 대통령 취임', ja: '李在明大統領就任' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2025-08-15',
    title: { en: 'US tightens Iran sanctions — oil supply pressure', ko: '미국 이란 제재 강화 — 원유 공급 압박', ja: '米国、イラン制裁強化 — 原油供給圧迫' },
    impact: 'gasPrice',
    category: 'geopolitical',
  },
  {
    date: '2025-09-01',
    title: { en: 'Electricity tariff restructuring announced', ko: '전기요금 구조 개편 발표', ja: '電気料金構造改編を発表' },
    impact: 'electricityBill',
    category: 'domestic',
  },
  {
    date: '2025-10-20',
    title: { en: 'Household debt hits record ₩1,920T', ko: '가계부채 역대 최고 1,920조 돌파', ja: '家計負債、過去最高の1,920兆ウォン突破' },
    impact: 'householdDebt',
    category: 'economic',
  },
  {
    date: '2025-11-15',
    title: { en: 'Middle East tensions push global oil above $90', ko: '중동 긴장으로 국제유가 $90 돌파', ja: '中東緊張で国際原油価格$90突破' },
    impact: 'gasPrice',
    category: 'geopolitical',
  },
  {
    date: '2026-01-10',
    title: { en: 'Won weakens further on US rate policy', ko: '미국 금리 정책에 원화 추가 약세', ja: '米金利政策でウォンがさらに下落' },
    impact: 'usdKrw',
    category: 'economic',
  },
  {
    date: '2026-02-01',
    title: { en: 'Gas prices hit ₩2,000+ in suburban areas', ko: '수도권 외곽 휘발유 리터당 2,000원 돌파', ja: '首都圏郊外でガソリン1リットル2,000ウォン突破' },
    impact: 'gasPrice',
    category: 'domestic',
  },
  {
    date: '2026-03-01',
    title: { en: 'CPI inflation rises to 3.4% — food prices surge', ko: '소비자물가 3.4% 상승 — 식품 가격 급등', ja: 'CPI 3.4%上昇 — 食品価格高騰' },
    impact: 'inflation',
    category: 'economic',
  },
];

// Gas station price data by region for the map
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

// Seed data — will be replaced by Opinet API
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
