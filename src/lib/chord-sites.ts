/**
 * @fileOverview Registry of chord websites with search URL patterns and scraping selectors.
 *
 * Sites are organized by region:
 *   - ex-YU (Balkan) sites for Serbian/Croatian/Bosnian music
 *   - International sites for worldwide coverage
 */

export interface ChordSite {
  name: string;
  key: string;
  searchUrl: (query: string) => string;
  /** CSS-like selectors or regex patterns to extract search result links */
  resultSelectors: {
    /** Pattern to find song links in search results HTML */
    linkPattern: RegExp;
    /** Pattern to extract title from the link text or nearby element */
    titlePattern?: RegExp;
  };
  /** How to extract chords from a song page */
  contentSelectors: RegExp[];
  /** Priority for search ordering (lower = searched first) */
  priority: number;
  /** Region hint for filtering */
  region: 'ex-yu' | 'international';
}

// ── Ex-YU (Balkan) Sites ────────────────────────────────────────────────────

export const CHORD_SITES_EX_YU: ChordSite[] = [
  {
    name: 'Akorde.me',
    key: 'akorde-me',
    searchUrl: (q) => `https://akorde.me/search?q=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*)"[^>]*class="[^"]*song[^"]*"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*song-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 1,
    region: 'ex-yu',
  },
  {
    name: 'Tabovi.com',
    key: 'tabovi',
    searchUrl: (q) => `https://www.tabovi.com/search.php?search=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*\.html)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*id="[^"]*chords?[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 2,
    region: 'ex-yu',
  },
  {
    name: 'Akorde Tabovi',
    key: 'akorde-tabovi',
    searchUrl: (q) => `https://www.akorditabovi.com/search?q=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(https?:\/\/www\.akorditabovi\.com\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 3,
    region: 'ex-yu',
  },
  {
    name: 'Gitaratabovi.com',
    key: 'gitaratabovi',
    searchUrl: (q) => `https://gitaratabovi.com/search?q=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    ],
    priority: 4,
    region: 'ex-yu',
  },
  {
    name: 'Akordi.org',
    key: 'akordi-org',
    searchUrl: (q) => `https://www.akordi.org/search.php?search=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*lyrics[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 5,
    region: 'ex-yu',
  },
];

// ── International Sites ─────────────────────────────────────────────────────

export const CHORD_SITES_INTL: ChordSite[] = [
  {
    name: 'Ultimate Guitar',
    key: 'ultimate-guitar',
    searchUrl: (q) => `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(https:\/\/tabs\.ultimate-guitar\.com\/tab\/[^"]*)"[^>]*>/gi,
    },
    contentSelectors: [
      /<div[^>]*class="js-store"[^>]*data-content="([^"]*)"[^>]*>/i,
    ],
    priority: 1,
    region: 'international',
  },
  {
    name: 'E-Chords',
    key: 'e-chords',
    searchUrl: (q) => `https://www.e-chords.com/search-all/${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(https:\/\/www\.e-chords\.com\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<div[^>]*id="coremain"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    ],
    priority: 2,
    region: 'international',
  },
  {
    name: 'AZChords',
    key: 'azchords',
    searchUrl: (q) => `https://www.azchords.com/search.php?search=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*chords?[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 3,
    region: 'international',
  },
  {
    name: 'ChordU',
    key: 'chordu',
    searchUrl: (q) => `https://chordu.com/search?q=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*chord[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ],
    priority: 4,
    region: 'international',
  },
  {
    name: 'Chordify',
    key: 'chordify',
    searchUrl: (q) => `https://chordify.net/search/${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(https:\/\/chordify\.net\/chords\/[^"]*)"[^>]*>/gi,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    ],
    priority: 5,
    region: 'international',
  },
  {
    name: 'Songsterr',
    key: 'songsterr',
    searchUrl: (q) => `https://www.songsterr.com/a/wa/bestMatchForQueryString?pattern=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /"id":\s*(\d+),"title":"([^"]+)"/gi,
    },
    contentSelectors: [],
    priority: 6,
    region: 'international',
  },
  {
    name: 'GuitareTab',
    key: 'guitaretabs',
    searchUrl: (q) => `https://www.guitaretabs.com/search.php?search=${encodeURIComponent(q)}`,
    resultSelectors: {
      linkPattern: /<a[^>]*href="(\/tabs\/[^"]*)"[^>]*>([^<]*)<\/a>/gi,
      titlePattern: />([^<]+)<\/a>/,
    },
    contentSelectors: [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    ],
    priority: 7,
    region: 'international',
  },
];

// ── Combined registry ───────────────────────────────────────────────────────

export const ALL_CHORD_SITES: ChordSite[] = [
  ...CHORD_SITES_EX_YU,
  ...CHORD_SITES_INTL,
];

export function getSitesByRegion(region: 'ex-yu' | 'international' | 'all'): ChordSite[] {
  if (region === 'all') return ALL_CHORD_SITES;
  return ALL_CHORD_SITES.filter((s) => s.region === region);
}

// ── User-Agent for requests ─────────────────────────────────────────────────

export const SCRAPER_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,hr;q=0.8,sr;q=0.8,bs;q=0.8',
};
