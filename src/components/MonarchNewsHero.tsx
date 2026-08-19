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
    eyebrow: '서울 편집국 · 시민의 자유',
    title: '침묵하지 않을', emphasis: '권리',
    dek: '믿음과 공동체를 지키려는 시민들의 목소리. 그 배경을 세계에 전한다.',
    briefing: '오늘의 뉴스', films: '모나크 필름스',
    sourcing: '취재 근거 공개 · 1차 자료', edition: '한국어판 · 서울',
  },
  ja: {
    eyebrow: 'ソウル編集局 · 市民の自由',
    title: '沈黙しない', emphasis: '権利',
    dek: '信仰と共同体を守ろうとする市民の声。その背景を世界に伝える。',
    briefing: '今日のニュース', films: 'モナーク・フィルムズ',
    sourcing: '出典を明示 · 一次資料', edition: '日本語版 · ソウル',
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
          <Link className={styles.secondary} href="/films">{text.films}</Link>
        </div>
      </div>
      <div className={styles.sourceLine}>
        <span>{text.sourcing}</span>
        <span>{text.edition}</span>
      </div>
    </section>
  );
}
