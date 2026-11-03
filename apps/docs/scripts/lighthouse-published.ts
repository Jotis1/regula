// Lighthouse en móvil sobre la web publicada (regula.jotis.me), en claro y en oscuro (tarea 15.3 de
// create-regula-design-system; spec docs-site, «Rendimiento y accesibilidad de la web»). Lo lanza a mano el workflow
// `lighthouse-publicada.yml`.
//
// El tema se fija como lo haría quien visita la web: la elección guardada en `localStorage` («regula-tema»), que el
// script de `<head>` aplica antes de pintar. Chrome corre con un perfil persistente (el mismo almacenamiento para la
// pestaña de Playwright y las de Lighthouse) y Lighthouse no lo borra (`disableStorageReset`). Tras cada página se
// comprueba que el tema seguía puesto: si no, la medida no valdría.
//
// Tres pasadas por página y tema; cuenta la mediana, como Lighthouse CI. Escribe anotaciones de GitHub Actions
// (`::notice::` / `::error::`), que se leen por la API pública, y sale con error si algo baja de 90.
// Uso: bun run scripts/lighthouse-published.ts
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";

const ORIGIN = "https://regula.jotis.me";
const PAGES = ["/", "/foundations/color/", "/components/button/"];
const THEMES = ["claro", "oscuro"] as const;
const RUNS = 3;
const MIN = 90;
const PORT = 9333;

const context = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), "lh-regula-")), {
	// El Chrome instalado en el runner, como Lighthouse CI
	channel: "chrome",
	headless: true,
	args: [`--remote-debugging-port=${PORT}`],
});
const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 0;

let failed = 0;
try {
	for (const theme of THEMES) {
		const page = await context.newPage();
		await page.goto(ORIGIN);
		await page.evaluate((t) => localStorage.setItem("regula-tema", t), theme);
		for (const path of PAGES) {
			const perf: number[] = [];
			const a11y: number[] = [];
			for (let run = 0; run < RUNS; run++) {
				const result = await lighthouse(`${ORIGIN}${path}`, {
					port: PORT,
					disableStorageReset: true,
					onlyCategories: ["performance", "accessibility"],
					output: "json",
					logLevel: "error",
				});
				const categories = result?.lhr.categories;
				perf.push(Math.round((categories?.performance?.score ?? 0) * 100));
				a11y.push(Math.round((categories?.accessibility?.score ?? 0) * 100));
			}
			await page.goto(`${ORIGIN}${path}`);
			const dark = await page.evaluate(() => document.documentElement.classList.contains("dark-mode"));
			const themeKept = dark === (theme === "oscuro");
			const [p, a] = [median(perf), median(a11y)];
			const ok = themeKept && p >= MIN && a >= MIN;
			if (!ok) failed++;
			const text = `rendimiento ${p}, accesibilidad ${a} (pasadas: ${perf.map((v, i) => `${v}/${a11y[i]}`).join(" ")})${themeKept ? "" : " · el tema no se conservó: medida no válida"}`;
			console.log(`::${ok ? "notice" : "error"} title=Lighthouse ${path} (${theme})::${text}`);
		}
		await page.close();
	}
} finally {
	await context.close();
}
if (failed) {
	console.log(
		`::error title=Lighthouse en la web publicada::${failed} medidas por debajo de ${MIN} o sin su tema`,
	);
	process.exit(1);
}
