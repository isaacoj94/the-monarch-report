'use client';

import { Metric } from '@/lib/data';
import { Locale, t } from '@/lib/translations';

interface CompareRow {
  label: string;
  metric: Metric;
}

interface CompareTableProps {
  rows: CompareRow[];
  locale: Locale;
}

function formatVal(value: number, unit: string): string {
  if (unit === '₩' && value >= 10000) return `₩${value.toLocaleString()}`;
  if (unit === '₩') return `₩${value.toLocaleString()}`;
  return `${value}${unit}`;
}

export default function CompareTable({ rows, locale }: CompareTableProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-[#222222]">
            <th className="text-left text-[#666666] p-3 text-xs uppercase tracking-wider"></th>
            <th className="text-right text-[#666666] p-3 text-xs uppercase tracking-wider">
              {t(locale, 'presidencyStart')}
              <br />
              <span className="text-[#555555] text-[10px]">2022.05</span>
            </th>
            <th className="text-right text-[#666666] p-3 text-xs uppercase tracking-wider">
              {t(locale, 'today')}
              <br />
              <span className="text-[#555555] text-[10px]">2026.03</span>
            </th>
            <th className="text-right text-[#666666] p-3 text-xs uppercase tracking-wider">
              {t(locale, 'change')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, metric }) => {
            const isNegativeGood = ['inflation'].includes(metric.id);
            const changeIsGood = isNegativeGood
              ? metric.changePercent < 0
              : metric.changePercent < 0;
            const changeColor = changeIsGood ? '#22c55e' : '#ef4444';
            const arrow = metric.changePercent > 0 ? '↑' : metric.changePercent < 0 ? '↓' : '→';

            return (
              <tr key={metric.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                <td className="p-3 text-[#cccccc]">{label}</td>
                <td className="p-3 text-right text-[#888888]">
                  {formatVal(metric.presidencyStartValue, metric.unit)}
                </td>
                <td className="p-3 text-right text-white font-bold">
                  {formatVal(metric.currentValue, metric.unit)}
                </td>
                <td className="p-3 text-right" style={{ color: changeColor }}>
                  {arrow} {Math.abs(metric.changePercent)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
