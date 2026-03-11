import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = 'The Monarch Report — Defending Democracy, Faith & Freedom';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  // Read the logo file as base64
  const logoPath = join(process.cwd(), 'public', 'logos', 'icon-gold.png');
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#080808',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          width={180}
          height={180}
          style={{ marginBottom: 30 }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: 10,
          }}
        >
          The Monarch Report
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#b8860b',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}
        >
          Defending Democracy, Faith & Freedom
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 16,
            color: '#666666',
            marginTop: 16,
          }}
        >
          Independent journalism on Korea and Japan
        </div>

        {/* Gold accent line */}
        <div
          style={{
            width: 80,
            height: 2,
            backgroundColor: '#b8860b',
            marginTop: 24,
            borderRadius: 1,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
