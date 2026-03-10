'use client';

import { useState } from 'react';
import { Locale, t } from '@/lib/translations';
import { presidents, presidencySnapshots, currentSnapshot, President } from '@/lib/data';

interface PresidencyComparisonProps {
  locale: Locale;
}

// All metric keys we want to compare across presidencies
const metricGroups = [
  {
    labelKey: 'yourWallet',
    metrics: [
      { key: 'gasPrice', unit: '₩', format: 'won' },
      { key: 'ricePrice', unit: '₩', format: 'won' },
      { key: 'eggsPrice', unit: '₩', format: 'won' },
      { key: 'sojuPrice', unit: '₩', format: 'won' },
      { key: 'coffeePrice', unit: '₩', format: 'won' },
      { key: 'chickenPrice', unit: '₩', format: 'won' },
      { key: 'subwayFare', unit: '₩', format: 'won' },
      { key: 'ramenPrice', unit: '₩', format: 'won' },
      { key: 'electricityBill', unit: '₩', format: 'won' },
    ],
  },
  {
    labelKey: 'housing',
    metrics: [
      { key: 'seoulAptPrice', unit: '₩/평', format: 'won' },
      { key: 'jeonseDeposit', unit: '만₩', format: 'man' },
      { key: 'housingIncomeRatio', unit: '년', format: 'decimal' },
      { key: 'seoulRent', unit: '₩', format: 'won' },
    ],
  },
  {
    labelKey: 'bigPicture',
    metrics: [
      { key: 'usdKrw', unit: '₩', format: 'won' },
      { key: 'householdDebt', unit: '%', format: 'pct' },
      { key: 'nationalDebt', unit: '%', format: 'pct' },
      { key: 'inflation', unit: '%', format: 'pct' },
      { key: 'youthUnemployment', unit: '%', format: 'pct' },
      { key: 'interestRate', unit: '%', format: 'pct' },
    ],
  },
];

function formatVal(value: number, format: string): string {
  if (format === 'won') return `₩${value.toLocaleString()}`;
  if (format === 'man') return `${value.toLocaleString()}만`;
  if (format === 'pct') return `${value}%`;
  if (format === 'decimal') return `${value}`;
  return String(value);
}

function getChangeColor(startVal: number, endVal: number, metricKey: string): string {
  const isLowerBetter = ['inflation', 'youthUnemployment', 'householdDebt', 'nationalDebt', 'housingIncomeRatio'].includes(metricKey);
  const increased = endVal > startVal;
  if (isLowerBetter) return increased ? '#ef4444' : '#22c55e';
  // For most price metrics, increase = bad
  const isPriceLowerBetter = !['interestRate'].includes(metricKey);
  if (isPriceLowerBetter) return increased ? '#ef4444' : '#22c55e';
  return increased ? '#eab308' : '#eab308';
}

export default function PresidencyComparison({ locale }: PresidencyComparisonProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [highlightedPresident, setHighlightedPresident] = useState<string | null>(null);

  const group = metricGroups[selectedGroup];

  return (
    <div className="space-y-6">
      {/* President legend bar */}
      <div className="flex flex-wrap gap-2">
        {presidents.map((p) => (
          <button
            key={p.id}
            onClick={() => setHighlightedPresident(prev => prev === p.id ? null : p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              highlightedPresident === p.id
                ? 'bg-[#1a1a1a] border-2'
                : highlightedPresident && highlightedPresident !== p.id
                ? 'opacity-40 border border-[#222]'
                : 'border border-[#222] hover:border-[#444]'
            }`}
            style={{ borderColor: highlightedPresident === p.id ? p.color : undefined }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[#ccc]">{p.name[locale] || p.name['en']}</span>
            <span className="text-[#555]">{p.start.slice(0, 4)}-{p.end?.slice(0, 4) || ''}</span>
          </button>
        ))}
      </div>

      {/* Metric group tabs */}
      <div className="flex gap-2 border-b border-[#222] pb-2">
        {metricGroups.map((g, i) => (
          <button
            key={g.labelKey}
            onClick={() => setSelectedGroup(i)}
            className={`px-3 py-1.5 text-xs font-mono rounded-t transition-colors ${
              selectedGroup === i ? 'bg-[#1a1a1a] text-white border-b-2 border-red-500' : 'text-[#666] hover:text-white'
            }`}
          >
            {t(locale, g.labelKey)}
          </button>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-[#222]">
              <th className="text-left text-[#666] p-3 sticky left-0 bg-[#111] z-10 min-w-[120px]"></th>
              {presidents.map((p) => {
                const isHighlighted = !highlightedPresident || highlightedPresident === p.id;
                return (
                  <th
                    key={p.id}
                    className={`text-center p-3 min-w-[90px] transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[#ccc] text-[10px]">{p.name[locale]?.split(' ')[0] || p.name['en'].split(' ')[0]}</span>
                      <span className="text-[#555] text-[9px]">{p.start.slice(0, 4)}</span>
                    </div>
                  </th>
                );
              })}
              <th className="text-center p-3 min-w-[90px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-white text-[10px] font-bold">{t(locale, 'today')}</span>
                  <span className="text-[#555] text-[9px]">2026.03</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {group.metrics.map((metric) => {
              const label = t(locale, metric.key);
              return (
                <tr key={metric.key} className="border-b border-[#1a1a1a] hover:bg-[#151515]">
                  <td className="p-3 text-[#aaa] sticky left-0 bg-[#111] z-10">{label}</td>
                  {presidents.map((p, pi) => {
                    const snapshot = presidencySnapshots[pi];
                    const val = snapshot.metrics[metric.key];
                    const nextVal = pi < presidents.length - 1
                      ? presidencySnapshots[pi + 1].metrics[metric.key]
                      : currentSnapshot[metric.key];
                    const changeColor = getChangeColor(val, nextVal, metric.key);
                    const changePct = val ? Math.round(((nextVal - val) / val) * 100) : 0;
                    const isHighlighted = !highlightedPresident || highlightedPresident === p.id;

                    return (
                      <td
                        key={p.id}
                        className={`p-3 text-center transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}
                      >
                        <span className="text-[#ccc] block">{formatVal(val, metric.format)}</span>
                        {changePct !== 0 && (
                          <span className="text-[9px] block mt-0.5" style={{ color: changeColor }}>
                            {changePct > 0 ? '↑' : '↓'}{Math.abs(changePct)}%
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <span className="text-white font-bold block">{formatVal(currentSnapshot[metric.key], metric.format)}</span>
                    {(() => {
                      const firstVal = presidencySnapshots[0].metrics[metric.key];
                      const curr = currentSnapshot[metric.key];
                      const totalChange = firstVal ? Math.round(((curr - firstVal) / firstVal) * 100) : 0;
                      const color = getChangeColor(firstVal, curr, metric.key);
                      return (
                        <span className="text-[9px] block mt-0.5" style={{ color }}>
                          {totalChange > 0 ? '↑' : '↓'}{Math.abs(totalChange)}% {locale === 'ko' ? '총' : locale === 'ja' ? '計' : 'total'}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
