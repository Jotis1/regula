// Genera `src/lib/starts/atajos.ts`, los atajos del ejemplo interactivo (design D3 de redesign-docs-site-v2), desde
// `test/fixtures/figma-types.json`: los tipos del Figma de cada componente que tiene más de uno. Es el mismo fichero
// del que sale `starts/tipos-del-figma.ts`. Tras cambiarlo:
//   bun run scripts/generate-shortcuts.ts && bunx biome format --write src/lib/starts/atajos.ts
// Un test (`test/playground-inspector.test.ts`) falla si el fichero generado no está al día.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Types = Record<string, { label: string; props: Record<string, unknown> }[]>;

const root = join(import.meta.dirname, "..");
const types: Types = JSON.parse(readFileSync(join(root, "test/fixtures/figma-types.json"), "utf8"));
const shortcuts = Object.fromEntries(Object.entries(types).filter(([, list]) => list.length > 1));

const header = [
	"// Los atajos del ejemplo interactivo (design D3 de redesign-docs-site-v2): los tipos del Figma de cada componente que",
	"// tiene más de uno, con las props que definen cada tipo. Se eligen en el desplegable «Empezar desde un atajo»; todo lo",
	"// que ponen se alcanza también con los controles. Los iconos van por el nombre de su componente.",
	"// Generado desde test/fixtures/figma-types.json con scripts/generate-shortcuts.ts: no lo edites a mano.",
	'import type { Shortcut } from "../playground";',
	"",
	"export const ATAJOS: Record<string, Shortcut[]> = ",
].join("\n");

writeFileSync(join(root, "src/lib/starts/atajos.ts"), `${header}${JSON.stringify(shortcuts, null, "\t")};\n`);
console.log(`${Object.keys(shortcuts).length} componentes con atajos`);
