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

// Yoon Suk-yeol inauguration: May 10, 2022
const PRESIDENCY_START = '2022-05-10';

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

export const walletMetrics: Record<string, Metric> = {
  gasPrice: {
    id: 'gasPrice',
    currentValue: 1845,
    unit: '₩',
    trend: 'rising',
    changePercent: 14.2,
    presidencyStartValue: 1615,
    history: generateMonthlyData(PRESIDENCY_START, 1615, 1845, 0.04),
  },
  ricePrice: {
    id: 'ricePrice',
    currentValue: 32500,
    unit: '₩',
    trend: 'rising',
    changePercent: 18.5,
    presidencyStartValue: 27430,
    history: generateMonthlyData(PRESIDENCY_START, 27430, 32500, 0.03),
  },
  eggsPrice: {
    id: 'eggsPrice',
    currentValue: 8900,
    unit: '₩',
    trend: 'rising',
    changePercent: 22.1,
    presidencyStartValue: 7290,
    history: generateMonthlyData(PRESIDENCY_START, 7290, 8900, 0.05),
  },
  porkBellyPrice: {
    id: 'porkBellyPrice',
    currentValue: 2380,
    unit: '₩',
    trend: 'rising',
    changePercent: 11.7,
    presidencyStartValue: 2130,
    history: generateMonthlyData(PRESIDENCY_START, 2130, 2380, 0.06),
  },
  electricityBill: {
    id: 'electricityBill',
    currentValue: 68400,
    unit: '₩',
    trend: 'rising',
    changePercent: 31.5,
    presidencyStartValue: 52000,
    history: generateMonthlyData(PRESIDENCY_START, 52000, 68400, 0.03),
  },
  seoulRent: {
    id: 'seoulRent',
    currentValue: 890000,
    unit: '₩',
    trend: 'rising',
    changePercent: 19.5,
    presidencyStartValue: 745000,
    history: generateMonthlyData(PRESIDENCY_START, 745000, 890000, 0.02),
  },
};

export const macroMetrics: Record<string, Metric> = {
  usdKrw: {
    id: 'usdKrw',
    currentValue: 1445,
    unit: '₩',
    trend: 'rising',
    changePercent: 15.2,
    presidencyStartValue: 1254,
    history: generateMonthlyData(PRESIDENCY_START, 1254, 1445, 0.03),
  },
  householdDebt: {
    id: 'householdDebt',
    currentValue: 104.2,
    unit: '%',
    trend: 'rising',
    changePercent: 3.1,
    presidencyStartValue: 101.1,
    history: generateMonthlyData(PRESIDENCY_START, 101.1, 104.2, 0.01),
  },
  nationalDebt: {
    id: 'nationalDebt',
    currentValue: 55.2,
    unit: '%',
    trend: 'rising',
    changePercent: 12.8,
    presidencyStartValue: 48.9,
    history: generateMonthlyData(PRESIDENCY_START, 48.9, 55.2, 0.01),
  },
  inflation: {
    id: 'inflation',
    currentValue: 3.1,
    unit: '%',
    trend: 'stable',
    changePercent: -1.9,
    presidencyStartValue: 5.4,
    history: generateMonthlyData(PRESIDENCY_START, 5.4, 3.1, 0.15),
  },
  youthUnemployment: {
    id: 'youthUnemployment',
    currentValue: 7.8,
    unit: '%',
    trend: 'rising',
    changePercent: 8.3,
    presidencyStartValue: 7.2,
    history: generateMonthlyData(PRESIDENCY_START, 7.2, 7.8, 0.08),
  },
  interestRate: {
    id: 'interestRate',
    currentValue: 3.0,
    unit: '%',
    trend: 'stable',
    changePercent: 71.4,
    presidencyStartValue: 1.75,
    history: generateMonthlyData(PRESIDENCY_START, 1.75, 3.0, 0.05),
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
    date: '2022-05-10',
    title: { en: 'Yoon Suk-yeol inaugurated', ko: '윤석열 대통령 취임', ja: '尹錫悦大統領就任' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2022-07-15',
    title: { en: 'BOK raises rate to 2.25%', ko: '한은 금리 2.25%로 인상', ja: '韓銀、金利2.25%に引上げ' },
    impact: 'interestRate',
    category: 'economic',
  },
  {
    date: '2022-11-01',
    title: { en: 'US tightens Iran oil sanctions', ko: '미국 이란 원유 제재 강화', ja: '米国、イラン原油制裁を強化' },
    impact: 'gasPrice',
    category: 'geopolitical',
  },
  {
    date: '2023-01-15',
    title: { en: 'Electricity tariff hike +9.5%', ko: '전기요금 9.5% 인상', ja: '電気料金9.5%値上げ' },
    impact: 'electricityBill',
    category: 'domestic',
  },
  {
    date: '2023-04-20',
    title: { en: 'Won hits 1,340 / USD', ko: '원화 1,340원 돌파', ja: 'ウォン、1,340ウォン突破' },
    impact: 'usdKrw',
    category: 'economic',
  },
  {
    date: '2023-08-01',
    title: { en: 'Korea-Japan trade normalization', ko: '한일 무역 정상화', ja: '日韓貿易正常化' },
    impact: 'usdKrw',
    category: 'geopolitical',
  },
  {
    date: '2023-11-15',
    title: { en: 'Household debt passes ₩1,900T', ko: '가계부채 1,900조 돌파', ja: '家計負債1,900兆ウォン突破' },
    impact: 'householdDebt',
    category: 'economic',
  },
  {
    date: '2024-03-01',
    title: { en: 'Global oil prices surge on ME tensions', ko: '중동 긴장으로 국제유가 급등', ja: '中東緊張で国際原油価格急騰' },
    impact: 'gasPrice',
    category: 'geopolitical',
  },
  {
    date: '2024-06-01',
    title: { en: 'Second electricity tariff hike', ko: '2차 전기요금 인상', ja: '2回目の電気料金値上げ' },
    impact: 'electricityBill',
    category: 'domestic',
  },
  {
    date: '2024-12-03',
    title: { en: 'Martial law declaration crisis', ko: '비상계엄 선포 사태', ja: '非常戒厳令宣布の危機' },
    impact: 'usdKrw',
    category: 'domestic',
  },
  {
    date: '2025-01-15',
    title: { en: 'Won crashes past 1,450 / USD', ko: '원화 1,450원 폭락', ja: 'ウォン、1,450ウォンまで暴落' },
    impact: 'usdKrw',
    category: 'economic',
  },
  {
    date: '2025-06-01',
    title: { en: 'US expands Iran sanctions further', ko: '미국 이란 제재 추가 확대', ja: '米国、イラン制裁をさらに拡大' },
    impact: 'gasPrice',
    category: 'geopolitical',
  },
];
