// Genera lo que sale de los assets de color:
//   - src/logos.generated.tsx y src/logos-store.generated.tsx: un componente por logo de terceros
//   - src/payments.generated.tsx y src/cursors.generated.tsx: un componente por icono de pago y por cursor
// Uso: bun run scripts/generate.ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

/** ${f.description} (\`@jotis-me/assets/${f.entry}/<nombre>.svg\`). */
export const ${f.listName} = ${JSON.stringify(slugs)} as const;

${lines.join("\n")}
`,
	);
	console.log(`${lines.length} componentes de ${f.entry} → src/${f.entry}.generated.tsx`);
}

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
	entry: "cursors",
	dir: "cursors",
	listName: "cursorNames",
	description:
		"Los nombres de los cursores, como sus ficheros SVG (`hand-grab`, `macos-resize-north-south`)",
	componentName: (slug) => `Cursor${pascalCase(slug)}`,
});
