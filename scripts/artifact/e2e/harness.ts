// Sirve el artefacto generado como lo pinta el tipo Design System: cada vista previa con la hoja, React 18 y el bundle
// precargados, desde el mismo origen que sus ficheros. El tema oscuro es `data-theme="dark"` en <html>.
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import type { Page } from "@playwright/test";

export const PROJECT = join(import.meta.dirname, "../../../dist-artifact/project");
export const ORIGIN = "http://artefacto.test";
const types: Record<string, string> = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".woff2": "font/woff2",
	".svg": "image/svg+xml",
};

const HEAD = [
	'<link rel="stylesheet" href="/components/bundle.css">',
	'<script src="/components/lib/react.production.min.js"></script>',
	'<script src="/components/lib/react-dom.production.min.js"></script>',
	'<script src="/components/bundle.js"></script>',
].join("");

/** Documento vacío con todo precargado, para montar componentes a mano. */
export const BLANK = `<!doctype html><html lang="es"><head><meta charset="utf-8">${HEAD}</head><body></body></html>`;

/** Sirve `project/` en ORIGIN; las vistas previas reciben la cabecera del tipo y el tema pedido. */
export async function serve(page: Page, dark = false): Promise<void> {
	await page.route(`${ORIGIN}/**`, (route) => {
		const path = decodeURIComponent(new URL(route.request().url()).pathname);
		if (path === "/") return route.fulfill({ contentType: "text/html", body: BLANK });
		const file = join(PROJECT, path);
		if (!existsSync(file)) return route.fulfill({ status: 404 });
		let body: Buffer | string = readFileSync(file);
		if (path.endsWith("/preview.html"))
			body = body
				.toString("utf8")
				.replace("<head>", `<head>${HEAD}`)
				.replace("<html", dark ? '<html data-theme="dark"' : "<html");
		return route.fulfill({ body, contentType: types[extname(path)] ?? "application/octet-stream" });
	});
}

/** Errores de la página y de consola, para comprobar que no hay ninguno. */
export function collectErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	page.on("console", (m) => {
		if (m.type() === "error") errors.push(m.text());
	});
	return errors;
}
