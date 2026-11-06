// bun run artifact:build [--out <carpeta>] [--published <design-system.json>] [--asset-shas <json>] [--blobs <json>]
// Genera dist-artifact/project/ y dist-artifact/manifest.json desde el commit actual. Sin red.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generate } from "./generate";
import { OUT, ROOT } from "./paths";

const args = process.argv.slice(2);
const arg = (name: string) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
const json = (name: string) => {
	const path = arg(name);
	return path ? JSON.parse(readFileSync(resolve(path), "utf8")) : undefined;
};
const git = (...a: string[]) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" }).trim();

const manifest = await generate({
	out: resolve(arg("--out") ?? OUT),
	commit: git("rev-parse", "HEAD"),
	branch: git("rev-parse", "--abbrev-ref", "HEAD"),
	date: arg("--date") ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
	published: json("--published"),
	assetShas: json("--asset-shas"),
	blobs: json("--blobs"),
});
console.log(
	`${manifest.components.length} componentes, ${manifest.files.length} ficheros y ${manifest.assets.length} assets → ${resolve(arg("--out") ?? OUT)} (${manifest.ref}${manifest.draft ? ", borrador: sin índice publicado" : ""})`,
);
if (manifest.uploads.length) console.log(`Assets por subir: ${manifest.uploads.length}`);
