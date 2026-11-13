/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Config de Vite de Astro para poder renderizar componentes .astro en los tests (container API)
// `inline`: los dos paquetes de Untitled UI que Node no carga solos (ver `ssr.noExternal` en astro.config.mjs)
export default getViteConfig({
	test: {
		include: ["test/**/*.test.ts"],
		server: { deps: { inline: ["@untitledui/country-flags", "@untitledui/file-icons"] } },
	},
});
