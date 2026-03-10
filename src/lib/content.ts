// Content configuration for The Monarch Report
// Social-first: X posts and Instagram are the primary content source
// This file serves as the "CMS" — update these arrays to feature content on the site

// === FEATURED CONTENT (Hero / Top of Homepage) ===

export interface FeaturedContent {
  type: 'documentary' | 'article' | 'campaign';
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCta?: { text: string; url: string };
  bgImage?: string;
  tag: string;
}

export const featuredContent: FeaturedContent = {
  type: 'documentary',
  title: 'The Story Korea Doesn\'t Want You to See',
  subtitle: 'A documentary on democracy, faith, and freedom under siege',
  description: 'We\'re producing a documentary that exposes what\'s really happening in Korea — the erosion of democratic norms, the crackdown on religious freedom, and the stories the mainstream media won\'t tell. This film will be our strongest tool to reach Western legislators and the global public.',
  ctaText: 'Support the Documentary',
  ctaUrl: '#documentary',
  secondaryCta: { text: 'Watch the Trailer', url: '#trailer' },
  tag: 'NOW RAISING FUNDS',
};

// === X (TWITTER) POSTS ===
// Add tweet IDs here to feature them on the homepage
// The site will embed them using X's embed script

export interface XPost {
  id: string; // Tweet ID from the URL
  isPinned?: boolean;
  isArticle?: boolean; // X long-form articles
  category?: 'korea' | 'japan' | 'geopolitics' | 'democracy' | 'religion' | 'economy';
}

// Featured/pinned X posts — shown prominently
export const featuredXPosts: XPost[] = [
  // Add your best/most important tweet IDs here
  // Example: { id: '1234567890', isPinned: true, category: 'korea' }
];

// X Articles (long-form) — these get special treatment as "original reporting"
export const xArticles: XPost[] = [
  // Add X article tweet IDs here — they'll be displayed as featured articles
  // Example: { id: '1234567890', isArticle: true, category: 'democracy' }
];

// === INSTAGRAM ===

export const instagramHandle = 'monarchreport25';
export const xHandle = 'monarchreport25';

// === SITE CONFIGURATION ===

export const siteConfig = {
  name: 'The Monarch Report',
  tagline: 'Defending Democracy, Faith & Freedom',
  description: 'Independent journalism bringing the truth about Korea and Japan to the West. Trusted by U.S. legislators and policymakers as a resource for facts.',
  x: `https://x.com/${xHandle}`,
  instagram: `https://www.instagram.com/${instagramHandle}/`,
  email: '', // Add when ready
  // Social embed settings
  xTimelineHeight: 800,
  xTheme: 'dark',
};

// === CATEGORIES ===

export interface Category {
  id: string;
  label: Record<string, string>;
  color: string;
}

export const categories: Category[] = [
  { id: 'korea', label: { en: 'Korea', ko: '한국', ja: '韓国' }, color: '#ef4444' },
  { id: 'japan', label: { en: 'Japan', ko: '일본', ja: '日本' }, color: '#f59e0b' },
  { id: 'democracy', label: { en: 'Democracy', ko: '민주주의', ja: '民主主義' }, color: '#3b82f6' },
  { id: 'religion', label: { en: 'Faith & Religion', ko: '종교', ja: '宗教' }, color: '#a855f7' },
  { id: 'geopolitics', label: { en: 'Geopolitics', ko: '지정학', ja: '地政学' }, color: '#22c55e' },
  { id: 'economy', label: { en: 'Economy', ko: '경제', ja: '経済' }, color: '#06b6d4' },
];

// === NEWSLETTER ===

export const newsletter = {
  title: 'Stay Informed',
  subtitle: 'Get the truth about Korea and Japan delivered to your inbox.',
  disclaimer: 'No spam. Unsubscribe anytime.',
  // Integration: add Mailchimp/ConvertKit/Buttondown URL later
  formAction: '', // Will be set up with email provider
};
