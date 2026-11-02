// Sirve las vistas previas de la guía (reference/components/<Nombre>/preview.html) tal como las pinta el
// artefacto: nuestros tokens.css y fuentes (mismos nombres de variable), bundle.css, React 18 UMD y bundle.js.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, join } from "node:path";
import type { Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const root = join(import.meta.dirname, "../../../..");
const components = join(root, "reference/components");
const tokensDist = join(root, "packages/tokens/dist");
export const ORIGIN = "http://referencia.test";

const families = JSON.parse(readFileSync(join(tokensDist, "tokens.json"), "utf8")).type.families as Record<
	string,
	string
>;
const fontVars = `:root{${Object.entries(families)
	.map(([k, v]) => `--font-${k}:${v};`)
	.join("")}}`;

const files: Record<string, () => Buffer | string> = {
	// En el artefacto el tema oscuro es `data-theme="dark"` (en <html> o en la raíz de cada componente de Stream);
	// nuestro `tokens.css` lo llama `.dark-mode` (design §3). Se sirven los dos selectores para que la vista previa
	// se vea como en la guía: las de Stream ponen la página en oscuro también en la captura "clara".
	"/tokens.css": () =>
		readFileSync(join(tokensDist, "tokens.css"), "utf8").replace(
			/^\.dark-mode \{/m,
			'.dark-mode, [data-theme="dark"] {',
		),
	"/fonts.css": () => readFileSync(join(tokensDist, "fonts.css")),
	"/font-vars.css": () => fontVars,
	"/bundle.css": () => readFileSync(join(components, "bundle.css")),
	"/bundle.js": () => readFileSync(join(components, "bundle.js")),
	"/react.js": () =>
		readFileSync(join(dirname(require.resolve("react-18/package.json")), "umd/react.production.min.js")),
	"/react-dom.js": () =>
		readFileSync(
			join(dirname(require.resolve("react-dom-18/package.json")), "umd/react-dom.production.min.js"),
		),
};
const types: Record<string, string> = {
	".css": "text/css",
	".js": "text/javascript",
	".woff2": "font/woff2",
};

/**
 * Correcciones de fallos de las vistas previas de la guía que contradicen su propia ficha (design §7: manda la
 * ficha). Cada una se aplica solo a su componente y se anota en su página. Al cambiarlas, recaptura con
 * `bun run scripts/capture-reference.ts <Nombre>`.
 */
export const REFERENCE_FIXES: Record<string, string> = {
	// La ficha pide Geist Mono 14/20; bundle.css lo pone en el <pre>, pero el <code> de dentro se queda con el
	// `monospace` del navegador (Consolas en Windows) y las líneas salen más anchas y más altas.
	CodeSnippet: ".jm-code-pre code { font: inherit; }",
	// El pie de cada muestra lleva el nombre del patrón en un <code> que se queda con el `monospace` del
	// navegador; la guía pide Geist Mono para el código, y su línea medía 21px en vez de 20, lo que bajaba la
	// segunda fila. Solo afecta al pie de la vista previa, no al componente.
	BackgroundPattern: ".jm-hint code { font-family: var(--font-mono); }",
};

/**
 * Vistas previas fijadas a una versión anterior de la guía, para cambios de la guía que aún no se han portado
 * (design §12). AppIcon: la versión 1793561361-ae73 añade Regula (`chartreuse`), que queda para un cambio de
 * estilo propio; hasta entonces se compara con su vista previa de cuatro apps (1793369818-a6e0).
 */
const PINNED_PREVIEWS: Record<string, string> = {
	AppIcon: join(import.meta.dirname, "pinned/AppIcon.preview.html"),
};

function previewHtml(name: string): string {
	return readFileSync(PINNED_PREVIEWS[name] ?? join(components, name, "preview.html"), "utf8");
}

/** Alto de la tarjeta que declara la vista previa (`<!-- @dsCard height=220 -->`). */
export function cardHeight(name: string): number {
	return Number(previewHtml(name).match(/@dsCard[^>]*height=(\d+)/)?.[1] ?? 300);
}

/** Componentes con vista previa en la guía (sin `Cover`, que es la portada del artefacto). */
export function previewNames(): string[] {
	return readdirSync(components).filter(
		(d) => d !== "Cover" && existsSync(join(components, d, "preview.html")),
	);
}

/** Carga en la página la vista previa de la guía de un componente, en el tema pedido. */
export async function openReference(page: Page, name: string, dark: boolean): Promise<void> {
	await page.route(`${ORIGIN}/**`, (route) => {
		const path = new URL(route.request().url()).pathname;
		if (path === "/") {
			const preview = previewHtml(name);
			const fix = REFERENCE_FIXES[name] ? `<style>${REFERENCE_FIXES[name]}</style>` : "";
			const head = `<link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/font-vars.css"><link rel="stylesheet" href="/bundle.css">${fix}<script src="/react.js"></script><script src="/react-dom.js"></script><script src="/bundle.js"></script>`;
			const html = preview
				.replace("<head>", `<head>${head}`)
				.replace(
					"<html",
					`<html class="${dark ? "dark-mode" : ""}"${dark ? ' data-theme="dark"' : ""}`,
				);
			return route.fulfill({ contentType: "text/html", body: html });
		}
		if (path.startsWith("/fonts/"))
			return route.fulfill({ body: readFileSync(join(tokensDist, path)), contentType: "font/woff2" });
		const file = files[path];
		if (!file) return route.fulfill({ status: 404 });
		return route.fulfill({
			body: file(),
			contentType: types[extname(path)] ?? "application/octet-stream",
		});
	});
	await page.goto(`${ORIGIN}/`);
	await page.waitForFunction(() => (document.getElementById("root")?.childElementCount ?? 0) > 0);
	await page.evaluate(() => document.fonts.ready);
}
