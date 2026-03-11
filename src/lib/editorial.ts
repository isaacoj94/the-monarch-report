// Editorial content for homepage sections — fact-checked, sourced data

// === FAITH ON FIRE: Religious Freedom Crisis ===

export interface PoliticalPrisoner {
  name: string;
  nameKo: string;
  age: number | null;
  title: string;
  status: 'detained' | 'released' | 'under-trial' | 'raided';
  charges: string;
  details: string;
  daysDetained: number | null;
  date: string; // arrest/raid date
  source: string;
}

export const politicalPrisoners: PoliticalPrisoner[] = [
  {
    name: 'Dr. Hak Ja Han',
    nameKo: '한학자',
    age: 83,
    title: 'Leader, Family Federation for World Peace and Unification',
    status: 'detained',
    charges: 'Alleged bribery and embezzlement of church funds',
    details: 'Arrested September 2025 with 1,000+ riot police. No direct evidence she personally instructed gift-giving. 83 years old with heart disease, arrhythmia, and glaucoma. Fell 3 times in detention in January 2026. Briefly released for glaucoma surgery in November 2025, returned to detention February 2026.',
    daysDetained: 170, // approximate as of March 2026
    date: '2025-09-22',
    source: 'CNN, Al Jazeera, Korea Herald',
  },
  {
    name: 'Pastor Son Hyun-bo',
    nameKo: '손현보',
    age: 63,
    title: 'Busan Segyeoro Church; leader of "Save Korea" rallies',
    status: 'released',
    charges: 'Violation of Public Official Election Act',
    details: 'Arrested September 8, 2025 for interviewing a PPP candidate during a church service and uploading the video. Spent 143 days in jail. Released January 30, 2026 with a suspended 6-month sentence. His sons briefed the U.S. State Department. Still faces ongoing legal cases.',
    daysDetained: 143,
    date: '2025-09-08',
    source: 'Korea Herald, ICC, Bitter Winter',
  },
  {
    name: 'Pastor Lee Young-hoon',
    nameKo: '이영훈',
    age: null,
    title: 'Senior Pastor, Yoido Full Gospel Church',
    status: 'raided',
    charges: 'Alleged lobbying on behalf of a former military commander',
    details: 'Home and church raided by prosecutors on July 18, 2025. Yoido Full Gospel Church is one of the world\'s largest congregations. Not arrested but under investigation.',
    daysDetained: null,
    date: '2025-07-18',
    source: 'Korea Times',
  },
  {
    name: 'Pastor Kim Jang-hwan',
    nameKo: '김장환',
    age: null,
    title: 'Chairman, Far East Broadcasting Company',
    status: 'raided',
    charges: 'Alleged lobbying on behalf of a former military commander',
    details: 'Home and Far East Broadcasting building raided July 18, 2025. Approximately 10 locations searched. Not arrested but under investigation.',
    daysDetained: null,
    date: '2025-07-18',
    source: 'Korea Times',
  },
];

export const unLawViolations = [
  {
    article: 'ICCPR Article 18',
    title: 'Freedom of Religion',
    description: 'Non-derogable right to freedom of thought, conscience, and religion. Cannot be suspended even during national emergencies.',
  },
  {
    article: 'ICCPR Article 9',
    title: 'Liberty and Security',
    description: 'Prohibits arbitrary arrest and detention. Requires deprivation of liberty to be according to law.',
  },
  {
    article: 'ICCPR Article 19',
    title: 'Freedom of Expression',
    description: 'Protects the right to hold and express opinions — directly relevant to pastors\' political speech from the pulpit.',
  },
  {
    article: 'ICCPR Article 26',
    title: 'Non-Discrimination',
    description: 'Prohibits discrimination on any ground including religion or political opinion.',
  },
];

// === JAPAN: THE DISSOLUTION PRECEDENT ===

