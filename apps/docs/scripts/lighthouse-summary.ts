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
	console.log(`::${level} title=Lighthouse ${path}::${text}`);
}
