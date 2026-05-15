import Image from 'next/image';
import Link from 'next/link';
import { buildUtm, type UtmParams } from '@/lib/shortlinks';

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
    if (isExternal) {
      return (
        <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      );
    }
    return (
      <Link key={idx} href={href} className={className}>
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
        <p className="text-center text-[10px] font-mono text-tm-dim mt-10">
          Defending Democracy, Faith &amp; Freedom · monarchreport.org
        </p>
      </div>
    </main>
  );
}
