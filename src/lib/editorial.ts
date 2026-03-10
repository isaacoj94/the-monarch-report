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
    details: 'Arrested September 2025 with 1,000+ riot police. No direct evidence she personally instructed gift-giving. 83 years old with heart disease, arrhythmia, and glaucoma. Fell 3 times in detention in January 2026. Briefly released for heart surgery in November 2025, returned to detention February 2026.',
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
