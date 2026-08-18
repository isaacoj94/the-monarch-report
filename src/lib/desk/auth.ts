export const DESK_COOKIE = 'monarch_desk';

export function deskPassword(): string | undefined {
  const value = process.env.DESK_PASSWORD?.trim();
  return value || undefined;
}

export async function deskToken(password = deskPassword()): Promise<string | null> {
  if (!password) return null;
  const data = new TextEncoder().encode(`monarch-desk:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function deskTokenMatches(value: string | undefined): Promise<boolean> {
  const expected = await deskToken();
  if (!expected || !value || expected.length !== value.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ value.charCodeAt(i);
  }
  return diff === 0;
}
