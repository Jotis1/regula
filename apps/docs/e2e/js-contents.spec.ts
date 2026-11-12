// JavaScript solo de lo que se usa (docs-site, «JavaScript solo de lo que se usa»): la página de un componente
// descarga el código de su ejemplo interactivo y no el de componentes pesados que no usa. Se buscan fragmentos de
// clases únicos de cada uno en todo el JavaScript que baja la página, también el de los imports dinámicos.
import { expect, type Page, test } from "@playwright/test";

const MARKERS: Record<string, string> = {
	ColorPicker: "h-50 w-full cursor-crosshair touch-none",
	Carousel: "touch-pan-y overflow-hidden",
	StreamScene: "inset-[0_0_128px_0]",
	CalendarView: "flex size-full min-w-0 cursor-pointer flex-col items-start",
};

/** Todo el JavaScript que descarga una página, con su contenido, una vez cargada y hidratadas sus islas. */
async function scripts(page: Page, path: string): Promise<string> {
	const bodies: Promise<string>[] = [];
	page.on("response", (r) => {
		if (r.url().endsWith(".js")) bodies.push(r.text().catch(() => ""));
	});
	await page.goto(path, { waitUntil: "networkidle" });
	// El ejemplo interactivo o, en los componentes que aún no lo tienen, sus variantes
	const example = page
		.locator("section[aria-labelledby=ejemplo], section[aria-labelledby=variantes]")
		.first();
	await example.scrollIntoViewIfNeeded();
	await expect(example.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await page.waitForLoadState("networkidle");
	return (await Promise.all(bodies)).join("\n");
}

for (const [path, absent] of [
	["/components/button/", ["ColorPicker", "Carousel", "StreamScene", "CalendarView"]],
	["/components/badge/", ["ColorPicker", "Carousel", "StreamScene", "CalendarView"]],
	["/components/input/", ["ColorPicker", "Carousel", "StreamScene"]],
] as const)
	test(`${path} no descarga ${absent.join(", ")}`, async ({ page }) => {
		const js = await scripts(page, path);
		for (const name of absent) expect(js.includes(MARKERS[name] as string), name).toBe(false);
	});

test("los marcadores existen: la página de ColorPicker sí descarga el suyo", async ({ page }) => {
	const js = await scripts(page, "/components/color-picker/");
	expect(js.includes(MARKERS.ColorPicker as string)).toBe(true);
});
