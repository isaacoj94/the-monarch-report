import Image from 'next/image';
import Link from 'next/link';
import { getViewerAccess } from '@/lib/screening';
import { signOutAction } from './actions';
import { ScreeningLogin } from './screening-login';
import { ScreeningRoom } from './screening-room';
import styles from './screening.module.css';

export const dynamic = 'force-dynamic';

export default async function ScreeningPage() {
  let access = null;
  let configurationError = false;

  try {
    access = await getViewerAccess();
  } catch {
    configurationError = true;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/documentary" className={styles.brand}>
          <Image src="/logos/monarch-films-butterfly.png" alt="" width={38} height={38} priority />
          <span>MONARCH <b>FILMS</b></span>
        </Link>
        <span className={styles.privateLabel}><i /> PRIVATE SCREENING</span>
        <span className={styles.securityStatus}>SESSION / ENCRYPTED</span>
      </header>

      {access ? (
        <ScreeningRoom access={access} signOutAction={signOutAction} />
      ) : (
        <ScreeningLogin configurationError={configurationError} />
      )}

      <footer className={styles.footer}><span>© 2026 MONARCH FILMS</span><span>UNAUTHORIZED DISTRIBUTION IS PROHIBITED</span><Link href="/documentary">Return to the film</Link></footer>
    </main>
  );
}
