'use client';

import { Locale, t } from '@/lib/translations';

interface CausalChainProps {
  titleKey: string;
  stepKeys: string[];
  locale: Locale;
  color: string;
}

export default function CausalChain({ titleKey, stepKeys, locale, color }: CausalChainProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
      <h3 className="text-white font-mono text-sm font-bold mb-4">{t(locale, titleKey)}</h3>
      <div className="space-y-0">
        {stepKeys.map((key, i) => (
          <div key={key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {i + 1}
              </div>
              {i < stepKeys.length - 1 && (
                <div className="w-px h-6" style={{ backgroundColor: `${color}30` }} />
              )}
            </div>
            <p className={`text-sm font-mono pt-1 ${i === stepKeys.length - 1 ? 'font-bold' : ''}`}
              style={{ color: i === stepKeys.length - 1 ? color : '#aaaaaa' }}>
              {t(locale, key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
