import {
  DEFAULT_MODEL,
  MAX_COMPLETION_TOKENS,
  MAX_TOOL_CALLS,
  snapshotFromUsage,
} from './cost';
import type { CostSnapshot, DiscoveryResult } from './types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface XSearchFilter {
  allowed_x_handles?: string[];
  excluded_x_handles?: string[];
  from_date?: string;
  to_date?: string;
  enable_image_understanding?: boolean;
  enable_video_understanding?: boolean;
}

export interface OpenRouterChatArgs {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  xSearch?: XSearchFilter;
  enableSearch?: boolean;
  maxTokens?: number;
  model?: string;
}

export async function openRouterChat(args: OpenRouterChatArgs): Promise<{
  content: string;
  cost: CostSnapshot;
  raw: unknown;
}> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not set');

  const model = args.model ?? process.env.DESK_MODEL ?? DEFAULT_MODEL;
  const body: Record<string, unknown> = {
    model,
    messages: args.messages,
    temperature: 0,
    max_tokens: args.maxTokens ?? MAX_COMPLETION_TOKENS,
    response_format: { type: 'json_object' },
  };

  if (args.enableSearch !== false) {
    body.tools = [
      {
        type: 'openrouter:web_search',
        parameters: {
          engine: 'native',
          max_results: 8,
          max_uses: MAX_TOOL_CALLS,
          search_context_size: 'low',
        },
      },
    ];
    body.max_tool_calls = MAX_TOOL_CALLS;
    body.x_search_filter = {
      enable_image_understanding: false,
      enable_video_understanding: false,
      ...args.xSearch,
    };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://monarchreport.org',
      'X-Title': 'The Monarch Report desk',
    },
    body: JSON.stringify(body),
  });

  const raw = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}: ${JSON.stringify(raw).slice(0, 400)}`);
  }

  const choices = raw.choices as Array<{ message?: { content?: string } }> | undefined;
  const content = choices?.[0]?.message?.content ?? '';
  const usage = raw.usage as Record<string, unknown> | undefined;
  return { content, cost: snapshotFromUsage(model, usage), raw };
}

export function parseDiscovery(content: string): DiscoveryResult {
  const json = extractJson(content);
  const items = Array.isArray(json.items) ? json.items : [];
  return {
    items: items.slice(0, 8).map((item) => {
      const row = item as Record<string, unknown>;
      return {
        title: String(row.title ?? '').slice(0, 180),
        url: str(row.url ?? row.sourceUrl),
        postId: str(row.postId ?? row.post_id),
        handle: str(row.handle)?.replace(/^@/, ''),
        eventTime: str(row.eventTime ?? row.event_time),
        location: str(row.location),
        people: strs(row.people),
        organizations: strs(row.organizations),
        claims: strs(row.claims ?? row.claimList),
        primarySourceCandidates: strs(row.primarySourceCandidates ?? row.primary_source_candidates),
        individualImpact: str(row.individualImpact),
        companyImpact: str(row.companyImpact),
        counterclaims: str(row.counterclaims),
        uncertainties: str(row.uncertainties),
        urgency: row.urgency === 'high' || row.urgency === 'low' ? row.urgency : 'normal',
        text: str(row.text),
      };
    }),
  };
}

function extractJson(content: string): Record<string, unknown> {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error('OpenRouter did not return JSON');
  }
}

function str(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const next = value.trim();
  return next || undefined;
}

function strs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
}
