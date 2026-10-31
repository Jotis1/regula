// Extrae una vez los datos de iconos y del icono de app desde la guía (reference/components/bundle.js)
// a src/data/. Los datos quedan versionados; este script solo hace falta si se reimporta la guía.
// Uso: bun run scripts/extract.ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const bundle = readFileSync(join(root, "../../reference/components/bundle.js"), "utf8");

function literal(name: string): unknown {
	const start = bundle.indexOf(`var ${name} = `);
	if (start < 0) throw new Error(`No encuentro ${name} en bundle.js`);
	return JSON.parse(bundle.slice(start + name.length + 7, bundle.indexOf(";\n", start)));
}

const icons = literal("ICONS") as Record<string, string[]>;
const appicon = literal("APPICON");
const header = "// Generado por scripts/extract.ts desde reference/components/bundle.js. No editar a mano.\n";
writeFileSync(
	join(root, "src/data/icons.ts"),
	`${header}export const icons = ${JSON.stringify(icons, null, "\t")} as const;\n`,
);
writeFileSync(
	join(root, "src/data/appicon.ts"),
	`${header}export const appicon = ${JSON.stringify(appicon, null, "\t")};\n`,
);
console.log(`${Object.keys(icons).length} iconos y los datos del icono de app → src/data/`);
