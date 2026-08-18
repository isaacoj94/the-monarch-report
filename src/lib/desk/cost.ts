import type { CostSnapshot } from './types';

/** grok-4.1-fast list price on OpenRouter. Native X/web search is ~$0.005/call. */
export const DEFAULT_MODEL = 'x-ai/grok-4.1-fast';
export const INPUT_USD_PER_M = 0.2;
export const OUTPUT_USD_PER_M = 0.5;
export const SEARCH_USD = 0.005;

export const DEFAULT_DAILY_BUDGET_USD = 0.4;
export const MAX_COMPLETION_TOKENS = 1200;
export const MAX_TOOL_CALLS = 2;
export const MAX_GROK_CALLS_PER_RUN = 2;
export const MAX_DISCOVERY_ITEMS = 8;
export const LOOKBACK_DAYS = 2;

export function dailyBudgetUsd(): number {
  const raw = process.env.DESK_DAILY_BUDGET_USD;
  const parsed = raw ? Number(raw) : DEFAULT_DAILY_BUDGET_USD;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_BUDGET_USD;
}

export function estimateCost(args: {
  promptTokens: number;
  completionTokens: number;
  searchRequests: number;
  billedUsd?: number;
}): number {
  if (typeof args.billedUsd === 'number' && Number.isFinite(args.billedUsd)) {
    return args.billedUsd;
  }
  return (
    (args.promptTokens / 1_000_000) * INPUT_USD_PER_M +
    (args.completionTokens / 1_000_000) * OUTPUT_USD_PER_M +
    args.searchRequests * SEARCH_USD
  );
}

export function snapshotFromUsage(
  model: string,
  usage: Record<string, unknown> | undefined,
): CostSnapshot {
  const promptTokens = num(usage?.prompt_tokens ?? usage?.input_tokens);
  const completionTokens = num(usage?.completion_tokens ?? usage?.output_tokens);
  const server = (usage?.server_tool_use ?? {}) as Record<string, unknown>;
  const searchRequests = num(
    server.web_search_requests ?? usage?.web_search_requests ?? usage?.x_search_requests,
  );
  const billed = usage?.cost ?? usage?.total_cost;
  const billedUsd = typeof billed === 'number' ? billed : undefined;
  return {
    model,
    promptTokens,
    completionTokens,
    searchRequests,
    estimatedUsd: estimateCost({ promptTokens, completionTokens, searchRequests, billedUsd }),
    billedUsd,
  };
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
