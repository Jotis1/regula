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
// Las insignias de tienda, en su propio módulo: pesan diez veces un logo y así un bundler las deja en el trozo de
// quien las usa, no en el de todos los logos.
const storeLines: string[] = [];
const logoNames: Record<string, string[]> = {};
for (const set of ["app", "integration", "social", "store"]) {
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
		(set === "store" ? storeLines : logoLines).push(
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
writeFileSync(
	join(import.meta.dirname, "../src/logos-store.generated.tsx"),
	`// Generado por scripts/generate.ts desde assets/logos/store/. No editar a mano.
import { makeLogo } from "./logo.js";

${storeLines.join("\n")}
`,
);
console.log(`${storeLines.length} insignias de tienda → src/logos-store.generated.tsx`);

// Familias planas de recursos en color (assets/<carpeta>/<nombre>.svg): un componente suelto por fichero, con su SVG en
// línea y marcado como puro, y la lista de nombres, en src/<entrada>.generated.tsx. Se reutiliza `makeLogo`.
interface Family {
	/** Entrada del paquete (`@jotis-me/icons/flags`) y nombre del fichero generado. */
	entry: string;
	/** Carpeta de assets. */
	dir: string;
	/** Nombre del componente a partir del nombre del fichero sin extensión. */
	componentName: (slug: string) => string;
	/** Nombre de la lista exportada (`flagNames`). */
	listName: string;
	description: string;
}
const pascalCase = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");

function generateFamily(f: Family) {
	const dir = join(import.meta.dirname, "../assets", f.dir);
	const files = readdirSync(dir)
		.filter((x) => x.endsWith(".svg"))
		.sort();
	const seenNames = new Map<string, string>();
	const slugs: string[] = [];
	const lines: string[] = [];
	for (const file of files) {
		const slug = file.slice(0, -4);
		const svg = readFileSync(join(dir, file), "utf8").trim();
		const m = svg.match(
			/^<svg [^>]*width="([\d.]+)" height="([\d.]+)" viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>$/,
		);
		if (!m) throw new Error(`SVG inesperado: ${f.dir}/${file}`);
		const [, w, h, viewBox, inner] = m;
		const name = f.componentName(slug);
		if (seenNames.has(name))
			throw new Error(`${file} y ${seenNames.get(name)} dan el mismo componente ${name}`);
		seenNames.set(name, file);
		slugs.push(slug);
		lines.push(
			`export const ${name} = /* @__PURE__ */ makeLogo(${w}, ${h}, ${JSON.stringify(viewBox)}, ${JSON.stringify(inner)});`,
		);
	}
	writeFileSync(
		join(import.meta.dirname, `../src/${f.entry}.generated.tsx`),
		`// Generado por scripts/generate.ts desde assets/${f.dir}/. No editar a mano.
import { makeLogo } from "./logo.js";

/** ${f.description} (\`@jotis-me/icons/${f.entry}/<nombre>.svg\`). */
export const ${f.listName} = ${JSON.stringify(slugs)} as const;

${lines.join("\n")}
`,
	);
	console.log(`${lines.length} componentes de ${f.entry} → src/${f.entry}.generated.tsx`);
}

generateFamily({
	entry: "flags",
	dir: "flags",
	listName: "flagNames",
	description: "Los nombres de las banderas, como sus ficheros SVG: país o región y forma (`spain-circle`)",
	componentName: (slug) => {
		const m = slug.match(/^(.*)-(circle|square|rectangle)$/) as RegExpMatchArray;
		return `Flag${pascalCase(m[1] as string)}${pascalCase(m[2] as string)}`;
	},
});

generateFamily({
	entry: "payments",
	dir: "payments",
	listName: "paymentNames",
	description: "Los nombres de los iconos de pago, como sus ficheros SVG: método y tamaño (`visa-md`)",
	componentName: (slug) => {
		const m = slug.match(/^(.*)-(sm|md)$/) as RegExpMatchArray;
		return `Payment${pascalCase(m[1] as string)}${pascalCase(m[2] as string)}`;
	},
});

generateFamily({
	entry: "files",
	dir: "files",
	listName: "fileNames",
	description:
		"Los nombres de los iconos de archivo y de carpeta, como sus ficheros SVG: tipo y variante (`document-pdf-gray`, `folder-brand-open`)",
	componentName: (slug) =>
		slug.startsWith("folder-") ? `Folder${pascalCase(slug.slice(7))}` : `File${pascalCase(slug)}`,
});

generateFamily({
	entry: "cursors",
	dir: "cursors",
	listName: "cursorNames",
	description:
		"Los nombres de los cursores, como sus ficheros SVG (`hand-grab`, `macos-resize-north-south`)",
	componentName: (slug) => `Cursor${pascalCase(slug)}`,
});
