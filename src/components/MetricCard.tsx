'use client';

import { Metric } from '@/lib/data';
import { Locale, t } from '@/lib/translations';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface MetricCardProps {
  metric: Metric;
  label: string;
  unitLabel: string;
  locale: Locale;
  accentColor?: string;
}

function formatValue(value: number, unit: string): string {
  if (unit === '₩' && value >= 10000) {
    return `₩${value.toLocaleString()}`;
  }
  if (unit === '₩') {
    return `₩${value.toLocaleString()}`;
  }
  return `${value}${unit}`;
}

export default function MetricCard({ metric, label, unitLabel, locale, accentColor = '#ef4444' }: MetricCardProps) {
  const trendColor = metric.trend === 'rising' ? '#ef4444' : metric.trend === 'falling' ? '#22c55e' : '#eab308';
  const trendLabel = t(locale, metric.trend);
  const arrow = metric.trend === 'rising' ? '↑' : metric.trend === 'falling' ? '↓' : '→';

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-4 hover:border-[#333333] transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[#888888] text-xs font-mono uppercase tracking-wider">{label}</p>
          <p className="text-white text-2xl font-mono font-bold mt-1">
            {formatValue(metric.currentValue, metric.unit)}
          </p>
          <p className="text-[#666666] text-xs font-mono">{unitLabel}</p>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ color: trendColor, backgroundColor: `${trendColor}15` }}
          >
            {arrow} {Math.abs(metric.changePercent)}%
          </span>
          <p className="text-[#555555] text-[10px] font-mono mt-1">
            {trendLabel} {t(locale, 'since')} 2022.05
          </p>
        </div>
      </div>

      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.history}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
              labelStyle={{ color: '#888' }}
              itemStyle={{ color: '#fff' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatValue(Number(value), metric.unit), '']}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(label: any) => String(label)}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accentColor}
              strokeWidth={1.5}
              fill={`url(#gradient-${metric.id})`}
              dot={false}
              activeDot={{ r: 3, fill: accentColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
