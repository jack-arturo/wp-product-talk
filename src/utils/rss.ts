export interface Episode {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  duration: string;
  imageUrl: string;
  enclosureUrl: string;
  guid: string;
}

function extractTagContent(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'm'));
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'm'));
  return match ? match[1] : '';
}

export async function getEpisodes(): Promise<Episode[]> {
  try {
    const res = await fetch('https://wpproducttalk.com/feed/podcast/');
    const xml = await res.text();

    // Split into items
    const items = xml.split('<item>').slice(1);

    return items.map(item => ({
      title: extractTagContent(item, 'title'),
      link: extractTagContent(item, 'link'),
      pubDate: extractTagContent(item, 'pubDate'),
      description: extractTagContent(item, 'description'),
      duration: extractTagContent(item, 'itunes:duration'),
      imageUrl:
        extractAttr(item, 'itunes:image', 'href') ||
        'https://wpproducttalk.com/wp-content/uploads/WPPT-Podcast-Creative-1.png',
      enclosureUrl: extractAttr(item, 'enclosure', 'url'),
      guid: extractTagContent(item, 'guid'),
    }));
  } catch (e) {
    console.error('RSS fetch failed:', e);
    return [];
  }
}

/**
 * Format a pubDate string into a human-readable date.
 */
export function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return pubDate;
  }
}

/**
 * Format itunes:duration (seconds or HH:MM:SS) into readable form.
 */
export function formatDuration(duration: string): string {
  if (!duration) return '';
  // Already in HH:MM:SS or MM:SS form
  if (duration.includes(':')) {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m ${s}s`;
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return `${m}m ${s}s`;
    }
  }
  // Seconds only
  const totalSecs = parseInt(duration, 10);
  if (isNaN(totalSecs)) return duration;
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Strip HTML tags and truncate description text.
 */
export function stripHtml(html: string, maxLength = 200): string {
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}
