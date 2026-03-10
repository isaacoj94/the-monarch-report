'use client';

import { useState } from 'react';
import { TimelineEvent, presidents } from '@/lib/data';
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
  housing: '#ef4444',
};

const categoryLabels: Record<string, Record<string, string>> = {
  geopolitical: { en: 'GEO', ko: '지정학', ja: '地政学' },
  economic: { en: 'ECON', ko: '경제', ja: '経済' },
  domestic: { en: 'DOM', ko: '국내', ja: '国内' },
  housing: { en: 'HOUSING', ko: '주거', ja: '住宅' },
};

const impactLabels: Record<string, Record<string, string>> = {
  usdKrw: { en: '→ USD/KRW', ko: '→ 환율', ja: '→ 為替' },
  gasPrice: { en: '→ Gas', ko: '→ 유가', ja: '→ ガソリン' },
  electricityBill: { en: '→ Electricity', ko: '→ 전기', ja: '→ 電気' },
  householdDebt: { en: '→ Debt', ko: '→ 부채', ja: '→ 負債' },
  inflation: { en: '→ Inflation', ko: '→ 물가', ja: '→ インフレ' },
  interestRate: { en: '→ Rates', ko: '→ 금리', ja: '→ 金利' },
  nationalDebt: { en: '→ Nat. Debt', ko: '→ 국가부채', ja: '→ 国家負債' },
  seoulAptPrice: { en: '→ Housing', ko: '→ 집값', ja: '→ 住宅' },
  jeonseDeposit: { en: '→ Jeonse', ko: '→ 전세', ja: '→ 伝貰' },
  chickenPrice: { en: '→ Chicken', ko: '→ 치킨', ja: '→ チキン' },
  subwayFare: { en: '→ Subway', ko: '→ 지하철', ja: '→ 地下鉄' },
};

export default function Timeline({ events, locale, activeImpact, onEventClick }: TimelineProps) {
  const [filterPresident, setFilterPresident] = useState<string | null>(null);

  const filteredEvents = filterPresident
    ? events.filter(e => e.presidentId === filterPresident)
    : events;

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
      <h3 className="text-white font-mono text-sm font-bold mb-2">
        {locale === 'ko' ? '주요 사건 타임라인' : locale === 'ja' ? '主要イベントタイムライン' : 'Key Events Timeline'}
      </h3>
      <p className="text-[#555] text-[10px] font-mono mb-3">
        {locale === 'ko' ? '대통령별 필터링 가능 · 클릭하면 관련 지표 확인' : locale === 'ja' ? '大統領別フィルタリング可能 · クリックで関連指標表示' : 'Filter by president · Click to see related metrics'}
      </p>

      {/* President filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setFilterPresident(null)}
          className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
            !filterPresident ? 'bg-[#222] text-white' : 'text-[#666] hover:text-white'
          }`}
        >
          {locale === 'ko' ? '전체' : locale === 'ja' ? '全て' : 'All'}
        </button>
        {presidents.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilterPresident(prev => prev === p.id ? null : p.id)}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded transition-colors ${
              filterPresident === p.id ? 'bg-[#222] text-white' : 'text-[#666] hover:text-white'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            {(p.name[locale] || p.name['en']).split(' ').pop()}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
        {filteredEvents.map((event, i) => {
          const catColor = categoryColors[event.category];
          const president = presidents.find(p => p.id === event.presidentId);
          const isActive = activeImpact === event.impact;
          const impactLabel = impactLabels[event.impact]?.[locale] || impactLabels[event.impact]?.['en'] || '';

          return (
            <div
              key={`${event.date}-${i}`}
              className={`flex gap-3 items-start rounded-md px-2 py-2 cursor-pointer transition-all duration-200 ${
                isActive ? 'bg-[#1a1a1a] border border-[#333]' : 'border border-transparent hover:bg-[#151515]'
              }`}
              onClick={() => onEventClick?.(event.impact)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full mt-1.5 shrink-0 transition-all duration-200 ${isActive ? 'w-3 h-3' : 'w-2 h-2'}`}
                  style={{
                    backgroundColor: president?.color || catColor,
                    boxShadow: isActive ? `0 0 8px ${catColor}60` : 'none',
                  }}
                />
                {i < filteredEvents.length - 1 && (
                  <div className="w-px h-full min-h-[16px]" style={{ backgroundColor: `${president?.color || catColor}30` }} />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[#555555] text-[10px] font-mono">{event.date}</span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ color: catColor, backgroundColor: `${catColor}15` }}
                  >
                    {categoryLabels[event.category]?.[locale] || categoryLabels[event.category]?.['en']}
                  </span>
                  {president && (
                    <span
                      className="text-[9px] font-mono px-1 py-0.5 rounded"
                      style={{ color: president.color, backgroundColor: `${president.color}15` }}
                    >
                      {(president.name[locale] || president.name['en']).split(' ').pop()}
                    </span>
                  )}
                  {impactLabel && (
                    <span className={`text-[10px] font-mono ${isActive ? 'opacity-100' : 'opacity-40'}`} style={{ color: catColor }}>
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
