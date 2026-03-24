/**
 * @fileOverview Chord website scraper with site-specific extraction, search, and AI fallback.
 *
 * Features:
 *   - Auto-search across 12 chord sites (ex-YU + international)
 *   - Site-specific content extraction
 *   - Generic HTML fallback
 *   - AI fallback for unknown sites
 */

import { ALL_CHORD_SITES, SCRAPER_HEADERS, type ChordSite } from './chord-sites';

// ── Types ───────────────────────────────────────────────────────────────────

export interface ScrapedSong {
  title: string;
  artist: string;
  lyricsAndChords: string;
}

export interface SearchResult {
  title: string;
  artist: string;
  url: string;
  siteName: string;
  siteKey: string;
}

type SiteExtractor = (html: string, url: string) => ScrapedSong | null;

// ── Site detection ──────────────────────────────────────────────────────────

const SITE_DOMAIN_PATTERNS: Record<string, RegExp> = {
  'ultimate-guitar': /ultimate-guitar\.com/i,
  'e-chords': /e-chords\.com/i,
  'azchords': /azchords\.com/i,
  'chordu': /chordu\.com/i,
  'songsterr': /songsterr\.com/i,
  'akorde-me': /akorde\.me/i,
  'tabovi': /tabovi\.com/i,
  'akorde-tabovi': /akorditabovi\.com/i,
  'gitaratabovi': /gitaratabovi\.com/i,
  'akordi-org': /akordi\.org/i,
  'chordify': /chordify\.net/i,
  'guitaretabs': /guitaretabs\.com/i,
};

