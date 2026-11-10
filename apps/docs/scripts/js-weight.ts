// Mide el JavaScript que descarga cada página de `dist`: los `<script src>`, las islas de Astro (`component-url`,
// `renderer-url`) y los scripts en línea con `import`, más todo lo que importan de forma estática. Los imports
// dinámicos se cuentan aparte: no se descargan al cargar la página. Falla si una página pasa de su límite de
// `js-budget.json`. Uso: bun run scripts/js-weight.ts [dist] [js-budget.json]
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { gzipSync } from "node:zlib";
import { EXAMPLE_FILES } from "../src/visual/example-files.ts";

export interface Size {
	raw: number;
	gz: number;
}

export interface PageWeight {
	/** Ruta de la página, `/` o `/components/button/`. */
	page: string;
	islands: string[];
	/** Lo que se descarga al cargar. */
	static: Size & { files: number };
	/** Lo que solo se descarga si algo lo pide. */
	dynamic: Size;
	/** Cada archivo con su peso y si es estático o dinámico, el mayor primero. */
	files: { url: string; kind: "static" | "dynamic"; raw: number; gz: number }[];
}

const sizeOf = (file: string): Size => {
	const buf = readFileSync(file);
	return { raw: buf.length, gz: gzipSync(buf).length };
};

/** Archivos que carga una página, siguiendo sus imports. */
function follow(dist: string, entries: Iterable<string>) {
	const seen = new Map<string, "static" | "dynamic">();
	const visit = (url: string, kind: "static" | "dynamic") => {
		const prev = seen.get(url);
		if (prev === "static" || prev === kind) return;
		const file = join(dist, url);
		if (!existsSync(file)) return;
		seen.set(url, kind);
		const src = readFileSync(file, "utf8");
		const resolve = (spec: string) => posix.normalize(posix.join(posix.dirname(url), spec));
		for (const m of src.matchAll(
			/(?:import|export)\s*(?:[\w*{}\s,$]*from\s*)?["'](\.{1,2}\/[^"']+\.js)["']/g,
		))
			visit(resolve(m[1] as string), kind);
		for (const m of src.matchAll(/import\(\s*["'](\.{1,2}\/[^"']+\.js)["']\s*\)/g))
			visit(resolve(m[1] as string), "dynamic");
	};
	for (const e of entries) visit(e, "static");
	return seen;
}

/** Trozos de `src/visual/examples/` que pedirán las islas VisualExample de la página, según el `name` de cada una. */
export function exampleChunks(dist: string, html: string): string[] {
	const out: string[] = [];
	for (const m of html.matchAll(
		/component-url="([^"]*\/VisualExample\.[^"]+\.js)"[^>]*\bprops="([^"]+)"/g,
	)) {
		const props = JSON.parse((m[2] as string).replaceAll("&quot;", '"')) as { name?: [number, string] };
		const file = props.name ? EXAMPLE_FILES[props.name[1]] : undefined;
		if (!file) continue;
		const url = m[1] as string;
		const src = readFileSync(join(dist, url), "utf8");
		const chunk = src.match(
			new RegExp(`examples/${file}\\.tsx["']:\\s*\\(\\)\\s*=>[^\`"']*[\`"'](\\.{1,2}/[^\`"']+\\.js)`),
		);
		if (!chunk) throw new Error(`No encuentro el trozo de examples/${file}.tsx en ${url}`);
		out.push(posix.normalize(posix.join(posix.dirname(url), chunk[1] as string)));
	}
	return out;
}

