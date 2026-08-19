'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';
import styles from './documentary.module.css';

const CHAPTERS = [
  { number: '01', country: 'China', title: 'Inside the Machine', logline: 'Coordinated raids on churches, mosques and spiritual communities reveal a system built to erase independent faith in the name of state control.' },
  { number: '02', country: 'Japan', title: 'The Precedent', logline: 'The dissolution of a religious organization establishes a legal precedent whose consequences extend far beyond one group or one courtroom.' },
  { number: '03', country: 'Korea', title: 'The Democratic Test', logline: 'Surveillance, detention and institutional pressure test whether democratic protections still apply when religious leaders refuse to be silenced.' },
];

export default function DocumentaryPage() {
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
        <nav aria-label="Film navigation"><a href="#film">The film</a><a href="#chapters">Episodes</a><a href="#production">Production</a></nav>
        <span className={styles.pictureLock}>PICTURE LOCK / 02:14</span>
      </header>

      <section id="film" className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true" />
        <div className={styles.heroGrade} aria-hidden="true" />
        <div className={styles.scopeBarTop} aria-hidden="true" />
        <div className={styles.scopeBarBottom} aria-hidden="true" />
        <div className={styles.frameData}><span>MR–YN–002 / FRAME 0184</span><span>2.39:1 · 8K MASTER · SEOUL</span></div>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>What happens behind closed doors reaches everyone</span>
          <h1>You’re Next:<br /><em>Do Nothing.</em></h1>
          <p>Three nations. One blueprint of persecution. A documentary series built from testimony, rare footage, public records and cinematic storytelling.</p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.play} onClick={openTrailer}><span>▶</span> Watch the trailer</button>
          </div>
        </div>
        <div className={styles.playback}><span>00:00</span><div><i /></div><span>02:14</span></div>
      </section>

      <section id="chapters" className={styles.chapters}>
        <header><span>The series</span><h2>Three nations. One warning.</h2><p>China, Japan and Korea reveal different methods of pressure—and a shared threat to freedom of belief.</p></header>
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
          <div className={styles.chapterMeta}><small>FORMAT</small><strong>DOCUMENTARY</strong><small>STATUS</small><strong>IN PRODUCTION</strong></div>
        </article>
      </section>

      <section id="production" className={styles.production}>
        <div className={styles.productionIntro}><span className={styles.eyebrow}>A Monarch Films production</span><h2>Truth, scaled to cinema.</h2><p>Exclusive interviews, rare footage, original reporting and high-end filmmaking bring clarity to stories too often hidden by distance, language or institutional power.</p></div>
        <div className={styles.productionGrid}>
          <article><small>01 / THE RECORD</small><h3>Source-led reporting</h3><p>Court filings, public documents, interviews and original-language reporting form the base layer.</p></article>
          <article><small>02 / THE FRAME</small><h3>High-end production</h3><p>Premium cinematography and editorial 2D sequences bring clarity without turning suffering into spectacle.</p></article>
          <article><small>03 / THE STORY</small><h3>Cinematic clarity</h3><p>VFX, sound and visual storytelling support the documented record without replacing or sensationalizing it.</p></article>
        </div>
      </section>

      <section className={styles.support}>
        <span className={styles.eyebrow}>Continue with the reporting</span>
        <h2>Follow the record behind the film.</h2>
        <p>Return to The Monarch Report for independent English-language coverage of Korea, religious freedom and the public consequences behind the series.</p>
        <div><Link href="/">Visit The Monarch Report →</Link></div>
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
