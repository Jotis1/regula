import { defineConfig } from "@playwright/test";

// Pruebas en navegador del artefacto generado (dist-artifact/project): bundle con React 18, hoja y vistas previas
// frente a las capturas aprobadas. En CI, en el job de Windows, donde se capturaron (design, Risks).
export default defineConfig({
	testDir: "e2e",
	use: { browserName: "chromium" },
});
