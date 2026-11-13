import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://regula.jotis.me",
	integrations: [react(), mdx()],
	// El texto de la guía sale tal cual: sin comillas tipográficas inglesas
	markdown: { smartypants: false },
	vite: { plugins: [tailwindcss()] },
});