export function weighPage(dist: string, htmlFile: string): PageWeight {
	const html = readFileSync(join(dist, htmlFile), "utf8");
	const entries = new Set<string>();
	for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+\.js)"/g)) entries.add(m[1] as string);
	for (const m of html.matchAll(/(?:component|renderer)-url="([^"]+\.js)"/g)) entries.add(m[1] as string);
	for (const m of html.matchAll(/import\s*["'](\/[^"']+\.js)["']/g)) entries.add(m[1] as string);
	// La isla VisualExample carga después el fichero de ejemplos de su componente (design D11): ese trozo también lo
	// descarga la página, así que cuenta como suyo
	for (const url of exampleChunks(dist, html)) entries.add(url);
	const islands = [...html.matchAll(/<astro-island[^>]*\bopts="([^"]+)"/g)].map(
		(m) => (JSON.parse((m[1] as string).replaceAll("&quot;", '"')) as { name: string }).name,
	);
	const files: PageWeight["files"] = [];
	const total = { static: { raw: 0, gz: 0, files: 0 }, dynamic: { raw: 0, gz: 0 } };
	for (const [url, kind] of follow(dist, entries)) {
		const s = sizeOf(join(dist, url));
		files.push({ url, kind, ...s });
		total[kind].raw += s.raw;
		total[kind].gz += s.gz;
		if (kind === "static") total.static.files++;
	}
	files.sort((a, b) => b.gz - a.gz);
	const page = `/${htmlFile.replace(/index\.html$/, "")}`;
	return { page, islands, static: total.static, dynamic: total.dynamic, files };
}

/** Todas las páginas HTML de `dist` (sin `/visual/`, que es la comparación con la guía, ni el 404). */
export function weighSite(dist: string): PageWeight[] {
	const pages: string[] = [];
	const walk = (dir: string) => {
		for (const e of readdirSync(join(dist, dir), { withFileTypes: true })) {
			const rel = posix.join(dir, e.name);
			if (e.isDirectory()) walk(rel);
			else if (e.name === "index.html") pages.push(rel);
		}
	};
	walk("");
	return pages.map((p) => weighPage(dist, p)).sort((a, b) => a.page.localeCompare(b.page));
}

export interface Budget {
	/** kB gzip de cualquier página sin entrada propia. */
	default: number;
	/** Ruta exacta o con `*` por segmento → kB gzip. */
	pages: Record<string, number>;
}

/** Límite de una página en bytes: la ruta exacta, si no el primer patrón que encaje, si no el de por defecto. */
export function limitOf(budget: Budget, page: string): number {
	const exact = budget.pages[page];
	if (exact !== undefined) return exact * 1024;
	for (const [pattern, limit] of Object.entries(budget.pages)) {
		if (!pattern.includes("*")) continue;
		const re = new RegExp(
			`^${pattern
				.split("*")
				.map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
				.join("[^/]+")}$`,
		);
		if (re.test(page)) return limit * 1024;
	}
	return budget.default * 1024;
}

/** Páginas que se pasan de su límite. */
export function overBudget(pages: PageWeight[], budget: Budget) {
	return pages
		.map((p) => ({ page: p.page, gz: p.static.gz, limit: limitOf(budget, p.page) }))
		.filter((p) => p.gz > p.limit);
}

const kb = (n: number) => `${(n / 1024).toFixed(1)} kB`;

function main() {
	const dist = process.argv[2] ?? join(import.meta.dirname, "../dist");
	const budgetFile = process.argv[3] ?? join(import.meta.dirname, "../js-budget.json");
	const budget = JSON.parse(readFileSync(budgetFile, "utf8")) as Budget;
	const pages = weighSite(dist);
	const heaviest = [...pages].sort((a, b) => b.static.gz - a.static.gz).slice(0, 8);
	console.log(`${pages.length} páginas. JS estático (gzip) de las más pesadas:`);
	for (const p of heaviest)
		console.log(`  ${kb(p.static.gz).padStart(9)}  ${p.page}  (${p.islands.length} islas)`);
	for (const p of pages.filter((x) => ["/", "/components/"].includes(x.page))) {
		console.log(
			`\n${p.page}: ${kb(p.static.gz)} gzip, ${kb(p.static.raw)} sin comprimir, ${p.static.files} archivos`,
		);
		for (const f of p.files.slice(0, 6)) console.log(`  ${kb(f.gz).padStart(9)}  ${f.kind}  ${f.url}`);
	}
	const over = overBudget(pages, budget);
	if (!over.length) {
		console.log(`\nTodas las páginas dentro de su límite (js-budget.json).`);
		return;
	}
	console.error(`\n${over.length} página(s) por encima de su límite de JS (js-budget.json):`);
	for (const o of over) console.error(`  ${o.page}: ${kb(o.gz)} gzip, límite ${kb(o.limit)}`);
	process.exitCode = 1;
}

if (process.argv[1]?.endsWith("js-weight.ts")) main();
