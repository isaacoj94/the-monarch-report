'use client';

import { Locale, t } from '@/lib/translations';

interface CausalChainProps {
  titleKey: string;
  stepKeys: string[];
  locale: Locale;
  color: string;
  relatedMetric: string;
  activeImpact?: string | null;
  onChainClick?: (metric: string) => void;
}

export default function CausalChain({ titleKey, stepKeys, locale, color, relatedMetric, activeImpact, onChainClick }: CausalChainProps) {
  const isActive = activeImpact === relatedMetric;

  return (
    <div
      className={`rounded-lg p-5 cursor-pointer transition-all duration-300 ${
        isActive
          ? 'bg-[#151515] border-2'
          : 'bg-[#111111] border border-[#222222] hover:border-[#333333]'
      }`}
      style={{
        borderColor: isActive ? `${color}60` : undefined,
        boxShadow: isActive ? `0 0 20px ${color}10` : 'none',
      }}
      onClick={() => onChainClick?.(relatedMetric)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-mono text-sm font-bold">{t(locale, titleKey)}</h3>
        {isActive && (
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full animate-pulse"
            style={{ color, backgroundColor: `${color}20` }}
          >
            {locale === 'ko' ? '활성' : locale === 'ja' ? 'アクティブ' : 'ACTIVE'}
          </span>
        )}
      </div>
      <div className="space-y-0">
        {stepKeys.map((key, i) => {
          const isLastStep = i === stepKeys.length - 1;
          return (
            <div
              key={key}
              className={`flex items-start gap-3 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-80'
              }`}
              style={{
                transitionDelay: isActive ? `${i * 60}ms` : '0ms',
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all duration-300 ${
                    isActive ? 'w-8 h-8' : 'w-7 h-7'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${color}30` : `${color}20`,
                    color,
                    boxShadow: isActive && isLastStep ? `0 0 12px ${color}40` : 'none',
                  }}
                >
                  {i + 1}
                </div>
                {i < stepKeys.length - 1 && (
                  <div
                    className="w-px h-6 transition-all duration-300"
                    style={{ backgroundColor: isActive ? `${color}50` : `${color}30` }}
                  />
                )}
              </div>
              <p
                className={`text-sm font-mono pt-1 transition-all duration-300 ${isLastStep ? 'font-bold' : ''}`}
                style={{
                  color: isLastStep ? color : isActive ? '#dddddd' : '#aaaaaa',
                  textShadow: isActive && isLastStep ? `0 0 10px ${color}30` : 'none',
                }}
              >
                {t(locale, key)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
