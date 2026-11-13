import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://regula.jotis.me",
	integrations: [react(), mdx()],
	// El texto de la guía sale tal cual: sin comillas tipográficas inglesas
	markdown: { smartypants: false },
	vite: {
		plugins: [tailwindcss()],
		// Estos dos paquetes importan sus ficheros sin extensión (`from "./Ad"`), y Node no los resuelve: los empaqueta Vite.
		// Con Bun no se nota, porque sí los resuelve; en CI y en Vercel el build corre con Node.
		// Va en `resolve` y no en `ssr`: Astro genera las páginas en su propio entorno de Vite (`prerender`), que no lee `ssr`.
		resolve: { noExternal: ["@untitledui/country-flags", "@untitledui/file-icons"] },
	},
});
