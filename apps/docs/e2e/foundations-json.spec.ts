// `/foundations.json` against the built pages (spec mcp-server, «Fundamentos en JSON»): each section of the JSON is a
// `##` of its page, in the same order and with the same anchor.
import { expect, test } from "./fixtures";

interface Foundation {
	id: string;
	url: string;
	sections: { title: string; url: string }[];
}

test("cada sección de /foundations.json es un `##` de su página, con la misma ancla", async ({
	page,
	request,
}) => {
	const response = await request.get("/foundations.json");
	expect(response.ok()).toBe(true);
	const { foundations } = (await response.json()) as { foundations: Foundation[] };
	expect(foundations).toHaveLength(10);
	for (const foundation of foundations) {
		expect(foundation.url).toBe(`https://regula.jotis.me/foundations/${foundation.id}/`);
		await page.goto(`/foundations/${foundation.id}/`);
		// In an MDX page the anchor is on the box of each title (`SectionTitle`); in a Markdown one, on the `<h2>` itself
		const headings = await page
			.locator("main :is(h2[id], div[id]:has(> * h2, > h2))")
			.evaluateAll((els) =>
				els.map((el) => [
					((el.matches("h2") ? el : el.querySelector("h2"))?.textContent ?? "").trim(),
					el.id,
				]),
			);
		expect(
			foundation.sections.map((s) => [s.title, decodeURIComponent(new URL(s.url).hash.slice(1))]),
			foundation.id,
		).toEqual(headings);
	}
});
