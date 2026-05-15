'use client';

import Image from 'next/image';
import Link from 'next/link';
import { buildUtm, type UtmParams } from '@/lib/shortlinks';
import { trackEvent } from '@/lib/utm-client';
import { siteConfig } from '@/lib/content';

export type HubCta = {
  label: string;
  sublabel?: string;
  base: string;
  campaign: string;
  content: string;
  primary?: boolean;
};

export type HubPlatform = {
  key: 'x' | 'ig' | 'yt' | 'tt' | 'fb' | 'policy';
  label: string;
  tagline: string;
};

type Props = {
  platform: HubPlatform;
  ctas: HubCta[];
};

const isDocSupport = (url: string): boolean =>
  /theprincipleproject\.com\/projects\/youre-next/i.test(url);

const SOCIALS: { key: 'x' | 'ig' | 'yt' | 'tt' | 'fb'; label: string; url: string }[] = [
  { key: 'x',  label: '𝕏',         url: siteConfig.x         },
  { key: 'ig', label: 'Instagram', url: siteConfig.instagram },
  { key: 'yt', label: 'YouTube',   url: siteConfig.youtube   },
  { key: 'tt', label: 'TikTok',    url: siteConfig.tiktok    },
  { key: 'fb', label: 'Facebook',  url: siteConfig.facebook  },
];

export function HubPage({ platform, ctas }: Props) {
  const sourceFor = (key: HubPlatform['key']): string =>
    key === 'policy' ? 'link-in-bio' : key;

  const renderCta = (cta: HubCta, idx: number) => {
    const utm: UtmParams = {
      source: sourceFor(platform.key),
      medium: 'bio',
      campaign: cta.campaign,
      content: cta.content,
    };
    const href = buildUtm(cta.base, utm);
    const isExternal = /^https?:\/\//i.test(cta.base);
    const className = cta.primary
      ? 'block w-full px-6 py-5 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-bold rounded-lg text-center transition-colors'
      : 'block w-full px-6 py-5 border border-tm-border-hover hover:border-tm-gold/40 text-tm-heading rounded-lg text-center transition-colors';
    const inner = (
      <>
        <span className="block text-base font-serif">{cta.label}</span>
        {cta.sublabel && (
          <span className="block text-xs font-mono text-tm-secondary mt-1">{cta.sublabel}</span>
        )}
      </>
    );
    const onClick = () => {
      const params: Record<string, unknown> = {
        link_url: href,
        source_page: `hub-${platform.key}`,
        cta_id: cta.content,
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
      };
      if (isDocSupport(cta.base)) {
        trackEvent('documentary_support_click', params);
      }
      trackEvent('hub_cta_click', params);
    };
    if (isExternal) {
      return (
        <a key={idx} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
          {inner}
        </a>
      );
    }
    return (
      <Link key={idx} href={href} onClick={onClick} className={className}>
        {inner}
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-tm-page">
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logos/icon-gold.png" alt="The Monarch Report" width={64} height={64} className="w-14 h-14 mx-auto opacity-80" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-tm-heading mb-1">The Monarch Report</h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-tm-gold mb-3">{platform.label}</p>
          <p className="text-sm text-tm-secondary leading-relaxed max-w-xs mx-auto">{platform.tagline}</p>
        </div>
        <div className="space-y-3">
          {ctas.map((cta, idx) => renderCta(cta, idx))}
        </div>
        {platform.key !== 'policy' && (
          <div className="mt-10 pt-6 border-t border-tm-border-subtle">
            <p className="text-center text-[10px] font-mono uppercase tracking-widest text-tm-muted mb-3">Also follow us on</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SOCIALS.filter(s => s.key !== platform.key).map(s => {
                const utm: UtmParams = {
                  source: sourceFor(platform.key),
                  medium: 'bio',
                  campaign: 'follow-2026',
                  content: `bio-${platform.key}-follow-${s.key}`,
                };
                const href = buildUtm(s.url, utm);
                const onClick = () => trackEvent('hub_cta_click', {
                  link_url: href,
                  source_page: `hub-${platform.key}`,
                  cta_id: `follow-${s.key}`,
                  utm_source: utm.source,
                  utm_medium: utm.medium,
                  utm_campaign: utm.campaign,
                  utm_content: utm.content,
                });
                return (
                  <a key={s.key} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}
                     className="text-xs font-mono text-tm-secondary hover:text-tm-heading transition-colors px-3 py-1.5 border border-tm-border rounded hover:border-tm-border-active">
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
        <p className="text-center text-[10px] font-mono text-tm-dim mt-10">
          Defending Democracy, Faith &amp; Freedom · monarchreport.org
        </p>
      </div>
    </main>
  );
}
