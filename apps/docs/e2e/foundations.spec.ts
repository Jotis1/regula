import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { nav } from "../src/nav";

// Cada apartado de la guía (## …) tiene su página en la navegación y la página se abre con su título
const guide = readFileSync(join(import.meta.dirname, "../../../reference/GUIA.md"), "utf8");
const sections = [...guide.matchAll(/^## (.+)$/gm)].map((m) => m[1] as string);
const pages: Record<string, string> = {
	Principios: "/foundations/principles/",
	"Contenido y tono": "/foundations/content/",
	Color: "/foundations/color/",
	Tipografía: "/foundations/typography/",
	"Espaciado, radios y layout": "/foundations/layout/",
	"Sombras y estados": "/foundations/states/",
	Iconografía: "/foundations/iconography/",
	"Fondos y adornos": "/foundations/backgrounds/",
	"Stream (Twitch)": "/foundations/stream/",
	Marca: "/foundations/brand/",
	"Con Tailwind v4 (Next o Astro)": "/start/install/",
	// «Uso en el propio sistema» describe el bundle del artefacto; su regla de gráficas está en Color
	"Uso en el propio sistema": "/foundations/color/",
};

test("todos los apartados de la guía tienen página", () => {
	expect(sections.filter((s) => !(s in pages))).toEqual([]);
	const linked = nav.flatMap((s) => s.items.map((i) => i.href));
	for (const href of Object.values(pages)) expect(linked).toContain(href);
});

for (const [section, href] of Object.entries(pages)) {
	test(`«${section}» se abre en ${href}`, async ({ page }) => {
		const res = await page.goto(href);
		expect(res?.status()).toBe(200);
		await expect(page.locator("h1")).toBeVisible();
		await expect(page.locator(`nav a[href="${href}"]`)).toHaveAttribute("aria-current", "page");
	});
}

// URLs del rediseño, sin redirecciones (proposal): las antiguas dejan de existir
for (const old of ["/usage/tailwind/", "/foundations/spacing/", "/foundations/shadows/"]) {
	test(`la URL antigua ${old} ya no existe`, async ({ page }) => {
		const res = await page.goto(old);
		expect(res?.status()).toBe(404);
	});
}

test("el texto de la guía sale tal cual", async ({ page }) => {
	await page.goto("/foundations/content/");
	await expect(page.getByText('"Aún no hay gastos. Qué calma."')).toBeVisible();
	await page.goto("/foundations/color/");
	await expect(page.getByText("Las series usan, en este orden")).toBeVisible();
	await page.goto("/foundations/stream/");
	await expect(page.getByText('"En directo" no va en rojo')).toBeVisible();
});
