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
    logline: { en: 'Coordinated raids on churches, mosques and spiritual communities reveal a system built to erase independent faith in the name of state control.', ko: '교회와 모스크, 신앙 공동체를 덮친 조직적 단속. 국가라는 이름의 기계가 독립된 신앙을 지우는 방식을 추적한다.', ja: '教会、モスク、信仰共同体を襲った組織的な摘発。国家という名の機械が、独立した信仰を消していく。' },
  },
  {
    number: '02', title: 'The Precedent', country: { en: 'Japan', ko: '일본', ja: '日本' },
    logline: { en: 'The dissolution of a religious organization establishes a legal precedent whose consequences extend far beyond one group or one courtroom.', ko: '한 종교법인의 해산. 법정 하나가 남긴 선례는, 그 단체와 그 나라만의 이야기가 아니다.', ja: '一つの宗教法人の解散。法廷が残した先例は、その団体、その国だけの話ではない。' },
  },
  {
    number: '03', title: 'The Democratic Test', country: { en: 'Korea', ko: '한국', ja: '韓国' },
    logline: { en: 'Surveillance, detention and institutional pressure test whether democratic protections still apply when religious leaders refuse to be silenced.', ko: '감시와 구금, 제도의 압박. 침묵을 거부한 종교 지도자들 앞에서, 민주주의는 시험대에 오른다.', ja: '監視、拘禁、制度の圧力。沈黙を拒んだ宗教指導者の前で、民主主義は試される。' },
  },
];

const filmCopy = {
  en: {
    film: 'The film', episodes: 'Episodes', production: 'Production', eyebrow: 'What happens behind closed doors reaches everyone', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: 'Three nations. One blueprint of persecution. A documentary series built from testimony, rare footage, public records and cinematic storytelling.', trailer: 'Watch the trailer', series: 'The series', warning: 'Three nations. One warning.', seriesDek: 'China, Japan and Korea reveal different methods of pressure—and a shared threat to freedom of belief.',
    format: 'FORMAT', status: 'STATUS', documentary: 'DOCUMENTARY', inProduction: 'IN PRODUCTION', productionLabel: 'A Monarch Films production', productionTitle: 'Truth, scaled to cinema.',
    productionDek: 'Exclusive interviews, rare footage, original reporting and high-end filmmaking bring clarity to stories too often hidden by distance, language or institutional power.', continue: 'Continue with the reporting', follow: 'Follow the record behind the film.', followDek: 'Return to The Monarch Report for independent coverage of Korea, religious freedom and the public consequences behind the series.', visit: 'Visit The Monarch Report →',
    productionCards: [
      ['01 / THE REPORTING', 'Documented from the source', 'Court filings, public records, interviews and original-language reporting establish the factual record.'],
      ['02 / THE IMAGE', 'Built for the cinema', 'Premium cinematography and restrained 2D sequences clarify complex events without turning suffering into spectacle.'],
      ['03 / THE NARRATIVE', 'Evidence, shaped with purpose', 'VFX, sound and visual storytelling serve the documented record without replacing or sensationalizing it.'],
    ],
  },
  ko: {
    film: '작품', episodes: '에피소드', production: '제작', eyebrow: '닫힌 문 뒤에서 시작된 일. 다음은 당신이다', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '중국, 일본, 한국. 세 나라에서 같은 수법이 반복된다. 증언과 기록으로 추적하는 장편 다큐멘터리.', trailer: '예고편 보기', series: '시리즈', warning: '세 나라, 하나의 경고', seriesDek: '압박의 방식은 달라도, 노리는 것은 같다. 믿을 자유.',
    format: '형식', status: '제작', documentary: '다큐멘터리', inProduction: '제작 중', productionLabel: '모나크 필름스', productionTitle: '진실은, 영화가 되어야 한다',
    productionDek: '독점 인터뷰, 희귀 영상, 현장 취재. 거리와 언어, 권력이 가린 이야기를 스크린에 올린다.', continue: '보도로 이어집니다', follow: '작품 뒤에 있는 기록', followDek: '시리즈가 다루는 한국과 종교의 자유를, 모나크 리포트에서 계속 읽으십시오.', visit: '모나크 리포트로 →',
    productionCards: [
      ['01 / 취재', '현장에서 쌓은 기록', '재판 기록, 공문서, 인터뷰, 현지어 보도를 맞춰 사실관계를 세운다.'],
      ['02 / 화면', '극장을 위한 영상', '촬영과 절제된 2D로 복잡한 사건을 보여 주되, 고통을 구경거리로 만들지 않는다.'],
      ['03 / 이야기', '증거가 이끄는 서사', '영상과 사운드는 기록을 대신하지 않는다. 이해를 도울 뿐이다.'],
    ],
  },
  ja: {
    film: '作品', episodes: 'エピソード', production: '制作', eyebrow: '閉ざされた扉の向こうで始まったこと。次は、あなただ', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '中国、日本、韓国。三つの国で、同じ手法が繰り返される。証言と記録で追う長編ドキュメンタリー。', trailer: '予告編を見る', series: 'シリーズ', warning: '三つの国、ひとつの警告', seriesDek: '圧力のかたちは違っても、狙いは同じだ。信じる自由。',
    format: '形式', status: '制作', documentary: 'ドキュメンタリー', inProduction: '制作中', productionLabel: 'モナーク・フィルムズ', productionTitle: '真実は、映画にならなければならない',
    productionDek: '独占インタビュー、希少な映像、現場取材。距離とことば、権力が覆い隠した話をスクリーンに上げる。', continue: '報道へ続く', follow: '作品の背後にある記録', followDek: 'シリーズが扱う韓国と信教の自由を、モナーク・レポートで読み継ぐ。', visit: 'モナーク・レポートへ →',
    productionCards: [
      ['01 / 取材', '現場で積んだ記録', '裁判記録、公文書、インタビュー、現地語報道を突き合わせ、事実を立てる。'],
      ['02 / 画面', '劇場のための映像', '撮影と抑制の効いた2Dで複雑な出来事を見せる。苦しみを見世物にはしない。'],
      ['03 / 物語', '証拠が導く叙事', '映像と音は記録の代わりにはならない。理解を助けるだけだ。'],
    ],
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
    trackEvent('documentary_trailer_play', { source_page: 'films', ...utms.current });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/films" className={styles.brand}>
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
          {copy.productionCards.map(([label, title, description]) => (
            <article key={label}><small>{label}</small><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.support}>
        <span className={styles.eyebrow}>{copy.continue}</span>
        <h2>{copy.follow}</h2>
        <p>{copy.followDek}</p>
        <div><Link href="/">{copy.visit}</Link></div>
      </section>

      <footer className={styles.footer}><Link href="/">{locale === 'ko' ? '모나크 리포트' : locale === 'ja' ? 'モナーク・レポート' : 'The Monarch Report'}</Link><span>{locale === 'ko' ? '모나크 필름스 제작 · 서울 / 뉴욕' : locale === 'ja' ? 'モナーク・フィルムズ製作 · ソウル / ニューヨーク' : 'A Monarch Films Production · Seoul / New York'}</span><span>© 2026</span></footer>

      {trailerOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={copy.trailer}>
          <button type="button" onClick={() => setTrailerOpen(false)} aria-label={copy.trailer}>{locale === 'ko' ? '닫기 ×' : locale === 'ja' ? '閉じる ×' : 'Close ×'}</button>
          <div><iframe src="https://www.youtube.com/embed/S2oRBd0spEo?autoplay=1" title="You're Next: Do Nothing — Official Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
        </div>
      )}
    </main>
  );
}
