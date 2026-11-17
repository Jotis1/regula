// Genera lo que sale de los assets de color:
//   - src/logos.generated.tsx y src/logos-store.generated.tsx: un componente por logo de terceros
//   - src/payments.generated.tsx y src/cursors.generated.tsx: un componente por icono de pago y por cursor
//   - src/logos.ts, src/payments.ts y src/cursors.ts: las entradas del paquete, con cada nombre exportado uno a uno
//     (sin `export *`, COD-011)
// Uso: bun run scripts/generate.ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Un módulo generado y los nombres que la entrada reexporta de él. */
interface EntryModule {
	file: string;
	names: string[];
}

/**
 * Escribe una entrada del paquete (`src/<entry>.ts`): su comentario, lo que reexporta de `logo.ts` y, por cada módulo
 * generado, un `export { … } from` con todos sus nombres, uno por línea.
 */
function writeEntry(entry: string, header: string, fromLogo: string, modules: EntryModule[]) {
	const blocks = modules.map(
		({ file, names }) => `export {\n${names.map((n) => `\t${n},\n`).join("")}} from "./${file}.js";`,
	);
	const source = [
		"// Generado por scripts/generate.ts. No editar a mano.",
		header,
		fromLogo,
		...blocks,
	].join("\n");
	writeFileSync(join(import.meta.dirname, `../src/${entry}.ts`), `${source}\n`);
	console.log(`src/${entry}.ts: ${modules.reduce((n, m) => n + m.names.length, 0)} nombres exportados`);
}

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
const logoExports: string[] = ["logoNames"];
const storeExports: string[] = [];
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
		(set === "store" ? storeExports : logoExports).push(logoComponentName(set, slug));
		(set === "store" ? storeLines : logoLines).push(
			`export const ${logoComponentName(set, slug)} = /* @__PURE__ */ makeLogo(${w}, ${h}, ${JSON.stringify(viewBox)}, ${JSON.stringify(inner)});`,
		);
	}
}
writeFileSync(
	join(import.meta.dirname, "../src/logos.generated.tsx"),
	`// Generado por scripts/generate.ts desde assets/logos/. No editar a mano.
import { makeLogo } from "./logo.js";

/** Nombres de los logos de cada set, como sus ficheros SVG (\`@jotis-me/assets/logos/<set>/<nombre>.svg\`). */
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
writeEntry(
	"logos",
	`// Entrada \`@jotis-me/assets/logos\`: logos de servicios de terceros (apps, integraciones y redes), aparte de los iconos de
// línea para que la entrada principal no los cargue. Cada marca es de su dueño: se usan para representar una
// integración o un perfil, sin cambiar su forma ni sus colores.`,
	'export { type LogoProps, type LogoSet, makeLogo } from "./logo.js";',
	[
		{ file: "logos.generated", names: logoExports },
		{ file: "logos-store.generated", names: storeExports },
	],
);

// Familias planas de recursos en color (assets/<carpeta>/<nombre>.svg): un componente suelto por fichero, con su SVG en
// línea y marcado como puro, y la lista de nombres, en src/<entrada>.generated.tsx. Se reutiliza `makeLogo`.
interface Family {
	/** Entrada del paquete (`@jotis-me/assets/payments`) y nombre del fichero generado. */
	entry: string;
	/** Carpeta de assets. */
	dir: string;
	/** Nombre del componente a partir del nombre del fichero sin extensión. */
	componentName: (slug: string) => string;
	/** Nombre de la lista exportada (`flagNames`). */
	listName: string;
	description: string;
	/** Comentario de la entrada del paquete (`src/<entry>.ts`). */
	header: string;
	/** Lo que la entrada reexporta de `logo.ts`. */
	fromLogo: string;
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
	const exported: string[] = [f.listName];
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
		exported.push(name);
		slugs.push(slug);
		lines.push(
			`export const ${name} = /* @__PURE__ */ makeLogo(${w}, ${h}, ${JSON.stringify(viewBox)}, ${JSON.stringify(inner)});`,
		);
	}
	writeFileSync(
		join(import.meta.dirname, `../src/${f.entry}.generated.tsx`),
		`// Generado por scripts/generate.ts desde assets/${f.dir}/. No editar a mano.
import { makeLogo } from "./logo.js";

/** ${f.description} (\`@jotis-me/assets/${f.entry}/<nombre>.svg\`). */
export const ${f.listName} = ${JSON.stringify(slugs)} as const;

${lines.join("\n")}
`,
	);
	console.log(`${lines.length} componentes de ${f.entry} → src/${f.entry}.generated.tsx`);
	writeEntry(f.entry, f.header, f.fromLogo, [{ file: `${f.entry}.generated`, names: exported }]);
}

generateFamily({
	entry: "payments",
	dir: "payments",
	listName: "paymentNames",
	description: "Los nombres de los iconos de pago, como sus ficheros SVG: método y tamaño (`visa-md`)",
	header: `// Entrada \`@jotis-me/assets/payments\`: los iconos de métodos de pago del Figma (tarjetas, monederos, transferencias y
// criptomonedas), cada uno en \`sm\` (34×24) y \`md\` (46×32), como componentes sueltos (\`PaymentVisaMd\`) y como SVG.
// Aparte de los iconos de línea para que la entrada principal no los cargue. Cada marca es de su dueño.`,
	fromLogo: 'export type { LogoProps as PaymentProps } from "./logo.js";',
	componentName: (slug) => {
		const m = slug.match(/^(.*)-(sm|md)$/) as RegExpMatchArray;
		return `Payment${pascalCase(m[1] as string)}${pascalCase(m[2] as string)}`;
	},
});

generateFamily({
	entry: "cursors",
	dir: "cursors",
	listName: "cursorNames",
	description:
		"Los nombres de los cursores, como sus ficheros SVG (`hand-grab`, `macos-resize-north-south`)",
	header: `// Entrada \`@jotis-me/assets/cursors\`: los cursores del Figma (los clásicos y los de macOS 26), como componentes sueltos
// (\`CursorHandGrab\`) y como SVG que se puede usar de cursor en CSS: \`cursor: url(".../hand-grab.svg") 6 4, grab\`. El SVG no
// lleva el punto activo del cursor: se pone en la regla de CSS. Aparte de los iconos de línea para que la entrada
// principal no los cargue.`,
	fromLogo: 'export type { LogoProps as CursorProps } from "./logo.js";',
	componentName: (slug) => `Cursor${pascalCase(slug)}`,
});
