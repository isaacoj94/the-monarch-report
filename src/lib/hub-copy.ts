import type { HubCta, HubText } from '@/components/HubPage';

type SocialKey = 'x' | 'ig' | 'yt' | 'tt' | 'fb';

// The five social hubs share the same destinations; only the UTM content ids
// and the platform greeting differ.
export function standardHubCtas(key: SocialKey): HubCta[] {
  return [
    {
      label: { en: 'Subscribe to the Newsletter', ko: '뉴스레터 구독', ja: 'ニュースレターを購読' },
      sublabel: {
        en: 'The truth about Korea & Japan in your inbox',
        ko: '한국과 일본의 진실을 메일함으로',
        ja: '韓国と日本の真実を、受信箱へ',
      },
      base: '/#newsletter', campaign: 'newsletter-2026', content: `bio-${key}-newsletter`, primary: true,
    },
    {
      label: { en: 'Support the Documentary', ko: '다큐멘터리 후원', ja: 'ドキュメンタリーを支援' },
      sublabel: {
        en: 'You\'re Next — now raising funds',
        ko: '《You\'re Next》 제작 후원 진행 중',
        ja: '『You\'re Next』制作資金を募集中',
      },
      base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: `bio-${key}-doc`,
    },
    {
      label: { en: 'Watch the Trailer', ko: '예고편 보기', ja: '予告編を見る' },
      base: '/#trailer', campaign: 'youre-next-doc-2026', content: `bio-${key}-trailer`,
    },
    {
      label: { en: 'Latest Articles', ko: '최신 기사', ja: '最新記事' },
      base: '/articles', campaign: 'articles-2026', content: `bio-${key}-articles`,
    },
    {
      label: { en: 'Economic Dashboard', ko: '경제 대시보드', ja: '経済ダッシュボード' },
      sublabel: {
        en: 'KOSPI, FX, gas, unemployment — live',
        ko: '코스피·환율·기름값·실업률 실시간',
        ja: 'KOSPI・為替・ガソリン・失業率をライブで',
      },
      base: '/dashboard', campaign: 'dashboard-launch-2026', content: `bio-${key}-dashboard`,
    },
  ];
}

export function welcomeTagline(platformName: string): HubText {
  return {
    en: `Welcome from ${platformName}. Pick where to go next.`,
    ko: `${platformName}에서 오셨군요. 어디로 갈지 고르십시오.`,
    ja: `${platformName}からようこそ。次の行き先を選んでください。`,
  };
}
