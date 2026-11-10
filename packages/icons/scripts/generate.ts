// Genera lo que sale del set de iconos y de los logos:
//   - src/components.generated.tsx: un componente por icono del set completo (IconRocket02…), cada uno con su dibujo
//   - src/data/core.generated.ts: los dibujos de los iconos del núcleo, los que `Icon name` puede pintar
//   - src/names.generated.ts: los nombres del set completo
//   - src/logos.generated.tsx: un componente por logo de terceros
// Uso: bun run scripts/generate.ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { coreNames } from "../src/data/core-names.ts";
import { icons } from "../src/data/icons.ts";

export const componentName = (name: string) =>
	`Icon${name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}`;

const src = join(import.meta.dirname, "../src");
const entries = Object.entries(icons) as [string, readonly string[]][];

// Dos nombres de icono no pueden dar el mismo componente
const seen = new Map<string, string>();
for (const [name] of entries) {
	const c = componentName(name);
	if (seen.has(c)) throw new Error(`${name} y ${seen.get(c)} dan el mismo componente ${c}`);
	seen.set(c, name);
}

// Un componente por icono, con su dibujo en línea y marcado como puro para que un bundler deje fuera los que no se usan
const componentLines = entries.map(
	([name, paths]) =>
		`export const ${componentName(name)} = /* @__PURE__ */ makeIcon(${JSON.stringify(paths)});`,
);
writeFileSync(
	join(src, "components.generated.tsx"),
	`// Generado por scripts/generate.ts desde src/data/icons.ts. No editar a mano.
import { makeIcon } from "./icon-svg.js";

export type { IconComponentProps } from "./icon-svg.js";

${componentLines.join("\n")}
`,
);
console.log(`${entries.length} componentes de icono → src/components.generated.tsx`);

// Los del núcleo, para `Icon name`
const coreLines = coreNames.map((name) => {
	const paths = (icons as Record<string, readonly string[]>)[name];
	if (!paths) throw new Error(`el icono del núcleo «${name}» no está en el set`);
	return `\t${JSON.stringify(name)}: ${JSON.stringify(paths)},`;
});
writeFileSync(
	join(src, "data/core.generated.ts"),
	`// Generado por scripts/generate.ts desde src/data/icons.ts. No editar a mano.
import type { IconName } from "./core-names.js";

export const coreIcons: Record<IconName, readonly string[]> = {
${coreLines.join("\n")}
};
`,
);
console.log(`${coreLines.length} iconos del núcleo → src/data/core.generated.ts`);

// Los nombres del set completo, aparte para que importarlos no cargue ningún dibujo
writeFileSync(
	join(src, "names.generated.ts"),
	`// Generado por scripts/generate.ts desde src/data/icons.ts. No editar a mano.
/** Los nombres de todos los iconos del set, como sus ficheros SVG (\`@jotis-me/icons/svg/<nombre>.svg\`). */
export const allIconNames = ${JSON.stringify(entries.map(([n]) => n))} as const;

export type AnyIconName = (typeof allIconNames)[number];
`,
);
console.log(`${entries.length} nombres → src/names.generated.ts`);

// Logos de terceros: un componente por logo y variante (AppZapierLogo, SocialGithubLogoGray…) desde assets/logos/,
// cada uno marcado como puro para que un bundler deje fuera los que no se importan.
const pascal = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");
export const logoComponentName = (set: string, slug: string) => {
	const gray = slug.endsWith("-gray");
	return `${pascal(set)}${pascal(gray ? slug.slice(0, -5) : slug)}Logo${gray ? "Gray" : ""}`;
};
const logosDir = join(import.meta.dirname, "../assets/logos");
const logoLines: string[] = [];
const logoNames: Record<string, string[]> = {};
for (const set of ["app", "integration", "social"]) {
	logoNames[set] = [];
	for (const file of readdirSync(join(logosDir, set))
		.filter((f) => f.endsWith(".svg"))
		.sort()) {
		const slug = file.slice(0, -4);
		const svg = readFileSync(join(logosDir, set, file), "utf8").trim();
		const m = svg.match(
			/^<svg [^>]*width="(\d+)" height="(\d+)" viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>$/,
		);
		if (!m) throw new Error(`SVG inesperado: ${set}/${file}`);
		const [, w, h, viewBox, inner] = m;
		(logoNames[set] as string[]).push(slug);
		logoLines.push(
			`export const ${logoComponentName(set, slug)} = /* @__PURE__ */ makeLogo(${w}, ${h}, ${JSON.stringify(viewBox)}, ${JSON.stringify(inner)});`,
		);
	}
}
writeFileSync(
	join(import.meta.dirname, "../src/logos.generated.tsx"),
	`// Generado por scripts/generate.ts desde assets/logos/. No editar a mano.
import { makeLogo } from "./logo.js";

/** Nombres de los logos de cada set, como sus ficheros SVG (\`@jotis-me/icons/logos/<set>/<nombre>.svg\`). */
export const logoNames = ${JSON.stringify(logoNames)} as const;

${logoLines.join("\n")}
`,
);
console.log(`${logoLines.length} componentes de logo → src/logos.generated.tsx`);
