import Link from 'next/link';
import styles from './MonarchNewsHero.module.css';

export default function MonarchNewsHero() {
  return (
    <section className={styles.hero} aria-labelledby="lead-story-title">
      <div className={styles.art} aria-hidden="true" />
      <div className={styles.grade} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>The English briefing · Seoul · Civil liberties</div>
        <h1 id="lead-story-title" className={styles.title}>
          The right <em>to be heard.</em>
        </h1>
        <p className={styles.dek}>
          Koreans speak for their beliefs, their communities and their future. We bring their voices—and the context around them—to the English-speaking world.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#now">Enter the briefing&nbsp; →</a>
          <Link className={styles.secondary} href="/documentary">Watch Monarch Films</Link>
        </div>
      </div>
      <div className={styles.sourceLine}>
        <span>Sourced reporting · Primary documents linked</span>
        <span>English edition · Seoul / 서울</span>
      </div>
    </section>
  );
}
