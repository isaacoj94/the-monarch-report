'use client';

import { useLocale } from '@/components/LocaleProvider';

export function LocalizedText({ en, ko, ja }: { en: string; ko: string; ja: string }) {
  const { locale } = useLocale();
  return <>{({ en, ko, ja })[locale]}</>;
}

export function ArticleLanguageNotice({ articleLocale }: { articleLocale: 'en' | 'ko' | 'ja' }) {
  const { locale } = useLocale();
  if (locale === articleLocale) return null;

  const message = {
    en: 'This article is preserved in the language in which the journalist published it. Use the language selector to browse Articles originally published in English, Korean, or Japanese.',
    ko: '기사의 의미가 달라지는 자동 번역을 피하기 위해 필진이 발행한 원문을 그대로 제공합니다. 언어 선택에서 영어·한국어·일본어 원문 기사를 각각 찾아볼 수 있습니다.',
    ja: '内容が変わり得る自動翻訳を避けるため、執筆者が公開した言語のまま掲載しています。言語選択から英語・韓国語・日本語の原文記事をそれぞれ閲覧できます。',
  }[locale];

  return <p className="mb-6 border-l-2 border-tm-gold bg-tm-card px-4 py-3 text-xs leading-relaxed text-tm-secondary">{message}</p>;
}
