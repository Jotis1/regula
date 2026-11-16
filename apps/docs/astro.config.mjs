import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://regula.jotis.me",
	// The compositions route used to be in Spanish; old links keep working (IDI-004)
	redirects: { "/components/[slug]/composiciones": "/components/[slug]/compositions" },
	integrations: [react(), mdx()],
	// El texto de la guía sale tal cual: sin comillas tipográficas inglesas
	markdown: { smartypants: false },
	vite: { plugins: [tailwindcss()] },
});
