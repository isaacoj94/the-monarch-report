'use client';

import { TimelineEvent } from '@/lib/data';
import { Locale } from '@/lib/translations';

interface TimelineProps {
  events: TimelineEvent[];
  locale: Locale;
  activeImpact?: string | null;
  onEventClick?: (impact: string) => void;
}

const categoryColors: Record<string, string> = {
  geopolitical: '#f59e0b',
  economic: '#3b82f6',
  domestic: '#a855f7',
};

const categoryLabels: Record<string, Record<string, string>> = {
  geopolitical: { en: 'GEO', ko: '지정학', ja: '地政学' },
  economic: { en: 'ECON', ko: '경제', ja: '経済' },
  domestic: { en: 'DOM', ko: '국내', ja: '国内' },
};

const impactLabels: Record<string, Record<string, string>> = {
  usdKrw: { en: '→ USD/KRW', ko: '→ 환율', ja: '→ 為替' },
  gasPrice: { en: '→ Gas prices', ko: '→ 유가', ja: '→ ガソリン' },
  electricityBill: { en: '→ Electricity', ko: '→ 전기요금', ja: '→ 電気代' },
  householdDebt: { en: '→ Debt', ko: '→ 부채', ja: '→ 負債' },
  inflation: { en: '→ Inflation', ko: '→ 물가', ja: '→ インフレ' },
  interestRate: { en: '→ Rates', ko: '→ 금리', ja: '→ 金利' },
};

export default function Timeline({ events, locale, activeImpact, onEventClick }: TimelineProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
      <h3 className="text-white font-mono text-sm font-bold mb-4">
        {locale === 'ko' ? '주요 사건 타임라인' : locale === 'ja' ? '主要イベントタイムライン' : 'Key Events Timeline'}
      </h3>
      <p className="text-[#555] text-[10px] font-mono mb-4">
        {locale === 'ko' ? '클릭하면 관련 지표를 확인할 수 있습니다' : locale === 'ja' ? 'クリックすると関連指標が表示されます' : 'Click an event to see related metrics'}
      </p>
      <div className="space-y-1">
        {events.map((event, i) => {
          const color = categoryColors[event.category];
          const isActive = activeImpact === event.impact;
          const impactLabel = impactLabels[event.impact]?.[locale] || impactLabels[event.impact]?.['en'] || '';

          return (
            <div
              key={i}
              className={`flex gap-3 items-start rounded-md px-2 py-2 cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-[#1a1a1a] border border-[#333]'
                  : 'border border-transparent hover:bg-[#151515]'
              }`}
              onClick={() => onEventClick?.(event.impact)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full mt-1.5 shrink-0 transition-all duration-200 ${isActive ? 'w-3 h-3' : 'w-2 h-2'}`}
                  style={{ backgroundColor: color, boxShadow: isActive ? `0 0 8px ${color}60` : 'none' }}
                />
                {i < events.length - 1 && (
                  <div className="w-px h-full min-h-[16px]" style={{ backgroundColor: `${color}30` }} />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[#555555] text-[10px] font-mono">{event.date}</span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}15` }}
                  >
                    {categoryLabels[event.category][locale] || categoryLabels[event.category]['en']}
                  </span>
                  {impactLabel && (
                    <span
                      className={`text-[10px] font-mono transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                      style={{ color }}
                    >
                      {impactLabel}
                    </span>
                  )}
                </div>
                <p className={`text-sm font-mono transition-colors duration-200 ${isActive ? 'text-white' : 'text-[#cccccc]'}`}>
                  {event.title[locale] || event.title['en']}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
