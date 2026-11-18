import { describe, expect, it } from "vitest";
import { isNoindex, sitemapXml } from "../src/lib/sitemap";

describe("sitemap", () => {
	it("lista cada página una vez, con su URL absoluta y en orden", () => {
		const xml = sitemapXml("https://regula.jotis.me", ["components/button/", "", "components/button/"]);
		expect(xml).toBe(
			[
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				"\t<url><loc>https://regula.jotis.me/</loc></url>",
				"\t<url><loc>https://regula.jotis.me/components/button/</loc></url>",
				"</urlset>",
				"",
			].join("\n"),
		);
	});

	it("escapa lo que no cabe tal cual en XML", () => {
		expect(sitemapXml("https://regula.jotis.me", ["search/?q=a&b=c"])).toContain(
			"<loc>https://regula.jotis.me/search/?q=a&#38;b=c</loc>",
		);
	});

	it("una página con noindex queda fuera, y una sin él, dentro", () => {
		expect(isNoindex('<head><meta name="robots" content="noindex"></head>')).toBe(true);
		expect(isNoindex('<head><meta name="robots" content="noindex, nofollow" /></head>')).toBe(true);
		expect(isNoindex('<head><meta name="description" content="Sin noindex"></head>')).toBe(false);
	});
});
