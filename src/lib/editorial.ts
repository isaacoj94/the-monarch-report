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
    titleKo: '김건희 여사 디올백 의혹, 야당 정쟁 전면화',
    titleJa: '金建希氏のディオールバッグ疑惑、野党が政争の材料に',
    description: 'Secret footage surfaces of First Lady Kim Keon-hee accepting a Dior handbag from a pastor in 2022. The opposition uses the scandal to launch relentless special counsel investigations, setting the stage for two years of political war.',
    category: 'court-case',
    source: 'NPR',
    sourceUrl: 'https://www.npr.org/2024/01/30/1227831327/luxury-dior-handbag-south-korea-politics',
  },
  {
    date: 'Apr 10, 2024',
    title: 'Opposition wins supermajority in National Assembly',
    titleKo: '야당, 총선에서 압도적 과반',
    titleJa: '野党、総選挙で圧倒的過半数',
    description: 'The Democratic Party of Korea (DPK) wins 175 of 300 seats, gaining near two-thirds control. This begins an unprecedented legislative standoff with President Yoon.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10181935',
  },
  {
    date: 'Nov 2024',
    title: 'Opposition slashes government budget by $4.1 billion',
    titleKo: '야당, 내년도 예산 4.1조 삭감',
    titleJa: '野党、来年度予算4.1兆ウォン削減',
    description: 'The DPK-led Assembly cuts the 2025 budget by 4.1 trillion won, removing police and prosecution funding and blocking key government appointments. 22 impeachment motions had been filed against Yoon officials since 2022.',
    category: 'legislation',
    source: 'CSIS',
    sourceUrl: 'https://www.csis.org/analysis/yoon-declares-martial-law-south-korea',
  },
  // === MARTIAL LAW ===
  {
    date: 'Dec 3, 2024',
    title: 'President Yoon declares martial law',
    titleKo: '윤석열 대통령, 비상계엄 선포',
    titleJa: '尹錫悦大統領、非常戒厳を宣布',
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
    titleKo: '국회, 6시간 만에 계엄 해제',
    titleJa: '国会、6時間で戒厳を解除',
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
    titleKo: '국회, 윤 대통령 탄핵소추안 가결',
    titleJa: '国会、尹大統領の弾劾訴追案を可決',
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
    titleKo: '서방 언론, 계엄을 ‘쿠데타’로 규정',
    titleJa: '欧米メディア、戒厳を「クーデター」と規定',
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
    titleKo: '윤 전 대통령, 관저 대치 끝 체포',
    titleJa: '尹前大統領、官邸での対峙の末に逮捕',
    description: 'After weeks of failed arrest attempts, the Corruption Investigation Office deploys 3,000 police and agents. Yoon surrenders to avoid violence. Placed in Seoul Detention Center.',
    category: 'court-case',
    source: 'Wikipedia — Arrest of Yoon',
    sourceUrl: 'https://en.wikipedia.org/wiki/Arrest_of_Yoon_Suk_Yeol',
  },
  {
    date: 'Apr 4, 2025',
    title: 'Constitutional Court upholds impeachment',
    titleKo: '헌재, 탄핵 인용…윤 대통령 파면',
    titleJa: '憲法裁、弾劾を引用　尹大統領を罷免',
    description: 'Yoon is formally removed from office. A special presidential election is called within 60 days.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2025/5/1/former-south-korean-president-yoon-indicted-for-abuse-of-power',
  },
  // === LEE TAKES POWER ===
  {
    date: 'Jun 3, 2025',
    title: 'Lee Jae-myung wins presidential election',
    titleKo: '이재명, 대통령 보궐선거 당선',
    titleJa: '李在明、大統領補欠選で当選',
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
    titleKo: '이 대통령, 대북 확성기 방송 중단',
    titleJa: '李大統領、対北拡声器放送を停止',
    description: 'One of Lee\'s first acts as president — suspending propaganda broadcasts across the DMZ as a unilateral concession to Pyongyang without receiving anything in return. Critics see it as restoring the failed Sunshine Policy.',
    category: 'foreign-policy',
    source: 'RFA',
    sourceUrl: 'https://www.rfa.org/english/korea/2025/06/05/north-korea-election-reaction-lee-jae-myung/',
  },
  // === CHURCH RAIDS BEGIN ===
  {
    date: 'Jul 18, 2025',
    title: 'Coordinated raids with 1,000+ police: churches and Unification Church',
    titleKo: '경찰 1000여명 동원, 교회·통일교 동시 압수수색',
    titleJa: '警察1000人超、教会と統一教会を一斉捜索',
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
    titleKo: '이 대통령, 대중·대러 ‘균형’ 시사',
    titleJa: '李大統領、対中・対露「均衡」を示唆',
    description: 'Lee states South Korea "cannot be unilaterally bound" to the US and should "maintain amicable relations with China and Russia." He had previously called US troops an "occupying force" (2021) and said China should "do as it wishes with Taiwan."',
    category: 'foreign-policy',
    source: 'The Hill',
    sourceUrl: 'https://thehill.com/opinion/international/5452599-lee-jaemyung-us-alliance-threat/',
  },
  // === TRUMP CONFRONTS LEE ===
  {
    date: 'Aug 25, 2025',
    title: 'Trump decries "vicious raids on churches" before Lee visit',
    titleKo: '트럼프, 방미 앞두고 “교회 습격은 잔혹”',
    titleJa: 'トランプ氏、訪米前に「教会襲撃は苛烈」',
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
    titleKo: '민주당, 방송법 통과…공영방송 지배구조 개편',
    titleJa: '与党、放送法を可決　公共放送の統治を再編',
    description: 'National Assembly overhauls governance of KBS, MBC, and EBS. Boards expanded and restructured so ruling party-aligned unions and associations pick new members. Opposition PPP accuses DPK of taking over all public broadcasters.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10559747',
  },
  // === MORE CHURCH TARGETING ===
  {
    date: 'Sep 8, 2025',
    title: 'Pastor Son Hyun-bo arrested for interviewing a candidate',
    titleKo: '손현보 목사, 후보 인터뷰 이유로 구속',
    titleJa: '孫賢甫牧師、候補インタビューで拘束',
    description: 'Busan pastor arrested for interviewing a PPP candidate during a church service and uploading the video. Charged with violating the Public Official Election Act. Spent 143 days in jail.',
    category: 'church-raid',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/a-religious-liberty-crisis-in-korea-1-after-the-2025-elections/',
  },
  {
    date: 'Sep 22, 2025',
    title: 'Dr. Hak Ja Han (82) detained after court hearing — never released',
    titleKo: '한학자 총재(82) 출석 뒤 구속…석방 없이 수감',
    titleJa: '韓鶴子総裁（82）出廷後に拘束、釈放されず',
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
    titleKo: '이 대통령, 4성 장군 전원 교체',
    titleJa: '李大統領、四星将軍を全員交代',
    description: 'Defense Ministry replaces every active four-star general in the first top-level military reshuffle, followed by 20 three-star positions. A special task force investigates 49 government agencies for ties to martial law.',
    category: 'military',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10566148',
  },
  // === USFK RAID ===
  {
    date: 'Oct 2025',
    title: 'Special counsel raids Osan Air Base (USFK)',
    titleKo: '특별검사팀, 오산 미군기지 압수수색',
    titleJa: '特別検察、烏山米軍基地を捜索',
    description: 'Prosecutors search the joint US-Korea facility at Osan Air Base without following SOFA procedures. USFK Lt. Gen. David Iverson sends formal protest letter. Seoul defends the raid.',
    category: 'foreign-policy',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10595011',
  },
  // === ANTI-FREE SPEECH ===
  {
    date: 'Dec 2025',
    title: 'Anti-Fake News Law signed',
    titleKo: '가짜뉴스 처벌법 공포',
    titleJa: '偽情報処罰法が公布',
    description: 'Punitive damages up to 5x for publishing "false information." UNESCO warned vague definitions could enable censorship. South Korea\'s press freedom score has fallen 4 consecutive years.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
  // === NORTH KOREAN NEWSPAPER ===
  {
    date: 'Dec 26, 2025',
    title: 'Government opens access to North Korea\'s state newspaper',
    titleKo: '정부, 노동신문 일반 자료로 공개',
    titleJa: '政府、労働新聞を一般資料に公開',
    description: 'The Unification Ministry reclassifies Rodong Sinmun (North Korea\'s main propaganda organ) from "special materials" to "general materials," making it publicly accessible to all citizens.',
    category: 'foreign-policy',
    source: 'Korea Times',
    sourceUrl: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20251226/s-korea-to-permit-public-access-to-n-koreas-main-newspaper',
  },
  // === TARGETING US COMPANIES ===
  {
    date: 'Dec 9, 2025',
    title: 'Police raid Coupang HQ; Lee says penalties should put them "out of business"',
    titleKo: '경찰, 쿠팡 본사 압수수색…이 대통령 “폐업 수준 제재”',
    titleJa: '警察がクーパン本社を捜索　李大統領「廃業級の制裁を」',
    description: 'Police raid the US-listed e-commerce giant over a data breach. President Lee openly demands penalties "so severe that they go out of business." DPK threatens to criminally indict a US-national Coupang executive. House Judiciary issues subpoena.',
    category: 'corporate',
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com/news/articles/2025-12-09/south-korea-police-raid-coupang-hq-over-historic-data-breach',
  },
  // === LEE ORDERS CHURCH DISSOLUTION REVIEW ===
  {
    date: 'Dec 10, 2025',
    title: 'Lee orders legal review to dissolve religious organizations',
    titleKo: '이 대통령, 종교단체 해산 법리 검토 지시',
    titleJa: '李大統領、宗教団体解散の法理検討を指示',
    description: 'President Lee orders a renewed review of legal measures to dissolve religious organizations engaged in "political interference." Mirrors Japan\'s dissolution of the Unification Church.',
    category: 'church-raid',
    source: 'Japan Times',
    sourceUrl: 'https://www.japantimes.co.jp/news/2025/12/10/asia-pacific/politics/south-korea-religous-group/',
  },
  // === CHURCH DISSOLUTION ACT ===
  {
    date: 'Jan 9, 2026',
    title: '"Church Dissolution Act" submitted to National Assembly',
    titleKo: '‘교회 해산법’ 국회 제출',
    titleJa: '「教会解散法」が国会に提出',
    description: 'Rep. Choi Hyuk-jin submits Civil Code Amendment Bill granting the state authority to audit, suspend, and dissolve religious organizations and seize their assets. Applies to all religious groups.',
    category: 'legislation',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/how-to-kill-a-religion-south-koreas-proposed-church-dissolution-act/',
  },
  // === LEE MEETS RELIGIOUS LEADERS ===
  {
    date: 'Jan 12, 2026',
    title: 'Lee agrees with religious leaders to disband "heretical" churches',
    titleKo: '이 대통령, 종교지도자와 ‘이단’ 해산 공감',
    titleJa: '李大統領、宗教指導者と「異端」解散で一致',
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
    titleKo: '한국 종교자유 위기, 유엔에서 규탄',
    titleJa: '韓国の信教の自由危機、国連で糾弾',
    description: 'NGOs file a written statement with the UN Human Rights Council in Geneva denouncing the escalating religious liberty crisis, focusing on threats to dissolve minority religious organizations under vague legal pretexts.',
    category: 'church-raid',
    source: 'Bitter Winter',
    sourceUrl: 'https://bitterwinter.org/a-growing-religious-liberty-crisis-in-south-korea-denounced-at-the-united-nations/',
  },
  // === YOON CONVICTED ===
  {
    date: 'Jan 16, 2026',
    title: 'Yoon convicted — 5-year sentence for abuse of power',
    titleKo: '윤 전 대통령, 직권남용 등 징역 5년',
    titleJa: '尹前大統領、職権乱用などで懲役5年',
    description: 'Found guilty of obstruction of justice, abuse of power, and falsification of documents. Sentenced to 5 years in prison in the first of two trials.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2026/1/16/south-koreas-former-president-yoon-sentenced-to-five-years-what-we-know',
  },
  {
    date: 'Jan 28, 2026',
    title: 'First Lady Kim Keon-hee sentenced to 20 months',
    titleKo: '김건희 여사, 뇌물 혐의 징역 1년 8개월',
    titleJa: '金建希氏、収賄で懲役1年8カ月',
    description: 'Convicted for corruption including receiving luxury gifts (Graff diamond necklace, Chanel bags) from the Unification Church in exchange for promises of business favors.',
    category: 'court-case',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/news/2026/1/28/south-koreas-former-first-lady-sentenced-to-jail-term-in-bribery-case',
  },
  {
    date: 'Feb 19, 2026',
    title: 'Yoon sentenced to LIFE for insurrection',
    titleKo: '윤 전 대통령, 내란 혐의 무기징역',
    titleJa: '尹前大統領、内乱で無期懲役',
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
    titleKo: '미국 투자자들, 쿠팡 제재 놓고 한국 제소',
    titleJa: '米投資家、クーパン規制を巡り韓国を提訴',
    description: 'US investment firms invoke investor-state dispute settlement under the US-Korea Free Trade Agreement. House Trade Subcommittee accuses Korean regulators of "aggressively targeting US technology leaders" through "discriminatory regulatory actions."',
    category: 'corporate',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2026/02/12/more-u-s-investors-sue-south-korean-government-over-handling-of-coupang-data-breach/',
  },
  // === JUDICIAL TAKEOVER ===
  {
    date: 'Mar 5, 2026',
    title: 'Supreme Court expanded from 14 to 26 justices',
    titleKo: '대법관 14명→26명 증원',
    titleJa: '最高裁判事、14人から26人へ増員',
    description: 'President Lee will appoint 22 of 26 justices, giving a single president overwhelming control of the highest court. Chief judges express "grave concern."',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
  {
    date: 'Mar 7, 2026',
    title: '"Distortion of Law" crime takes effect — judges face 10 years',
    titleKo: '‘법 왜곡죄’ 시행…법관 최고 징역 10년',
    titleJa: '「法歪曲罪」施行　裁判官は最高懲役10年',
    description: 'Judges or prosecutors who "intentionally misapply laws" can now be imprisoned up to 10 years. Chief judges warned the crime\'s elements are "abstract and overly broad." A chilling effect on judicial independence.',
    category: 'legislation',
    source: 'Korea Herald',
    sourceUrl: 'https://www.koreaherald.com/article/10632927',
  },
  // === CURRENT EDITORIAL DESK ===
  {
    date: 'Jul 24, 2026',
    title: 'Who investigates North Korean espionage after the August transfer?',
    titleKo: '대북 간첩 수사, 8월 이관 뒤 누가 맡나',
    titleJa: '北朝鮮スパイ捜査、8月の権限移管後は誰が担う',
    description: 'The Monarch Report examines how an August 1 transfer of investigative responsibility may affect counterespionage cases, inter-agency coordination and public accountability.',
    descriptionKo: '8월 1일 수사 책임이 넘어가면 방첩 사건과 기관 공조, 책임 소재가 어떻게 바뀌는지 따졌다.',
    descriptionJa: '8月1日に捜査権限が移れば、防諜事件と省庁連携、責任の所在はどう変わるのかを問うた。',
    category: 'foreign-policy',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2080653052923551820',
  },
  {
    date: 'Aug 1, 2026',
    title: 'New investigative structure shifts the final check on police cases',
    titleKo: '수사 체계 개편…경찰 사건 최종 견제 장치 바뀐다',
    titleJa: '捜査制度を再編、警察捜査の「最後の歯止め」に変化',
    description: 'Original reporting reviews a legal restructuring that gives police investigations a more decisive role and asks what recourse remains when an investigation is incomplete or disputed.',
    descriptionKo: '경찰 수사 비중을 키운 개편 뒤에, 수사가 비거나 다툴 때 남은 구제 장치가 무엇인지 확인했다.',
    descriptionJa: '警察捜査の比重を高めた改編のあと、捜査が不十分でもめたときに残る救済は何かを確かめた。',
    category: 'legislation',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2083538660138614813',
  },
  {
    date: 'Aug 8, 2026',
    title: 'Missionary support payments face new tax questions',
    titleKo: '해외 선교 지원금 과세 논란…종교활동 경계는',
    titleJa: '海外宣教師への支援金、課税を巡り新たな論点',
    description: 'A Monarch Report analysis examines how tax treatment of overseas missionary support could affect churches, missionaries and the boundary between religious activity and taxable compensation.',
    descriptionKo: '해외 선교 지원금을 어떻게 과세하느냐가 교회와 선교사의 경계를 흔든다. 종교활동과 과세 대상 보수를 나눴다.',
    descriptionJa: '海外宣教の支援金をどう課税するかが、教会と宣教師の境界を揺さぶる。宗教活動と課税対象の報酬を分けた。',
    category: 'religious-freedom',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2085917079509877041',
  },
  {
    date: 'Aug 14, 2026',
    title: 'Defense challenges inconsistencies in testimony in Dr. Hak Ja Han case',
    titleKo: '한학자 총재 사건…변호인단 “진술 기록 불일치”',
    titleJa: '韓鶴子総裁の裁判、弁護側が「供述記録に不一致」',
    description: 'The defense account identifies statements it says do not align across the record. The article separates the defense argument from established findings while the proceeding remains ongoing.',
    descriptionKo: '변호인단은 진술 기록이 서로 어긋난다고 주장한다. 재판이 진행 중인 만큼, 주장과 확인된 사실을 갈라 전했다.',
    descriptionJa: '弁護側は、供述記録が食い違うと主張する。審理中につき、主張と確認された事実を分けて伝えた。',
    category: 'court-case',
    source: 'The Monarch Report on X',
    sourceUrl: 'https://x.com/monarchreport25/status/2088228544606519789',
  },
  {
    date: 'Aug 17, 2026',
    title: 'Why renewed interest in communism matters for faith and family',
    titleKo: '다시 고개 든 공산주의 담론…신앙과 가정은',
    titleJa: '再び頭をもたげる共産主義論　信仰と家族は',
    description: 'A new long-form analysis compares communism’s stated promises with its historical record and examines why independent faith, family life, property rights and a free press remain central safeguards.',
    descriptionKo: '공산주의가 내건 약속과 역사를 맞춰 봤다. 신앙·가정·재산권·언론 자유가 사회를 붙드는 까닭을 따졌다.',
    descriptionJa: '共産主義が掲げた約束と歴史を突き合わせた。信仰、家族、財産権、報道の自由が社会を支える理由を問うた。',
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
