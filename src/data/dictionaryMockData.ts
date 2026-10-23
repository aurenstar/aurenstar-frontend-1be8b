export type OpportunityStatus = 'Discovered' | 'Analyzing' | 'Approved' | 'Writing' | 'Rejected';
export type OpportunityPriority = 'High' | 'Medium' | 'Low';
export type SearchIntent = 'Informational' | 'Navigational' | 'Commercial' | 'Comparative';
export type EditorialStatus = 'Draft' | 'Writing' | 'In Review' | 'Approved' | 'Published';
export type IndexingStatus = 'Indexed' | 'Crawled - Not Indexed' | 'Discovered - Not Indexed' | 'Submitted';

export interface OpportunityItem {
  id: string;
  query: string;
  intent: SearchIntent;
  demand: 'Very High' | 'High' | 'Medium' | 'Emerging';
  searchVolume: number;
  difficulty: number; // 0 - 100
  priority: OpportunityPriority;
  status: OpportunityStatus;
  dataSource: string;
  relatedPages: string[];
  aiScore: number;
  aiRecommendation: string;
  suggestedAction: string;
  detectedAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  url: string;
  category: 'Planets' | 'Zodiac Signs' | 'Houses' | 'Transits' | 'Aspects' | 'Fundamentals';
  status: EditorialStatus;
  wordCount: number;
  assignedAuthor: string;
  lastUpdated: string;
  metaDescription: string;
  readingTime: string;
}

export interface QualityCheckItem {
  id: string;
  label: string;
  description: string;
  status: 'Passed' | 'Needs Review' | 'Failed';
  details: string;
}

export interface ReviewArticle {
  id: string;
  title: string;
  primaryKeyword: string;
  slug: string;
  metaDescription: string;
  wordCount: number;
  headings: { level: 1 | 2 | 3; text: string }[];
  internalLinks: { anchor: string; targetUrl: string; status: 'Valid' | 'Suggested' }[];
  contentSample: string;
  checks: QualityCheckItem[];
  overallStatus: 'Needs Review' | 'Approved' | 'Changes Requested';
  lastEditedBy: string;
}

export interface PublishedPageItem {
  id: string;
  title: string;
  url: string;
  publishedDate: string;
  indexingStatus: IndexingStatus;
  clicks: number;
  impressions: number;
  ctr: number; // percentage
  avgPosition: number;
  topQuery: string;
  category: string;
}

