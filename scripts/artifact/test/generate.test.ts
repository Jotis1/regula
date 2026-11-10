// Generador del artefacto (design D6) sin navegador: estructura, límites del tipo, tokens, fichas, índice y tipos.
// Se genera una vez, con la red bloqueada: cualquier intento de conexión queda anotado y falla.
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import tls from "node:tls";
import { iconNames } from "@jotis-me/icons";
import * as react from "@jotis-me/react";
import { catalogComponents, slugOf } from "../../../apps/docs/src/lib/catalog";
import { componentReadme } from "../src/content";
import { generate, LIMITS, type Manifest } from "../src/generate";
import { mdxToMarkdown } from "../src/guide";
import { REACT, TOKENS } from "../src/paths";

const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const DATE = "2026-11-06T00:00:00Z";
let out = "";
let manifest: Manifest;
const network: string[] = [];
const file = (path: string) => readFileSync(join(out, "project", path));
const text = (path: string) => file(path).toString("utf8");
const catalog = [...catalogComponents()].sort();

beforeAll(async () => {
	out = mkdtempSync(join(tmpdir(), "artefacto-"));
	const original = { fetch: globalThis.fetch, connect: net.Socket.prototype.connect, tls: tls.connect };
	const block = (what: string) => {
		network.push(what);
		throw new Error(`Red bloqueada en el test del generador: ${what}`);
	};
	globalThis.fetch = ((input: unknown) => block(`fetch ${String(input)}`)) as unknown as typeof fetch;
	net.Socket.prototype.connect = (() => block("net.connect")) as typeof net.Socket.prototype.connect;
	(tls as { connect: unknown }).connect = () => block("tls.connect");
	try {
		manifest = await generate({ out, commit: COMMIT, branch: "main", date: DATE });
	} finally {
		globalThis.fetch = original.fetch;
		net.Socket.prototype.connect = original.connect;
		(tls as { connect: unknown }).connect = original.tls;
	}
}, 300_000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

describe("generación", () => {
	it("corre sin red", () => {
		expect(network).toEqual([]);
	});

	it("escribe project/ y manifest.json con el sha256 de cada fichero", () => {
		const written = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8")) as Manifest;
		expect(written.commit).toBe(COMMIT);
		for (const f of written.files.slice(0, 20)) {
			const data = readFileSync(join(out, f.path));
			expect(new Bun.CryptoHasher("sha256").update(data).digest("hex"), f.path).toBe(f.sha256);
		}
	});
});

describe("catálogo", () => {
	it("el bundle declara la lista del catálogo, que es la de @jotis-me/react", () => {
		const header = text("components/bundle.js").split("\n")[0] as string;
		const meta = JSON.parse(header.replace(/^\/\* @ds-bundle: /, "").replace(/ \*\/$/, ""));
		expect(meta.namespace).toBe("Jotis");
		expect(meta.components.map((c: { name: string }) => c.name).sort()).toEqual(catalog);
		const exported = Object.entries(react)
			.filter(
				([n, v]) =>
					/^[A-Z]/.test(n) && (typeof v === "function" || (typeof v === "object" && v !== null)),
			)
			.map(([n]) => n)
			.sort();
		expect(exported).toEqual(catalog);
	});

	it("cada componente tiene README.md y preview.html, y no hay ninguno más", () => {
		const dirs = readdirSync(join(out, "project/components"), { withFileTypes: true })
			.filter((d) => d.isDirectory() && !["Cover", "lib"].includes(d.name))
			.map((d) => d.name)
			.sort();
		expect(dirs).toEqual(catalog);
		for (const name of catalog) {
			expect(existsSync(join(out, "project/components", name, "README.md")), name).toBe(true);
			expect(existsSync(join(out, "project/components", name, "preview.html")), name).toBe(true);
		}
	});

	it("la ficha es la de la web: su descripción y cada párrafo de su página, sin cambios", () => {
		for (const name of catalog) {
			const page = readFileSync(
				join(import.meta.dirname, "../../../apps/docs/src/content/components", `${slugOf(name)}.md`),
				"utf8",
			).replace(/\r\n/g, "\n");
			const readme = text(`components/${name}/README.md`);
			expect(readme).toBe(componentReadme(name));
			const body = page.slice(page.indexOf("\n---\n", 4) + 5);
			for (const p of body
				.split(/\n\s*\n/)
				.map((x) => x.trim())
				.filter(Boolean))
				expect(readme, name).toContain(p);
		}
	});

	it("la vista previa declara grupo y alto, y monta el ejemplo del registro", () => {
		const button = text("components/Button/preview.html");
		expect(button.split("\n")[0]).toBe('<!-- @dsCard group="Acciones" height=220 -->');
		expect(button).toContain('window.Jotis.previews["Button"]');
		expect(text("components/StreamAlert/preview.html").split("\n")[0]).toMatch(
			/group="Stream · Alertas"/,
		);
		expect(text("components/StreamAlert/preview.html")).toContain('setAttribute("data-theme", "dark")');
		expect(button).not.toContain("data-theme");
	});
});

describe("límites del tipo", () => {
	it("ningún fichero pasa de 15 MiB y el total queda por debajo de 1.008", () => {
		for (const f of manifest.files) expect(f.size, f.path).toBeLessThanOrEqual(LIMITS.fileBytes);
		expect(manifest.files.length + manifest.assets.length).toBeLessThan(LIMITS.files);
	});

	it("la hoja mantiene .jm-root de la guía, para los diseños que envuelven con esa clase", () => {
		const sheet = text("components/bundle.css");
		expect(sheet).toContain(".jm-root, .jm-root * { box-sizing: border-box; }");
		expect(sheet).toContain(".jm-root { font-family: var(--font-body); color: var(--text-primary);");
		expect(text("README.md")).toContain("clase `jm-root`");
	});

	it("el bundle no pasa de 6 MB ni contiene `</script` ni `<!--`", () => {
		const bundle = text("components/bundle.js");
		expect(Buffer.byteLength(bundle)).toBeLessThanOrEqual(LIMITS.bundleBytes);
		expect(bundle).not.toMatch(/<\/script/i);
		expect(bundle).not.toContain("<!--");
	});
});

describe("tokens, fuentes y assets", () => {
	const generated = () => JSON.parse(text("tokens.json"));
	const pkg = JSON.parse(readFileSync(join(TOKENS, "src/tokens.json"), "utf8"));

	it("tokens.json tiene los mismos tokens con los mismos valores que @jotis-me/tokens", () => {
		const t = generated();
		for (const family of ["color", "spacing", "radius", "width", "shadow", "blur"])
			expect(t[family].tokens, family).toEqual(pkg[family].tokens);
		expect(t.color.themes).toEqual(pkg.color.themes);
		expect(t.type.groups).toEqual(pkg.type.groups);
	});

	it("registra el repo y el commit de origen", () => {
		const { meta } = generated();
		expect(meta).toMatchObject({
			source: "github",
			repo: "Jotis1/regula",
			ref: `main@${COMMIT.slice(0, 7)}`,
		});
		expect(meta.components.Button).toBe("packages/react/src/components/Button.tsx");
	});

	it("cada fuente que nombra tokens.json está en project/fonts", () => {
		for (const font of generated().type.fonts)
			expect(existsSync(join(out, "project", font.file)), font.file).toBe(true);
	});

	it("los grupos de assets salen del repo, con los iconos en el orden de @jotis-me/icons", () => {
		const names = (group: string) => manifest.assets.filter((a) => a.group === group).map((a) => a.name);
		expect(names("Icons")).toEqual(iconNames.map((n) => `${n}.svg`));
		expect(names("App icons")).toContain("scaena-default.svg");
		expect(names("Hand-drawn").length).toBe(87);
		expect(names("Patterns").length).toBe(4);
		const icon = text("assets/Icons/plus.svg");
		expect(icon).toContain("#525252");
		expect(icon).not.toContain("currentColor");
		expect(text("assets/Hand-drawn/arrow-01.svg")).toContain("#171717");
	});

	it("los logos de terceros van en «Marcas», aparte del grupo «Logos», con los grises en la tinta de los iconos", () => {
		const marcas = manifest.assets.filter((a) => a.group === "Marcas").map((a) => a.name);
		expect(marcas).toHaveLength(232 + 32 + 68);
		expect(marcas).toContain("social-github-gray.svg");
		expect(marcas).toContain("app-zapier.svg");
		const gray = text("assets/Marcas/social-github-gray.svg");
		expect(gray).toContain("#525252");
		expect(gray).not.toContain("currentColor");
		expect(manifest.assets.filter((a) => a.group === "Logos")).toEqual([]);
	});
});

describe("índice", () => {
	const index = () => JSON.parse(text("design-system.json"));

	it("queda en solo lectura, con la procedencia en lastChange", () => {
		const i = index();
		expect(i).toMatchObject({
			v: 3,
			layout: "files",
			title: "Jotis.me",
			namespace: "Jotis",
			editing: "code",
		});
		expect(i.lastChange).toMatchObject({ at: DATE, via: `GitHub · Jotis1/regula@${COMMIT.slice(0, 7)}` });
		expect(i.libraries.map((l: { file: string }) => l.file)).toEqual([
			"components/lib/react.production.min.js",
			"components/lib/react-dom.production.min.js",
		]);
		for (const l of i.libraries) expect(existsSync(join(out, "project", l.file)), l.file).toBe(true);
	});

	it("sin índice publicado es un borrador: todos los assets por subir", () => {
		expect(manifest.draft).toBe(true);
		expect(manifest.uploads.length).toBe(manifest.assets.length);
	});

	it("con el publicado: conserva sus claves y Logos, reutiliza un blob igual y exige subir uno distinto", async () => {
		const plus = manifest.assets.find((a) => a.group === "Icons" && a.name === "plus.svg");
		if (!plus) throw new Error("falta plus.svg");
		const published = {
			...index(),
			createdOnFiles: { v: 1, at: "2026-10-29T17:40:00Z" },
			extra: "se conserva",
			assetGroups: {
				Logos: {
					name: "Logos",
					tile: "l",
					order: ["logo.svg"],
					files: { "logo.svg": { name: "logo.svg", blob: "L1" } },
				},
				Icons: {
					name: "Icons",
					tile: "xs",
					order: ["plus.svg"],
					files: { "plus.svg": { name: "plus.svg", blob: "B1" } },
				},
			},
		};
		const blobs = Object.fromEntries(
			manifest.assets.filter((a) => a !== plus).map((a) => [`${a.group}/${a.name}`, `nuevo-${a.name}`]),
		);
		const again = mkdtempSync(join(tmpdir(), "artefacto-"));
		try {
			const m = await generate({
				out: again,
				commit: COMMIT,
				branch: "main",
				date: DATE,
				published,
				blobs,
				assetShas: { B1: plus.sha256 },
			});
			const i = JSON.parse(readFileSync(join(again, "project/design-system.json"), "utf8"));
			expect(i.extra).toBe("se conserva");
			expect(i.createdOnFiles.at).toBe("2026-10-29T17:40:00Z");
			expect(i.assetGroups.Logos.files["logo.svg"].blob).toBe("L1");
			expect(i.assetGroups.Icons.files["plus.svg"].blob).toBe("B1");
			expect(m.uploads).toEqual([]);
			// El mismo nombre con otro contenido: el blob publicado no vale y hay que subir
			await expect(
				generate({
					out: again,
					commit: COMMIT,
					branch: "main",
					date: DATE,
					published,
					blobs,
					assetShas: { B1: "otro" },
				}),
			).rejects.toThrow("Icons/plus.svg");
		} finally {
			rmSync(again, { recursive: true, force: true });
		}
	}, 300_000);
});

describe("tipos", () => {
	it("index.d.ts compila con tsc y declara todos los componentes del catálogo", () => {
		const dts = text("components/index.d.ts");
		for (const name of catalog)
			expect(dts, name).toMatch(new RegExp(`declare (const|function) ${name}\\b`));
		const types = join(import.meta.dirname, "../node_modules/@types/react").replaceAll("\\", "/");
		writeFileSync(
			join(out, "tsconfig.json"),
			JSON.stringify({
				compilerOptions: {
					strict: true,
					noEmit: true,
					skipLibCheck: false,
					module: "esnext",
					moduleResolution: "bundler",
					jsx: "react-jsx",
					lib: ["es2022", "dom"],
					types: [],
					paths: { react: [types], "react/*": [`${types}/*`] },
				},
				files: ["project/components/index.d.ts"],
			}),
		);
		const tsc = join(import.meta.dirname, "../node_modules/typescript/bin/tsc");
		expect(() =>
			execFileSync("node", [tsc, "-p", join(out, "tsconfig.json")], { encoding: "utf8" }),
		).not.toThrow();
	}, 120_000);
});

describe("guía", () => {
	it("el README es la guía de las páginas de fundamentos, sin restos de MDX", () => {
		const readme = text("README.md");
		expect(readme).toMatch(/^El sistema de diseño de la suite jotis\.me/);
		for (const h of [
			"## Principios",
			"## Color",
			"## Marca e iconos de app",
			"## Stream (Twitch)",
			"## Uso en este artefacto",
		])
			expect(readme).toContain(h);
		expect(readme).not.toMatch(/<[A-Z][A-Za-z]+|\{\/\*|^import /m);
		expect(readme).toContain("| `border-primary` |");
	});

	it("un componente MDX sin conversión rompe en vez de perder texto", () => {
		expect(() => mdxToMarkdown('<Nuevo items={["a"]} />', "prueba.mdx")).toThrow("<Nuevo>");
		expect(mdxToMarkdown('<Terms items={[{ term: "Uno", text: "Dos." }]} />')).toBe("- **Uno.** Dos.");
	});
});

// El paquete de React es la fuente del bundle: sin dist no hay nada que generar
it("usa el dist de @jotis-me/react", () => {
	expect(existsSync(join(REACT, "dist/index.js"))).toBe(true);
});
