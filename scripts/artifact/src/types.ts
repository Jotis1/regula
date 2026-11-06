// Tipos del artefacto (design D6): un único `index.d.ts` hecho con dts-bundle-generator desde packages/react/dist.
import Module, { createRequire } from "node:module";
import { join } from "node:path";
import { REACT } from "./paths";

const local = createRequire(join(import.meta.dirname, "../package.json"));

/**
 * dts-bundle-generator pide `typescript >=5` como dependencia propia y Bun le enlaza el TypeScript 7 de la raíz, que no
 * tiene API de JavaScript. Mientras corre, `require("typescript")` se resuelve al 6 de este paquete (Bun no admite
 * overrides anidados). Solo cambia esa petición y se restaura al terminar.
 */
function withTypeScript6<T>(run: () => T): T {
	const ts6 = local.resolve("typescript");
	const mod = Module as unknown as { _resolveFilename: (request: string, ...rest: unknown[]) => string };
	const original = mod._resolveFilename;
	mod._resolveFilename = function (this: unknown, request, ...rest) {
		return request === "typescript" ? ts6 : original.call(this, request, ...rest);
	};
	try {
		return run();
	} finally {
		mod._resolveFilename = original;
	}
}

export function buildTypes(): string {
	return withTypeScript6(() => {
		const { generateDtsBundle } = local("dts-bundle-generator") as typeof import("dts-bundle-generator");
		const [dts] = generateDtsBundle(
			[{ filePath: join(REACT, "dist/index.d.ts"), output: { noBanner: true } }],
			{
				preferredConfigPath: join(import.meta.dirname, "../tsconfig.dts.json"),
			},
		);
		if (!dts) throw new Error("dts-bundle-generator no devolvió tipos");
		return `// Jotis.me — window.Jotis: los tipos de @jotis-me/react (generado desde el repo; documentación).\n${dts}`;
	});
}
