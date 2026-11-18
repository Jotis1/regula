// robots.txt (SEO-003): the whole site can be crawled, and the sitemap says which pages there are. The pages that
// must stay out carry `noindex` themselves. The domain comes from `site`, so it is written in one place.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", site).href}\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
