import { NextResponse } from 'next/server';
import { welcomeEmail, type WelcomeLocale } from '@/lib/welcome-email';

// Brevo (formerly Sendinblue) API integration
// Set BREVO_API_KEY in Vercel environment variables
// Get your API key from: https://app.brevo.com/settings/keys/api

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_ACCOUNT_URL = 'https://api.brevo.com/v3/account';
const BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER = { name: 'The Monarch Report', email: 'news@monarchreport.org' };

type SignupBody = {
  email?: string;
  locale?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

function newsletterListId() {
  const value = Number(process.env.BREVO_LIST_ID ?? '2');
  return Number.isSafeInteger(value) && value > 0 ? value : 2;
}

export async function GET() {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return NextResponse.json({ connected: false }, { status: 503 });

  try {
    const response = await fetch(BREVO_ACCOUNT_URL, {
      headers: { accept: 'application/json', 'api-key': apiKey },
      cache: 'no-store',
    });
    return response.ok
      ? NextResponse.json({ connected: true })
      : NextResponse.json({ connected: false }, { status: 503 });
  } catch {
    return NextResponse.json({ connected: false }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error(`Newsletter signup attempted but BREVO_API_KEY is not configured: ${email}`);
      return NextResponse.json(
        { error: 'Newsletter is not yet available. Please check back soon.' },
        { status: 503 }
      );
    }

    const attributes: Record<string, string> = { SIGNUP_AT: new Date().toISOString() };
    if (body.utm_source) attributes.UTM_SOURCE = body.utm_source;
    if (body.utm_medium) attributes.UTM_MEDIUM = body.utm_medium;
    if (body.utm_campaign) attributes.UTM_CAMPAIGN = body.utm_campaign;
    if (body.utm_content) attributes.UTM_CONTENT = body.utm_content;

    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [newsletterListId()],
        updateEnabled: true,
        attributes,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { code?: string };
      if (data.code === 'duplicate_parameter') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Brevo API error:', data);
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
    }

    // 201 = contact created; 204 = existing contact updated (no welcome re-send).
    if (res.status !== 201) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    // Welcome email is best-effort: a send failure must never fail the signup.
    const locale: WelcomeLocale = body.locale === 'ko' || body.locale === 'ja' ? body.locale : 'en';
    const { subject, html } = welcomeEmail(locale);
    try {
      const sendRes = await fetch(BREVO_SEND_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email }],
          subject,
          htmlContent: html,
          tags: ['welcome', 'newsletter-2026'],
        }),
      });
      if (!sendRes.ok) {
        console.error('Brevo welcome send error:', await sendRes.json().catch(() => ({})));
      }
    } catch (err) {
      console.error('Brevo welcome send failed:', err);
    }

    return NextResponse.json({ success: true, message: 'Subscribed' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
