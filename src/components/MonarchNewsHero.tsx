'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import styles from './MonarchNewsHero.module.css';

const copy = {
  en: {
    eyebrow: 'The English briefing · Seoul · Civil liberties',
    title: 'The right', emphasis: 'to be heard.',
    dek: 'Koreans speak for their beliefs, their communities and their future. We bring their voices—and the context around them—to the English-speaking world.',
    briefing: 'See what’s happening', films: 'Watch Monarch Films',
    sourcing: 'Sourced reporting · Primary documents linked', edition: 'English edition · Seoul / 서울',
  },
  ko: {
    eyebrow: '서울 · 시민의 자유 · 국제 독자를 위한 브리핑',
    title: '목소리를 낼', emphasis: '권리.',
    dek: '한국인들은 신앙과 공동체, 그리고 미래를 위해 말합니다. 그 목소리와 반드시 알아야 할 맥락을 세계 독자에게 전합니다.',
    briefing: '지금 무슨 일이 일어나는지 보기', films: '모나크 필름 보기',
    sourcing: '출처가 명시된 보도 · 1차 자료 연결', edition: '한국어 안내 · 서울',
  },
  ja: {
    eyebrow: 'ソウル · 市民の自由 · 海外読者向けブリーフィング',
    title: '声を上げる', emphasis: '権利。',
    dek: '韓国の人々は、信仰、地域社会、そして未来のために声を上げています。その声と、理解に欠かせない背景を世界へ伝えます。',
    briefing: 'いま起きていることを見る', films: 'モナーク・フィルムズを見る',
    sourcing: '出典を明記した報道 · 一次資料へのリンク', edition: '日本語案内 · ソウル',
  },
} as const;

export default function MonarchNewsHero() {
  const { locale } = useLocale();
  const text = copy[locale];
  return (
    <section className={styles.hero} aria-labelledby="lead-story-title">
      <div className={styles.art} aria-hidden="true" />
      <div className={styles.grade} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>{text.eyebrow}</div>
        <h1 id="lead-story-title" className={styles.title}>
          {text.title} <em>{text.emphasis}</em>
        </h1>
        <p className={styles.dek}>{text.dek}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#now">{text.briefing}&nbsp; →</a>
          <Link className={styles.secondary} href="/documentary">{text.films}</Link>
        </div>
      </div>
      <div className={styles.sourceLine}>
        <span>{text.sourcing}</span>
        <span>{text.edition}</span>
      </div>
    </section>
  );
}
