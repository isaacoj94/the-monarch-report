'use client';

import { useLocale } from '@/components/LocaleProvider';

export function LocalizedText({ en, ko, ja }: { en: string; ko: string; ja: string }) {
  const { locale } = useLocale();
  return <>{({ en, ko, ja })[locale]}</>;
}

export function LocalizedDate({ iso, options }: { iso: string; options?: Intl.DateTimeFormatOptions }) {
  const { locale } = useLocale();
  const dateLocale = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP' }[locale];
  return <>{new Date(iso).toLocaleDateString(dateLocale, options ?? { year: 'numeric', month: 'long', day: 'numeric' })}</>;
}

export function ArticleLanguageNotice({ articleLocale }: { articleLocale: 'en' | 'ko' | 'ja' }) {
  const { locale } = useLocale();
  if (locale === articleLocale) return null;

  const message = {
    en: 'This article is preserved in the language in which the journalist published it. Use the language selector to browse Articles originally published in English, Korean, or Japanese.',
    ko: '자동 번역으로 뜻이 바뀌지 않도록, 기자가 쓴 원문 그대로 싣습니다. 언어를 바꾸면 영어·한국어·일본어로 쓴 기사를 각각 볼 수 있습니다.',
    ja: '自動翻訳で意味が変わらないよう、記者が書いた原文のまま載せています。言語を切り替えると、英語・韓国語・日本語の記事をそれぞれ読めます。',
  }[locale];

  return <p className="mb-6 border-l-2 border-tm-gold bg-tm-card px-4 py-3 text-xs leading-relaxed text-tm-secondary">{message}</p>;
}
