import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	// En CI, un reintento: en el runner de Windows `astro preview` rechaza a veces una conexión suelta
	// (ERR_CONNECTION_REFUSED a mitad de pasada). Un test que solo pasa al reintentar sale como "flaky" en el informe.
	retries: process.env.CI ? 1 : 0,
	use: { browserName: "chromium", baseURL: "http://localhost:4321" },
	webServer: {
		command: "bun run preview --port 4321",
		url: "http://localhost:4321",
		reuseExistingServer: true,
	},
});
