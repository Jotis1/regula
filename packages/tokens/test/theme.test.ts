import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@tailwindcss/node";
import { beforeAll, describe, expect, it } from "vitest";
import { type TokensFile, themeCss, tokensCss } from "../src/generate.ts";

const tokens: TokensFile = JSON.parse(readFileSync(join(import.meta.dirname, "../src/tokens.json"), "utf8"));

let build: (candidates: string[]) => string;

beforeAll(async () => {
	// Fixture: un proyecto con Tailwind v4 que importa tokens y tema como haría una app
	const input = `@import "tailwindcss";\n${tokensCss(tokens)}\n${themeCss(tokens)}`;
	const compiler = await compile(input, { base: import.meta.dirname, onDependency: () => {} });
	build = (candidates) => compiler.build(candidates);
});

/** Declaraciones de la regla de una clase en el CSS generado. */
function rule(css: string, className: string): string {
	const selector = `.${className.replace(/[:/]/g, (c) => `\\${c}`)}`;
	const i = css.indexOf(`${selector} {`);
	if (i < 0) return "";
	return css.slice(i, css.indexOf("}", i) + 1);
}

describe("theme.css con Tailwind v4", () => {
	it("expone los colores con el nombre de la guía", () => {
		const css = build([
			"bg-brand-solid",
			"text-brand-secondary",
			"border-secondary",
			"text-fg-quaternary",
		]);
		expect(rule(css, "bg-brand-solid")).toContain("background-color: var(--bg-brand-solid)");
		expect(rule(css, "text-brand-secondary")).toContain("color: var(--text-brand-secondary)");
		expect(rule(css, "border-secondary")).toContain("border-color: var(--border-secondary)");
		expect(rule(css, "text-fg-quaternary")).toContain("color: var(--fg-quaternary)");
	});

	it("expone escalas utility y transparencias con modificador", () => {
		const css = build(["bg-utility-brand-50", "bg-alpha-white/10", "ring-focus-ring"]);
		expect(rule(css, "bg-utility-brand-50")).toContain("var(--utility-brand-50)");
		expect(rule(css, "bg-alpha-white/10")).toMatch(/var\(--alpha-white-100\)/);
		expect(rule(css, "ring-focus-ring")).toContain("var(--focus-ring)");
	});

	it("no genera la paleta cruda", () => {
		const css = build(["bg-indigo-600", "text-gray-500", "bg-white"]);
		expect(rule(css, "bg-indigo-600")).toBe("");
		expect(rule(css, "text-gray-500")).toBe("");
		expect(rule(css, "bg-white")).toBe("");
	});

	it("tiene la escala tipográfica de la guía", () => {
		const css = build(["text-display-sm", "text-display-md", "text-sm", "font-display"]);
		expect(rule(css, "text-display-sm")).toContain("font-size: 1.875rem");
		expect(rule(css, "text-display-sm")).toContain("line-height: var(--tw-leading, 2.375rem)");
		expect(rule(css, "text-display-md")).toContain("letter-spacing: var(--tw-tracking, -0.02em)");
		expect(rule(css, "text-sm")).toContain("font-size: 0.875rem");
		expect(rule(css, "font-display")).toContain("Bricolage Grotesque");
	});

	it("tiene radios, espaciado, anchos y desenfoques de la guía", () => {
		const css = build(["rounded-lg", "p-6", "max-w-container", "max-w-paragraph", "backdrop-blur-lg"]);
		expect(rule(css, "rounded-lg")).toContain("border-radius: 8px");
		expect(rule(css, "p-6")).toContain("calc(var(--spacing) * 6)");
		expect(css).toContain("--spacing: 0.25rem");
		expect(rule(css, "max-w-container")).toContain("1280px");
		expect(rule(css, "max-w-paragraph")).toContain("720px");
		expect(rule(css, "backdrop-blur-lg")).toContain("blur(16px)");
	});

	it("tiene las sombras, incluida la esqueumórfica y la de foco", () => {
		const css = build(["shadow-xs-skeuomorphic", "shadow-focus-ring", "shadow-focus-ring-error"]);
		expect(rule(css, "shadow-xs-skeuomorphic")).toContain(
			"inset 0 0 0 1px var(--tw-shadow-color, #0000002e)",
		);
		expect(rule(css, "shadow-focus-ring")).toContain("var(--focus-ring-shadow)");
		expect(rule(css, "shadow-focus-ring-error")).toContain("var(--focus-ring-error-shadow)");
	});

	it("activa dark: con la clase dark-mode y no con prefers-color-scheme", () => {
		const css = build(["dark:bg-primary"]);
		expect(css).toContain(".dark-mode");
		expect(css).not.toContain("prefers-color-scheme: dark");
	});

	it("no aplica dark: dentro de un light-mode, aunque un ancestro sea dark-mode", () => {
		const css = build(["dark:bg-primary"]);
		const selector = css.slice(
			css.indexOf(".dark\\:bg-primary"),
			css.indexOf("}", css.indexOf(".dark\\:bg-primary")),
		);
		expect(selector).toContain(":where(.dark-mode, .dark-mode *)");
		expect(selector).toContain(":not(:where(.light-mode, .light-mode *))");
	});
});
