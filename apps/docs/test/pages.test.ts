// The built pages against the standards a page can be checked for (SEO-001 to SEO-005, SEO-007, LOC-001 and ACC-003):
// reads every `index.html` of `dist/`, so it runs after the build (Turbo builds before the tests). A page is
// indexable unless its HTML carries `noindex`: the internal ones (/visual/, /showcase/, the full-size canvases) and
// the redirects. Each failure names its pages.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isNoindex } from "../src/lib/sitemap";

const SITE = "https://regula.jotis.me";
const dist = join(import.meta.dirname, "../dist");

/** Every `index.html` under a directory, as `[path of the page, html]`: `/` for the home, `/components/button/`. */
function pagesOf(dir: string, base = "/"): [string, string][] {
	return readdirSync(dir).flatMap((name) => {
		const file = join(dir, name);
		if (statSync(file).isDirectory()) return pagesOf(file, `${base}${name}/`);
		return name === "index.html" ? [[base, readFileSync(file, "utf8")] as [string, string]] : [];
	});
}

const first = (html: string, pattern: RegExp): string | undefined => pattern.exec(html)?.[1];
const titleOf = (html: string) => first(html, /<title>([^<]*)<\/title>/);
const metaOf = (html: string, name: string) =>
	first(html, new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`));
const canonicalOf = (html: string) => first(html, /<link rel="canonical" href="([^"]*)"/);
const count = (html: string, pattern: RegExp) => html.match(pattern)?.length ?? 0;

/** The stub Astro writes for a redirect (`redirects` in astro.config.mjs): a refresh to the new URL, not a page. */
const isRedirect = (html: string) => /<meta http-equiv="refresh"/.test(html);

const built = existsSync(dist) ? pagesOf(dist) : [];
const redirects = built.filter(([, html]) => isRedirect(html));
const pages = built.filter(([, html]) => !isRedirect(html));
const indexable = pages.filter(([, html]) => !isNoindex(html));
/** The paths of the pages that fail a check: an empty list is a pass, and a failure shows which ones. */
const failing = (list: [string, string][], ok: (html: string, path: string) => boolean) =>
	list.filter(([path, html]) => !ok(html, path)).map(([path]) => path);

describe("páginas construidas", () => {
	it("hay build, con páginas indexables y páginas internas", () => {
		expect(indexable.length).toBeGreaterThan(100);
		expect(pages.length).toBeGreaterThan(indexable.length);
	});

	it("SEO-001: cada página indexable tiene su título, distinto del de las demás, y su descripción", () => {
		expect(failing(indexable, (html) => !!titleOf(html)?.trim())).toEqual([]);
		const byTitle = Map.groupBy(indexable, ([, html]) => titleOf(html));
		const repeated = [...byTitle.values()]
			.filter((group) => group.length > 1)
			.map((group) => group.map(([p]) => p));
		expect(repeated).toEqual([]);
		expect(failing(indexable, (html) => !!metaOf(html, "description")?.trim())).toEqual([]);
	});

	it("SEO-002: cada página indexable lleva su canonical, con su URL absoluta", () => {
		expect(failing(indexable, (html, path) => canonicalOf(html) === `${SITE}${path}`)).toEqual([]);
	});

	it("SEO-004: cada página indexable tiene un solo h1", () => {
		expect(failing(indexable, (html) => count(html, /<h1[\s>]/g) === 1)).toEqual([]);
	});

	it("SEO-005: las páginas internas llevan noindex, y no llevan canonical ni tarjeta", () => {
		const internal = pages.filter(([path]) => /^\/(visual|showcase)\//.test(path));
		expect(internal.length).toBeGreaterThan(0);
		expect(failing(internal, (html) => isNoindex(html))).toEqual([]);
		const hidden = pages.filter(([, html]) => isNoindex(html));
		expect(failing(hidden, (html) => !canonicalOf(html))).toEqual([]);
		expect(failing(hidden, (html) => !metaOf(html, "og:title"))).toEqual([]);
	});

	it("SEO-006: una redirección no se indexa y apunta a la página nueva", () => {
		expect(redirects.length).toBeGreaterThan(0);
		expect(
			failing(redirects, (html) => isNoindex(html) && !!canonicalOf(html)?.startsWith(`${SITE}/`)),
		).toEqual([]);
	});

	it("SEO-007: cada página indexable lleva su tarjeta de Open Graph", () => {
		expect(
			failing(
				indexable,
				(html, path) =>
					metaOf(html, "og:title") === titleOf(html) &&
					metaOf(html, "og:description") === metaOf(html, "description") &&
					metaOf(html, "og:url") === `${SITE}${path}` &&
					!!metaOf(html, "og:image")?.startsWith(`${SITE}/`) &&
					!!metaOf(html, "twitter:card"),
			),
		).toEqual([]);
	});

	it("LOC-001: todas las páginas llevan lang en html", () => {
		expect(failing(pages, (html) => /<html[^>]*\slang="[a-z]{2}(-[A-Z]{2})?"/.test(html))).toEqual([]);
	});

	it("ACC-003: cada página indexable tiene su región main y, antes, un enlace de salto a ella", () => {
		expect(
			failing(indexable, (html) => {
				const id = first(html, /<main[^>]*\sid="([^"]*)"/);
				const skip = html.indexOf(`<a href="#${id}"`);
				return !!id && skip >= 0 && skip < html.indexOf("<main");
			}),
		).toEqual([]);
	});
});

describe("robots.txt y sitemap (SEO-003)", () => {
	const read = (name: string) =>
		existsSync(join(dist, name)) ? readFileSync(join(dist, name), "utf8") : "";

	it("robots.txt deja rastrear el sitio y enlaza al sitemap", () => {
		const robots = read("robots.txt");
		expect(robots).toContain("User-agent: *");
		expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
		expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
	});

	it("el sitemap lista las páginas indexables y ninguna más", () => {
		const listed = [...read("sitemap.xml").matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]).sort();
		expect(listed).toEqual(indexable.map(([path]) => `${SITE}${path}`).sort());
	});
});
