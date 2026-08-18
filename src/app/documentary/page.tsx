'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';
import styles from './documentary.module.css';

const SUPPORT_URL = 'https://www.theprincipleproject.com/projects/youre-next';

const CHAPTERS = [
  { number: '01', country: 'South Korea', title: 'Silence', logline: 'When private power meets public consequence, testimony becomes an act of resistance.' },
  { number: '02', country: 'Japan', title: 'Dissolution', logline: 'A legal precedent that reaches far beyond one organization and one courtroom.' },
  { number: '03', country: 'China', title: 'Surveillance', logline: 'Faith survives beneath a system built to watch, identify and erase dissent.' },
  { number: '04', country: 'North Korea', title: 'Witness', logline: 'In the world’s most closed society, fragments of evidence carry extraordinary weight.' },
];

export default function DocumentaryPage() {
  const [chapter, setChapter] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [reconstruction, setReconstruction] = useState(false);
  const utms = useRef<UtmPayload>({});

  useEffect(() => { utms.current = captureUtms(); }, []);

  const supportClick = (ctaId: string) => () => {
    trackEvent('documentary_support_click', { link_url: SUPPORT_URL, source_page: 'documentary', cta_id: ctaId, ...utms.current });
  };

  const openTrailer = () => {
    setTrailerOpen(true);
    trackEvent('documentary_trailer_play', { source_page: 'documentary', ...utms.current });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image src="/logos/icon-gold.png" alt="" width={38} height={38} />
          <span>MONARCH <b>FILMS</b></span>
        </Link>
        <nav aria-label="Film navigation"><a href="#film">The film</a><a href="#chapters">Chapters</a><a href="#production">VFX lab</a></nav>
        <span className={styles.pictureLock}>PICTURE LOCK / 02:14</span>
      </header>

      <section id="film" className={`${styles.hero} ${reconstruction ? styles.reconstruction : ''}`}>
        <div className={styles.heroArt} aria-hidden="true" />
        <div className={styles.heroGrade} aria-hidden="true" />
        <div className={styles.scopeBarTop} aria-hidden="true" />
        <div className={styles.scopeBarBottom} aria-hidden="true" />
        <div className={styles.frameData}><span>MR–YN–002 / FRAME 0184</span><span>2.39:1 · 8K MASTER · SEOUL</span></div>
        {reconstruction && (
          <div className={styles.vfxOverlay} aria-hidden="true">
            <span>SUBJECT / TRACK 03</span><span>ENVIRONMENT RECONSTRUCTION</span><span>VFX VIEW · 184 NODES</span>
          </div>
        )}
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>What happens behind closed doors reaches everyone</span>
          <h1>You’re Next:<br /><em>Do Nothing.</em></h1>
          <p>Power meets in private. Citizens live with the consequences. Enter a five-part investigation built from testimony, court records and cinematic reconstruction.</p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.play} onClick={openTrailer}><span>▶</span> Watch the first 90 seconds</button>
            <button type="button" className={styles.vfxToggle} aria-pressed={reconstruction} onClick={() => setReconstruction((value) => !value)}>{reconstruction ? 'Return to final grade' : 'Reveal the reconstruction'}</button>
          </div>
        </div>
        <div className={styles.playback}><span>00:00</span><div><i /></div><span>02:14</span></div>
      </section>

      <section id="chapters" className={styles.chapters}>
        <header><span>Series architecture</span><h2>Four countries. One warning.</h2><p>Each chapter follows a distinct system of pressure, then traces the pattern connecting them.</p></header>
        <div className={styles.chapterTabs} role="tablist" aria-label="Documentary chapters">
          {CHAPTERS.map((item, index) => (
            <button key={item.number} role="tab" aria-selected={chapter === index} onClick={() => setChapter(index)}>
              <small>{item.number} / {item.country}</small><strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <article className={styles.chapterDetail}>
          <div className={styles.chapterNumber}>{CHAPTERS[chapter].number}</div>
          <div><span>{CHAPTERS[chapter].country}</span><h3>{CHAPTERS[chapter].title}</h3><p>{CHAPTERS[chapter].logline}</p></div>
          <div className={styles.chapterMeta}><small>FORMAT</small><strong>22 MINUTES</strong><small>STATUS</small><strong>IN PRODUCTION</strong></div>
        </article>
      </section>

      <section id="production" className={styles.production}>
        <div className={styles.productionIntro}><span className={styles.eyebrow}>A Monarch Films production</span><h2>Journalism, scaled to cinema.</h2><p>Our reconstructions do not replace the record. They make complex timelines visible while every dramatic element remains labeled and paired with the reporting behind it.</p></div>
        <div className={styles.productionGrid}>
          <article><small>01 / THE RECORD</small><h3>Source-led reporting</h3><p>Court filings, public documents, interviews and original-language reporting form the base layer.</p></article>
          <article><small>02 / THE FRAME</small><h3>High-end production</h3><p>Premium cinematography and editorial 2D sequences bring clarity without turning suffering into spectacle.</p></article>
          <article><small>03 / THE BUILD</small><h3>AAA VFX reconstruction</h3><p>Environments and events are reconstructed only where the evidence supports what the audience sees.</p></article>
        </div>
      </section>

      <section className={styles.support}>
        <span className={styles.eyebrow}>The investigation is in production</span>
        <h2>Help bring the record to the screen.</h2>
        <p>Support the five-part series and help place these stories before legislators, institutions and audiences around the world.</p>
        <div><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" onClick={supportClick('cinema-primary')}>Support the production →</a><Link href="/articles">Read the reporting</Link></div>
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
