// Transactional welcome email sent by /api/newsletter after a successful signup.
// Email-safe HTML: table layout, inline styles only. Links carry newsletter-2026
// welcome UTMs (utm_medium must stay "email" — GA4 channel grouping depends on it).

export type WelcomeLocale = 'en' | 'ko' | 'ja';

const SITE = 'https://monarchreport.org';
const UTM = 'utm_source=email&utm_medium=email&utm_campaign=newsletter-2026&utm_content=welcome';

const copy = {
  en: {
    subject: 'Welcome to The Monarch Report',
    preheader: 'Korea and Japan, with the missing context restored.',
    greeting: 'You’re on the list.',
    body: 'Thank you for subscribing to The Monarch Report — a concise dispatch on Korea and Japan for readers, policymakers and organizations that need more than the headline. Expect important developments translated into consequence: what happened, why it matters to people, and why it matters to companies.',
    articlesCta: 'Read the latest reporting',
    filmLead: 'From Monarch Films',
    filmBody: 'Our documentary work begins with You’re Next: Do Nothing — stories that demand more than a headline.',
    filmCta: 'Watch the trailer',
    footer: 'You received this email because you subscribed at monarchreport.org.',
    tagline: 'Defending Democracy, Faith & Freedom',
  },
  ko: {
    subject: '모나크 리포트 구독을 환영합니다',
    preheader: '헤드라인 뒤에 있는 한국과 일본.',
    greeting: '구독 신청이 완료됐습니다.',
    body: '모나크 리포트를 구독해 주셔서 감사합니다. 정책과 현안이 가계와 사업에 미치는 변화를 짧게 정리해 보내 드립니다. 무슨 일이 있었는지, 가계와 기업에 어떤 의미인지 — 숫자와 맥락으로 전해 드리겠습니다.',
    articlesCta: '최신 기사 보기',
    filmLead: '모나크 필름스',
    filmBody: '기사 한 줄로는 담기지 않는 이야기 — 장편 다큐멘터리 《You’re Next: Do Nothing》을 시작으로 소개해 드립니다.',
    filmCta: '예고편 보기',
    footer: 'monarchreport.org에서 구독을 신청하셨기 때문에 이 메일을 받으셨습니다.',
    tagline: 'Defending Democracy, Faith & Freedom',
  },
  ja: {
    subject: 'モナーク・レポートへようこそ',
    preheader: '見出しの向こうにある韓国と日本。',
    greeting: '購読の登録が完了しました。',
    body: 'モナーク・レポートの購読ありがとうございます。政策と懸案が家計と事業に及ぼす変化を、短く整理して届けます。何が起きたのか、家計と企業に何を意味するのか — 数字と文脈で読み解きます。',
    articlesCta: '最新記事を読む',
    filmLead: 'モナーク・フィルムズ',
    filmBody: '見出し一行では収まらない話 — 長編ドキュメンタリー『You’re Next: Do Nothing』から紹介します。',
    filmCta: '予告編を見る',
    footer: 'このメールは monarchreport.org で購読登録されたため届いています。',
    tagline: 'Defending Democracy, Faith & Freedom',
  },
} as const;

export function welcomeEmail(locale: WelcomeLocale) {
  const t = copy[locale] ?? copy.en;
  const html = `<!doctype html>
<html lang="${locale}">
<body style="margin:0;padding:0;background-color:#f0efe8;">
  <div style="display:none;max-height:0;overflow:hidden;">${t.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0efe8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #dddbd2;">
        <tr><td style="background-color:#0a0a0a;padding:28px 32px;" align="center">
          <img src="${SITE}/logos/combined-gold.png" alt="The Monarch Report" width="277" style="max-width:277px;width:60%;height:auto;" />
        </td></tr>
        <tr><td style="padding:36px 32px 8px;font-family:Georgia,'Times New Roman',serif;color:#0a0a0a;">
          <div style="border-top:3px solid #d4a017;width:48px;margin-bottom:20px;"></div>
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;font-weight:700;">${t.greeting}</h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#333333;">${t.body}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#0a0a0a;">
            <a href="${SITE}/articles?${UTM}" style="display:inline-block;padding:13px 26px;font-family:Georgia,serif;font-size:15px;color:#d4a017;text-decoration:none;font-weight:700;">${t.articlesCta} →</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:28px 32px 36px;font-family:Georgia,'Times New Roman',serif;">
          <div style="border-top:1px solid #eae9e4;padding-top:24px;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a6508;font-weight:700;">${t.filmLead}</p>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333333;">${t.filmBody}</p>
            <a href="${SITE}/documentary?${UTM}" style="font-size:15px;color:#8a6508;font-weight:700;text-decoration:underline;">${t.filmCta} →</a>
          </div>
        </td></tr>
        <tr><td style="background-color:#0a0a0a;padding:22px 32px;" align="center">
          <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:12px;letter-spacing:0.1em;color:#d4a017;">${t.tagline}</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:#a5a49d;">${t.footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { subject: t.subject, html };
}
