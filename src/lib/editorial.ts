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
    details: 'Attended a court hearing September 22, 2025. Court approved detention — she was moved to Seoul Detention Center and never released. No direct evidence she personally instructed gift-giving. 82 years old with heart disease, arrhythmia, and glaucoma. Fell 3 times in detention in January 2026. Briefly released for glaucoma surgery in November 2025, returned to detention February 2026.',
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
  titleKo?: string;
  titleJa?: string;
  description: string;
  descriptionKo?: string;
  descriptionJa?: string;
  category: 'martial-law' | 'church-raid' | 'religious-freedom' | 'legislation' | 'military' | 'foreign-policy' | 'court-case' | 'media' | 'corporate';
  source: string;
  sourceUrl: string;
  featured?: boolean; // hero treatment for key events
  image?: string; // local path in /public/timeline/
}

// Inclusive month range of events present in koreaTimeline below.
// Update this whenever you add events past the current end date.
export const KOREA_TIMELINE_RANGE_LABEL = 'Jan 2024 – Aug 2026 · checked Aug 19';

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
    featured: true,
    image: '/timeline/martial-law-assembly.jpg',
  },
  {
    date: 'Dec 4, 2024',
    title: 'National Assembly lifts martial law in 6 hours',
    description: '190 lawmakers breach military lines and unanimously vote to lift martial law at 1:02 AM. Yoon officially lifts it at 4:30 AM. The shortest martial law in Korean history.',
    category: 'martial-law',
    source: 'Wikipedia — Martial Law Crisis',
    sourceUrl: 'https://en.wikipedia.org/wiki/2024_South_Korean_martial_law_crisis',
    featured: true,
    image: '/timeline/martial-law-broadcast.png',
  },
  {
    date: 'Dec 14, 2024',
    title: 'Yoon impeached by National Assembly',
    description: '204 of 300 members vote to impeach President Yoon. His presidential powers are suspended. Prime Minister Han Duck-soo becomes acting president.',
    category: 'court-case',
    source: 'Wikipedia — Impeachment of Yoon',
    sourceUrl: 'https://en.wikipedia.org/wiki/Impeachment_of_Yoon_Suk_Yeol',
    featured: true,
    image: '/timeline/impeachment-signing.jpg',
  },
  // === MEDIA FRAMING ===
  {
    date: 'Dec 2024',
    title: 'Western media frames martial law as "authoritarian coup"',
    description: 'Major Western outlets universally frame the 6-hour martial law as an attempted coup, with minimal coverage of the opposition\'s two years of legislative obstruction, 22 impeachment motions, and $4.1B budget cuts that prompted it.',
    category: 'media',
    source: 'NPR',
    sourceUrl: 'https://www.npr.org/2024/12/12/g-s1-37854/south-korea-yoon-martial-law',
    featured: true,
    image: '/timeline/protest-flags.jpg',
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
    featured: true,
  },
  // === PRO-NK CONCESSIONS ===
  {
    date: 'Jun 11, 2025',
    title: 'Lee suspends DMZ loudspeaker broadcasts into North Korea',
    description: 'One of Lee\'s first acts as president — suspending propaganda broadcasts across the DMZ as a unilateral concession to Pyongyang without receiving anything in return. Critics see it as restoring the failed Sunshine Policy.',
    category: 'foreign-policy',
    source: 'RFA',
    sourceUrl: 'https://www.rfa.org/english/korea/2025/06/05/north-korea-election-reaction-lee-jae-myung/',
  },
  // === CHURCH RAIDS BEGIN ===
  {
    date: 'Jul 18, 2025',
    title: 'Coordinated raids with 1,000+ police: churches and Unification Church',
    description: 'Over 1,000 police deployed in coordinated raids on 10+ locations — Yoido Full Gospel Church (one of the world\'s largest congregations), Far East Broadcasting Company, and the Unification Church\'s Seoul HQ in Cheongpa-dong, Cheonjeonggung Palace, and multiple offices. Pastors Lee Young-hoon and Kim Jang-hwan targeted.',
    category: 'church-raid',
    source: 'UPI, Korea Times',
    sourceUrl: 'https://www.upi.com/Top_News/World-News/2025/07/18/Unification-Church-scandal-expands-with-raids-at-more-than-10-locations/9461752874293/',
    featured: true,
    image: '/timeline/raid-police-buses.jpg',
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
    image: '/timeline/trump-lee.jpg',
  },
  // === MEDIA TAKEOVER ===
  {
    date: 'Aug 2025',
    title: 'DPK passes broadcasting bills — seizes control of public media',
    description: 'National Assembly overhauls governance of KBS, MBC, and EBS. Boards expanded and restructured so ruling party-aligned unions and associations pick new members. Opposition PPP accuses DPK of taking over all public broadcasters.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10559747',
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
    title: 'Dr. Hak Ja Han (82) detained after court hearing — never released',
    description: 'The 82-year-old leader of the Family Federation attended a court hearing in Seoul. The court approved prosecutors\' detention request citing "risk of evidence destruction." She was moved to Seoul Detention Center and has never been released. Has heart disease, arrhythmia, and glaucoma.',
    category: 'church-raid',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2025/9/22/south-korean-unification-church-leader-faces-arrest-in-bribery-case',
    featured: true,
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
    featured: true,
  },
  // === UN DENOUNCEMENT ===
  {
    date: 'Jan 2026',
    title: 'South Korea\'s religious liberty crisis denounced at the United Nations',
    description: 'NGOs file a written statement with the UN Human Rights Council in Geneva denouncing the escalating religious liberty crisis, focusing on threats to dissolve minority religious organizations under vague legal pretexts.',
    category: 'church-raid',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/a-growing-religious-liberty-crisis-in-south-korea-denounced-at-the-united-nations/',
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
    featured: true,
  },
  // === COUPANG ESCALATION ===
  {
    date: 'Feb 12, 2026',
    title: 'US investors sue South Korea over Coupang targeting',
    description: 'US investment firms invoke investor-state dispute settlement under the US-Korea Free Trade Agreement. House Trade Subcommittee accuses Korean regulators of "aggressively targeting US technology leaders" through "discriminatory regulatory actions."',
    category: 'corporate',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2026/02/12/more-u-s-investors-sue-south-korean-government-over-handling-of-coupang-data-breach/',
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
  // === CURRENT EDITORIAL DESK ===
  {
    date: 'Jul 24, 2026',
    title: 'Who investigates North Korean espionage after the August transfer?',
    titleKo: '8월 수사권 이관 이후 대북 간첩 수사는 누가 맡나',
    titleJa: '8月の権限移管後、北朝鮮のスパイ事件を誰が捜査するのか',
    description: 'The Monarch Report examines how an August 1 transfer of investigative responsibility may affect counterespionage cases, inter-agency coordination and public accountability.',
    descriptionKo: '더 모나크 리포트는 8월 1일 수사 책임 이관이 방첩 사건과 기관 간 공조, 공적 책임에 어떤 영향을 줄 수 있는지 살펴봅니다.',
    descriptionJa: 'ザ・モナーク・レポートは、8月1日の捜査権限移管が防諜事件、機関間の連携、公的説明責任に及ぼし得る影響を検証します。',
    category: 'foreign-policy',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2080653052923551820',
  },
  {
    date: 'Aug 1, 2026',
    title: 'New investigative structure shifts the final check on police cases',
    titleKo: '새 수사 체계, 경찰 수사에 대한 최종 견제 장치를 바꾸다',
    titleJa: '新たな捜査制度、警察捜査に対する最終的なチェックを変更',
    description: 'Original reporting reviews a legal restructuring that gives police investigations a more decisive role and asks what recourse remains when an investigation is incomplete or disputed.',
    descriptionKo: '경찰 수사의 비중을 크게 높인 법적 개편을 검토하고, 수사가 미진하거나 다툼이 있을 때 어떤 구제 절차가 남는지 묻습니다.',
    descriptionJa: '警察捜査の比重を大きく高める制度改編を検証し、捜査が不十分または争われる場合にどのような救済手段が残るのかを問います。',
    category: 'legislation',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2083538660138614813',
  },
  {
    date: 'Aug 8, 2026',
    title: 'Missionary support payments face new tax questions',
    titleKo: '해외 선교 지원금에 제기된 새로운 과세 쟁점',
    titleJa: '海外宣教師への支援金をめぐる新たな課税問題',
    description: 'A Monarch Report analysis examines how tax treatment of overseas missionary support could affect churches, missionaries and the boundary between religious activity and taxable compensation.',
    descriptionKo: '해외 선교 지원금의 과세 방식이 교회와 선교사, 그리고 종교 활동과 과세 대상 보수의 경계에 어떤 영향을 미칠 수 있는지 분석합니다.',
    descriptionJa: '海外宣教師への支援金の税務上の扱いが、教会、宣教師、宗教活動と課税対象となる報酬の境界に及ぼし得る影響を分析します。',
    category: 'religious-freedom',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2085917079509877041',
  },
  {
    date: 'Aug 14, 2026',
    title: 'Defense challenges inconsistencies in testimony in Dr. Hak Ja Han case',
    titleKo: '한학자 총재 사건 변호인단, 진술 기록의 불일치 지적',
    titleJa: '韓鶴子総裁事件の弁護側、供述記録の不一致を指摘',
    description: 'The defense account identifies statements it says do not align across the record. The article separates the defense argument from established findings while the proceeding remains ongoing.',
    descriptionKo: '변호인단은 사건 기록상 서로 맞지 않는 진술이 있다고 주장합니다. 재판이 진행 중인 만큼, 기사에서는 변호인단의 주장과 확정된 사실을 구분해 다룹니다.',
    descriptionJa: '弁護側は、事件記録の中に整合しない供述があると主張しています。審理が続いているため、記事では弁護側の主張と確定した事実を区別して扱います。',
    category: 'court-case',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2088228544606519789',
  },
  {
    date: 'Aug 17, 2026',
    title: 'Why renewed interest in communism matters for faith and family',
    titleKo: '공산주의에 대한 새로운 관심이 신앙과 가정에 중요한 이유',
    titleJa: '共産主義への関心の再燃が、信仰と家族にとって重要な理由',
    description: 'A new long-form analysis compares communism’s stated promises with its historical record and examines why independent faith, family life, property rights and a free press remain central safeguards.',
    descriptionKo: '공산주의가 내세운 약속과 역사적 기록을 비교하고, 독립적인 신앙과 가정생활, 재산권, 언론의 자유가 왜 핵심적인 안전장치인지 살펴봅니다.',
    descriptionJa: '共産主義が掲げた約束と歴史的記録を比較し、独立した信仰、家庭生活、財産権、報道の自由がなぜ重要な歯止めとなるのかを考察します。',
    category: 'media',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2089327475226775667',
  },
];

// Category labels and colors for Korea timeline
export const koreaTimelineCategories: Record<string, { label: string; color: string; icon: string }> = {
  'martial-law': { label: 'Martial Law', color: '#ef4444', icon: '⚠' },
  'church-raid': { label: 'Religious Freedom', color: '#a855f7', icon: '⛪' },
  'religious-freedom': { label: 'Religious Freedom', color: '#8b5cf6', icon: '◈' },
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
