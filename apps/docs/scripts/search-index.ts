// Builds the Pagefind index over the finished static site. On Vercel the adapter leaves it in
// `.vercel/output/static`; everywhere else it is `dist/` (see astro.config.mjs).
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const site = process.env.VERCEL && existsSync(".vercel/output/static") ? ".vercel/output/static" : "dist";
const run = spawnSync("bunx", ["pagefind", "--site", site], {
	stdio: "inherit",
	shell: process.platform === "win32",
});
process.exit(run.status ?? 1);
