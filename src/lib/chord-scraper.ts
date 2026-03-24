/**
 * @fileOverview Chord website scraper with site-specific extraction and AI fallback.
 *
 * Supports:
 *   - ultimate-guitar.com  → JSON extraction from js-store data attribute
 *   - e-chords.com         → regex extraction from server-rendered HTML
 *   - azchords.com         → regex extraction from server-rendered HTML
 *   - chordu.com           → regex extraction from server-rendered HTML
 *   - songsterr.com        → JSON API
 *   - Any other site       → AI fallback (sends raw HTML to Gemini)
 */

export interface ScrapedSong {
  title: string;
  artist: string;
  lyricsAndChords: string;
}

type SiteExtractor = (html: string, url: string) => ScrapedSong | null;

// ── Site detection ──────────────────────────────────────────────────────────

const SITE_PATTERNS: Record<string, RegExp> = {
  'ultimate-guitar': /ultimate-guitar\.com/i,
  'e-chords': /e-chords\.com/i,
  'azchords': /azchords\.com/i,
  'chordu': /chordu\.com/i,
  'songsterr': /songsterr\.com/i,
};

export function detectSite(url: string): string | null {
  for (const [site, pattern] of Object.entries(SITE_PATTERNS)) {
    if (pattern.test(url)) return site;
  }
  return null;
}

// ── Helper: strip HTML tags and decode common entities ──────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|li|tr|h[1-6]|pre|blockquote)[^>]*>/gi, '\n')
    .replace(/<\/?(span|b|i|em|strong|a|font|sup|sub)[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Helper: extract title/artist from <title> tag ──────────────────────────

function extractMetaFromTitle(html: string): { title: string; artist: string } {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (!titleMatch) return { title: '', artist: '' };

  let raw = titleMatch[1]
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

  // Common patterns: "Song - Artist Chords | Site" or "Song by Artist - Chords"
  // Strip site suffixes
  raw = raw
    .replace(/\s*[|\-–—]\s*(Chords?|Tabs?|Lyrics?|Guitar\s*Tabs?|Ukulele\s*Chords?).*$/i, '')
    .replace(/\s*(Chords?|Tabs?|Lyrics?)\s*$/i, '')
    .trim();

  // Split on " - " or " by "
  const byMatch = raw.match(/^(.+?)\s+by\s+(.+)$/i);
  if (byMatch) {
    return { title: byMatch[1].trim(), artist: byMatch[2].trim() };
  }

  const dashMatch = raw.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    return { title: dashMatch[1].trim(), artist: dashMatch[2].trim() };
  }

  return { title: raw, artist: '' };
}

// ── Site-specific extractors ────────────────────────────────────────────────

const extractors: Record<string, SiteExtractor> = {
  'ultimate-guitar': (html) => {
    // UG embeds tab data in <div class="js-store" data-content="...">
    const storeMatch = html.match(
      /<div[^>]*class="js-store"[^>]*data-content="([^"]*)"[^>]*>/i
    );
    if (!storeMatch) return null;

    try {
      const decoded = decodeURIComponent(storeMatch[1]);
      const storeData = JSON.parse(decoded);
      const tab = storeData?.store?.page?.data?.tab;
      const wikiTab = storeData?.store?.page?.data?.tab_view?.wiki_tab;

      const title = tab?.song_name || '';
      const artist = tab?.artist_name || '';

      // Try wiki_tab content first, then tab.content
      let content = wikiTab?.content || tab?.content || '';

      if (typeof content === 'string' && content.length > 0) {
        // UG uses [ch]...[/ch] BBCode for chords
        content = content
          .replace(/\[ch\]/g, '')
          .replace(/\[\/ch\]/g, '')
          .replace(/\[tab\]/g, '')
          .replace(/\[\/tab\]/g, '')
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\r\n/g, '\n')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .trim();

        if (content.length > 10) {
          return { title, artist, lyricsAndChords: content };
        }
      }
    } catch {
      // JSON parsing failed
    }
    return null;
  },

  'e-chords': (html) => {
    const { title, artist } = extractMetaFromTitle(html);

    // E-Chords wraps lyrics/chords in a specific div
    // Try multiple patterns
    const patterns = [
      /<div[^>]*id="coremain"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*lyrics[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const content = stripHtml(match[1]);
        if (content.length > 20) {
          return { title, artist, lyricsAndChords: content };
        }
      }
    }
    return null;
  },

  'azchords': (html) => {
    const { title, artist } = extractMetaFromTitle(html);

    const patterns = [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*chords?[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*id="[^"]*chords?[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const content = stripHtml(match[1]);
        if (content.length > 20) {
          return { title, artist, lyricsAndChords: content };
        }
      }
    }
    return null;
  },

  'chordu': (html) => {
    const { title, artist } = extractMetaFromTitle(html);

    const patterns = [
      /<pre[^>]*>([\s\S]*?)<\/pre>/i,
      /<div[^>]*class="[^"]*chord[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const content = stripHtml(match[1]);
        if (content.length > 20) {
          return { title, artist, lyricsAndChords: content };
        }
      }
    }
    return null;
  },

  'songsterr': (_html, url) => {
    // Songsterr uses a JSON API — we handle this separately in fetchContentFromUrl
    // This extractor is a fallback that won't match
    // The actual Songsterr fetch is handled in the main scrape function
    return null;
  },
};