export interface PerformanceSnapshot {
  period: '7d' | '28d' | '90d';
  label: string;
  summary: {
    totalClicks: number;
    clicksGrowth: number;
    totalImpressions: number;
    impressionsGrowth: number;
    avgCtr: number;
    ctrGrowth: number;
    avgPosition: number;
    positionGrowth: number;
  };
  dailyPoints: {
    date: string;
    clicks: number;
    impressions: number;
  }[];
  topPages: {
    title: string;
    url: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  improvements: {
    title: string;
    query: string;
    currentPosition: number;
    potentialClicks: string;
    issue: string;
    recommendation: string;
  }[];
}

// ---------------------------------------------------------------------------
// INITIAL MOCK DATA
// ---------------------------------------------------------------------------

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    query: 'What does Mercury retrograde mean?',
    intent: 'Informational',
    demand: 'Very High',
    searchVolume: 165000,
    difficulty: 42,
    priority: 'High',
    status: 'Approved',
    dataSource: 'Search Trends + PAA Seed',
    relatedPages: ['/daily-message', '/planets/mercury-guide'],
    aiScore: 94,
    aiRecommendation:
      'High search intent with seasonal spikes every 4 months. Create an evergreen hub page explaining the astronomical optical effect and practical mental routines.',
    suggestedAction: 'Create dedicated 1,800-word definitive guide with interactive calendar dates.',
    detectedAt: '2026-10-12',
  },
  {
    id: 'opp-2',
    query: 'What is a rising sign?',
    intent: 'Informational',
    demand: 'High',
    searchVolume: 110000,
    difficulty: 38,
    priority: 'High',
    status: 'Writing',
    dataSource: 'Keyword Seed Analysis',
    relatedPages: ['/discover-sign', '/aureneffect'],
    aiScore: 91,
    aiRecommendation:
      'Core astrology fundamental. High conversion path to the Discover Sign tool. Focus on how the Ascendant affects morning energy and public perception.',
    suggestedAction: 'Structure with direct comparison table between Sun vs Rising sign.',
    detectedAt: '2026-10-11',
  },
  {
    id: 'opp-3',
    query: 'What does Venus mean in astrology?',
    intent: 'Informational',
    demand: 'High',
    searchVolume: 74000,
    difficulty: 35,
    priority: 'High',
    status: 'Approved',
    dataSource: 'Google Search Console Opportunities',
    relatedPages: ['/blog/venus-in-taurus', '/aureneffect'],
    aiScore: 89,
    aiRecommendation:
      'Consistently searched year-round. User searches look for relationship dynamics, aesthetic inclinations, and financial comfort.',
    suggestedAction: 'Create comprehensive primer with subsections for Venus through all 12 signs.',
    detectedAt: '2026-10-10',
  },
  {
    id: 'opp-4',
    query: 'What is a birth chart?',
    intent: 'Informational',
    demand: 'Very High',
    searchVolume: 245000,
    difficulty: 58,
    priority: 'High',
    status: 'Analyzing',
    dataSource: 'Organic Competitor Gap',
    relatedPages: ['/discover-sign', '/aureneffect'],
    aiScore: 96,
    aiRecommendation:
      'Massive search volume. Top ranking pages are often too clinical or cluttered with ads. Clean, human-first visual diagrams will win featured snippets.',
    suggestedAction: 'Draft comprehensive visual anatomy of the 12 houses and planetary placements.',
    detectedAt: '2026-10-09',
  },
  {
    id: 'opp-5',
    query: 'Saturn return meaning in 2026',
    intent: 'Informational',
    demand: 'High',
    searchVolume: 49000,
    difficulty: 29,
    priority: 'High',
    status: 'Discovered',
    dataSource: 'Temporal Search Trends',
    relatedPages: ['/blog/saturn-cycles'],
    aiScore: 88,
    aiRecommendation:
      'Strong demographic pull for users aged 27-30. Captures users undergoing major career and relationship transitions with high engagement rates.',
    suggestedAction: 'Approve immediately for Q4 publication before the next planetary station.',
    detectedAt: '2026-10-13',
  },
  {
    id: 'opp-6',
    query: 'What is the 12th house in astrology?',
    intent: 'Informational',
    demand: 'Medium',
    searchVolume: 28000,
    difficulty: 24,
    priority: 'Medium',
    status: 'Discovered',
    dataSource: 'Long-tail Query Clustered',
    relatedPages: ['/blog/astrological-houses-guide'],
    aiScore: 82,
    aiRecommendation:
      'Low competition niche query. Users seek clarity on subconscious patterns, solitude, and creative rest.',
    suggestedAction: 'Add to upcoming Houses cluster sprint after 1st and 7th house pages.',
    detectedAt: '2026-10-08',
  },
  {
    id: 'opp-7',
    query: 'Difference between Sun sign and Moon sign',
    intent: 'Comparative',
    demand: 'High',
    searchVolume: 82000,
    difficulty: 33,
    priority: 'High',
    status: 'Analyzing',
    dataSource: 'People Also Ask Scrape',
    relatedPages: ['/daily-message', '/discover-sign'],
    aiScore: 93,
    aiRecommendation:
      'High snippet opportunity. Clear side-by-side comparison table directly answers the PAA box.',
    suggestedAction: 'Target #1 featured snippet with quick summary callout box in intro.',
    detectedAt: '2026-10-07',
  },
  {
    id: 'opp-8',
    query: 'Is astrology a science or philosophy?',
    intent: 'Informational',
    demand: 'Medium',
    searchVolume: 34000,
    difficulty: 46,
    priority: 'Low',
    status: 'Rejected',
    dataSource: 'General FAQ Seed',
    relatedPages: ['/about'],
    aiScore: 61,
    aiRecommendation:
      'Too broad and prone to academic debates without direct conversion to daily reading tools.',
    suggestedAction: 'Reject for standalone SEO dictionary page; incorporate brief mention in About section instead.',
    detectedAt: '2026-10-05',
  },
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt-1',
    title: 'Mercury Retrograde: The Complete Practical Guide',
    primaryKeyword: 'Mercury retrograde meaning',
    secondaryKeywords: ['retrograde calendar', 'mercury shadow period', 'communication tips'],
    url: '/dictionary/mercury-retrograde-meaning',
    category: 'Transits',
    status: 'In Review',
    wordCount: 1940,
    assignedAuthor: 'Elena Rossi (SEO Editor)',
    lastUpdated: '2026-10-14 16:30',
    metaDescription: 'Learn what Mercury retrograde truly means, why it is an optical illusion, and how to stay grounded and productive during the cycle.',
    readingTime: '8 min',
  },
  {
    id: 'cnt-2',
    title: 'The Rising Sign (Ascendant) Explained in Plain Words',
    primaryKeyword: 'What is a rising sign',
    secondaryKeywords: ['ascendant calculator', 'sun vs ascendant', 'birth time rising sign'],
    url: '/dictionary/what-is-a-rising-sign',
    category: 'Fundamentals',
    status: 'Writing',
    wordCount: 1420,
    assignedAuthor: 'Marcus Chen',
    lastUpdated: '2026-10-14 11:15',
    metaDescription: 'Discover how your rising sign determines your outer demeanor, morning habits, and cosmic chart ruler.',
    readingTime: '6 min',
  },
  {
    id: 'cnt-3',
    title: 'Venus in Astrology: Love, Values and Aesthetics',
    primaryKeyword: 'Venus meaning in astrology',
    secondaryKeywords: ['venus signs meaning', 'venus in love', 'birth chart venus placement'],
    url: '/dictionary/venus-meaning-astrology',
    category: 'Planets',
    status: 'Approved',
    wordCount: 2200,
    assignedAuthor: 'Elena Rossi (SEO Editor)',
    lastUpdated: '2026-10-13 18:40',
    metaDescription: 'Explore the meaning of planet Venus in birth charts: love language, artistic inclinations, and relationship compatibility.',
    readingTime: '9 min',
  },
  {
    id: 'cnt-4',
    title: 'The 12 Astrological Houses: A Beginner Map',
    primaryKeyword: 'astrological houses explained',
    secondaryKeywords: ['1st house to 12th house', 'natal chart wheel', 'angular houses'],
    url: '/dictionary/astrological-houses-guide',
    category: 'Houses',
    status: 'Published',
    wordCount: 2650,
    assignedAuthor: 'Dr. Sarah Vance',
    lastUpdated: '2026-10-09 09:20',
    metaDescription: 'A straightforward tour of all 12 houses in astrology: from identity and wealth to career and deep spirituality.',
    readingTime: '11 min',
  },
  {
    id: 'cnt-5',
    title: 'Sun Sign vs Moon Sign: What Really Sets Them Apart',
    primaryKeyword: 'difference between sun sign and moon sign',
    secondaryKeywords: ['sun and moon compatibility', 'inner self vs outer self'],
    url: '/dictionary/sun-vs-moon-sign',
    category: 'Fundamentals',
    status: 'Published',
    wordCount: 1780,
    assignedAuthor: 'Marcus Chen',
    lastUpdated: '2026-10-06 14:00',
    metaDescription: 'Understand the essential differences between your conscious ego (Sun) and your emotional instinct (Moon).',
    readingTime: '7 min',
  },
  {
    id: 'cnt-6',
    title: 'The North Node and South Node: Your Karmic Axis',
    primaryKeyword: 'lunar nodes meaning',
    secondaryKeywords: ['north node destiny', 'south node comfort zone', 'past life astrology'],
    url: '/dictionary/lunar-nodes-meaning',
    category: 'Aspects',
    status: 'Draft',
    wordCount: 890,
    assignedAuthor: 'Elena Rossi (SEO Editor)',
    lastUpdated: '2026-10-12 10:05',
    metaDescription: 'How the lunar nodes illuminate your life path, growth edges, and intuitive past habits.',
    readingTime: '4 min',
  },
];

