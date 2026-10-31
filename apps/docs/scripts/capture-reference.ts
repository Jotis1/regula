// Captura una vez las vistas previas de la guía, en claro y en oscuro, como referencia de la paridad visual.
// Las capturas se versionan en e2e/visual/reference/. Uso: bun run scripts/capture-reference.ts [Nombre…]
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { REFERENCE_DIR, referencePath, VIEWPORT_WIDTH } from "../e2e/visual/compare.ts";
import { cardHeight, openReference, previewNames } from "../e2e/visual/reference.ts";

const names = process.argv.slice(2).length ? process.argv.slice(2) : previewNames();
mkdirSync(REFERENCE_DIR, { recursive: true });
const browser = await chromium.launch();
for (const name of names) {
	for (const theme of ["light", "dark"] as const) {
		const page = await browser.newPage({
			viewport: { width: VIEWPORT_WIDTH, height: cardHeight(name) },
			reducedMotion: "reduce",
		});
		await openReference(page, name, theme === "dark");
		writeFileSync(
			referencePath(name, theme),
			await page.screenshot({ animations: "disabled", caret: "hide" }),
		);
		await page.close();
	}
	console.log(`${name}: claro y oscuro`);
}
await browser.close();
console.log(`${names.length} componentes → e2e/visual/reference/`);
