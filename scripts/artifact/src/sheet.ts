// Hoja del artefacto (design D6): Tailwind v4 compila @jotis-me/react/styles.css (tokens, tema, fuentes y las clases
// de `dist`) más las utilidades propias de los ejemplos de la web, que el bundle publica en `Jotis.previews`.
import { join } from "node:path";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { DOCS } from "./paths";

const EXAMPLES = join(DOCS, "src/visual");

/**
 * Compatibilidad con los diseños hechos con la guía (decisión de la 6.1): envuelven su contenido en `.jm-root`, que en
 * la hoja de la guía daba fuente, color, suavizado y `box-sizing`. Se mantienen las mismas reglas.
 */
export const JM_ROOT = `/* Contenedor de los diseños (compatibilidad con la guía) */
.jm-root, .jm-root * { box-sizing: border-box; }
.jm-root { font-family: var(--font-body); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
`;

// El artefacto pone el tema oscuro con `data-theme="dark"`; las apps, con `.dark-mode`
// Un trozo claro dentro de uno oscuro apaga `dark:`: `data-theme="light"` en un contenedor (en las apps, `.light-mode`).
// El de `<html>` no cuenta: el visor lo pone en la raíz para su tema claro y un contenedor oscuro debe seguir siéndolo.
export const DARK_VARIANT =
	'@custom-variant dark (&:where(.dark-mode, .dark-mode *, [data-theme="dark"], [data-theme="dark"] *):not(:where(.light-mode, .light-mode *, [data-theme="light"]:not(:root), [data-theme="light"]:not(:root) *)));';

export async function buildSheet(): Promise<string> {
	// `source(none)`: sin detección automática; solo las fuentes declaradas (las de styles.css y los ejemplos)
	const input = [
		'@import "tailwindcss" source(none);',
		'@import "@jotis-me/react/styles.css";',
		`@source "${EXAMPLES.replaceAll("\\", "/")}";`,
		DARK_VARIANT,
	].join("\n");
	const compiler = await compile(input, { base: join(import.meta.dirname, ".."), onDependency: () => {} });
	const candidates = new Scanner({ sources: compiler.sources }).scan();
	let css = compiler.build(candidates);
	// Los valores oscuros de los tokens: el mismo bloque para los dos selectores
	css = css.replace(/(^|\n)(\s*)\.dark-mode\s*\{/g, '$1$2.dark-mode, [data-theme="dark"] {');
	// Y los claros de vuelta, para el contenedor claro dentro de uno oscuro
	css = css.replace(/(^|\n)(\s*)\.light-mode\s*\{/g, '$1$2.light-mode, [data-theme="light"] {');
	// Las fuentes viven en `project/fonts/`; la hoja, en `project/components/`
	css = css.replace(/url\((["']?)\.\/fonts\//g, "url($1../fonts/");
	return `${css}\n${JM_ROOT}`;
}
