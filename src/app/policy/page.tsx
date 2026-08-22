import type { Metadata } from 'next';
import { HubPage, type HubCta } from '@/components/HubPage';

export const metadata: Metadata = {
  title: 'The Monarch Report — For Policymakers',
  description: 'Briefings, data, and reporting on Korea and Japan for legislators and staff.',
  robots: { index: false, follow: false },
};

const CTAS: HubCta[] = [
  { label: { en: 'Subscribe to Policy Briefings', ko: '정책 브리핑 구독', ja: '政策ブリーフィングを購読' },
    sublabel: { en: 'Curated reporting for legislators and staff', ko: '입법 관계자를 위한 선별 보도', ja: '議員・スタッフのための厳選報道' },
    base: '/#newsletter', campaign: 'policy-briefings-2026', content: 'bio-policy-newsletter', primary: true },
  { label: { en: 'Economic Dashboard', ko: '경제 대시보드', ja: '経済ダッシュボード' },
    sublabel: { en: 'KOSPI, FX, gas, youth unemployment — citation-ready', ko: '코스피·환율·기름값·청년실업률, 인용 가능한 수치', ja: 'KOSPI・為替・ガソリン・若年失業率、引用可能な数値' },
    base: '/dashboard', campaign: 'dashboard-launch-2026', content: 'bio-policy-dashboard' },
  { label: { en: 'Latest Reporting', ko: '최신 보도', ja: '最新報道' },
    base: '/articles', campaign: 'articles-2026', content: 'bio-policy-articles' },
  { label: { en: 'Support the Documentary', ko: '다큐멘터리 후원', ja: 'ドキュメンタリーを支援' },
    sublabel: { en: 'You\'re Next — independent reporting on Korea', ko: '《You\'re Next》 — 한국에 관한 독립 보도', ja: '『You\'re Next』 — 韓国をめぐる独立報道' },
    base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: 'bio-policy-doc' },
];

export default function PolicyHub() {
  return (
    <HubPage
      platform={{
        key: 'policy',
        label: { en: 'For Policymakers', ko: '정책 담당자를 위해', ja: '政策担当者のために' },
        tagline: {
          en: 'A resource for U.S. legislators and policy staff. Briefings, data, reporting.',
          ko: '미국 입법·정책 관계자를 위한 자료. 브리핑, 데이터, 보도.',
          ja: '米国の議員・政策スタッフのための資料。ブリーフィング、データ、報道。',
        },
      }}
      ctas={CTAS}
    />
  );
}