export const japanDissolution = {
  timeline: [
    { date: 'Oct 13, 2023', event: 'MEXT files dissolution request with Tokyo District Court' },
    { date: 'Mar 25, 2025', event: 'Tokyo District Court orders dissolution — first without criminal charges' },
    { date: 'Mar 4, 2026', event: 'Tokyo High Court upholds dissolution order' },
    { date: 'Mar 9, 2026', event: 'Church files special appeal to Supreme Court — pending' },
  ],
  keyFacts: [
    'First religious organization dissolved in Japan without criminal charges',
    'Prior precedent: Aum Shinrikyo — dissolved after sarin gas attack killed 13',
    'Dissolution based on civil claims of coerced donations, not criminal prosecution',
    'Legal standard: "significantly causing harm to public welfare" — criticized by UN as overly vague',
  ],
  communistConnection: {
    organization: 'National Network of Lawyers Against Spiritual Sales (Zenkoku Benren)',
    founded: 'May 1987',
    members: '~300 lawyers, primarily affiliated with the Communist Party and Socialist Party',
    cofounder: 'Hiroshi Yamaguchi, legal counsel for the Socialist Party',
    jcpQuote: {
      speaker: 'JCP Chairperson Kazuo Shii',
      text: 'The fight went on for a long time. This time we will never give up until we will win.',
      description: 'Called the dissolution effort "a final war"',
    },
  },
  antiCommunistHistory: [
    'Church founded IFVOC (International Federation for Victory Over Communism) in 1968',
    'IFVOC defeated Communist-backed governor in Kyoto in 1978, ending 28 years of leftist rule',
    'Pushed for anti-espionage legislation — collected millions of signatures',
    'Japan still has no comprehensive anti-spy law, making it vulnerable to foreign intelligence',
  ],
  internationalReactions: [
    {
      who: 'Mike Pompeo, former U.S. Secretary of State',
      quote: 'The Decision by the Tokyo High Court to order the dissolution of the Unification Church should trouble anyone who cares about religious liberty.',
      date: 'March 2026',
    },
    {
      who: '4 UN Special Rapporteurs',
      quote: 'International human rights law does not recognize "public welfare" as a legitimate ground for restricting freedom of religion.',
      date: 'October 2025',
    },
  ],
};

// === KOREA: DEMOCRACY CRISIS TIMELINE ===

export interface KoreaTimelineEntry {
  date: string;
  title: string;
  description: string;
  category: 'martial-law' | 'church-raid' | 'legislation' | 'military' | 'foreign-policy' | 'court-case' | 'media' | 'corporate';
  source: string;
  sourceUrl: string;
  image?: string; // optional photo URL
}

