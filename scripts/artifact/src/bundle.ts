// Bundle del artefacto (design D6): @jotis-me/react compilado como UN script clásico que lee React de
// `window.React`/`window.ReactDOM` (el artefacto carga React 18) y asigna `window.Jotis`.
import { join } from "node:path";
import type { BunPlugin } from "bun";
import { NAMESPACE } from "./paths";

/** `react`, `react-dom` y `react/jsx-runtime` resueltos contra los globales; el runtime de JSX, sobre createElement. */
const reactGlobals: BunPlugin = {
	name: "react-globals",
	setup(build) {
		build.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => ({
			path: args.path,
			namespace: "react-global",
		}));
		build.onLoad({ filter: /.*/, namespace: "react-global" }, (args) => {
			if (args.path === "react/jsx-runtime" || args.path === "react/jsx-dev-runtime")
				return {
					loader: "js",
					contents: `const R = window.React;
function jsx(type, props, key) { return R.createElement(type, key === undefined ? props : Object.assign({}, props, { key: key })); }
module.exports = { jsx: jsx, jsxs: jsx, jsxDEV: jsx, Fragment: R.Fragment };`,
				};
			if (args.path.startsWith("react-dom"))
				return { loader: "js", contents: "module.exports = window.ReactDOM;" };
			if (args.path === "react") return { loader: "js", contents: "module.exports = window.React;" };
			throw new Error(`Import de React sin global: ${args.path}`);
		});
	},
};

/** Primera línea que lee el tipo Design System: formato, namespace y la lista del catálogo. */
export function bundleHeader(components: readonly string[]): string {
	const meta = { format: 4, namespace: NAMESPACE, components: components.map((name) => ({ name })) };
	return `/* @ds-bundle: ${JSON.stringify(meta)} */`;
}

export async function buildBundle(components: readonly string[]): Promise<string> {
	const result = await Bun.build({
		entrypoints: [join(import.meta.dirname, "entry.ts")],
		format: "iife",
		target: "browser",
		minify: true,
		define: { "process.env.NODE_ENV": '"production"' },
		plugins: [reactGlobals],
	});
	if (!result.success) throw new AggregateError(result.logs, "No compila el bundle del artefacto");
	const [output] = result.outputs;
	if (!output) throw new Error("El bundle no tiene salida");
	// El tipo prohíbe `</script` y `<!--` literales en el bundle (se inyecta en un <script>)
	const code = (await output.text()).replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
	return `${bundleHeader(components)}\n${code}`;
}