// ── Songsterr API helper ────────────────────────────────────────────────────

async function fetchSongsterrData(url: string): Promise<ScrapedSong | null> {
  // Extract song name from URL: /a/wa/song?song=Artist-Song
  // Or search by URL pattern
  const songMatch = url.match(/songsterr\.com\/a\/wa\/song\?.*song=([^&]+)/i);
  const searchMatch = url.match(/songsterr\.com\/.*?\/([^\/]+?)(?:-chords)?-s(\d+)s?$/i);

  try {
    if (searchMatch) {
      // Fetch tab data directly by song ID
      const songId = searchMatch[2];
      const apiResponse = await fetch(
        `https://www.songsterr.com/a/wa/song?id=${songId}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data && data.title) {
          return {
            title: data.title || '',
            artist: data.artist?.name || '',
            lyricsAndChords: '(Songsterr tab — use the interactive player at songsterr.com)',
          };
        }
      }
    }

    if (songMatch) {
      const query = decodeURIComponent(songMatch[1]).replace(/-/g, ' ');
      const apiResponse = await fetch(
        `https://www.songsterr.com/a/wa/bestMatchForQueryString?pattern=${encodeURIComponent(query)}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data && data.title) {
          return {
            title: data.title || '',
            artist: data.artist?.name || '',
            lyricsAndChords: '(Songsterr tab — use the interactive player at songsterr.com)',
          };
        }
      }
    }
  } catch {
    // Songsterr API failed
  }
  return null;
}

// ── Main export: fetch + extract ────────────────────────────────────────────

export async function scrapeChordSite(url: string): Promise<ScrapedSong | null> {
  const site = detectSite(url);

  // Songsterr uses API, not HTML scraping
  if (site === 'songsterr') {
    return fetchSongsterrData(url);
  }

  // Fetch raw HTML
  let html: string;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    html = await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }

  // Try site-specific extraction
  if (site && extractors[site]) {
    const result = extractors[site](html, url);
    if (result) return result;
  }

  // Generic fallback: try <pre> tags and common patterns
  const genericPatterns = [
    /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    /<code[^>]*>([\s\S]*?)<\/code>/i,
  ];

  const { title, artist } = extractMetaFromTitle(html);
  for (const pattern of genericPatterns) {
    const match = html.match(pattern);
    if (match) {
      const content = stripHtml(match[1]);
      if (content.length > 20) {
        return { title, artist, lyricsAndChords: content };
      }
    }
  }

  // Return null — caller should fall back to AI extraction
  return null;
}
