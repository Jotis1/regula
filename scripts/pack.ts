// Empaqueta los paquetes públicos con `bun pm pack` (sustituye `workspace:*` por la versión real) y comprueba en
// cada .tgz que su package.json no contiene `workspace:` (design §11: `npm publish` no lo reescribe y se
// publicarían dependencias rotas). Deja los .tgz en `.pack/`. Uso: bun run scripts/pack.ts
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

export const PACKAGES = ["packages/tokens", "packages/assets", "packages/react"];
const root = join(import.meta.dirname, "..");
export const PACK_DIR = join(root, ".pack");

export interface Packed {
	name: string;
	version: string;
	tgz: string;
}

/** package.json que va dentro del .tgz (no el del repo). */
export function packedManifest(tgz: string): Record<string, unknown> {
	// `tar` con ruta relativa: en Windows, GNU tar toma `C:\…` por un host remoto.
	const json = execFileSync(
		"tar",
		["-xOzf", tgz.replace(`${PACK_DIR}`, ".").replaceAll("\\", "/"), "package/package.json"],
		{
			cwd: PACK_DIR,
			encoding: "utf8",
		},
	);
	return JSON.parse(json);
}

export function packAll(): Packed[] {
	rmSync(PACK_DIR, { recursive: true, force: true });
	mkdirSync(PACK_DIR, { recursive: true });
	for (const dir of PACKAGES) {
		execFileSync("bun", ["pm", "pack", "--destination", PACK_DIR, "--quiet"], {
			cwd: join(root, dir),
			stdio: ["ignore", "ignore", "inherit"],
		});
	}
	const tgzs = readdirSync(PACK_DIR).filter((f) => f.endsWith(".tgz"));
	if (tgzs.length !== PACKAGES.length)
		throw new Error(`Se esperaban ${PACKAGES.length} .tgz y hay ${tgzs.length}`);

	const packed: Packed[] = [];
	const errors: string[] = [];
	for (const file of tgzs) {
		const tgz = join(PACK_DIR, file);
		const manifest = packedManifest(tgz);
		const text = JSON.stringify(manifest);
		if (text.includes("workspace:")) errors.push(`${file}: su package.json contiene "workspace:"`);
		packed.push({ name: String(manifest.name), version: String(manifest.version), tgz });
	}
	if (errors.length) throw new Error(errors.join("\n"));
	return packed;
}

if (import.meta.main) {
	for (const p of packAll()) console.log(`${p.name}@${p.version}  ${p.tgz}  (sin workspace:)`);
}
