// Genera el CSS y los módulos de tokens a partir de tokens.json. Funciones puras: el build y los tests las usan.

export interface ThemedValue {
	light: string;
	dark: string;
}

export interface Token<V = string> {
	name: string;
	value: V;
	usage: string;
}

export interface TypeStyle {
	name: string;
	fontSize: string;
	lineHeight: string;
	fontWeight: number;
	letterSpacing?: string;
	usage?: string;
}

export interface TokensFile {
	name: string;
	version: number;
	color: { themes: { id: string; name: string }[]; tokens: Token<ThemedValue>[] };
	type: {
		fonts: { family: string; file: string; weight: string; style: string }[];
		families: Record<"display" | "body" | "mono", string>;
		groups: { name: string; family: string; styles: TypeStyle[] }[];
	};
	spacing: { tokens: Token[] };
	radius: { tokens: Token[] };
	width: { tokens: Token[] };
	shadow: { tokens: Token<ThemedValue>[] };
	blur: { tokens: Token[] };
}

const HEADER = "/* Generado por @jotis-me/tokens a partir de tokens.json. No editar a mano. */\n";

/** Todos los tokens con valor por tema (colores y sombras), en el orden del fichero. */
function themed(t: TokensFile): Token<ThemedValue>[] {
	return [...t.color.tokens, ...t.shadow.tokens];
}

/** Tokens con un único valor (espaciado, radios, anchos, desenfoques). */
function plain(t: TokensFile): Token[] {
	return [...t.spacing.tokens, ...t.radius.tokens, ...t.width.tokens, ...t.blur.tokens];
}

/**
 * tokens.css: cada token como variable con su nombre de la guía (`--bg-primary`, `--spacing-md`).
 * Claro en `:root`, oscuro en `.dark-mode`, que puede ir en `<html>` o en cualquier ancestro, y claro otra vez en
 * `.light-mode`, para un trozo claro dentro de una página oscura (no se anida un `.dark-mode` dentro).
 */
export function tokensCss(t: TokensFile): string {
	const light = themed(t).map((x) => `\t--${x.name}: ${x.value.light};`);
	const dark = themed(t)
		.filter((x) => x.value.dark !== x.value.light)
		.map((x) => `\t--${x.name}: ${x.value.dark};`);
	const rest = plain(t).map((x) => `\t--${x.name}: ${x.value};`);
	// Los mismos tokens que cambian en oscuro, de vuelta a su valor claro: un trozo claro dentro de una página oscura
	const back = themed(t)
		.filter((x) => x.value.dark !== x.value.light)
		.map((x) => `\t--${x.name}: ${x.value.light};`);
	return `${HEADER}\n:root {\n${[...light, ...rest].join("\n")}\n}\n\n.dark-mode {\n\tcolor-scheme: dark;\n${dark.join("\n")}\n}\n\n.light-mode {\n\tcolor-scheme: light;\n${back.join("\n")}\n}\n`;
}

/**
 * Variable de tema de Tailwind v4 para un token de color, según su prefijo:
 * `bg-*` → `--background-color-*` (utilidad `bg-*`), `text-*` → `--text-color-*` (`text-*`),
 * `border-*` → `--border-color-*` (y también anillo y contorno), el resto → `--color-<nombre>`.
 */
export function themeVarsFor(name: string): string[] {
	if (name.startsWith("bg-")) return [`--background-color-${name.slice(3)}`];
	if (name.startsWith("text-")) return [`--text-color-${name.slice(5)}`];
	if (name.startsWith("border-")) {
		const n = name.slice(7);
		return [`--border-color-${n}`, `--ring-color-${n}`, `--outline-color-${n}`];
	}
	return [`--color-${name}`];
}

/** Utilidad de ejemplo que expone un token de color (para la documentación). */
export function utilityFor(name: string): string {
	if (name.startsWith("bg-") || name.startsWith("text-") || name.startsWith("border-")) return name;
	if (name.startsWith("fg-")) return `text-${name}`;
	if (name.startsWith("focus-ring")) return `ring-${name}`;
	return `bg-${name}`;
}

const px = (v: string) => Number.parseFloat(v);

function typeScale(t: TokensFile): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	for (const group of t.type.groups) {
		for (const s of group.styles) {
			// display-sm-semibold → display-sm; text-md-regular → md; code-sm → code-sm
			const size = s.name.replace(/-(regular|medium|semibold|bold)$/, "").replace(/^text-/, "");
			if (seen.has(size)) continue;
			seen.add(size);
			out.push(`\t--text-${size}: ${px(s.fontSize) / 16}rem;`);
			out.push(`\t--text-${size}--line-height: ${px(s.lineHeight) / 16}rem;`);
			if (s.letterSpacing && s.letterSpacing !== "0")
				out.push(`\t--text-${size}--letter-spacing: ${s.letterSpacing};`);
		}
	}
	return out;
}

/**
 * theme.css: tema de Tailwind v4. `@theme inline` hace que cada utilidad lea la variable del token
 * directamente, de modo que `.dark-mode` cambia también un subárbol. La paleta cruda no existe.
 */
