import { NextResponse } from 'next/server';

// Brevo (formerly Sendinblue) API integration
// Set BREVO_API_KEY in Vercel environment variables
// Get your API key from: https://app.brevo.com/settings/keys/api

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

type SignupBody = {
  email?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

const cleanAttr = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim().slice(0, 120);
  return trimmed.length > 0 ? trimmed : undefined;
};

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

    // Pass UTM cohort onto the Brevo contact so the email tool knows where
    // each subscriber came from. Attribute names follow Brevo's uppercase
    // convention; create them once in the Brevo dashboard if your account
    // doesn't auto-provision on-the-fly.
    const attributes: Record<string, string> = {};
    const utmSource = cleanAttr(body.utm_source);
    const utmMedium = cleanAttr(body.utm_medium);
    const utmCampaign = cleanAttr(body.utm_campaign);
    const utmContent = cleanAttr(body.utm_content);
    if (utmSource) attributes.UTM_SOURCE = utmSource;
    if (utmMedium) attributes.UTM_MEDIUM = utmMedium;
    if (utmCampaign) attributes.UTM_CAMPAIGN = utmCampaign;
    if (utmContent) attributes.UTM_CONTENT = utmContent;
    attributes.SIGNUP_AT = new Date().toISOString();

    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [2], // Default list ID — change to match your Brevo list
        attributes,
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.code === 'duplicate_parameter') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Brevo API error:', data);
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
