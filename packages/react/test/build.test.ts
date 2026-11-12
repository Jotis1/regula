import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function sources(dir: string): string[] {
	return readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? sources(p) : /\.tsx?$/.test(f) ? [p] : [];
	});
}
const isClient = (code: string) => /^\s*["']use client["'];?/.test(code);

describe("build de @jotis-me/react", () => {
	const files = sources(join(root, "src"));

	it("cada módulo de src tiene su fichero en dist con la misma frontera cliente/servidor", () => {
		let client = 0;
		let server = 0;
		for (const src of files) {
			const out = join(root, "dist", relative(join(root, "src"), src).replace(/\.tsx?$/, ".js"));
			const a = isClient(readFileSync(src, "utf8"));
			expect(isClient(readFileSync(out, "utf8")), relative(root, out)).toBe(a);
			if (a) client++;
			else server++;
		}
		expect(client).toBeGreaterThan(0);
		expect(server).toBeGreaterThan(0);
	});

	it("declara React, React DOM y Tailwind v4 como peers y no los incluye", () => {
		expect(Object.keys(pkg.peerDependencies)).toEqual(["react", "react-dom", "tailwindcss"]);
		expect(pkg.dependencies.react).toBeUndefined();
		expect(pkg.sideEffects).toEqual(["**/*.css"]);
		for (const src of files) expect(readFileSync(src, "utf8")).not.toMatch(/from "tailwindcss"/);
	});

	it("styles.css trae tokens, tema y fuentes y apunta el escaneo de clases a dist", async () => {
		const compiler = await compile('@import "tailwindcss";\n@import "../styles.css";', {
			base: join(root, "test"),
			onDependency: () => {},
		});
		const css = compiler.build(["bg-brand-solid", "font-display"]);
		expect(css).toContain("var(--bg-brand-solid)");
		expect(css).toContain("--bg-brand-solid: #4f39f6");
		expect(css).toContain('font-family: "Bricolage Grotesque"');
		expect(compiler.sources.map((s) => join(s.base, s.pattern))).toContain(join(root, "dist"));
	});

	it("no importa ningún set de recursos en color de @jotis-me/assets (design D3 de complete-figma-coverage)", () => {
		const out = (dir: string): string[] =>
			readdirSync(dir).flatMap((f) => {
				const p = join(dir, f);
				return statSync(p).isDirectory() ? out(p) : f.endsWith(".js") ? [p] : [];
			});
		const js = out(join(root, "dist"));
		expect(js.length).toBeGreaterThan(100);
		const sets =
			/(?:from\s*|import\(\s*)["']@jotis-me\/icons\/(logos|flags|payments|files|cursors)(?:\/[^"']*)?["']/;
		for (const p of js) expect(readFileSync(p, "utf8"), relative(root, p)).not.toMatch(sets);
		// Las fuentes tampoco: las banderas, los pagos, los archivos y los logos llegan por props
		for (const src of files) expect(readFileSync(src, "utf8"), relative(root, src)).not.toMatch(sets);
	});
});