export function themeCss(t: TokensFile): string {
	const colors = t.color.tokens.flatMap((x) =>
		themeVarsFor(x.name).map((v) => `\t${v}: var(--${x.name});`),
	);
	// alpha-white-10…100 también como color base para el modificador de opacidad: bg-alpha-white/10
	const alphaBase = ["white", "black"].map((c) => `\t--color-alpha-${c}: var(--alpha-${c}-100);`);
	const families = Object.entries(t.type.families).map(([k, v]) => `\t--font-${k}: ${v};`);
	// Radios y sombras llevan el mismo nombre que su variable de tokens.css: van con valor literal
	// para no crear una referencia circular. Solo el anillo de foco cambia con el tema.
	const radius = t.radius.tokens.map((x) => `\t--${x.name}: ${x.value};`);
	const shadows = t.shadow.tokens.map((x) =>
		x.name.endsWith("-shadow")
			? `\t--shadow-${x.name.replace(/-shadow$/, "")}: var(--${x.name});`
			: `\t--${x.name}: ${x.value.light};`,
	);
	const blur = t.blur.tokens.map(
		(x) => `\t--${x.name.replace(/^backdrop-/, "")}: ${x.value.replace(/^blur\((.*)\)$/, "$1")};`,
	);
	const width = (n: string) => t.width.tokens.find((x) => x.name === n)?.value ?? "";

	return `${HEADER}
@custom-variant dark (&:where(.dark-mode, .dark-mode *):not(:where(.light-mode, .light-mode *)));

@theme inline {
\t--color-*: initial;
\t--text-*: initial;
\t--font-*: initial;
\t--radius-*: initial;
\t--shadow-*: initial;
\t--blur-*: initial;

${colors.join("\n")}
${alphaBase.join("\n")}

${families.join("\n")}
\t--font-sans: var(--font-body);

${typeScale(t).join("\n")}

${radius.join("\n")}

${shadows.join("\n")}

${blur.join("\n")}

\t--container-container: ${width("container-max-width-desktop")};
\t--container-paragraph: ${width("paragraph-max-width")};
}

@layer base {
\thtml {
\t\tfont-family: var(--font-body);
\t\tcolor: var(--text-primary);
\t\tbackground-color: var(--bg-primary);
\t}
}
`;
}

/** Fuente incluida en el paquete: familia, fichero woff2 y rango Unicode. */
export interface FontFile {
	family: string;
	file: string;
	weight: string;
	style: string;
	unicodeRange?: string;
}

export function fontsCss(fonts: FontFile[]): string {
	const faces = fonts.map(
		(f) => `@font-face {
\tfont-family: "${f.family}";
\tfont-style: ${f.style};
\tfont-weight: ${f.weight};
\tfont-display: swap;
\tsrc: url("./fonts/${f.file}") format("woff2");${f.unicodeRange ? `\n\tunicode-range: ${f.unicodeRange};` : ""}
}`,
	);
	return `${HEADER}\n${faces.join("\n\n")}\n`;
}

/** Módulo JS con los tokens de color como objeto `{ nombre: { light, dark, usage } }` y el resto en grupos. */
export function indexJs(t: TokensFile): string {
	const colors = Object.fromEntries(t.color.tokens.map((x) => [x.name, { ...x.value, usage: x.usage }]));
	const shadows = Object.fromEntries(t.shadow.tokens.map((x) => [x.name, { ...x.value, usage: x.usage }]));
	const group = (list: Token[]) =>
		Object.fromEntries(list.map((x) => [x.name, { value: x.value, usage: x.usage }]));
	const data = {
		colors,
		shadows,
		spacing: group(t.spacing.tokens),
		radius: group(t.radius.tokens),
		width: group(t.width.tokens),
		blur: group(t.blur.tokens),
		type: t.type,
	};
	return `${HEADER}
export const colors = ${JSON.stringify(data.colors, null, "\t")};
export const shadows = ${JSON.stringify(data.shadows, null, "\t")};
export const spacing = ${JSON.stringify(data.spacing, null, "\t")};
export const radius = ${JSON.stringify(data.radius, null, "\t")};
export const width = ${JSON.stringify(data.width, null, "\t")};
export const blur = ${JSON.stringify(data.blur, null, "\t")};
export const type = ${JSON.stringify(data.type, null, "\t")};
export const tokens = colors;
export const seriesColors = ["utility-brand-600", "utility-brand-400", "utility-brand-200", "utility-sky-500", "utility-pink-500", "utility-neutral-400"];
`;
}

export function indexDts(t: TokensFile): string {
	const union = (names: string[]) => names.map((n) => JSON.stringify(n)).join(" | ");
	const colorNames = t.color.tokens.map((x) => x.name);
	const shadowNames = t.shadow.tokens.map((x) => x.name);
	const g = (name: string, list: Token[]) =>
		`export type ${name}Name = ${union(list.map((x) => x.name))};\nexport declare const ${name.toLowerCase()}: Record<${name}Name, PlainToken>;`;
	return `${HEADER}
export interface ThemedToken { light: string; dark: string; usage: string; }
export interface PlainToken { value: string; usage: string; }
export type ColorName = ${union(colorNames)};
export type ShadowName = ${union(shadowNames)};
export declare const colors: Record<ColorName, ThemedToken>;
export declare const tokens: Record<ColorName, ThemedToken>;
export declare const shadows: Record<ShadowName, ThemedToken>;
${g("Spacing", t.spacing.tokens)}
${g("Radius", t.radius.tokens)}
${g("Width", t.width.tokens)}
${g("Blur", t.blur.tokens)}
export interface TypeStyle { name: string; fontSize: string; lineHeight: string; fontWeight: number; letterSpacing?: string; usage?: string; }
export declare const type: {
\tfonts: { family: string; file: string; weight: string; style: string }[];
\tfamilies: Record<"display" | "body" | "mono", string>;
\tgroups: { name: string; family: string; styles: TypeStyle[] }[];
};
export declare const seriesColors: readonly ColorName[];
`;
}
