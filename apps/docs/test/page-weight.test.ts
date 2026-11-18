import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { afterAll, describe, expect, it } from "vitest";
import { limitOf, overBudget, weighPage, weighSite } from "../scripts/page-weight";

const script = fileURLToPath(new URL("../scripts/page-weight.ts", import.meta.url));

const dist = mkdtempSync(join(tmpdir(), "page-weight-"));
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

// Isla VisualExample (design D11): pide a demanda el fichero de ejemplos de su componente y no los demás
const visual =
	'const f={"./examples/display.tsx":()=>d(()=>import(`./display.js`)),"./examples/forms.tsx":()=>d(()=>import(`./forms.js`))};';
const display = `import{a}from"./shared.js";export const AvatarExample=a;${"z".repeat(1000)}`;
// En su propio dist, para no cambiar la lista de páginas del resto de tests
const distVisual = mkdtempSync(join(tmpdir(), "page-weight-visual-"));
afterAll(() => rmSync(distVisual, { recursive: true, force: true }));
const writeVisual = (path: string, text: string) => {
	mkdirSync(join(distVisual, path, ".."), { recursive: true });
	writeFileSync(join(distVisual, path), text);
};
writeVisual("_astro/VisualExample.abc.js", visual);
writeVisual("_astro/display.js", display);
writeVisual("_astro/shared.js", shared);
writeVisual("_astro/forms.js", `export const InputExample=1;${"w".repeat(5000)}`);
writeVisual(
	"components/avatar/index.html",
	`<html><astro-island component-url="/_astro/VisualExample.abc.js" renderer-url="/_astro/client.js" props="{&quot;slot&quot;:[0,&quot;examples&quot;],&quot;name&quot;:[0,&quot;Avatar&quot;]}" opts="{&quot;name&quot;:&quot;VisualExample&quot;}"></astro-island></html>`,
);

// A page with two style sheets, one of them linked twice, and a page with none: for the HTML and CSS weight
const distStyles = mkdtempSync(join(tmpdir(), "page-weight-styles-"));
afterAll(() => rmSync(distStyles, { recursive: true, force: true }));
const writeStyles = (path: string, text: string) => {
	mkdirSync(join(distStyles, path, ".."), { recursive: true });
	writeFileSync(join(distStyles, path), text);
};
const sheet = `.a{color:red}${".b{margin:0}".repeat(300)}`;
const print = "@media print{.a{display:none}}";
const styledHtml = `<html><head><link rel="stylesheet" href="/_astro/global.css"><link href="/_astro/print.css" rel="stylesheet"><link rel="stylesheet" href="/_astro/global.css"><link rel="icon" href="/icon.css"></head><body>${"<p>x</p>".repeat(200)}</body></html>`;
writeStyles("_astro/global.css", sheet);
writeStyles("_astro/print.css", print);
writeStyles("index.html", styledHtml);
writeStyles("plain/index.html", "<html><body>sin hojas</body></html>");

/** Budgets no page of the fixtures reaches. */
const ROOMY = {
	js: { default: 1000, pages: {} },
	css: { default: 1000, pages: {} },
	html: { default: 1000, pages: {} },
};

describe("page-weight", () => {
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

	it("check:weight falla con la página, su peso y su límite cuando una se pasa de JS", () => {
		const budgetFile = join(dist, "budget.json");
		const tight = { ...ROOMY, js: { default: 1000, pages: { "/": 0.001 } } };
		writeFileSync(budgetFile, JSON.stringify(tight));
		expect(overBudget(weighSite(dist), tight).map((o) => [o.page, o.kind])).toEqual([["/", "js"]]);
		const run = spawnSync("bun", ["run", script, dist, budgetFile], { encoding: "utf8" });
		expect(run.status).toBe(1);
		expect(run.stderr).toMatch(/\/: JS \d+\.\d kB gzip, límite 0\.0 kB/);
		writeFileSync(budgetFile, JSON.stringify(ROOMY));
		expect(spawnSync("bun", ["run", script, dist, budgetFile], { encoding: "utf8" }).status).toBe(0);
	});

	it("mide el HTML de la página y el CSS de las hojas que enlaza, una vez cada una", () => {
		const page = weighPage(distStyles, "index.html");
		expect(page.html.gz).toBe(gz(styledHtml));
		expect(page.css).toEqual({ raw: sheet.length + print.length, gz: gz(sheet) + gz(print), files: 2 });
		// Una página sin hojas no pesa nada de CSS
		expect(weighPage(distStyles, "plain/index.html").css).toEqual({ raw: 0, gz: 0, files: 0 });
	});

	it("check:weight falla cuando el HTML o el CSS de una página pasan de su límite, y dice de cuál", () => {
		const pages = weighSite(distStyles);
		expect(overBudget(pages, ROOMY)).toEqual([]);
		const tightCss = { ...ROOMY, css: { default: 1000, pages: { "/": 0.001 } } };
		expect(overBudget(pages, tightCss)).toEqual([
			{ page: "/", kind: "css", gz: gz(sheet) + gz(print), limit: 0.001 * 1024 },
		]);
		const tightHtml = { ...ROOMY, html: { default: 0.001, pages: { "/": 1000 } } };
		expect(overBudget(pages, tightHtml).map((o) => [o.page, o.kind])).toEqual([["/plain/", "html"]]);
		const budgetFile = join(distStyles, "budget.json");
		writeFileSync(budgetFile, JSON.stringify(tightCss));
		const run = spawnSync("bun", ["run", script, distStyles, budgetFile], { encoding: "utf8" });
		expect(run.status).toBe(1);
		expect(run.stderr).toMatch(/\/: CSS \d+\.\d kB gzip, límite 0\.0 kB/);
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

	it("cuenta como de la página el fichero de ejemplos que pide su VisualExample, y solo ese", () => {
		const avatar = weighPage(distVisual, "components/avatar/index.html");
		const urls = avatar.files.filter((f) => f.kind === "static").map((f) => f.url);
		expect(urls).toContain("/_astro/display.js");
		expect(urls).toContain("/_astro/shared.js");
		expect(urls).not.toContain("/_astro/forms.js");
	});
});
