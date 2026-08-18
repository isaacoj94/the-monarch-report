export type SourceKind =
  | 'primary'
  | 'specialist'
  | 'mainstream'
  | 'advocacy'
  | 'party'
  | 'government'
  | 'witness'
  | 'owned';

export type SourceForm = 'reporting' | 'analysis' | 'opinion' | 'allegation' | 'record' | 'post';

export type EventStatus = 'Developing' | 'Corroborated' | 'Confirmed' | 'Contested' | 'Corrected';

export type ClaimVerdict =
  | 'supported'
  | 'partially_supported'
  | 'contested'
  | 'unsupported'
  | 'outdated'
  | 'unchecked';

export type ReviewState = 'inbox' | 'needs_review' | 'approved' | 'rejected' | 'held';

export type ImpactTag =
  | 'regulatory_risk'
  | 'foreign_investment'
  | 'supply_chain'
  | 'reputation'
  | 'labor'
  | 'sanctions'
  | 'data_privacy'
  | 'political_stability';

export interface DeskSource {
  id: string;
  handle?: string;
  name: string;
  url?: string;
  country?: string;
  language?: string;
  kind: SourceKind;
  ownership?: string;
  relationships?: string;
  notes?: string;
}

export interface RawItem {
  id: string;
  collectedAt: string;
  collector: 'x-api' | 'openrouter-x' | 'manual';
  beat?: string;
  postId?: string;
  articleId?: string;
  url?: string;
  handle?: string;
  postedAt?: string;
  lang?: string;
  text: string;
  hasArticle?: boolean;
  media?: { type: string; url?: string }[];
  reviewState: ReviewState;
  seenHash: string;
}

export interface DeskClaim {
  id: string;
  eventId?: string;
  text: string;
  kind: 'fact' | 'allegation' | 'inference' | 'opinion';
  verdict: ClaimVerdict;
  needsHuman: boolean;
  sources: string[];
}

export interface DeskEvent {
  id: string;
  title: string;
  summary: string;
  status: EventStatus;
  reviewState: ReviewState;
  urgency: 'low' | 'normal' | 'high';
  location?: string;
  eventTime?: string;
  people: string[];
  organizations: string[];
  individualImpact?: string;
  companyImpact?: string;
  impactTags: ImpactTag[];
  known?: string;
  unverified?: string;
  counterclaims?: string;
  sourceUrls: string[];
  postIds: string[];
  rawItemIds: string[];
  claimIds: string[];
  lastCheckedAt: string;
  extractionModel?: string;
  challengeModel?: string;
  extraction?: unknown;
  challenge?: unknown;
}

export interface DeskInbox {
  version: 1;
  rawItems: RawItem[];
  events: DeskEvent[];
  claims: DeskClaim[];
}

export interface DeskCursor {
  ownAccountSinceId: string | null;
  lastRunAt: string | null;
  lastBeatIndex: number;
  spendDay: string;
  spendUsd: number;
  seenPostIds: string[];
  lastError?: string | null;
}

export interface WatchlistBeat {
  id: string;
  title: string;
  query: string;
  handles: string[];
}

export interface WatchlistFile {
  ownHandle: string;
  beats: WatchlistBeat[];
}

export interface DiscoveryItem {
  title: string;
  url?: string;
  postId?: string;
  handle?: string;
  eventTime?: string;
  location?: string;
  people: string[];
  organizations: string[];
  claims: string[];
  primarySourceCandidates: string[];
  individualImpact?: string;
  companyImpact?: string;
  counterclaims?: string;
  uncertainties?: string;
  urgency: 'low' | 'normal' | 'high';
  text?: string;
}

export interface DiscoveryResult {
  items: DiscoveryItem[];
}

export interface CostSnapshot {
  model: string;
  promptTokens: number;
  completionTokens: number;
  searchRequests: number;
  estimatedUsd: number;
  billedUsd?: number;
}
