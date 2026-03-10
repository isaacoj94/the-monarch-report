'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/translations';
import { RegionGasPrice, regionalGasPrices } from '@/lib/data';

interface GasMapProps {
  locale: Locale;
}

function getPriceColor(price: number): string {
  if (price >= 2000) return '#ef4444'; // red — over ₩2,000
  if (price >= 1970) return '#f97316'; // orange
  if (price >= 1940) return '#eab308'; // yellow
  return '#22c55e'; // green — relatively cheaper
}

function getRegionName(region: RegionGasPrice, locale: Locale): string {
  if (locale === 'ko') return region.regionKo;
  if (locale === 'ja') return region.regionJa;
  return region.region;
}

// SVG-based map visualization of Korea with positioned dots
// Coordinates are mapped from lat/lng to SVG viewBox
function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  // Korea bounding box approx: lat 33-38.5, lng 124.5-130
  const x = ((lng - 124.5) / (130 - 124.5)) * 400 + 50;
  const y = ((38.5 - lat) / (38.5 - 33)) * 500 + 30;
  return { x, y };
}

export default function GasMap({ locale }: GasMapProps) {
  const [regions, setRegions] = useState<RegionGasPrice[]>(regionalGasPrices);
  const [nationalAvg, setNationalAvg] = useState<number>(0);
  const [hoveredRegion, setHoveredRegion] = useState<RegionGasPrice | null>(null);
  const [source, setSource] = useState<string>('seed');

  useEffect(() => {
    fetch('/api/gas-prices')
      .then(r => r.json())
      .then(data => {
        if (data.regions && Array.isArray(data.regions) && data.regions.length > 0 && data.regions[0].avgPrice) {
          setRegions(data.regions);
        }
        if (data.nationalAverage) setNationalAvg(data.nationalAverage);
        if (data.source) setSource(data.source);
      })
      .catch(() => {
        // Keep seed data
        const avg = Math.round(regions.reduce((s, r) => s + r.avgPrice, 0) / regions.length);
        setNationalAvg(avg);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nationalAvg === 0 && regions.length > 0) {
      setNationalAvg(Math.round(regions.reduce((s, r) => s + r.avgPrice, 0) / regions.length));
    }
  }, [regions, nationalAvg]);

  const labels: Record<Locale, Record<string, string>> = {
    en: {
      title: 'Gas Prices Across Korea',
      subtitle: 'Regular gasoline, per liter',
      nationalAvg: 'National Average',
      stations: 'stations',
      min: 'Low',
      max: 'High',
      avg: 'Avg',
      legend2000: '₩2,000+',
      legend1970: '₩1,970+',
      legend1940: '₩1,940+',
      legendBelow: 'Below ₩1,940',
      source: 'Source',
      opinet: 'Korea National Oil Corp (Opinet)',
      seed: 'Estimated data — Opinet API key pending',
    },
    ko: {
      title: '전국 휘발유 가격 현황',
      subtitle: '보통 휘발유, 리터당',
      nationalAvg: '전국 평균',
      stations: '주유소',
      min: '최저',
      max: '최고',
      avg: '평균',
      legend2000: '₩2,000+',
      legend1970: '₩1,970+',
      legend1940: '₩1,940+',
      legendBelow: '₩1,940 미만',
      source: '출처',
      opinet: '한국석유공사 (오피넷)',
      seed: '추정 데이터 — 오피넷 API 키 대기 중',
    },
    ja: {
      title: '韓国全土のガソリン価格',
      subtitle: 'レギュラーガソリン、1リットルあたり',
      nationalAvg: '全国平均',
      stations: 'スタンド',
      min: '最安',
      max: '最高',
      avg: '平均',
      legend2000: '₩2,000+',
      legend1970: '₩1,970+',
      legend1940: '₩1,940+',
      legendBelow: '₩1,940未満',
      source: 'ソース',
      opinet: '韓国石油公社（オピネット）',
      seed: '推定データ — オピネットAPIキー待ち',
    },
  };

  const l = labels[locale];

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-mono text-sm font-bold">{l.title}</h3>
          <p className="text-[#666] text-xs font-mono">{l.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[#888] text-[10px] font-mono uppercase">{l.nationalAvg}</p>
          <p className="text-white text-xl font-mono font-bold">₩{nationalAvg.toLocaleString()}</p>
          <p className="text-[10px] font-mono" style={{ color: getPriceColor(nationalAvg) }}>
            {l.avg} / {locale === 'ko' ? '리터' : locale === 'ja' ? 'リットル' : 'liter'}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <svg viewBox="0 0 500 560" className="w-full h-auto">
          {/* Korea outline (simplified) */}
          <path
            d="M200,50 L260,30 L310,45 L340,80 L360,60 L380,75 L390,120 L370,160 L385,200 L380,250 L350,280 L365,320 L340,360 L310,390 L280,420 L250,450 L220,470 L190,460 L170,430 L150,400 L140,350 L160,310 L145,270 L130,230 L140,190 L155,150 L170,110 L180,70 Z"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
          />
          {/* Jeju island */}
          <ellipse cx="210" cy="520" rx="45" ry="20" fill="#1a1a1a" stroke="#333" strokeWidth="1" />

          {/* Region dots */}
          {regions.map((region) => {
            const pos = latLngToSvg(region.lat, region.lng);
            const color = getPriceColor(region.avgPrice);
            const isHovered = hoveredRegion?.region === region.region;
            return (
              <g key={region.region}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer"
              >
                {/* Pulse ring for expensive areas */}
                {region.avgPrice >= 2000 && (
                  <circle cx={pos.x} cy={pos.y} r={isHovered ? 18 : 14} fill={`${color}15`} stroke={`${color}40`} strokeWidth="0.5">
                    <animate attributeName="r" values={isHovered ? "18;22;18" : "14;18;14"} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 10 : 7}
                  fill={color}
                  opacity={isHovered ? 1 : 0.85}
                  stroke={isHovered ? '#fff' : 'none'}
                  strokeWidth={1}
                  style={{ transition: 'all 0.15s ease' }}
                />
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#888'}
                  fontSize={isHovered ? 11 : 9}
                  fontFamily="monospace"
                  style={{ transition: 'all 0.15s ease' }}
                >
                  {getRegionName(region, locale)}
                </text>
                {/* Price label on hover */}
                {isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y + 22}
                    textAnchor="middle"
                    fill={color}
                    fontSize={11}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ₩{region.avgPrice.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover detail panel */}
        {hoveredRegion && (
          <div className="absolute top-2 right-2 bg-[#0a0a0a] border border-[#333] rounded-lg p-3 min-w-[180px]">
            <p className="text-white font-mono text-sm font-bold">
              {getRegionName(hoveredRegion, locale)}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">{l.avg}</span>
                <span className="text-white font-bold">₩{hoveredRegion.avgPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">{l.min}</span>
                <span className="text-[#22c55e]">₩{hoveredRegion.minPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#888]">{l.max}</span>
                <span className="text-[#ef4444]">₩{hoveredRegion.maxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono pt-1 border-t border-[#222]">
                <span className="text-[#888]">{l.stations}</span>
                <span className="text-[#888]">{hoveredRegion.stationCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-[#888]">{l.legend2000}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
          <span className="text-[#888]">{l.legend1970}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
          <span className="text-[#888]">{l.legend1940}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          <span className="text-[#888]">{l.legendBelow}</span>
        </div>
      </div>

      {/* Source */}
      <p className="text-[#444] text-[10px] font-mono mt-3">
        {l.source}: {source === 'opinet' ? l.opinet : l.seed}
      </p>
    </div>
  );
}
