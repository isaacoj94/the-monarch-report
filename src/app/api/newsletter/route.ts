import { NextResponse } from 'next/server';

// Brevo (formerly Sendinblue) API integration
// Set BREVO_API_KEY in Vercel environment variables
// Get your API key from: https://app.brevo.com/settings/keys/api

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      // If no API key yet, still accept the email gracefully
      console.log(`Newsletter signup (Brevo not configured): ${email}`);
      return NextResponse.json({ success: true, message: 'Subscribed' });
    }

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
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      // "Contact already exist" is not an error for us
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
