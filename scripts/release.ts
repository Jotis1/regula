// Publicación (release.yml): empaqueta con scripts/pack.ts (sin `workspace:`) y publica cada .tgz con
// `npm publish --provenance`. Con trusted publishing no hay token: npm usa el OIDC de GitHub Actions. Salta las
// versiones que ya están en npm, así que repetirlo no publica nada dos veces. Después crea las etiquetas de git.
// Uso: bun run release [--dry-run]
import { execFileSync, spawnSync } from "node:child_process";
import { type Packed, packAll } from "./pack.ts";

/** Orden de dependencias: react depende de tokens, y assets (que la usa para generar los iconos de app) de react: los tres en este orden. */
export const ORDER = ["@jotis-me/tokens", "@jotis-me/react", "@jotis-me/assets"];

/** Ordena para publicar y se niega a seguir si algún paquete está sin versión (0.0.0) o es desconocido. */
export function releasePlan(packed: Packed[]): Packed[] {
	const unknown = packed.filter((p) => !ORDER.includes(p.name));
	if (unknown.length) throw new Error(`Paquetes desconocidos: ${unknown.map((p) => p.name).join(", ")}`);
	const unversioned = packed.filter((p) => p.version === "0.0.0");
	if (unversioned.length)
		throw new Error(
			`Sin versión (0.0.0): ${unversioned.map((p) => p.name).join(", ")}. Fusiona antes el PR de versión.`,
		);
	return [...packed].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));
}

function published(name: string, version: string): boolean {
	const r = spawnSync("npm", ["view", `${name}@${version}`, "version"], { encoding: "utf8", shell: true });
	return r.status === 0 && r.stdout.trim() === version;
}

if (import.meta.main) {
	const dryRun = process.argv.includes("--dry-run");
	const packed = packAll();
	let plan: Packed[];
	try {
		plan = releasePlan(packed);
	} catch (e) {
		// En el ensayo se avisa y se sigue, para poder probar el resto con las versiones de ahora.
		if (!dryRun) throw e;
		console.warn(`Aviso (ensayo): ${(e as Error).message}`);
		plan = [...packed].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));
	}
	let count = 0;
	for (const { name, version, tgz } of plan) {
		if (published(name, version)) {
			console.log(`${name}@${version} ya está en npm: se salta.`);
			continue;
		}
		const args = ["publish", tgz, "--access", "public", "--provenance", ...(dryRun ? ["--dry-run"] : [])];
		execFileSync("npm", args, { stdio: "inherit", shell: true });
		// changesets/action lee estas líneas para saber qué se ha publicado.
		console.log(`New tag: ${name}@${version}`);
		count++;
	}
	if (count && !dryRun) {
		execFileSync("bunx", ["changeset", "tag"], { stdio: "inherit", shell: true });
		execFileSync("git", ["push", "origin", "--tags"], { stdio: "inherit" });
	}
	console.log(dryRun ? `Ensayo: ${count} paquetes se publicarían.` : `${count} paquetes publicados.`);
}
