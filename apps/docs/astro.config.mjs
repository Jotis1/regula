import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

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

export default defineConfig({
	site: "https://regula.jotis.me",
	// The compositions route used to be in Spanish; old links keep working (LNG-004)
	redirects: { "/components/[slug]/composiciones": "/components/[slug]/compositions" },
	adapter: onVercel ? (await import("@astrojs/vercel")).default() : undefined,
	integrations: [react(), mdx(), ...(onVercel ? [mcpRoute] : [])],
	// El texto de la guía sale tal cual: sin comillas tipográficas inglesas
	markdown: { smartypants: false },
	vite: { plugins: [tailwindcss()] },
});
