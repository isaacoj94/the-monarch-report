import Image from 'next/image';
import Link from 'next/link';
import { getViewerAccess } from '@/lib/screening';
import { signOutAction } from './actions';
import { ScreeningLogin } from './screening-login';
import { ScreeningRoom } from './screening-room';
import styles from './screening.module.css';
import { LocalizedText } from '@/components/LocalizedText';

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
        <span className={styles.privateLabel}><i /> <LocalizedText en="PRIVATE SCREENING" ko="비공개 시사회" ja="限定試写" /></span>
        <span className={styles.securityStatus}><LocalizedText en="SESSION / ENCRYPTED" ko="암호화 세션" ja="暗号化セッション" /></span>
      </header>

      {access ? (
        <ScreeningRoom access={access} signOutAction={signOutAction} />
      ) : (
        <ScreeningLogin configurationError={configurationError} />
      )}

      <footer className={styles.footer}><span>© 2026 MONARCH FILMS</span><span><LocalizedText en="UNAUTHORIZED DISTRIBUTION IS PROHIBITED" ko="무단 배포를 금지합니다" ja="無断配布を禁じます" /></span><Link href="/documentary"><LocalizedText en="Return to the film" ko="작품 페이지로" ja="作品ページへ" /></Link></footer>
    </main>
  );
}