export const INITIAL_REVIEW_ARTICLE: ReviewArticle = {
  id: 'rev-1',
  title: 'Mercury Retrograde: The Complete Practical Guide',
  primaryKeyword: 'Mercury retrograde meaning',
  slug: 'mercury-retrograde-meaning',
  metaDescription:
    'Understand what Mercury retrograde actually means in real terms, debunk common myths, and adopt 5 practical habits for clear thinking and peace of mind.',
  wordCount: 1940,
  overallStatus: 'Needs Review',
  lastEditedBy: 'Elena Rossi (SEO Content Lead)',
  headings: [
    { level: 1, text: 'What Mercury Retrograde Means: Facts Over Fear' },
    { level: 2, text: 'The Science: Why It is an Apparent Optical Phenomenon' },
    { level: 2, text: 'Why Does It Feel Real? Behavioral Reflections' },
    { level: 2, text: '5 Simple Practices During the Retrograde Window' },
    { level: 3, text: '1. Reread before hitting send' },
    { level: 3, text: '2. Back up important digital drafts' },
    { level: 3, text: '3. Reconnect with unfinished creative tasks' },
    { level: 2, text: 'Frequently Asked Questions About Mercury Cycles' },
  ],
  internalLinks: [
    { anchor: 'daily message reading', targetUrl: '/daily-message', status: 'Valid' },
    { anchor: 'Auren Effect behavioral rhythm', targetUrl: '/aureneffect', status: 'Valid' },
    { anchor: 'astrological birth chart houses', targetUrl: '/dictionary/astrological-houses-guide', status: 'Suggested' },
  ],
  contentSample: `Mercury retrograde is one of the most frequently searched astrological topics in the world, yet it is also the most misunderstood. When the planet Mercury appears to move backward in the night sky, people often blame it for dropped calls, delayed flights, and email misunderstandings.

In reality, Mercury does not stop orbiting the Sun or reverse its direction. Because Mercury circles the Sun faster than Earth (88 days compared to our 365), Earth periodically overtakes it in orbit, creating an optical illusion similar to passing a slower-moving train on a parallel track.

Rather than approaching this cycle with superstition, thoughtful observers use it as a deliberate reminder to pause: to review, revise, rethink, and recharge our daily habits.`,
  checks: [
    {
      id: 'chk-clarity',
      label: 'Clarity & Accessibility',
      description: 'Is the explanation free of inaccessible astrological jargon?',
      status: 'Passed',
      details: 'Score 96/100. Uses plain words like "orbital perspective" and "pause" instead of confusing glyph terminology.',
    },
    {
      id: 'chk-accuracy',
      label: 'Factual & Astronomical Accuracy',
      description: 'Accurately clarifies the optical illusion vs literal movement.',
      status: 'Passed',
      details: 'Clearly states the 88-day heliocentric orbit and passing train metaphor.',
    },
    {
      id: 'chk-intent',
      label: 'Search Intent Alignment',
      description: 'Satisfies "What does Mercury retrograde mean?" directly in the first 100 words.',
      status: 'Passed',
      details: 'Definition is delivered immediately in paragraph 1 with bold summary callout for featured snippet capture.',
    },
    {
      id: 'chk-originality',
      label: 'Originality & Brand Voice',
      description: 'Ensures content is unique and matches Aurenstar calm, empowering philosophy.',
      status: 'Passed',
      details: 'Zero superstitious scare-tactics; 98.4% unique copy checked against internal index.',
    },
    {
      id: 'chk-internal-links',
      label: 'Internal Linking Architecture',
      description: 'Connects to interactive tools and sibling topic clusters.',
      status: 'Needs Review',
      details: '2 links present. Recommended: add 1 contextual link to the upcoming Rising Sign guide.',
    },
    {
      id: 'chk-seo-structure',
      label: 'SEO Structural Hierarchy',
      description: 'H1, H2, and H3 elements follow strict non-skipping schema with FAQ markup.',
      status: 'Passed',
      details: 'Proper single H1, sequential H2/H3 hierarchy, and structured question headings.',
    },
  ],
};

