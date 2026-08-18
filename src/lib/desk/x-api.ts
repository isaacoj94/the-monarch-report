const X_API = 'https://api.x.com/2';

export interface XPost {
  id: string;
  text: string;
  created_at?: string;
  lang?: string;
  conversation_id?: string;
  article?: unknown;
  attachments?: { media_keys?: string[] };
  entities?: unknown;
}

export interface XUserPosts {
  userId: string;
  newestId: string | null;
  posts: XPost[];
}

function bearer(): string {
  const token = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;
  if (!token) throw new Error('X_BEARER_TOKEN is not set');
  return token;
}

async function xGet<T>(path: string): Promise<T> {
  const response = await fetch(`${X_API}${path}`, {
    headers: { Authorization: `Bearer ${bearer()}` },
  });
  const json = (await response.json()) as T & { title?: string; detail?: string };
  if (!response.ok) {
    throw new Error(`X API ${response.status}: ${json.detail || json.title || response.statusText}`);
  }
  return json;
}

export async function resolveUserId(username: string): Promise<string> {
  if (process.env.X_USER_ID) return process.env.X_USER_ID;
  const data = await xGet<{ data?: { id: string } }>(`/users/by/username/${username}`);
  if (!data.data?.id) throw new Error(`X user @${username} not found`);
  return data.data.id;
}

export async function fetchOwnPosts(args: {
  username: string;
  sinceId?: string | null;
  maxResults?: number;
}): Promise<XUserPosts> {
  const userId = await resolveUserId(args.username);
  const params = new URLSearchParams({
    max_results: String(Math.min(args.maxResults ?? 20, 20)),
    exclude: 'retweets,replies',
    'tweet.fields':
      'created_at,lang,entities,attachments,public_metrics,conversation_id,note_tweet,article',
    expansions: 'attachments.media_keys',
    'media.fields': 'url,preview_image_url,type,alt_text',
  });
  if (args.sinceId) params.set('since_id', args.sinceId);

  const payload = await xGet<{
    data?: XPost[];
    meta?: { newest_id?: string; result_count?: number };
  }>(`/users/${userId}/tweets?${params.toString()}`);

  const posts = payload.data ?? [];
  return {
    userId,
    newestId: payload.meta?.newest_id ?? posts[0]?.id ?? args.sinceId ?? null,
    posts,
  };
}

export function hasXCredentials(): boolean {
  return Boolean(process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN);
}
