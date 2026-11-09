import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { afterAll, describe, expect, it } from "vitest";
import { limitOf, overBudget, weighPage, weighSite } from "../scripts/js-weight";

const script = fileURLToPath(new URL("../scripts/js-weight.ts", import.meta.url));

const dist = mkdtempSync(join(tmpdir(), "js-weight-"));
afterAll(() => rmSync(dist, { recursive: true, force: true }));

const write = (path: string, text: string) => {
	mkdirSync(join(dist, path, ".."), { recursive: true });
	writeFileSync(join(dist, path), text);
};
const gz = (text: string) => gzipSync(Buffer.from(text)).length;

// Isla `Menu` que importa un chunk compartido y, por import dinámico, otro que solo se pide a demanda.
const menu = 'import{a}from"./shared.js";export default a;';
const shared = `export const a=1;${"x".repeat(2000)}`;
const lazy = `export const b=2;${"y".repeat(3000)}`;
write("_astro/Menu.js", `${menu}import("./lazy.js");`);
write("_astro/shared.js", shared);
write("_astro/lazy.js", lazy);
write("_astro/client.js", "export const c=1;");
write(
	"index.html",
	`<html><script type="module" src="/_astro/client.js"></script>
<astro-island component-url="/_astro/Menu.js" renderer-url="/_astro/client.js" opts="{&quot;name&quot;:&quot;Menu&quot;,&quot;value&quot;:true}"></astro-island></html>`,
);
write("components/button/index.html", "<html><body>sin JS</body></html>");

describe("js-weight", () => {
	it("suma las entradas y sus imports estáticos, y deja aparte los dinámicos", () => {
		const home = weighPage(dist, "index.html");
		expect(home.page).toBe("/");
		expect(home.islands).toEqual(["Menu"]);
		expect(
			home.files
				.filter((f) => f.kind === "static")
				.map((f) => f.url)
				.sort(),
		).toEqual(["/_astro/Menu.js", "/_astro/client.js", "/_astro/shared.js"]);
		expect(home.dynamic.raw).toBe(lazy.length);
		expect(home.static.files).toBe(3);
	});

	it("cuenta el gzip de cada archivo", () => {
		const home = weighPage(dist, "index.html");
		const expected = gz(`${menu}import("./lazy.js");`) + gz(shared) + gz("export const c=1;");
		expect(home.static.gz).toBe(expected);
		expect(home.dynamic.gz).toBe(gz(lazy));
	});

	it("un archivo que ya es estático no se cuenta otra vez como dinámico", () => {
		write("_astro/Both.js", 'import{a}from"./shared.js";import("./shared.js");');
		write("both/index.html", '<script src="/_astro/Both.js"></script>');
		const page = weighPage(dist, "both/index.html");
		expect(page.dynamic.raw).toBe(0);
		expect(page.files.find((f) => f.url === "/_astro/shared.js")?.kind).toBe("static");
	});

	it("el límite es el de la ruta exacta, si no el del patrón, si no el de por defecto", () => {
		const budget = { default: 10, pages: { "/": 30, "/components/*/": 50 } };
		expect(limitOf(budget, "/")).toBe(30 * 1024);
		expect(limitOf(budget, "/components/button/")).toBe(50 * 1024);
		// `*` es un segmento: no encaja con el índice ni con rutas más hondas
		expect(limitOf(budget, "/components/")).toBe(10 * 1024);
		expect(limitOf(budget, "/components/button/full/")).toBe(10 * 1024);
	});

	it("check:js falla con la página, su peso y su límite cuando una se pasa", () => {
		const budgetFile = join(dist, "budget.json");
		writeFileSync(budgetFile, JSON.stringify({ default: 1000, pages: { "/": 0.001 } }));
		expect(
			overBudget(weighSite(dist), { default: 1000, pages: { "/": 0.001 } }).map((o) => o.page),
		).toEqual(["/"]);
		const run = spawnSync("bun", ["run", script, dist, budgetFile], { encoding: "utf8" });
		expect(run.status).toBe(1);
		expect(run.stderr).toMatch(/\/: \d+\.\d kB gzip, límite 0\.0 kB/);
		writeFileSync(budgetFile, JSON.stringify({ default: 1000, pages: {} }));
		expect(spawnSync("bun", ["run", script, dist, budgetFile], { encoding: "utf8" }).status).toBe(0);
	});

	it("una página sin JS pesa cero y todas salen en la lista del sitio", () => {
		const pages = weighSite(dist);
		expect(pages.map((p) => p.page)).toEqual(["/", "/both/", "/components/button/"]);
		expect(pages.find((p) => p.page === "/components/button/")?.static).toEqual({
			raw: 0,
			gz: 0,
			files: 0,
		});
	});
});