export const INITIAL_PUBLISHED_PAGES: PublishedPageItem[] = [
  {
    id: 'pub-1',
    title: 'The 12 Astrological Houses: A Beginner Map',
    url: '/dictionary/astrological-houses-guide',
    publishedDate: '2026-09-24',
    indexingStatus: 'Indexed',
    clicks: 14820,
    impressions: 182400,
    ctr: 8.12,
    avgPosition: 3.4,
    topQuery: 'astrological houses explained',
    category: 'Houses',
  },
  {
    id: 'pub-2',
    title: 'Sun Sign vs Moon Sign: What Really Sets Them Apart',
    url: '/dictionary/sun-vs-moon-sign',
    publishedDate: '2026-10-01',
    indexingStatus: 'Indexed',
    clicks: 11240,
    impressions: 139800,
    ctr: 8.04,
    avgPosition: 2.8,
    topQuery: 'difference between sun and moon sign',
    category: 'Fundamentals',
  },
  {
    id: 'pub-3',
    title: 'What Does Saturn Represent in a Birth Chart?',
    url: '/dictionary/saturn-meaning-astrology',
    publishedDate: '2026-09-15',
    indexingStatus: 'Indexed',
    clicks: 8630,
    impressions: 114500,
    ctr: 7.54,
    avgPosition: 4.1,
    topQuery: 'saturn meaning in astrology',
    category: 'Planets',
  },
  {
    id: 'pub-4',
    title: 'Zodiac Elements: Fire, Earth, Air and Water Defined',
    url: '/dictionary/zodiac-elements-guide',
    publishedDate: '2026-08-28',
    indexingStatus: 'Indexed',
    clicks: 9450,
    impressions: 98200,
    ctr: 9.62,
    avgPosition: 1.9,
    topQuery: 'zodiac elements personality',
    category: 'Fundamentals',
  },
  {
    id: 'pub-5',
    title: 'The Meaning of Mars in Your Horoscope',
    url: '/dictionary/mars-meaning-horoscope',
    publishedDate: '2026-09-08',
    indexingStatus: 'Crawled - Not Indexed',
    clicks: 840,
    impressions: 14200,
    ctr: 5.91,
    avgPosition: 11.2,
    topQuery: 'what does mars mean in horoscope',
    category: 'Planets',
  },
  {
    id: 'pub-6',
    title: 'Mutable Signs in Astrology: Gemini, Virgo, Sag, Pisces',
    url: '/dictionary/mutable-signs-guide',
    publishedDate: '2026-09-18',
    indexingStatus: 'Indexed',
    clicks: 5310,
    impressions: 64900,
    ctr: 8.18,
    avgPosition: 3.8,
    topQuery: 'what are mutable signs',
    category: 'Zodiac Signs',
  },
  {
    id: 'pub-7',
    title: 'Cardinal Signs vs Fixed Signs vs Mutable Signs',
    url: '/dictionary/modalities-in-astrology',
    publishedDate: '2026-09-29',
    indexingStatus: 'Submitted',
    clicks: 1190,
    impressions: 18400,
    ctr: 6.47,
    avgPosition: 7.6,
    topQuery: 'cardinal fixed mutable signs',
    category: 'Fundamentals',
  },
];

