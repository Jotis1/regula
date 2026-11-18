import { existsSync, readFileSync, writeFileSync } from "node:fs";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { isNoindex, sitemapXml } from "./src/lib/sitemap.ts";

const SITE = "https://regula.jotis.me";

// `/mcp` is the only server route (spec mcp-server). The Vercel adapter moves the static output out of `dist/`
// and needs symlinks to bundle the function, so it is registered only in the Vercel build; locally and in CI
// the site stays fully static and the MCP handler is tested directly (design D2).
const onVercel = Boolean(process.env.VERCEL);

const mcpRoute = {
	name: "regula-mcp-route",
	hooks: {
		"astro:config:setup": ({ injectRoute }) =>
			injectRoute({ pattern: "/mcp", entrypoint: "./src/features/mcp/route.ts", prerender: false }),
	},
};

// SEO-003: the sitemap, written once the build knows every page. A page is listed unless its HTML carries `noindex`
// (the internal ones and the redirects), so the page itself decides, and there is no list of paths to keep in sync.
const sitemap = {
	name: "regula-sitemap",
	hooks: {
		"astro:build:done": ({ dir, pages }) => {
			const indexable = pages
				.map((page) => page.pathname)
				.filter((pathname) => {
					const file = new URL(`${pathname}index.html`, dir);
					return existsSync(file) && !isNoindex(readFileSync(file, "utf8"));
				});
			writeFileSync(new URL("sitemap.xml", dir), sitemapXml(SITE, indexable));
		},
	},
};

export default defineConfig({
	site: SITE,
	// The compositions route used to be in Spanish; old links keep working (LNG-004)
	redirects: { "/components/[slug]/composiciones": "/components/[slug]/compositions" },
	adapter: onVercel ? (await import("@astrojs/vercel")).default() : undefined,
	integrations: [react(), mdx(), sitemap, ...(onVercel ? [mcpRoute] : [])],
	// SEC-012: cada página lleva su CSP en una <meta>, con los hashes de sus scripts y estilos. frame-ancestors no
	// cabe en una <meta>: va como cabecera en vercel.json, con las demás cabeceras de seguridad.
	security: {
		csp: {
			styleDirective: {
				// Los atributos `style=` que React pinta en el servidor (ancho de una barra, color de una muestra). Solo
				// en `style-src-attr`, que no ejecuta código: `script-src` no lleva nunca `unsafe-inline`.
				resources: [{ resource: "'unsafe-inline'", kind: "attribute" }],
				// Los dos <style> que React Aria crea con un texto fijo: usePress (touch-action) y preventScroll del
				// Dialog (overscroll-behavior). Si React Aria cambia ese texto, el e2e de a11y.spec.ts lo detecta.
				hashes: [
					"sha256-38RhXrc7EdReTKsOm23ZPOCUgniTUUcjky8QOOrQx6o=",
					"sha256-gYiS/BvZvRcK27JIXTuwhZ3hs2+VJ1X+2gUlE+farlg=",
				],
			},
		},
	},
	// El texto de la guía sale tal cual: sin comillas tipográficas inglesas
	markdown: { smartypants: false },
	vite: { plugins: [tailwindcss()] },
});
