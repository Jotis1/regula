// Escribe `asset-shas.json` (paso 4 de la publicación, README.md) sin copiar a mano los listados de assets.
//
// Todos los assets salen de `packages/assets`. Si no ha cambiado desde el commit de la última sincronización
// (`lastChange.via` del índice publicado), cada blob del índice sigue siendo el de su asset, así que se le
// asigna el sha256 del asset generado. Si ha cambiado, falla: entonces toca listar los assets publicados.
//
// No usa el `sha256` del listado de assets: el de los trazos (Hand-drawn) no coincide con el del repo aunque el
// fichero sea el mismo (el listado da el del fichero guardado, no el de lo que se subió).
//
// Uso, después de un `bun run artifact:build` sin `--published` (borrador) desde un árbol limpio:
//   node scripts/artifact/tools/asset-shas.mjs <published.json> <asset-shas.json> [dist-artifact]
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [published, out, dist = "dist-artifact"] = process.argv.slice(2);
if (!published || !out) {
	console.error(
		"Uso: node scripts/artifact/tools/asset-shas.mjs <published.json> <asset-shas.json> [dist-artifact]",
	);
	process.exit(2);
}

const index = JSON.parse(readFileSync(published, "utf8"));
const via = index.lastChange?.via ?? "";
const commit = /@([0-9a-f]{7,40})$/.exec(via)?.[1];
if (!commit) {
	console.error(`El índice publicado no dice de qué commit sale (lastChange.via: "${via}").`);
	process.exit(1);
}
const changed = execFileSync(
	"git",
	[
		"diff",
		"--name-only",
		commit,
		"HEAD",
		"--",
		"packages/assets/assets",
		"packages/assets/src",
		"packages/assets/scripts",
	],
	{
		encoding: "utf8",
	},
).trim();
if (changed) {
	console.error(
		`packages/assets ha cambiado desde ${commit}: lista los assets publicados para saber qué blobs siguen valiendo.\n${changed}`,
	);
	process.exit(1);
}

const shas = {};
const missing = [];
for (const [group, data] of Object.entries(index.assetGroups ?? {})) {
	if (group === "Logos") continue; // no sale del repo: el generador conserva los publicados
	for (const [name, record] of Object.entries(data.files ?? {})) {
		const file = join(dist, "project", "assets", group, name);
		if (!existsSync(file)) {
			missing.push(`${group}/${name}`);
			continue;
		}
		const blob = String(record.blob).replace(/^.*_blob\//, "");
		shas[blob] = createHash("sha256").update(readFileSync(file)).digest("hex");
	}
}
writeFileSync(out, `${JSON.stringify(shas, null, 1)}\n`);
console.log(`${Object.keys(shas).length} blobs → ${out}`);
if (missing.length)
	console.log(`Publicados que ya no salen del repo (el generador los quita):\n${missing.join("\n")}`);