export function detectSite(url: string): string | null {
  for (const [site, pattern] of Object.entries(SITE_DOMAIN_PATTERNS)) {
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

  // Strip site suffixes
  raw = raw
    .replace(/\s*[|\-–—]\s*(Chords?|Tabs?|Lyrics?|Guitar\s*Tabs?|Ukulele\s*Chords?|Akorde|Tabovi|Akorde i tabovi).*$/i, '')
    .replace(/\s*(Chords?|Tabs?|Lyrics?)\s*$/i, '')
    .trim();

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

// ── Site-specific content extractors ────────────────────────────────────────

const extractors: Record<string, SiteExtractor> = {
  'ultimate-guitar': (html) => {
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

      let content = wikiTab?.content || tab?.content || '';

      if (typeof content === 'string' && content.length > 0) {
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

  'songsterr': (_html, url) => {
    // Handled separately via API
    return null;
  },
};

// Generic extractor for sites without custom logic
const genericExtractor: SiteExtractor = (html) => {
  const { title, artist } = extractMetaFromTitle(html);

  const patterns = [
    /<pre[^>]*>([\s\S]*?)<\/pre>/i,
    /<code[^>]*>([\s\S]*?)<\/code>/i,
    /<div[^>]*class="[^"]*(?:chords?|lyrics?|song-text|tab-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*(?:chords?|lyrics?|coremain)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
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
};

// ── Songsterr API helper ────────────────────────────────────────────────────

async function fetchSongsterrData(url: string): Promise<ScrapedSong | null> {
  const songMatch = url.match(/songsterr\.com\/a\/wa\/song\?.*song=([^&]+)/i);
  const searchMatch = url.match(/songsterr\.com\/.*?\/([^\/]+?)(?:-chords)?-s(\d+)s?$/i);

  try {
    if (searchMatch) {
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

// ── Main export: fetch + extract from URL ───────────────────────────────────

export async function scrapeChordSite(url: string): Promise<ScrapedSong | null> {
  const site = detectSite(url);

  if (site === 'songsterr') {
    return fetchSongsterrData(url);
  }

  // Fetch raw HTML
  let html: string;
  try {
    const response = await fetch(url, { headers: SCRAPER_HEADERS });
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

  // Generic fallback
  const result = genericExtractor(html, url);
  if (result) return result;

  return null;
}

// ── Auto-search across all chord sites ──────────────────────────────────────

/**
 * Search a single site for chord results.
 * Returns an array of SearchResult objects found on that site.
 */
async function searchSingleSite(
  site: ChordSite,
  query: string
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const searchUrl = site.searchUrl(query);

  try {
    const response = await fetch(searchUrl, {
      headers: SCRAPER_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return results;

    const html = await response.text();

    // Special handling for Songsterr (JSON API)
    if (site.key === 'songsterr') {
      try {
        const data = JSON.parse(html);
        if (Array.isArray(data)) {
          for (const item of data.slice(0, 10)) {
            if (item.title) {
              results.push({
                title: item.title || '',
                artist: item.artist?.name || '',
                url: `https://www.songsterr.com/a/wa/song?id=${item.id}`,
                siteName: site.name,
                siteKey: site.key,
              });
            }
          }
        } else if (data && data.title) {
          results.push({
            title: data.title || '',
            artist: data.artist?.name || '',
            url: `https://www.songsterr.com/a/wa/song?id=${data.id}`,
            siteName: site.name,
            siteKey: site.key,
          });
        }
      } catch {
        // Not JSON
      }
      return results;
    }

    // HTML-based search result extraction
    const { linkPattern } = site.resultSelectors;
    let match;
    let count = 0;
    const maxResults = 10;

    // Clone the regex to reset lastIndex
    const regex = new RegExp(linkPattern.source, linkPattern.flags);

    while ((match = regex.exec(html)) !== null && count < maxResults) {
      const href = match[1];
      let title = match[2] || '';

      // Clean up the title
      title = title
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();

      if (!title && href) {
        // Try to extract title from URL
        const urlParts = href.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\.\w+$/, '') || '';
        title = urlParts.slice(0, 80);
      }

      if (title.length < 3) continue;

      // Build full URL
      let fullUrl = href;
      if (href.startsWith('/')) {
        const siteUrl = new URL(searchUrl);
        fullUrl = `${siteUrl.origin}${href}`;
      }

      // Parse title and artist from combined string
      let parsedTitle = title;
      let parsedArtist = '';

      const sepMatch = title.match(/^(.+?)\s*[-–—]\s*(.+)$/);
      if (sepMatch) {
        parsedArtist = sepMatch[1].trim();
        parsedTitle = sepMatch[2].trim();
      }

      // Skip duplicates
      if (results.some((r) => r.url === fullUrl)) continue;

      // Filter out junk links
      const junkPatterns = [/about/i, /terms/i, /privacy/i, /features/i, /refund/i, /contact/i];
      if (junkPatterns.some(p => p.test(fullUrl) || p.test(title))) continue;

      results.push({
        title: parsedTitle,
        artist: parsedArtist,
        url: fullUrl,
        siteName: site.name,
        siteKey: site.key,
      });
      count++;
    }
  } catch (error) {
    // Site search failed — skip silently
    console.debug(`Search failed for ${site.name}:`, error);
  }

  return results;
}

/**
 * Search all chord sites in parallel for a song.
 *
 * @param songName - Song title to search for
 * @param artist   - Optional artist name to narrow results
 * @returns Array of SearchResult from all sites, sorted by relevance
 */
export async function searchChordSites(
  songName: string,
  artist?: string
): Promise<SearchResult[]> {
  const query = artist ? `${artist} ${songName}` : songName;

  // Search all sites in parallel with timeout
  const searchPromises = ALL_CHORD_SITES.map((site) =>
    searchSingleSite(site, query).catch(() => [])
  );

  const allResults = await Promise.all(searchPromises);
  const results = allResults.flat();

  // Sort by relevance: exact title match first, then by artist match
  const queryLower = songName.toLowerCase();
  const artistLower = (artist || '').toLowerCase();

  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();

    // Exact title match bonus
    const aExact = aTitle.includes(queryLower) ? 0 : 1;
    const bExact = bTitle.includes(queryLower) ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    // Artist match bonus
    if (artistLower) {
      const aArtist = a.artist.toLowerCase().includes(artistLower) ? 0 : 1;
      const bArtist = b.artist.toLowerCase().includes(artistLower) ? 0 : 1;
      if (aArtist !== bArtist) return aArtist - bArtist;
    }

    // Ex-YU sites first (for Balkan music relevance)
    const aExYU = a.siteKey.match(/akorde|tabovi|gitaratabovi|akordi/) ? 0 : 1;
    const bExYU = b.siteKey.match(/akorde|tabovi|gitaratabovi|akordi/) ? 0 : 1;
    return aExYU - bExYU;
  });

  // Limit to top 50 results (show all versions)
  return results.slice(0, 50);
}
