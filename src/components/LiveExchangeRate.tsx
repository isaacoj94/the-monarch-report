'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/lib/translations';

interface ExchangeData {
  rate: number;
  date: string;
  source: string;
}

interface LiveExchangeRateProps {
  locale: Locale;
}

export default function LiveExchangeRate({ locale }: LiveExchangeRateProps) {
  const [data, setData] = useState<ExchangeData | null>(null);
  const [prevRate, setPrevRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = () => {
      fetch('/api/exchange-rate')
        .then(r => r.json())
        .then((d: ExchangeData) => {
          if (data?.rate) setPrevRate(data.rate);
          setData(d);
        })
        .catch(() => {});
    };

    fetchRate();
    const interval = setInterval(fetchRate, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-[#333]" />
        <span className="text-[#444] text-xs font-mono">USD/KRW ---</span>
      </div>
    );
  }

  const isUp = prevRate !== null ? data.rate > prevRate : false;
  const isDown = prevRate !== null ? data.rate < prevRate : false;
  const flash = isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-white';

  const labels: Record<Locale, { live: string; source: string }> = {
    en: { live: 'LIVE', source: data.source === 'fallback' ? 'Estimated' : 'Live' },
    ko: { live: '실시간', source: data.source === 'fallback' ? '추정' : '실시간' },
    ja: { live: 'ライブ', source: data.source === 'fallback' ? '推定' : 'ライブ' },
  };

  return (
    <div className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-[10px] text-red-400 font-mono font-bold uppercase">{labels[locale].live}</span>
      </div>
      <div>
        <p className="text-[#888] text-[10px] font-mono">USD / KRW</p>
        <p className={`text-lg font-mono font-bold transition-colors duration-500 ${flash}`}>
          ₩{data.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="text-[10px] text-[#555] font-mono">
        {labels[locale].source}
        <br />
        {data.date}
      </div>
    </div>
  );
}
