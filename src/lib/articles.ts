// Stored article metadata for X Articles
// X Articles can't be scraped (behind auth), so titles/summaries are stored here.
// Add new articles at the top. The articleId comes from the X article URL:
//   https://x.com/i/article/{articleId}

export interface StoredArticle {
  articleId: string;
  title: string;
  summary?: string;
  category?: 'korea' | 'japan' | 'democracy' | 'economy' | 'religion' | 'opinion';
  image?: string; // optional cover image path in /public/articles/
}

export const storedArticles: StoredArticle[] = [
  {
    articleId: '2029814586296397824',
    title: 'Korea's Religious Freedom Crisis: A Timeline of Persecution',
    summary: 'From Pastor Son\'s arrest to Dr. Han\'s detention — a comprehensive timeline of religious persecution under the Lee Jae-myung government.',
    category: 'religion',
  },
  {
    articleId: '2029622475181674499',
    title: 'The Dissolution Order: What It Means for Religious Freedom Worldwide',
    summary: 'Tokyo High Court upholds first dissolution of a religious organization without criminal charges in a modern democracy.',
    category: 'japan',
  },
  {
    articleId: '2029267292245377028',
    title: 'Supreme Court Expansion: How Lee Jae-myung Is Packing the Bench',
    summary: '14 to 26 justices — with 22 appointed by one president. What this means for judicial independence.',
    category: 'democracy',
  },
  {
    articleId: '2028664214643159040',
    title: 'The Communist Connection Behind Japan\'s Dissolution Campaign',
    summary: 'How a network of Communist Party-affiliated lawyers drove a 40-year campaign against religious freedom.',
    category: 'japan',
  },
  {
    articleId: '2028653018913374208',
    title: 'Inside the Church Dissolution Act: Korea\'s Most Dangerous Bill',
    summary: 'Bill No. 2215932 would let the government revoke religious permits and seize church assets without criminal charges.',
    category: 'religion',
  },
  {
    articleId: '2028466310964023296',
    title: 'Democracy in Decline: 8 Bills Eroding Freedom in South Korea',
    summary: 'From court-packing to criminalizing sermons — a bill-by-bill breakdown of Korea\'s democratic backslide.',
    category: 'democracy',
  },
  {
    articleId: '2027711375200616448',
    title: 'The Economic Cost of Democratic Erosion',
    summary: 'Won at record lows, KOSPI stagnant, household debt at 105% of GDP — the numbers Korean media won\'t show you.',
    category: 'economy',
  },
  {
    articleId: '2027019035196661760',
    title: 'UN Rapporteurs Challenge Japan\'s Dissolution Standard',
    summary: 'Four UN Special Rapporteurs declare "public welfare" is not a legitimate ground for restricting religious freedom.',
    category: 'japan',
  },
  {
    articleId: '2022845292455038978',
    title: 'Pastor Son Hyun-bo: 143 Days in Jail for a Sunday Interview',
    summary: 'Arrested for interviewing a political candidate during a church service. His sons briefed the U.S. State Department.',
    category: 'religion',
  },
  {
    articleId: '2021899542115815424',
    title: 'Dr. Hak Ja Han: Detained at 83 with No Conviction',
    summary: '1,000 riot police. Heart disease, arrhythmia, glaucoma. Three falls in detention. The story the world needs to hear.',
    category: 'religion',
  },
];

// Lookup map for fast access
export const articleMap = new Map(storedArticles.map(a => [a.articleId, a]));
