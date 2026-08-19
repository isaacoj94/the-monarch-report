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
    dek: '신앙과 공동체, 미래를 지키려는 한국 시민의 목소리. 그 발언의 배경과 파장을 세계 독자에게 전한다.',
    briefing: '주요 현안 보기', films: '모나크 필름 보기',
    sourcing: '출처가 명시된 보도 · 1차 자료 연결', edition: '한국어 안내 · 서울',
  },
  ja: {
    eyebrow: 'ソウル · 市民の自由 · 海外読者向けブリーフィング',
    title: '声を上げる', emphasis: '権利。',
    dek: '信仰、地域社会、未来を守ろうとする韓国市民の声。その背景と波紋を世界へ伝える。',
    briefing: '主要ニュースを見る', films: 'モナーク・フィルムズを見る',
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
