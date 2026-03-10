'use client';

import { TimelineEvent } from '@/lib/data';
import { Locale } from '@/lib/translations';

interface TimelineProps {
  events: TimelineEvent[];
  locale: Locale;
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

export default function Timeline({ events, locale }: TimelineProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
      <div className="space-y-4">
        {events.map((event, i) => {
          const color = categoryColors[event.category];
          return (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: color }}
                />
                {i < events.length - 1 && (
                  <div className="w-px h-full min-h-[24px]" style={{ backgroundColor: `${color}30` }} />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[#555555] text-[10px] font-mono">{event.date}</span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}15` }}
                  >
                    {categoryLabels[event.category][locale] || categoryLabels[event.category]['en']}
                  </span>
                </div>
                <p className="text-[#cccccc] text-sm font-mono">
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