export const PERFORMANCE_DATA: Record<'7d' | '28d' | '90d', PerformanceSnapshot> = {
  '7d': {
    period: '7d',
    label: 'Last 7 Days',
    summary: {
      totalClicks: 18420,
      clicksGrowth: 14.8,
      totalImpressions: 214600,
      impressionsGrowth: 11.2,
      avgCtr: 8.58,
      ctrGrowth: 0.32,
      avgPosition: 3.2,
      positionGrowth: -0.4, // lower is better in rank
    },
    dailyPoints: [
      { date: 'Oct 08', clicks: 2310, impressions: 28900 },
      { date: 'Oct 09', clicks: 2480, impressions: 29400 },
      { date: 'Oct 10', clicks: 2690, impressions: 31200 },
      { date: 'Oct 11', clicks: 2840, impressions: 32800 },
      { date: 'Oct 12', clicks: 2710, impressions: 30900 },
      { date: 'Oct 13', clicks: 2640, impressions: 29800 },
      { date: 'Oct 14', clicks: 2750, impressions: 31600 },
    ],
    topPages: [
      {
        title: 'The 12 Astrological Houses: A Beginner Map',
        url: '/dictionary/astrological-houses-guide',
        clicks: 5410,
        impressions: 62800,
        ctr: 8.6,
        position: 2.9,
      },
      {
        title: 'Sun Sign vs Moon Sign: What Really Sets Them Apart',
        url: '/dictionary/sun-vs-moon-sign',
        clicks: 4120,
        impressions: 48900,
        ctr: 8.4,
        position: 2.4,
      },
      {
        title: 'Zodiac Elements: Fire, Earth, Air and Water Defined',
        url: '/dictionary/zodiac-elements-guide',
        clicks: 3840,
        impressions: 39100,
        ctr: 9.8,
        position: 1.8,
      },
      {
        title: 'What Does Saturn Represent in a Birth Chart?',
        url: '/dictionary/saturn-meaning-astrology',
        clicks: 2920,
        impressions: 37400,
        ctr: 7.8,
        position: 3.9,
      },
    ],
    improvements: [
      {
        title: 'The Meaning of Mars in Your Horoscope',
        query: 'what does mars mean in horoscope',
        currentPosition: 11.2,
        potentialClicks: '+1,800 clicks/mo',
        issue: 'Sitting on page 2 just beneath the fold (Position 11.2).',
        recommendation: 'Add comparison section on Mars in Fire vs Water signs to expand keyword density.',
      },
      {
        title: 'Cardinal Signs vs Fixed Signs',
        query: 'cardinal fixed mutable signs',
        currentPosition: 7.6,
        potentialClicks: '+950 clicks/mo',
        issue: 'CTR is 6.47% (lower than category benchmark of 8.2%).',
        recommendation: 'Enhance meta description with a direct quick-definition snippet to boost SERP CTR.',
      },
    ],
  },
  '28d': {
    period: '28d',
    label: 'Last 28 Days',
    summary: {
      totalClicks: 68940,
      clicksGrowth: 22.4,
      totalImpressions: 812400,
      impressionsGrowth: 18.7,
      avgCtr: 8.48,
      ctrGrowth: 0.28,
      avgPosition: 3.5,
      positionGrowth: -0.6,
    },
    dailyPoints: [
      { date: 'Wk 1', clicks: 15400, impressions: 184000 },
      { date: 'Wk 2', clicks: 16800, impressions: 198000 },
      { date: 'Wk 3', clicks: 17900, impressions: 211000 },
      { date: 'Wk 4', clicks: 18840, impressions: 219400 },
    ],
    topPages: [
      {
        title: 'The 12 Astrological Houses: A Beginner Map',
        url: '/dictionary/astrological-houses-guide',
        clicks: 19820,
        impressions: 234000,
        ctr: 8.47,
        position: 3.1,
      },
      {
        title: 'Sun Sign vs Moon Sign: What Really Sets Them Apart',
        url: '/dictionary/sun-vs-moon-sign',
        clicks: 16240,
        impressions: 195000,
        ctr: 8.32,
        position: 2.7,
      },
      {
        title: 'Zodiac Elements: Fire, Earth, Air and Water Defined',
        url: '/dictionary/zodiac-elements-guide',
        clicks: 14610,
        impressions: 151000,
        ctr: 9.67,
        position: 1.9,
      },
      {
        title: 'What Does Saturn Represent in a Birth Chart?',
        url: '/dictionary/saturn-meaning-astrology',
        clicks: 11480,
        impressions: 152000,
        ctr: 7.55,
        position: 4.1,
      },
    ],
    improvements: [
      {
        title: 'The Meaning of Mars in Your Horoscope',
        query: 'what does mars mean in horoscope',
        currentPosition: 11.2,
        potentialClicks: '+6,200 clicks/mo',
        issue: 'Crawled but lagging in index trust due to thin internal links.',
        recommendation: 'Add 3 inbound internal links from the high-performing Sun/Moon and Elements pages.',
      },
      {
        title: 'Mutable Signs in Astrology',
        query: 'what are mutable signs',
        currentPosition: 3.8,
        potentialClicks: '+2,100 clicks/mo',
        issue: 'Position 3.8 can be elevated to #1 with a quick FAQ accordion schema.',
        recommendation: 'Implement FAQ structured data on Gemini, Virgo, Sagittarius, and Pisces traits.',
      },
    ],
  },
  '90d': {
    period: '90d',
    label: 'Last 90 Days',
    summary: {
      totalClicks: 214500,
      clicksGrowth: 41.2,
      totalImpressions: 2590000,
      impressionsGrowth: 34.6,
      avgCtr: 8.28,
      ctrGrowth: 0.45,
      avgPosition: 3.8,
      positionGrowth: -1.1,
    },
    dailyPoints: [
      { date: 'Month 1', clicks: 58200, impressions: 720000 },
      { date: 'Month 2', clicks: 71400, impressions: 870000 },
      { date: 'Month 3', clicks: 84900, impressions: 1000000 },
    ],
    topPages: [
      {
        title: 'The 12 Astrological Houses: A Beginner Map',
        url: '/dictionary/astrological-houses-guide',
        clicks: 64200,
        impressions: 780000,
        ctr: 8.23,
        position: 3.4,
      },
      {
        title: 'Sun Sign vs Moon Sign: What Really Sets Them Apart',
        url: '/dictionary/sun-vs-moon-sign',
        clicks: 51900,
        impressions: 640000,
        ctr: 8.11,
        position: 2.8,
      },
      {
        title: 'Zodiac Elements: Fire, Earth, Air and Water Defined',
        url: '/dictionary/zodiac-elements-guide',
        clicks: 46800,
        impressions: 490000,
        ctr: 9.55,
        position: 2.0,
      },
      {
        title: 'What Does Saturn Represent in a Birth Chart?',
        url: '/dictionary/saturn-meaning-astrology',
        clicks: 36200,
        impressions: 480000,
        ctr: 7.54,
        position: 4.2,
      },
    ],
    improvements: [
      {
        title: 'The 12 Astrological Houses: A Beginner Map',
        query: 'astrological houses explained',
        currentPosition: 3.4,
        potentialClicks: '+12,000 clicks/mo',
        issue: 'Competitors recently updated their guides with visual chart wheels.',
        recommendation: 'Refresh with interactive house wheel SVG asset to protect top 3 rank.',
      },
    ],
  },
};

