// Resumen de Lighthouse CI como anotaciones de GitHub Actions (`::notice::` / `::error::`): se ven en la página de
// la ejecución y se leen por la API pública sin descargar logs. Si no hay informes (Lighthouse no arrancó), anota
// el final de su salida. Uso (en CI, tras `bun run test:lighthouse`): bun run scripts/lighthouse-summary.ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "../.lighthouseci");
const manifestPath = join(dir, "reports/manifest.json");
const MIN = 0.9;
// Las anotaciones van en una línea: los saltos se escriben como %0A.
const esc = (s: string) => s.replaceAll("%", "%25").replaceAll("\r", "").replaceAll("\n", "%0A");

interface Run {
	url: string;
	isRepresentativeRun: boolean;
	summary: Record<string, number>;
	jsonPath: string;
}

interface Audit {
	numericValue?: number;
	score: number | null;
	title: string;
	details?: { type?: string; overallSavingsMs?: number };
}

// Métricas que pesan en la nota de rendimiento y lo que Lighthouse dice que más se ahorraría.
const METRICS: [string, string, (v: number) => string][] = [
	["first-contentful-paint", "FCP", (v) => `${(v / 1000).toFixed(1)} s`],
	["largest-contentful-paint", "LCP", (v) => `${(v / 1000).toFixed(1)} s`],
	["total-blocking-time", "TBT", (v) => `${Math.round(v)} ms`],
	["cumulative-layout-shift", "CLS", (v) => v.toFixed(3)],
	["speed-index", "SI", (v) => `${(v / 1000).toFixed(1)} s`],
];

function details(jsonPath: string): string {
	const lhr = JSON.parse(readFileSync(jsonPath, "utf8")) as { audits: Record<string, Audit> };
	const metrics = METRICS.map(([id, label, fmt]) => {
		const a = lhr.audits[id];
		return a?.numericValue == null
			? null
			: `${label} ${fmt(a.numericValue)} (${Math.round((a.score ?? 0) * 100)})`;
	}).filter(Boolean);
	const savings = Object.values(lhr.audits)
		.filter((a) => (a.details?.overallSavingsMs ?? 0) > 0)
		.sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
		.slice(0, 4)
		.map((a) => `${a.title}: ${Math.round(a.details?.overallSavingsMs ?? 0)} ms`);
	return `
${metrics.join(" · ")}${
	savings.length
		? `
Ahorros: ${savings.join("; ")}`
		: ""
}`;
}

if (!existsSync(manifestPath)) {
	const log = existsSync(join(dir, "run.log"))
		? readFileSync(join(dir, "run.log"), "utf8")
		: "(sin salida)";
	const tail = log.trim().split("\n").slice(-25).join("\n");
	console.log(`::error title=Lighthouse sin informes::${esc(tail)}`);
	process.exit(0);
}

const runs = JSON.parse(readFileSync(manifestPath, "utf8")) as Run[];
for (const run of runs.filter((r) => r.isRepresentativeRun)) {
	const path = new URL(run.url).pathname;
	const perf = run.summary.performance ?? 0;
	const a11y = run.summary.accessibility ?? 0;
	const level = perf >= MIN && a11y >= MIN ? "notice" : "error";
	const text = `rendimiento ${Math.round(perf * 100)}, accesibilidad ${Math.round(a11y * 100)}`;
	const more = existsSync(run.jsonPath) ? details(run.jsonPath) : "";
	console.log(`::${level} title=Lighthouse ${path}::${esc(text + more)}`);
}
