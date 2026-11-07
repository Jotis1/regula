// Mide una página de la web construida y servida con `astro preview` (puerto 4321 por defecto), con el Chromium de
// Playwright por CDP. Sirve donde Lighthouse no se puede ejecutar. Emula un móvil (412×823, CPU a 4× y red 4G lenta)
// y da la mediana de varias pasadas: peso del HTML y de todo lo que se pide al cargar, nodos del DOM y tiempos de
// maquetación, de estilos, de scripts y de tareas.
// Uso: bun run scripts/measure-page.ts <ruta> [--runs=5] [--port=4321] [--scroll]
//   --scroll recorre la página entera antes de medir el peso, para contar también lo que carga en perezoso.
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const path = args.find((a) => a.startsWith("/")) ?? "/components/";
const flag = (name: string, fallback: string) =>
	args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const runs = Number(flag("runs", "5"));
const port = flag("port", "4321");
const scroll = args.includes("--scroll");

interface Sample {
	htmlBytes: number;
	requests: number;
	transferBytes: number;
	nodes: number;
	layoutMs: number;
	styleMs: number;
	scriptMs: number;
	taskMs: number;
}

const median = (values: number[]) => {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = sorted.length >> 1;
	return sorted.length % 2
		? (sorted[mid] as number)
		: ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
};

async function once(browser: Awaited<ReturnType<typeof chromium.launch>>): Promise<Sample> {
	const context = await browser.newContext({
		viewport: { width: 412, height: 823 },
		deviceScaleFactor: 1.75,
		isMobile: true,
		hasTouch: true,
	});
	const page = await context.newPage();
	const cdp = await context.newCDPSession(page);
	await cdp.send("Network.enable");
	await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
	await cdp.send("Network.emulateNetworkConditions", {
		offline: false,
		latency: 150,
		downloadThroughput: (1.6 * 1024 * 1024) / 8,
		uploadThroughput: (750 * 1024) / 8,
	});
	await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
	await cdp.send("Performance.enable");
	let transferBytes = 0;
	let requests = 0;
	let htmlBytes = 0;
	const documentIds = new Set<string>();
	cdp.on("Network.requestWillBeSent", (e: { requestId: string; type?: string }) => {
		requests++;
		if (e.type === "Document") documentIds.add(e.requestId);
	});
	cdp.on("Network.loadingFinished", (e: { requestId: string; encodedDataLength: number }) => {
		transferBytes += e.encodedDataLength;
		if (documentIds.has(e.requestId)) htmlBytes = e.encodedDataLength;
	});
	await page.goto(`http://localhost:${port}${path}`, { waitUntil: "networkidle" });
	if (scroll) {
		await page.evaluate(async () => {
			for (let y = 0; y < document.body.scrollHeight; y += 600) {
				window.scrollTo(0, y);
				await new Promise((r) => setTimeout(r, 60));
			}
		});
		await page.waitForLoadState("networkidle");
	}
	const metrics = Object.fromEntries(
		(
			(await cdp.send("Performance.getMetrics")) as { metrics: { name: string; value: number }[] }
		).metrics.map((m) => [m.name, m.value]),
	) as Record<string, number>;
	await context.close();
	return {
		htmlBytes,
		requests,
		transferBytes,
		nodes: metrics.Nodes ?? 0,
		layoutMs: (metrics.LayoutDuration ?? 0) * 1000,
		styleMs: (metrics.RecalcStyleDuration ?? 0) * 1000,
		scriptMs: (metrics.ScriptDuration ?? 0) * 1000,
		taskMs: (metrics.TaskDuration ?? 0) * 1000,
	};
}

const browser = await chromium.launch();
const samples: Sample[] = [];
for (let i = 0; i < runs; i++) samples.push(await once(browser));
await browser.close();

const pick = (key: keyof Sample) => median(samples.map((s) => s[key]));
const kb = (n: number) => `${(n / 1024).toFixed(1)} kB`;
const ms = (n: number) => `${n.toFixed(0)} ms`;
console.log(`${path}  (mediana de ${runs} pasadas${scroll ? ", con scroll" : ""})`);
console.log(`  HTML (transferido)      ${kb(pick("htmlBytes"))}`);
console.log(`  Peticiones              ${pick("requests")}`);
console.log(`  Transferido en total    ${kb(pick("transferBytes"))}`);
console.log(`  Nodos del DOM           ${pick("nodes")}`);
console.log(`  Maquetación             ${ms(pick("layoutMs"))}`);
console.log(`  Cálculo de estilos      ${ms(pick("styleMs"))}`);
console.log(`  Scripts                 ${ms(pick("scriptMs"))}`);
console.log(`  Tareas (total)          ${ms(pick("taskMs"))}`);