export const INITIAL_SETTINGS = {
  general: {
    systemName: 'Aurenstar Dictionary',
    primaryDomain: 'https://aurenstar.com/dictionary',
    defaultLanguage: 'English (US)',
    targetLocale: 'Global English (en-US, en-GB, en-CA, en-AU)',
    contentDirector: 'Alex Reed (Lead SEO Strategist)',
  },
  content: {
    voiceTone: 'Warm, Educational & Grounded',
    targetWordCount: '1,800 - 2,400 words',
    jargonPolicy: 'Strictly plain-language definitions first; jargon only as contextual reference.',
    includeFaqSection: true,
    requireAuthorBio: true,
  },
  seo: {
    slugFormat: '/dictionary/[term-slug]',
    metaTitlePattern: '[Term Meaning]: Plain Explanation & Daily Guide | Aurenstar',
    metaDescMaxChars: 155,
    enforceCanonical: true,
    autoSchemaTypes: 'Article, FAQPage, DefinedTerm',
  },
  publishing: {
    requireHumanSignOff: true,
    maxDailyPublications: 3,
    autoPingSearchEngines: true,
    reindexCooldownHours: 24,
  },
  integrations: [
    {
      id: 'gsc',
      name: 'Google Search Console',
      description: 'Fetches seed impressions, clicks, and page indexing statuses.',
      status: 'Demo Only',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      connectedAccount: 'sc-domain:aurenstar.com (simulated)',
      lastSync: '12 minutes ago',
    },
    {
      id: 'wp',
      name: 'WordPress REST API',
      description: 'Publishes approved articles directly to WordPress as draft or live posts.',
      status: 'Not Connected',
      badgeColor: 'text-slate-600 bg-slate-50 border-slate-200',
      connectedAccount: 'None (Demo Mode)',
      lastSync: 'Never',
    },
    {
      id: 'supabase',
      name: 'Supabase Database',
      description: 'Stores dictionary terms, keyword clusters, and editorial state changes.',
      status: 'Not Connected',
      badgeColor: 'text-slate-600 bg-slate-50 border-slate-200',
      connectedAccount: 'None (Demo Mode)',
      lastSync: 'Never',
    },
    {
      id: 'n8n',
      name: 'n8n Automation Workflows',
      description: 'Automates keyword opportunity scraping, alerts, and indexing webhooks.',
      status: 'Not Connected',
      badgeColor: 'text-slate-600 bg-slate-50 border-slate-200',
      connectedAccount: 'None (Demo Mode)',
      lastSync: 'Never',
    },
  ],
};
