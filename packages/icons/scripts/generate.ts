// Genera src/components.generated.tsx: un componente por icono (IconCalendar, IconAlertCircle…).
// Uso: bun run scripts/generate.ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { icons } from "../src/data/icons.ts";

export const componentName = (name: string) =>
	`Icon${name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}`;

const lines = Object.keys(icons).map(
	(name) =>
		`export const ${componentName(name)} = (props: IconComponentProps) => <Icon name="${name}" {...props} />;`,
);

writeFileSync(
	join(import.meta.dirname, "../src/components.generated.tsx"),
	`// Generado por scripts/generate.ts. No editar a mano.
import { Icon, type IconProps } from "./Icon.js";

export type IconComponentProps = Omit<IconProps, "name">;

${lines.join("\n")}
`,
);
console.log(`${lines.length} componentes de icono → src/components.generated.tsx`);

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
