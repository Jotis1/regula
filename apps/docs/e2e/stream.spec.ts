// Variante de Stream de la página de componente (Scene.dc.html) y lienzos a tamaño real (design §10).
import { expect, test } from "@playwright/test";

for (const [slug, width, height] of [
	["stream-scene", 1920, 1080],
	["channel-banner", 1200, 480],
] as const)
	test(`/components/${slug}/full/ pinta el lienzo a ${width}×${height} px, sin escalar ni indexar`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(`/components/${slug}/full/`);
		const canvas = page.locator("[data-full-canvas] astro-island > *").first();
		await expect(canvas).toBeVisible();
		const box = await canvas.evaluate((el) => {
			const r = el.getBoundingClientRect();
			return { width: Math.round(r.width), height: Math.round(r.height) };
		});
		expect(box).toEqual({ width, height });
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
		// Sin la cabecera ni la navegación de la web, con un enlace de vuelta a su página
		await expect(page.getByRole("banner")).toHaveCount(0);
		await expect(page.getByRole("link", { name: /^Volver a / })).toHaveAttribute(
			"href",
			`/components/${slug}/`,
		);
	});

test("StreamScene: insignias, ejemplos en oscuro, nota del tema con enlace a tamaño real, nota de OBS y guía", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/stream-scene/");
	const header = page.locator("article header");
	await expect(header.getByText("Stream · Escenas")).toBeVisible();
	await expect(header.getByText("Siempre en oscuro")).toBeVisible();
	const crumbs = page.getByRole("navigation", { name: /migas/i });
	await expect(crumbs.getByRole("link", { name: "Stream" })).toHaveAttribute(
		"href",
		"/foundations/stream/",
	);
	// El playground va en oscuro y debajo va la nota, con el enlace a tamaño real
	await expect(page.locator("section[aria-labelledby=ejemplo] [data-playground-preview]")).toHaveClass(
		/dark-mode/,
	);
	const note = page.locator("section[aria-labelledby=ejemplo] [data-stream-note]");
	await expect(note).toContainText("dark-mode");
	await expect(note.getByRole("link", { name: "Ver a tamaño real" })).toHaveAttribute(
		"href",
		"/components/stream-scene/full/",
	);
	await expect(page.locator("[data-playground-preview]")).toHaveClass(/dark-mode/);
	await expect(page.locator("section[aria-labelledby=codigo] [data-obs-note]")).toContainText("En OBS.");
	const toc = page.getByRole("navigation", { name: "En esta página" }).last();
	await expect(toc.getByRole("link", { name: "Guía de Stream" })).toHaveAttribute(
		"href",
		"/foundations/stream/",
	);
});

test("un componente de Stream sin lienzo fijo no enlaza a tamaño real; uno de aplicación no lleva nada de Stream", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/stream-alert/");
	await expect(page.locator("[data-stream-note]")).toHaveCount(1);
	await expect(page.getByRole("link", { name: "Ver a tamaño real" })).toHaveCount(0);
	await expect(
		page
			.getByRole("navigation", { name: "En esta página" })
			.last()
			.getByRole("link", { name: "Guía de Stream" }),
	).toBeVisible();
	await page.goto("/components/button/");
	await expect(page.locator("[data-stream-note], [data-obs-note]")).toHaveCount(0);
	await expect(page.getByText("Siempre en oscuro")).toHaveCount(0);
});
