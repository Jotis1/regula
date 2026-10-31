import { expect, test } from "@playwright/test";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "../src/Icon.js";

const html = `<!doctype html><body style="color:#4f39f6">${renderToStaticMarkup(<Icon name="loading-02" spin />)}</body>`;
const animation = () => getComputedStyle(document.querySelector("svg") as Element).animationName;

test("el icono con spin gira", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.setContent(html);
	expect(await page.evaluate(animation)).toBe("jm-icon-spin");
});

test("con movimiento reducido no gira", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.setContent(html);
	expect(await page.evaluate(animation)).toBe("none");
});

test("el trazo toma el color del contenedor", async ({ page }) => {
	await page.setContent(html);
	expect(await page.evaluate(() => getComputedStyle(document.querySelector("svg") as Element).stroke)).toBe(
		"rgb(79, 57, 246)",
	);
});
