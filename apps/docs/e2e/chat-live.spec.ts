// ChatBox y StreamPinnedMessage en el navegador (add-live-interaction-pieces, D3 y D7–D9): insignias junto al nombre,
// enlaces marcados, el ejemplo animado que recibe mensajes, el chat seleccionable y el corte a cuatro líneas.
import { expect, type Locator, type Page, test } from "@playwright/test";

/** La sección del ejemplo interactivo, con su isla ya hidratada. */
async function example(page: Page, path: string): Promise<Locator> {
	await page.goto(path);
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await pg.scrollIntoViewIfNeeded();
	await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await expect(pg.locator("[data-playground]")).toBeVisible();
	return pg;
}

/** El control de una prop, con su grupo abierto y a la vista. */
async function control(pg: Locator, prop: string): Promise<Locator> {
	const el = pg.locator(`[data-playground-controls] [data-prop="${prop}"]`);
	const group = el.locator("xpath=ancestor::details[1]");
	if (!(await group.evaluate((d) => (d as HTMLDetailsElement).open)))
		await group.locator("> summary").click();
	await el.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
	return el;
}

const rows = (pg: Locator) => pg.locator("[data-playground-preview] [role=log] > div > *");

test.describe("Insignias junto al nombre", () => {
	test("Mensaje largo con insignias: insignias y nombre en la misma línea, centrados a ±1 px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 800, height: 600 });
		await page.goto("/visual/chat-box/?tema=oscuro");
		await page.evaluate(() => document.fonts.ready);
		// Los dos chats del ejemplo: 420 px y 400 px de ancho
		const long = page.locator("[role=log] > div > div").filter({ hasText: "nada de gritar" });
		await expect(long).toHaveCount(2);
		for (const row of await long.all()) {
			const m = await row.evaluate((el) => {
				const group = el.firstElementChild as HTMLElement;
				const badges = [...group.querySelectorAll("[role=img]")].map((b) =>
					b.getBoundingClientRect(),
				);
				const name = group.querySelector(".font-semibold")?.getBoundingClientRect() as DOMRect;
				const line = Number.parseFloat(getComputedStyle(el).lineHeight);
				return {
					count: badges.length,
					tops: badges.map((b) => b.top),
					nameTop: name.top,
					centers: badges.map((b) => b.top + b.height / 2),
					nameCenter: name.top + name.height / 2,
					line,
					rowTop: el.getBoundingClientRect().top,
				};
			});
			expect(m.count).toBe(3);
			// Todo en la primera línea de la fila
			for (const top of [...m.tops, m.nameTop]) expect(top - m.rowTop).toBeLessThan(m.line);
			for (const c of m.centers) expect(Math.abs(c - m.nameCenter)).toBeLessThanOrEqual(1);
		}
	});
});

test.describe("Enlaces en el chat", () => {
	test("se marcan subrayados, sin enlace que pulsar", async ({ page }) => {
		await page.goto("/visual/chat-box/?tema=oscuro");
		const link = page.locator("[role=log] span", { hasText: /^https:\/\/jotis\.me\/clips$/ }).first();
		await expect(link).toBeVisible();
		await expect(link).toHaveCSS("text-decoration-line", "underline");
		await expect(page.locator("[role=log] a")).toHaveCount(0);
	});
});

test.describe("Chat animado en el ejemplo", () => {
	test("Animación apagada: el chat del ejemplo no cambia", async ({ page }) => {
		const pg = await example(page, "/components/chat-box/");
		const before = await rows(pg).allTextContents();
		await page.waitForTimeout(3500);
		expect(await rows(pg).allTextContents()).toEqual(before);
	});

	test("Encender la animación: entra un mensaje nuevo con su entrada, y la ventana no pasa de 8", async ({
		page,
	}) => {
		const pg = await example(page, "/components/chat-box/");
		const n = await rows(pg).count();
		const toggle = (await control(pg, "animate")).getByRole("switch");
		await toggle.locator("xpath=ancestor::label[1]").click();
		await expect(rows(pg)).toHaveCount(n + 1, { timeout: 5000 });
		await expect(rows(pg).last()).toHaveClass(/starting:opacity-0/);
		// El código sigue siendo el del componente, sin el temporizador
		await expect(pg.locator("[data-playground-code]")).toContainText("animate");
		await expect(pg.locator("[data-playground-code]")).not.toContainText("setInterval");
		await expect.poll(() => rows(pg).count(), { timeout: 25_000, intervals: [2500] }).toBe(8);
		await page.waitForTimeout(3000);
		expect(await rows(pg).count()).toBe(8);
	});
});

test.describe("Chat seleccionable en la ficha", () => {
	test("Elegir en la ficha: el pulsado queda elegido y el anterior deja de estarlo", async ({ page }) => {
		const pg = await example(page, "/components/chat-box/");
		const el = await control(pg, "onSelect");
		await el.locator('button:not([aria-label^="Restablecer"])').click();
		await page
			.getByRole("listbox")
			.last()
			.getByRole("option", { name: "Seleccionable", exact: true })
			.click();
		const preview = pg.locator("[data-playground-preview]");
		const first = preview.getByRole("button", { name: /TioBigotes/ });
		const second = preview.getByRole("button", { name: /lucia_pixel/ });
		await first.click();
		await expect(first).toHaveAttribute("aria-pressed", "true");
		await second.click();
		await expect(second).toHaveAttribute("aria-pressed", "true");
		await expect(first).toHaveAttribute("aria-pressed", "false");
		await expect(pg.locator("[data-playground-code]")).toContainText("onSelect");
	});
});

test.describe("StreamPinnedMessage", () => {
	test("Mensaje de 500 caracteres: como mucho cuatro líneas, sin pasar del ancho", async ({ page }) => {
		await page.goto("/visual/stream-pinned-message/?tema=oscuro");
		await page.evaluate(() => document.fonts.ready);
		const card = page.locator("[data-scene], div.rounded-2xl", { hasText: "lucia_88" }).first();
		const width = (await card.boundingBox())?.width;
		const m = await card.evaluate((el) => {
			const p = el.querySelector("p") as HTMLElement;
			const text = p.querySelector(":scope > span:last-child") as HTMLElement;
			text.textContent = "Esto es un mensaje muy largo del chat. ".repeat(13).slice(0, 500);
			return {
				height: p.getBoundingClientRect().height,
				line: Number.parseFloat(getComputedStyle(p).lineHeight),
				length: text.textContent.length,
			};
		});
		expect(m.length).toBe(500);
		expect(m.height).toBeLessThanOrEqual(m.line * 4 + 1);
		expect(m.height).toBeGreaterThan(m.line * 3);
		expect((await card.boundingBox())?.width).toBe(width);
	});
});

test.describe("StreamPoll en el ejemplo interactivo", () => {
	test("el estado de la votación y la ganadora se eligen en desplegables", async ({ page }) => {
		const pg = await example(page, "/components/stream-poll/");
		const pick = async (prop: string, value: string) => {
			const el = await control(pg, prop);
			await el.locator('button:not([aria-label^="Restablecer"])').click();
			await page.getByRole("listbox").last().getByRole("option", { name: value, exact: true }).click();
		};
		await pick("state", "ended");
		await pick("winnerId", "si");
		const preview = pg.locator("[data-playground-preview]");
		await expect(preview).toContainText("Ha ganado Sí");
		await expect(pg.locator("[data-playground-code]")).toContainText('state="ended"');
		await pick("state", "locked");
		await expect(preview).toContainText("Votación cerrada");
	});
});
