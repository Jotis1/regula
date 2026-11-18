// The sitemap of the site (SEO-003): every indexable page and nothing else. Astro hands the list of built pages to
// the `astro:build:done` hook (astro.config.mjs), which leaves out the ones whose HTML carries `noindex`: what is
// in the sitemap is decided in one place, the page itself.

const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;

/** Whether the HTML of a page asks search engines to leave it out. */
export const isNoindex = (html: string): boolean => NOINDEX.test(html);

const escapeXml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The sitemap XML for these page paths (`""` is the home, `components/button/` a page), as absolute URLs of `site`. */
export function sitemapXml(site: string, paths: readonly string[]): string {
	const urls = [...new Set(paths)]
		.map((path) => new URL(path, site).href)
		.sort((a, b) => a.localeCompare(b))
		.map((url) => `\t<url><loc>${escapeXml(url)}</loc></url>`);
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