export const koreaTimeline: KoreaTimelineEntry[] = [
  // === PRE-MARTIAL LAW: Why it happened ===
  {
    date: 'Jan 30, 2024',
    title: 'Dior bag scandal breaks — opposition weaponizes it',
    description: 'Secret footage surfaces of First Lady Kim Keon-hee accepting a Dior handbag from a pastor in 2022. The opposition uses the scandal to launch relentless special counsel investigations, setting the stage for two years of political war.',
    category: 'court-case',
    source: 'NPR',
    sourceUrl: 'https://www.npr.org/2024/01/30/1227831327/luxury-dior-handbag-south-korea-politics',
  },
  {
    date: 'Apr 10, 2024',
    title: 'Opposition wins supermajority in National Assembly',
    description: 'The Democratic Party of Korea (DPK) wins 175 of 300 seats, gaining near two-thirds control. This begins an unprecedented legislative standoff with President Yoon.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10181935',
  },
  {
    date: 'Nov 2024',
    title: 'Opposition slashes government budget by $4.1 billion',
    description: 'The DPK-led Assembly cuts the 2025 budget by 4.1 trillion won, removing police and prosecution funding and blocking key government appointments. 22 impeachment motions had been filed against Yoon officials since 2022.',
    category: 'legislation',
    source: 'CSIS',
    sourceUrl: 'https://www.csis.org/analysis/yoon-declares-martial-law-south-korea',
  },
  // === MARTIAL LAW ===
  {
    date: 'Dec 3, 2024',
    title: 'President Yoon declares martial law',
    description: 'At 10:27 PM, Yoon declares emergency martial law in a televised address, accusing the opposition of being "anti-state forces" running a "legislative dictatorship." Troops deployed to the National Assembly.',
    category: 'martial-law',
    source: 'CNN',
    sourceUrl: 'https://www.cnn.com/2024/12/03/asia/south-korea-martial-law-yoon-intl-hnk',
  },
  {
    date: 'Dec 4, 2024',
    title: 'National Assembly lifts martial law in 6 hours',
    description: '190 lawmakers breach military lines and unanimously vote to lift martial law at 1:02 AM. Yoon officially lifts it at 4:30 AM. The shortest martial law in Korean history.',
    category: 'martial-law',
    source: 'Wikipedia — Martial Law Crisis',
    sourceUrl: 'https://en.wikipedia.org/wiki/2024_South_Korean_martial_law_crisis',
  },
  {
    date: 'Dec 14, 2024',
    title: 'Yoon impeached by National Assembly',
    description: '204 of 300 members vote to impeach President Yoon. His presidential powers are suspended. Prime Minister Han Duck-soo becomes acting president.',
    category: 'court-case',
    source: 'Wikipedia — Impeachment of Yoon',
    sourceUrl: 'https://en.wikipedia.org/wiki/Impeachment_of_Yoon_Suk_Yeol',
  },
  // === MEDIA FRAMING ===
  {
    date: 'Dec 2024',
    title: 'Western media frames martial law as "authoritarian coup"',
    description: 'Major Western outlets universally frame the 6-hour martial law as an attempted coup, with minimal coverage of the opposition\'s two years of legislative obstruction, 22 impeachment motions, and $4.1B budget cuts that prompted it.',
    category: 'media',
    source: 'NPR',
    sourceUrl: 'https://www.npr.org/2024/12/12/g-s1-37854/south-korea-yoon-martial-law',
  },
  // === YOON ARREST & TRIAL ===
  {
    date: 'Jan 15, 2025',
    title: 'Yoon arrested after standoff at presidential residence',
    description: 'After weeks of failed arrest attempts, the Corruption Investigation Office deploys 3,000 police and agents. Yoon surrenders to avoid violence. Placed in Seoul Detention Center.',
    category: 'court-case',
    source: 'Wikipedia — Arrest of Yoon',
    sourceUrl: 'https://en.wikipedia.org/wiki/Arrest_of_Yoon_Suk_Yeol',
  },
  {
    date: 'Apr 4, 2025',
    title: 'Constitutional Court upholds impeachment',
    description: 'Yoon is formally removed from office. A special presidential election is called within 60 days.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2025/5/1/former-south-korean-president-yoon-indicted-for-abuse-of-power',
  },
  // === LEE TAKES POWER ===
  {
    date: 'Jun 3, 2025',
    title: 'Lee Jae-myung wins presidential election',
    description: 'The former opposition leader — who had been convicted of violating election law and was facing corruption charges — wins the snap election. He takes office immediately.',
    category: 'legislation',
    source: 'Foreign Policy',
    sourceUrl: 'https://foreignpolicy.com/2025/06/05/south-korea-president-election-results-lee-jae-myung-foreign-policy/',
  },
  // === CHURCH RAIDS BEGIN ===
  {
    date: 'Jul 18, 2025',
    title: 'Prosecutors raid Yoido Full Gospel Church & Far East Broadcasting',
    description: 'Home and offices of Pastor Lee Young-hoon (one of the world\'s largest congregations) and Pastor Kim Jang-hwan (Far East Broadcasting chairman) raided simultaneously. ~10 locations searched.',
    category: 'church-raid',
    source: 'Korea Times',
    sourceUrl: 'https://www.koreatimes.co.kr/opinion/20251203/raids-on-clergy-reveal-fragility-of-informal-diplomacy',
  },
  // === FOREIGN POLICY SHIFTS ===
  {
    date: 'Jul 2025',
    title: 'Lee signals foreign policy shift toward China',
    description: 'Lee states South Korea "cannot be unilaterally bound" to the US and should "maintain amicable relations with China and Russia." He had previously called US troops an "occupying force" (2021) and said China should "do as it wishes with Taiwan."',
    category: 'foreign-policy',
    source: 'The Hill',
    sourceUrl: 'https://thehill.com/opinion/international/5452599-lee-jaemyung-us-alliance-threat/',
  },
  // === TRUMP CONFRONTS LEE ===
  {
    date: 'Aug 25, 2025',
    title: 'Trump decries "vicious raids on churches" before Lee visit',
    description: 'On Truth Social, Trump calls the church raids "very vicious" hours before Lee\'s White House visit. Lee\'s staff feared a "Zelenskyy moment" public confrontation. The summit avoided public clash but spotlight was placed on Korea.',
    category: 'church-raid',
    source: 'Washington Times',
    sourceUrl: 'https://www.washingtontimes.com/news/2025/aug/25/trump-notes-purge-revolution-south-korea-ahead-meeting-president-lee/',
  },
  // === MORE CHURCH TARGETING ===
  {
    date: 'Sep 8, 2025',
    title: 'Pastor Son Hyun-bo arrested for interviewing a candidate',
    description: 'Busan pastor arrested for interviewing a PPP candidate during a church service and uploading the video. Charged with violating the Public Official Election Act. Spent 143 days in jail.',
    category: 'church-raid',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/a-religious-liberty-crisis-in-korea-1-after-the-2025-elections/',
  },
  {
    date: 'Sep 22, 2025',
    title: 'Dr. Hak Ja Han (83) arrested with 1,000+ riot police',
    description: '83-year-old leader of the Family Federation arrested with massive police deployment. Charged with alleged bribery and embezzlement. Has heart disease, arrhythmia, and glaucoma. Detained without conviction.',
    category: 'church-raid',
    source: 'CNN, Al Jazeera',
    sourceUrl: 'https://www.cnn.com/2025/09/22/asia/south-korea-unification-church-arrest',
  },
  // === MILITARY PURGE ===
  {
    date: 'Sep 2025',
    title: 'Lee replaces ALL four-star generals',
    description: 'Defense Ministry replaces every active four-star general in the first top-level military reshuffle, followed by 20 three-star positions. A special task force investigates 49 government agencies for ties to martial law.',
    category: 'military',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10566148',
  },
  // === USFK RAID ===
  {
    date: 'Oct 2025',
    title: 'Special counsel raids Osan Air Base (USFK)',
    description: 'Prosecutors search the joint US-Korea facility at Osan Air Base without following SOFA procedures. USFK Lt. Gen. David Iverson sends formal protest letter. Seoul defends the raid.',
    category: 'foreign-policy',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10595011',
  },
  // === ANTI-FREE SPEECH ===
  {
    date: 'Dec 2025',
    title: 'Anti-Fake News Law signed',
    description: 'Punitive damages up to 5x for publishing "false information." UNESCO warned vague definitions could enable censorship. South Korea\'s press freedom score has fallen 4 consecutive years.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
  // === NORTH KOREAN NEWSPAPER ===
  {
    date: 'Dec 26, 2025',
    title: 'Government opens access to North Korea\'s state newspaper',
    description: 'The Unification Ministry reclassifies Rodong Sinmun (North Korea\'s main propaganda organ) from "special materials" to "general materials," making it publicly accessible to all citizens.',
    category: 'foreign-policy',
    source: 'Korea Times',
    sourceUrl: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20251226/s-korea-to-permit-public-access-to-n-koreas-main-newspaper',
  },
  // === TARGETING US COMPANIES ===
  {
    date: 'Dec 9, 2025',
    title: 'Police raid Coupang HQ; Lee says penalties should put them "out of business"',
    description: 'Police raid the US-listed e-commerce giant over a data breach. President Lee openly demands penalties "so severe that they go out of business." DPK threatens to criminally indict a US-national Coupang executive. House Judiciary issues subpoena.',
    category: 'corporate',
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2025-12-09/south-korea-police-raid-coupang-hq-over-historic-data-breach',
  },
  // === LEE ORDERS CHURCH DISSOLUTION REVIEW ===
  {
    date: 'Dec 10, 2025',
    title: 'Lee orders legal review to dissolve religious organizations',
    description: 'President Lee orders a renewed review of legal measures to dissolve religious organizations engaged in "political interference." Mirrors Japan\'s dissolution of the Unification Church.',
    category: 'church-raid',
    source: 'Japan Times',
    sourceUrl: 'https://www.japantimes.co.jp/news/2025/12/10/asia-pacific/politics/south-korea-religous-group/',
  },
  // === CHURCH DISSOLUTION ACT ===
  {
    date: 'Jan 9, 2026',
    title: '"Church Dissolution Act" submitted to National Assembly',
    description: 'Rep. Choi Hyuk-jin submits Civil Code Amendment Bill granting the state authority to audit, suspend, and dissolve religious organizations and seize their assets. Applies to all religious groups.',
    category: 'legislation',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/how-to-kill-a-religion-south-koreas-proposed-church-dissolution-act/',
  },
  // === LEE MEETS RELIGIOUS LEADERS ===
  {
    date: 'Jan 12, 2026',
    title: 'Lee agrees with religious leaders to disband "heretical" churches',
    description: 'President Lee meets leaders of 7 major religious communities and voices agreement with their call to disband the Unification Church, Shincheonji, and other "illegitimate, heretical religious organizations."',
    category: 'church-raid',
    source: 'Korea Times',
    sourceUrl: 'https://www.koreatimes.co.kr/southkorea/politics/20260112/president-agrees-on-religious-leaders-call-for-disbanding-unification-church-shincheonji',
  },
  // === YOON CONVICTED ===
  {
    date: 'Jan 16, 2026',
    title: 'Yoon convicted — 5-year sentence for abuse of power',
    description: 'Found guilty of obstruction of justice, abuse of power, and falsification of documents. Sentenced to 5 years in prison in the first of two trials.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2026/1/16/south-koreas-former-president-yoon-sentenced-to-five-years-what-we-know',
  },
  {
    date: 'Jan 28, 2026',
    title: 'First Lady Kim Keon-hee sentenced to 20 months',
    description: 'Convicted for corruption including receiving luxury gifts (Graff diamond necklace, Chanel bags) from the Unification Church in exchange for promises of business favors.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2026/1/28/south-koreas-former-first-lady-sentenced-to-jail-term-in-bribery-case',
  },
  {
    date: 'Feb 19, 2026',
    title: 'Yoon sentenced to LIFE for insurrection',
    description: 'Found guilty of leading an insurrection. Sentenced to life in prison — the harshest penalty short of death. The DPK immediately moves to ban presidential pardons for insurrection.',
    category: 'court-case',
    source: 'CNN',
    sourceUrl: 'https://www.cnn.com/2026/02/19/asia/south-korea-yoon-suk-yeol-verdict-insurrection-intl-hnk',
  },
  // === JUDICIAL TAKEOVER ===
  {
    date: 'Mar 5, 2026',
    title: 'Supreme Court expanded from 14 to 26 justices',
    description: 'President Lee will appoint 22 of 26 justices, giving a single president overwhelming control of the highest court. Chief judges express "grave concern."',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
  {
    date: 'Mar 7, 2026',
    title: '"Distortion of Law" crime takes effect — judges face 10 years',
    description: 'Judges or prosecutors who "intentionally misapply laws" can now be imprisoned up to 10 years. Chief judges warned the crime\'s elements are "abstract and overly broad." A chilling effect on judicial independence.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
];

// Category labels and colors for Korea timeline
export const koreaTimelineCategories: Record<string, { label: string; color: string; icon: string }> = {
  'martial-law': { label: 'Martial Law', color: '#ef4444', icon: '⚠' },
  'church-raid': { label: 'Religious Freedom', color: '#a855f7', icon: '⛪' },
  'legislation': { label: 'Legislation', color: '#f59e0b', icon: '📜' },
  'military': { label: 'Military', color: '#6b7280', icon: '🎖' },
  'foreign-policy': { label: 'Foreign Policy', color: '#3b82f6', icon: '🌐' },
  'court-case': { label: 'Court Case', color: '#ec4899', icon: '⚖' },
  'media': { label: 'Media', color: '#22c55e', icon: '📰' },
  'corporate': { label: 'Corporate', color: '#f97316', icon: '🏢' },
};

// === DEMOCRACY IN DECLINE: Bills Tracker ===

export interface DangerousBill {
  name: string;
  status: 'signed' | 'passed' | 'committee' | 'proposed';
  date: string;
  threat: 'judicial' | 'speech' | 'religion' | 'protest' | 'press' | 'political';
  summary: string;
  detail: string;
}

export const dangerousBills: DangerousBill[] = [
  {
    name: 'Supreme Court Expansion',
    status: 'signed',
    date: 'Mar 5, 2026',
    threat: 'judicial',
    summary: '14 → 26 justices. President Lee will appoint 22 of 26.',
    detail: 'Passed March 1, signed March 5. Gives a single president overwhelming control over the highest court. Chief judges expressed "grave concern."',
  },
  {
    name: 'Crime of "Distortion of Law"',
    status: 'signed',
    date: 'Mar 7, 2026',
    threat: 'judicial',
    summary: 'Judges face up to 10 years in prison for rulings deemed wrong.',
    detail: 'Judges or prosecutors who "intentionally misapply laws" can be imprisoned. Took effect March 7. Chief judges warned the crime\'s elements are "abstract and overly broad."',
  },
  {
    name: 'Constitutional Complaints Against Courts',
    status: 'signed',
    date: 'Mar 5, 2026',
    threat: 'judicial',
    summary: 'Constitutional Court can now overturn any lower court ruling.',
    detail: 'Creates an "endless retrial" system. Any final court ruling can be challenged at the Constitutional Court.',
  },
  {
    name: 'Church Dissolution Act',
    status: 'proposed',
    date: 'Jan 9, 2026',
    threat: 'religion',
    summary: 'Government can revoke religious organizations\' permits and seize assets.',
    detail: 'Bill No. 2215932. Explicitly names Unification Church and Shincheonji. Officials can enter churches and inspect records without a warrant. Seized assets go to the National Treasury.',
  },
  {
    name: 'Anti-Fake News Law',
    status: 'signed',
    date: 'Dec 2025',
    threat: 'press',
    summary: 'Punitive damages up to 5x for "false information." Enforcement July 2026.',
    detail: 'UNESCO warned vague definitions could enable censorship. IPI condemned it. South Korea\'s press freedom score fell for 4 consecutive years.',
  },
  {
    name: 'Anti-Protest Bill',
    status: 'committee',
    date: 'Oct 2025',
    threat: 'protest',
    summary: 'Bans rallies deemed to "incite hatred" — triggered by anti-China protests.',
    detail: 'Penalties up to 5 years in prison. Rights groups warn it could expand to broader forms of dissent.',
  },
  {
    name: 'Pardon Ban for Insurrection',
    status: 'committee',
    date: 'Feb 2026',
    threat: 'political',
    summary: 'Prohibits presidential pardons for insurrection convictions.',
    detail: 'Passed immediately after Yoon\'s life sentence. Clearly designed to ensure he can never be pardoned.',
  },
  {
    name: 'Criminalization of Sermons',
    status: 'signed',
    date: 'Jan 2026',
    threat: 'religion',
    summary: 'President Lee promised "stricter enforcement" against churches in politics.',
    detail: 'Pastor Son arrested for interviewing a candidate during service. Signal to all churches: political speech from the pulpit will be prosecuted.',
  },
];

// Threat type labels and colors
export const threatColors: Record<string, { label: string; color: string }> = {
  judicial: { label: 'Judicial Independence', color: '#ef4444' },
  speech: { label: 'Free Speech', color: '#f59e0b' },
  religion: { label: 'Religious Freedom', color: '#a855f7' },
  protest: { label: 'Right to Protest', color: '#3b82f6' },
  press: { label: 'Press Freedom', color: '#22c55e' },
  political: { label: 'Political Freedom', color: '#ec4899' },
};

// Status labels
export const statusLabels: Record<string, { label: string; color: string }> = {
  signed: { label: 'SIGNED INTO LAW', color: '#ef4444' },
  passed: { label: 'PASSED', color: '#f97316' },
  committee: { label: 'IN COMMITTEE', color: '#eab308' },
  proposed: { label: 'PROPOSED', color: '#6b7280' },
};
