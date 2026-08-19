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
    logline: { en: 'Coordinated raids on churches, mosques and spiritual communities reveal a system built to erase independent faith in the name of state control.', ko: '교회와 모스크, 신앙 공동체를 겨냥한 조직적 단속. 국가 통제 아래 독립적인 신앙을 지우려는 체계의 내부를 추적한다.', ja: '教会、モスク、信仰共同体への組織的な取り締まり。国家統制の名の下に、独立した信仰を消そうとする仕組みを追う。' },
  },
  {
    number: '02', title: 'The Precedent', country: { en: 'Japan', ko: '일본', ja: '日本' },
    logline: { en: 'The dissolution of a religious organization establishes a legal precedent whose consequences extend far beyond one group or one courtroom.', ko: '종교단체 해산이 남긴 법적 선례. 하나의 단체와 법정을 넘어 확산될 파장을 짚는다.', ja: '宗教法人の解散が残す法的先例。一つの団体や法廷を超えて広がる影響を検証する。' },
  },
  {
    number: '03', title: 'The Democratic Test', country: { en: 'Korea', ko: '한국', ja: '韓国' },
    logline: { en: 'Surveillance, detention and institutional pressure test whether democratic protections still apply when religious leaders refuse to be silenced.', ko: '감시와 구금, 제도적 압박 속에서 침묵을 거부한 종교 지도자. 민주주의의 보호 장치가 작동하는지 묻는다.', ja: '監視、拘禁、制度的圧力の中で沈黙を拒んだ宗教指導者。民主主義の歯止めが機能するのかを問う。' },
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
    film: '작품', episodes: '에피소드', production: '제작', eyebrow: '닫힌 문 뒤에서 시작된 일, 다음은 우리일 수 있다', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '중국·일본·한국, 서로 다른 세 나라에서 반복된 하나의 박해 구조. 증언과 희귀 영상, 공공 기록을 바탕으로 추적한 다큐멘터리 시리즈.', trailer: '공식 예고편', series: '시리즈', warning: '세 나라에서 확인된 하나의 경고', seriesDek: '서로 다른 압박의 방식, 그리고 신앙의 자유를 겨냥한 공통의 흐름을 추적한다.',
    format: '장르', status: '제작 현황', documentary: '다큐멘터리', inProduction: '제작 중', productionLabel: 'MONARCH FILMS 제작', productionTitle: '기록을 스크린 위에 세우다',
    productionDek: '독점 인터뷰와 희귀 영상, 자체 취재를 영화적 영상과 사운드로 구현해 언어와 거리, 제도 권력에 가려진 사건의 실체를 드러낸다.', continue: '관련 보도', follow: '작품의 바탕이 된 기록', followDek: '한국과 종교의 자유, 시리즈가 다루는 사회적 파장을 취재한 더 모나크 리포트 기사로 이어진다.', visit: '더 모나크 리포트로 이동 →',
    productionCards: [
      ['01 / 취재와 기록', '원자료에서 출발한 취재', '재판 기록과 공공 문서, 인터뷰, 현지어 보도를 교차 검증해 사실관계를 세운다.'],
      ['02 / 영상 구현', '영화를 위한 화면', '고급 촬영과 절제된 2D 시퀀스로 복잡한 사건을 풀어내되 고통을 볼거리로 소비하지 않는다.'],
      ['03 / 서사', '증거를 중심에 둔 이야기', 'VFX와 사운드, 시각적 서사는 기록을 대체하거나 과장하지 않고 이해를 돕는 데 쓰인다.'],
    ],
  },
  ja: {
    film: '作品', episodes: 'エピソード', production: '制作', eyebrow: '閉ざされた場所で始まったことは、やがて私たちにも及ぶ', title: 'You’re Next:', emphasis: 'Do Nothing.',
    dek: '中国、日本、韓国。異なる三つの国で繰り返された一つの迫害構造を、証言、希少映像、公的記録から追うドキュメンタリーシリーズ。', trailer: '公式予告編', series: 'シリーズ', warning: '三つの国が映し出す、一つの警告', seriesDek: '異なる圧力の手法、その背後にある信教の自由への共通した脅威を追う。',
    format: 'ジャンル', status: '制作状況', documentary: 'ドキュメンタリー', inProduction: '制作中', productionLabel: 'MONARCH FILMS 制作', productionTitle: '記録を、スクリーンへ',
    productionDek: '独占インタビュー、希少映像、独自取材を映像と音で構成し、距離や言語、制度の力に隠された出来事の輪郭を浮かび上がらせる。', continue: '関連報道', follow: '作品の土台となった記録', followDek: '韓国、信教の自由、シリーズが扱う社会的影響を追った「ザ・モナーク・レポート」の記事へ。', visit: 'ザ・モナーク・レポートへ移動 →',
    productionCards: [
      ['01 / 取材と記録', '一次資料から組み立てる', '裁判記録、公文書、インタビュー、現地語報道を照合し、事実関係を積み上げる。'],
      ['02 / 映像表現', '映画として描く', '上質な撮影と抑制の効いた2Dシークエンスで、苦しみを見世物にせず複雑な出来事を伝える。'],
      ['03 / 物語', '証拠を中心に据える', 'VFX、音響、映像演出は、記録を置き換えたり誇張したりせず、理解を深めるために用いる。'],
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
