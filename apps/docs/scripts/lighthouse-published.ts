// Lighthouse en móvil sobre la web publicada (regula.jotis.me), en claro y en oscuro (tarea 15.3 de
// create-regula-design-system; spec docs-site, «Rendimiento y accesibilidad de la web»). Lo lanza a mano el workflow
// `lighthouse-publicada.yml`.
//
// El tema se fija como lo haría quien visita la web: la elección guardada en `localStorage` («regula-tema»), que el
// script de `<head>` aplica antes de pintar. Chrome corre con un perfil persistente (el mismo almacenamiento para la
// pestaña de Playwright y las de Lighthouse) y Lighthouse no lo borra (`disableStorageReset`). Tras cada página se
// comprueba que el tema seguía puesto: si no, la medida no valdría.
//
// `disableStorageReset` también deja la caché HTTP: sin vaciarla, Lighthouse mide una carga en caliente (fuentes, CSS
// y JS ya descargados) y el rendimiento sale inflado. Antes de cada pasada se vacía por CDP, sin tocar `localStorage`,
// y el resumen anota lo transferido para que se vea que la carga es en frío.
//
// Tres pasadas por página y tema; cuenta la mediana, como Lighthouse CI. Escribe anotaciones de GitHub Actions
// (`::notice::` / `::error::`), que se leen por la API pública, y sale con error si algo baja de 90.
// Uso: bun run scripts/lighthouse-published.ts
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { screenEmulationMetrics, throttling, userAgents } from "lighthouse/core/config/constants.js";

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
		const cdp = await context.newCDPSession(page);
		await page.goto(ORIGIN);
		await page.evaluate((t) => localStorage.setItem("regula-tema", t), theme);
		for (const path of PAGES) {
			const perf: number[] = [];
			const a11y: number[] = [];
			const fcp: number[] = [];
			const lcp: number[] = [];
			let applied = "";
			const transferred: number[] = [];
			for (let run = 0; run < RUNS; run++) {
				await cdp.send("Network.clearBrowserCache");
				const result = await lighthouse(`${ORIGIN}${path}`, {
					port: PORT,
					disableStorageReset: true,
					// Móvil explícito, con las constantes de Lighthouse: no depende de los valores por defecto
					formFactor: "mobile",
					screenEmulation: screenEmulationMetrics.mobile,
					emulatedUserAgent: userAgents.mobile,
					throttlingMethod: "simulate",
					throttling: throttling.mobileSlow4G,
					onlyCategories: ["performance", "accessibility"],
					output: "json",
					logLevel: "error",
				});
				const lhr = result?.lhr;
				const categories = lhr?.categories;
				fcp.push(lhr?.audits["first-contentful-paint"]?.numericValue ?? 0);
				lcp.push(lhr?.audits["largest-contentful-paint"]?.numericValue ?? 0);
				// Lo que Lighthouse dice haber aplicado, para que la medida se pueda comprobar
				const requests =
					(lhr?.audits["network-requests"]?.details as { items?: { transferSize?: number }[] })
						?.items ?? [];
				transferred.push(requests.reduce((n, r) => n + (r.transferSize ?? 0), 0));
				const c = lhr?.configSettings;
				applied = c
					? `${c.formFactor}, ${c.screenEmulation.width}×${c.screenEmulation.height}, ${c.throttlingMethod} (RTT ${c.throttling.rttMs} ms, ${c.throttling.throughputKbps} kbps, CPU ×${c.throttling.cpuSlowdownMultiplier})${lhr?.runWarnings.length ? ` · avisos: ${lhr.runWarnings.join("; ")}` : ""}`
					: "sin informe";
				perf.push(Math.round((categories?.performance?.score ?? 0) * 100));
				a11y.push(Math.round((categories?.accessibility?.score ?? 0) * 100));
			}
			await page.goto(`${ORIGIN}${path}`);
			const dark = await page.evaluate(() => document.documentElement.classList.contains("dark-mode"));
			const themeKept = dark === (theme === "oscuro");
			const [p, a] = [median(perf), median(a11y)];
			const ok = themeKept && p >= MIN && a >= MIN;
			if (!ok) failed++;
			const secs = (v: number) => `${(v / 1000).toFixed(1)} s`;
			const text = `rendimiento ${p}, accesibilidad ${a} (pasadas: ${perf.map((v, i) => `${v}/${a11y[i]}`).join(" ")}) · FCP ${secs(median(fcp))}, LCP ${secs(median(lcp))}, ${Math.round(median(transferred) / 1024)} KB transferidos · ${applied}${themeKept ? "" : " · el tema no se conservó: medida no válida"}`;
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
