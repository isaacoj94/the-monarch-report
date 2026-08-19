'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';
import { useLocale } from '@/components/LocaleProvider';
import styles from './documentary.module.css';

const CHAPTERS = [
  {
    number: '01', title: 'Inside the Machine', country: { en: 'China', ko: '중국', ja: '中国' },
    logline: { en: 'Coordinated raids on churches, mosques and spiritual communities reveal a system built to erase independent faith in the name of state control.', ko: '교회와 모스크, 신앙 공동체를 겨냥한 조직적 단속을 통해 국가 통제 아래 독립적인 신앙을 지우려는 체계를 들여다봅니다.', ja: '教会、モスク、信仰共同体への組織的な取り締まりを通じ、国家統制の名の下に独立した信仰を消そうとする仕組みを追います。' },
  },
  {
    number: '02', title: 'The Precedent', country: { en: 'Japan', ko: '일본', ja: '日本' },
    logline: { en: 'The dissolution of a religious organization establishes a legal precedent whose consequences extend far beyond one group or one courtroom.', ko: '종교단체 해산이 하나의 단체나 법정을 넘어 어떤 법적 선례와 파장을 남기는지 살펴봅니다.', ja: '宗教法人の解散が、一つの団体や法廷を超えてどのような法的先例と影響を残すのかを検証します。' },
  },
  {
    number: '03', title: 'The Democratic Test', country: { en: 'Korea', ko: '한국', ja: '韓国' },
    logline: { en: 'Surveillance, detention and institutional pressure test whether democratic protections still apply when religious leaders refuse to be silenced.', ko: '감시와 구금, 제도적 압박 속에서도 종교 지도자가 침묵을 거부할 때 민주주의의 보호 장치가 제대로 작동하는지 묻습니다.', ja: '監視、拘禁、制度的圧力の中で宗教指導者が沈黙を拒むとき、民主主義の保護が機能するのかを問います。' },
  },
];

const filmCopy = {
  en: {
    film: 'The film', episodes: 'Episodes', production: 'Production', eyebrow: 'What happens behind closed doors reaches everyone', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: 'Three nations. One blueprint of persecution. A documentary series built from testimony, rare footage, public records and cinematic storytelling.', trailer: 'Watch the trailer', series: 'The series', warning: 'Three nations. One warning.', seriesDek: 'China, Japan and Korea reveal different methods of pressure—and a shared threat to freedom of belief.',
    format: 'FORMAT', status: 'STATUS', documentary: 'DOCUMENTARY', inProduction: 'IN PRODUCTION', productionLabel: 'A Monarch Films production', productionTitle: 'Truth, scaled to cinema.',
    productionDek: 'Exclusive interviews, rare footage, original reporting and high-end filmmaking bring clarity to stories too often hidden by distance, language or institutional power.', continue: 'Continue with the reporting', follow: 'Follow the record behind the film.', followDek: 'Return to The Monarch Report for independent coverage of Korea, religious freedom and the public consequences behind the series.', visit: 'Visit The Monarch Report →',
  },
  ko: {
    film: '작품', episodes: '에피소드', production: '프로덕션', eyebrow: '닫힌 문 뒤의 일은 결국 모두에게 영향을 미칩니다', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '세 나라, 하나의 박해 구조. 증언과 희귀 영상, 공공 기록, 영화적 스토리텔링으로 완성하는 다큐멘터리 시리즈입니다.', trailer: '예고편 보기', series: '시리즈', warning: '세 나라, 하나의 경고.', seriesDek: '중국·일본·한국에서 서로 다른 압박 방식과 신앙의 자유를 위협하는 공통된 흐름을 추적합니다.',
    format: '형식', status: '상태', documentary: '다큐멘터리', inProduction: '제작 중', productionLabel: '모나크 필름 제작', productionTitle: '사실을 영화의 규모로.',
    productionDek: '독점 인터뷰와 희귀 영상, 자체 취재, 고품질 영상 제작을 통해 거리와 언어, 제도 권력에 가려진 이야기를 분명하게 전합니다.', continue: '관련 보도 이어보기', follow: '영화의 근거가 된 기록을 확인하세요.', followDek: '한국과 종교의 자유, 시리즈가 다루는 공적 영향을 독립적으로 보도하는 더 모나크 리포트로 돌아갑니다.', visit: '더 모나크 리포트 방문 →',
  },
  ja: {
    film: '作品', episodes: 'エピソード', production: '制作', eyebrow: '閉ざされた場所で起きることは、やがて誰にでも及ぶ', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '三つの国、一つの迫害構造。証言、希少映像、公的記録、映画的な物語表現で描くドキュメンタリーシリーズです。', trailer: '予告編を見る', series: 'シリーズ', warning: '三つの国、一つの警告。', seriesDek: '中国・日本・韓国における異なる圧力の手法と、信教の自由への共通した脅威を追います。',
    format: '形式', status: '状況', documentary: 'ドキュメンタリー', inProduction: '制作中', productionLabel: 'モナーク・フィルムズ制作', productionTitle: '事実を、映画のスケールで。',
    productionDek: '独占インタビュー、希少映像、独自取材、高品質な映像制作によって、距離・言語・制度的権力に隠れた物語を明確に伝えます。', continue: '関連報道を読む', follow: '作品の背景にある記録をたどる。', followDek: '韓国、信教の自由、シリーズが扱う社会的影響を独立して報じる「ザ・モナーク・レポート」へ戻ります。', visit: 'ザ・モナーク・レポートへ →',
  },
} as const;

