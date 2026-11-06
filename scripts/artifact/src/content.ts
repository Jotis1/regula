// Fichas, vistas previas, tokens, fuentes y assets del artefacto (design D6), todo desde el repo.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { apps, iconNames } from "@jotis-me/icons";
import { COMPONENT_GROUPS, catalogComponents, slugOf } from "../../../apps/docs/src/lib/catalog";
import { CARD_HEIGHTS, DARK_PREVIEWS } from "../../../apps/docs/src/visual/cards";
import { DOCS, ICONS, REACT, REPO, TOKENS } from "./paths";

export const catalog = (): string[] => catalogComponents();

/** Ficha del artefacto: la descripción de la página como primera frase y su cuerpo tal cual. */
export function componentReadme(name: string): string {
	const source = readFileSync(join(DOCS, "src/content/components", `${slugOf(name)}.md`), "utf8").replace(
		/\r\n/g,
		"\n",
	);
	const front = source.match(/^---\n([\s\S]*?)\n---\n/);
	if (!front) throw new Error(`${name}: la ficha no tiene frontmatter`);
	const raw = front[1]?.match(/^description:\s*(.+)$/m)?.[1]?.trim();
	if (!raw) throw new Error(`${name}: la ficha no tiene description`);
	const description = raw.startsWith('"') ? (JSON.parse(raw) as string) : raw;
	return `${description}\n\n${source.slice(front[0].length).trim()}\n`;
}

/** Grupo de la tarjeta: el de la navegación de la web (los de Stream, con su prefijo, como en la guía). */
export function groupLabel(name: string): string {
	const group = COMPONENT_GROUPS.find((g) => g.components.includes(name));
	if (!group) throw new Error(`${name} no está en ningún grupo del catálogo`);
	return group.section === "stream" ? `Stream · ${group.label}` : group.label;
}

/**
 * Vista previa: monta `Jotis.previews.<Nombre>`, el mismo ejemplo que la web compara con su captura aprobada, con el
 * mismo marco que la página /visual/ (16px de margen sobre bg-primary). Las de Stream van siempre en oscuro.
 */
export function componentPreview(name: string): string {
	const height = CARD_HEIGHTS[name];
	if (!height) throw new Error(`${name} no tiene alto de tarjeta en el registro (CARD_HEIGHTS)`);
	const dark = DARK_PREVIEWS.has(name);
	return `<!-- @dsCard group="${groupLabel(name)}" height=${height} -->
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${name}</title>
<style>
html, body { margin: 0; }
body { padding: 16px; background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-body); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
</style>
</head>
<body>
<div id="root"></div>
<script>
${dark ? 'document.documentElement.setAttribute("data-theme", "dark");\n' : ""}ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(window.Jotis.previews[${JSON.stringify(name)}]));
</script>
</body>
</html>
`;
}

/** Fichero fuente de cada componente, para la procedencia de `tokens.json`. */
function componentSources(): Record<string, string> {
	const dir = join(REACT, "src/components");
	const out: Record<string, string> = {};
	for (const name of catalog()) {
		const file = `${name}.tsx`;
		if (!existsSync(join(dir, file)))
			throw new Error(`${name}: no está packages/react/src/components/${file}`);
		out[name] = `packages/react/src/components/${file}`;
	}
	return out;
}

export interface FontFile {
	/** Ruta en el artefacto (`fonts/…`). */
	path: string;
	source: string;
}

/**
 * `tokens.json` del paquete con la procedencia del repo. Las fuentes que el paquete parte por alfabeto
 * (Bricolage: `-latin` y `-latin-ext`) se nombran con el fichero `-latin`: `type.fonts` no admite `unicode-range`
 * y el latín básico y Latin-1 cubren el castellano.
 */
export function tokensJson(ref: string, date: string): { json: string; fonts: FontFile[] } {
	const tokens = JSON.parse(readFileSync(join(TOKENS, "src/tokens.json"), "utf8"));
	const fontsDir = join(TOKENS, "dist/fonts");
	const fonts: FontFile[] = [];
	for (const font of tokens.type.fonts as { file: string }[]) {
		const base = font.file.replace(/^fonts\//, "");
		const file = [base, base.replace(/\.woff2$/, "-latin.woff2")].find((f) =>
			existsSync(join(fontsDir, f)),
		);
		if (!file) throw new Error(`No está la fuente ${font.file} en packages/tokens/dist/fonts`);
		font.file = `fonts/${file}`;
		fonts.push({ path: `fonts/${file}`, source: join(fontsDir, file) });
	}
	tokens.meta = {
		source: "github",
		repo: REPO,
		ref,
		package: "packages/react",
		paths: {
			tokens: ["packages/tokens/src/tokens.json"],
			fonts: ["packages/tokens/dist/fonts"],
			assets: ["packages/icons/assets", "packages/icons/dist/app-icons", "packages/icons/dist/svg"],
			docs: ["apps/docs/src/content/foundations", "apps/docs/src/content/components"],
		},
		components: componentSources(),
		synced: date,
	};
	return { json: `${JSON.stringify(tokens, null, "\t")}\n`, fonts };
}

export interface Asset {
	group: string;
	name: string;
	data: Buffer;
	type: "image/svg+xml";
}

const svg = (group: string, name: string, data: Buffer | string): Asset => ({
	group,
	name,
	data: Buffer.isBuffer(data) ? data : Buffer.from(data),
	type: "image/svg+xml",
});

/**
 * Grupos de assets que salen del repo. En el artefacto los SVG se ven con <img>, que no hereda color: los trazos y
 * patrones llevan su tinta de la guía (#171717) y los iconos la de `fg-tertiary` (#525252). Logos no sale del repo:
 * se conserva el publicado.
 */
export function assets(): Asset[] {
	const out: Asset[] = [];
	const appIcons = join(ICONS, "dist/app-icons");
	for (const app of Object.keys(apps))
		for (const variant of ["default", "solid", "light", "mono", "maskable"])
			out.push(
				svg(
					"App icons",
					`${app}-${variant}.svg`,
					readFileSync(join(appIcons, `${app}-${variant}.svg`)),
				),
			);
	const iconsDir = join(ICONS, "dist/svg");
	for (const name of iconNames)
		out.push(
			svg(
				"Icons",
				`${name}.svg`,
				readFileSync(join(iconsDir, `${name}.svg`), "utf8").replace(/currentColor/g, "#525252"),
			),
		);
	for (const [group, folder] of [
		["Hand-drawn", "hand-drawn"],
		["Patterns", "patterns"],
	] as const) {
		const dir = join(ICONS, "assets", folder);
		for (const f of readdirSync(dir)
			.filter((x) => x.endsWith(".svg"))
			.sort())
			out.push(svg(group, f, readFileSync(join(dir, f), "utf8").replace(/currentColor/g, "#171717")));
	}
	return out;
}

/** Grupos de assets en el orden de la guía, y el tamaño de sus tarjetas. */
export const ASSET_GROUPS = [
	["Logos", "l"],
	["App icons", "m"],
	["Icons", "xs"],
	["Hand-drawn", "m"],
	["Patterns", "l"],
] as const;
