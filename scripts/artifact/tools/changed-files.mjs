// Qué ficheros hay que publicar (paso 6 de la publicación, README.md): compara por sha256 los ficheros
// `project/…` publicados, guardados en una carpeta con `read` + `paths`, con `dist-artifact/manifest.json`.
//
// Uso: node scripts/artifact/tools/changed-files.mjs <carpeta leída> [dist-artifact] [--json <salida>]
//   <carpeta leída> es la que contiene `project/` (la herramienta los guarda en `artifact-files/<slug>/`).
// Saca tres listas: nuevos, cambiados (por sha256) y publicados que ya no salen del repo. El índice
// (`project/design-system.json`) no entra: se publica aparte, el último.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const args = process.argv.slice(2);
const jsonAt = args.indexOf("--json");
const jsonOut = jsonAt >= 0 ? args.splice(jsonAt, 2)[1] : undefined;
const [readDir, dist = "dist-artifact"] = args;
if (!readDir) {
	console.error(
		"Uso: node scripts/artifact/tools/changed-files.mjs <carpeta leída> [dist-artifact] [--json <salida>]",
	);
	process.exit(2);
}

const INDEX = "project/design-system.json";
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const walk = (dir) =>
	readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});

const manifest = JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8"));
const generated = new Map(
	manifest.files.map((f) => [f.path.startsWith("project/") ? f.path : `project/${f.path}`, f.sha256]),
);
const projectDir = join(readDir, "project");
const published = existsSync(projectDir)
	? walk(projectDir).map((p) => relative(readDir, p).split(sep).join("/"))
	: [];

const result = { newFiles: [], changed: [], gone: [] };
for (const [path, hash] of generated) {
	if (path === INDEX) continue;
	const file = join(readDir, path);
	if (!existsSync(file)) result.newFiles.push(path);
	else if (sha(file) !== hash) result.changed.push(path);
}
for (const path of published) if (path !== INDEX && !generated.has(path)) result.gone.push(path);

if (jsonOut) writeFileSync(jsonOut, `${JSON.stringify(result, null, 1)}\n`);
for (const [label, list] of [
	["Nuevos", result.newFiles],
	["Cambiados", result.changed],
	["Ya no salen del repo (quitar solo si el usuario lo confirma)", result.gone],
])
	console.log(`${label}: ${list.length}${list.length ? `\n  ${list.join("\n  ")}` : ""}`);
console.log(`Sin cambios: ${generated.size - 1 - result.newFiles.length - result.changed.length}`);
