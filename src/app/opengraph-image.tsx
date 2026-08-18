import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = 'The Monarch Report — The right to be heard.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  const imagePath = join(process.cwd(), 'public', 'og-monarch.png');
  const imageData = await readFile(imagePath);
  const imageBase64 = `data:image/png;base64,${imageData.toString('base64')}`;

  return new ImageResponse(
    <img
      alt="The Monarch Report — The right to be heard."
      src={imageBase64}
      width={size.width}
      height={size.height}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />,
    { ...size },
  );
}