export default function DocumentaryPage() {
  const { locale } = useLocale();
  const copy = filmCopy[locale];
  const [chapter, setChapter] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const utms = useRef<UtmPayload>({});

  useEffect(() => { utms.current = captureUtms(); }, []);

  const openTrailer = () => {
    setTrailerOpen(true);
    trackEvent('documentary_trailer_play', { source_page: 'documentary', ...utms.current });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/documentary" className={styles.brand}>
          <Image src="/logos/monarch-films-butterfly.png" alt="" width={42} height={42} />
          <span>MONARCH <b>FILMS</b></span>
        </Link>
        <nav aria-label="Film navigation"><a href="#film">{copy.film}</a><a href="#chapters">{copy.episodes}</a><a href="#production">{copy.production}</a></nav>
        <span className={styles.pictureLock}>PICTURE LOCK / 02:14</span>
      </header>

      <section id="film" className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true" />
        <div className={styles.heroGrade} aria-hidden="true" />
        <div className={styles.scopeBarTop} aria-hidden="true" />
        <div className={styles.scopeBarBottom} aria-hidden="true" />
        <div className={styles.frameData}><span>MR–YN–002 / FRAME 0184</span><span>2.39:1 · 8K MASTER · SEOUL</span></div>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1>{copy.title}<br /><em>{copy.emphasis}</em></h1>
          <p>{copy.dek}</p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.play} onClick={openTrailer}><span>▶</span> {copy.trailer}</button>
          </div>
        </div>
        <div className={styles.playback}><span>00:00</span><div><i /></div><span>02:14</span></div>
      </section>

      <section id="chapters" className={styles.chapters}>
        <header><span>{copy.series}</span><h2>{copy.warning}</h2><p>{copy.seriesDek}</p></header>
        <div className={styles.chapterTabs} role="tablist" aria-label="Documentary chapters">
          {CHAPTERS.map((item, index) => (
            <button key={item.number} role="tab" aria-selected={chapter === index} onClick={() => setChapter(index)}>
              <small>{item.number} / {item.country[locale]}</small><strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <article className={styles.chapterDetail}>
          <div className={styles.chapterNumber}>{CHAPTERS[chapter].number}</div>
          <div><span>{CHAPTERS[chapter].country[locale]}</span><h3>{CHAPTERS[chapter].title}</h3><p>{CHAPTERS[chapter].logline[locale]}</p></div>
          <div className={styles.chapterMeta}><small>{copy.format}</small><strong>{copy.documentary}</strong><small>{copy.status}</small><strong>{copy.inProduction}</strong></div>
        </article>
      </section>

      <section id="production" className={styles.production}>
        <div className={styles.productionIntro}><span className={styles.eyebrow}>{copy.productionLabel}</span><h2>{copy.productionTitle}</h2><p>{copy.productionDek}</p></div>
        <div className={styles.productionGrid}>
          <article><small>01 / THE RECORD</small><h3>Source-led reporting</h3><p>Court filings, public documents, interviews and original-language reporting form the base layer.</p></article>
          <article><small>02 / THE FRAME</small><h3>High-end production</h3><p>Premium cinematography and editorial 2D sequences bring clarity without turning suffering into spectacle.</p></article>
          <article><small>03 / THE STORY</small><h3>Cinematic clarity</h3><p>VFX, sound and visual storytelling support the documented record without replacing or sensationalizing it.</p></article>
        </div>
      </section>

      <section className={styles.support}>
        <span className={styles.eyebrow}>{copy.continue}</span>
        <h2>{copy.follow}</h2>
        <p>{copy.followDek}</p>
        <div><Link href="/">{copy.visit}</Link></div>
      </section>

      <footer className={styles.footer}><Link href="/">The Monarch Report</Link><span>A Monarch Films Production · Seoul / New York</span><span>© 2026</span></footer>

      {trailerOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Official trailer">
          <button type="button" onClick={() => setTrailerOpen(false)} aria-label="Close trailer">Close ×</button>
          <div><iframe src="https://www.youtube.com/embed/S2oRBd0spEo?autoplay=1" title="You're Next: Do Nothing — Official Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
        </div>
      )}
    </main>
  );
}
