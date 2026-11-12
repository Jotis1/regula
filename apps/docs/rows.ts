// uso: bun rows.ts Nombre...  (herramienta temporal para escribir configuraciones)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { propsOf } from "./src/lib/props";
const dir = "src/content/components";
const pages = new Map(readdirSync(dir).map((f) => {
	const md = readFileSync(join(dir, f), "utf8");
	return [(md.match(/^name: (.+)$/m) as RegExpMatchArray)[1] as string, md.match(/^source: "?([^"\n]+)"?$/m)?.[1]] as const;
}));
for (const name of process.argv.slice(2)) {
	const rows = propsOf(join("../..", pages.get(name) ?? `packages/react/src/components/${name}.tsx`), name);
	console.log(`## ${name}`);
	for (const r of rows) console.log(`  ${r.name}${r.required ? "*" : ""}: ${r.type.slice(0, 110)}${r.defaultValue ? " = " + r.defaultValue : ""}`);
}
