// Hoja del artefacto (design D6): Tailwind v4 compila @jotis-me/react/styles.css (tokens, tema, fuentes y las clases
// de `dist`) más las utilidades propias de los ejemplos de la web, que el bundle publica en `Jotis.previews`.
import { join } from "node:path";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { DOCS } from "./paths";

const EXAMPLES = join(DOCS, "src/visual");

export async function buildSheet(): Promise<string> {
	// `source(none)`: sin detección automática; solo las fuentes declaradas (las de styles.css y los ejemplos)
	const input = [
		'@import "tailwindcss" source(none);',
		'@import "@jotis-me/react/styles.css";',
		`@source "${EXAMPLES.replaceAll("\\", "/")}";`,
		// El artefacto pone el tema oscuro con `data-theme="dark"`; las apps, con `.dark-mode`
		'@custom-variant dark (&:where(.dark-mode, .dark-mode *, [data-theme="dark"], [data-theme="dark"] *));',
	].join("\n");
	const compiler = await compile(input, { base: join(import.meta.dirname, ".."), onDependency: () => {} });
	const candidates = new Scanner({ sources: compiler.sources }).scan();
	let css = compiler.build(candidates);
	// Los valores oscuros de los tokens: el mismo bloque para los dos selectores
	css = css.replace(/(^|\n)(\s*)\.dark-mode\s*\{/g, '$1$2.dark-mode, [data-theme="dark"] {');
	// Las fuentes viven en `project/fonts/`; la hoja, en `project/components/`
	css = css.replace(/url\((["']?)\.\/fonts\//g, "url($1../fonts/");
	return css;
}
