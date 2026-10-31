import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	use: { browserName: "chromium", baseURL: "http://localhost:4321" },
	webServer: {
		command: "bun run preview --port 4321",
		url: "http://localhost:4321",
		reuseExistingServer: true,
	},
});
