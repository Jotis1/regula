// README del artefacto (design D6): la guía, desde las páginas de fundamentos de la web en su orden. Las páginas son
// MDX y reparten el texto de la guía en componentes; aquí cada componente con texto vuelve a markdown y los que solo
// enseñan (ejemplos vivos, explorador de tokens) se omiten. Un componente que no esté en la lista rompe el build, para
// que ningún texto nuevo se pierda sin que nadie lo decida.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FOUNDATIONS } from "../../../apps/docs/src/lib/catalog";
import { CONTRAST_EXCEPTIONS, exceptionRatio } from "../../../apps/docs/src/lib/contrast-exceptions";
import { DOCS } from "./paths";

type Props = Record<string, unknown>;
type Item = Record<string, string>;

/** Componentes sin texto de la guía: piezas visuales y ejemplos. */
const VISUAL = new Set(["Example", "TokenExplorer", "BackgroundPattern", "Button", "EmptyState", "Alert"]);

const sentence = (s: string) => (/[.:!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** Componentes con texto: su markdown. */
const TEXT: Record<string, (p: Props) => string> = {
	Essentials: (p) =>
		(p.items as Item[]).map((i) => `- **${sentence(i.title ?? "")}** ${i.text}`).join("\n"),
	Terms: (p) => (p.items as Item[]).map((i) => `- **${sentence(i.term ?? "")}** ${i.text}`).join("\n"),
	Formats: (p) => (p.items as Item[]).map((i) => `- ${i.label}: \`${i.value}\``).join("\n"),
	Fit: (p) =>
		[
			`- **${String(p.fitsLabel ?? "Cabe")}:** ${(p.fits as string[]).join(", ")}.`,
			`- **${String(p.notsLabel ?? "No cabe")}:** ${(p.nots as string[]).join(", ")}.`,
		].join("\n"),
	ContrastExceptions: () =>
		[
			"| Token | Claro | Oscuro | Cómo se usa |",
			"| --- | --- | --- | --- |",
			...CONTRAST_EXCEPTIONS.map(
				(e) =>
					`| \`${e.name}\`${e.on === "white" ? " (con texto blanco)" : ""} | ${exceptionRatio(e, "light")} | ${exceptionRatio(e, "dark")} | ${e.how} |`,
			),
		].join("\n"),
};

const VERDICT: Record<string, string> = {
	do: "Esto sí",
	dont: "Esto no",
	instead: "En lugar de",
	better: "Mejor",
};
const attr = (tag: string, name: string) => {
	const m = tag.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)')`));
	return m?.[1] ?? m?.[2];
};

/**
 * Un `<Pair>` de reglas con ejemplo (`<Rule verdict caption>`): en la guía quedan el veredicto y su frase; el espécimen
 * es visual. Con `title` (contenido y tono), el par va en una sola línea.
 */
function pairToMarkdown(open: string, inner: string, file: string): string {
	const rules = [...inner.matchAll(/<Rule\s[^\n]*>/g)].map((m) => {
		const verdict = VERDICT[attr(m[0], "verdict") ?? ""];
		const caption = attr(m[0], "caption");
		if (!verdict || !caption)
			throw new Error(`${file}: <Rule> sin verdict o caption que pasar a markdown (guide.ts)`);
		return { verdict, caption };
	});
	if (!rules.length) throw new Error(`${file}: <Pair> sin <Rule> (guide.ts)`);
	const title = attr(open, "title");
	return title
		? `- **${sentence(title)}** ${rules.map((r) => `${r.verdict}: ${r.caption}`).join(" ")}`
		: rules.map((r) => `- **${r.verdict}.** ${r.caption}`).join("\n");
}

/** Recorta desde `start` hasta el cierre equilibrado de `{`/`[`/`(` (las cadenas cuentan como texto). */
function balanced(text: string, start: number): number {
	let depth = 0;
	let quote = "";
	for (let i = start; i < text.length; i++) {
		const c = text[i] as string;
		if (quote) {
			if (c === "\\") i++;
			else if (c === quote) quote = "";
		} else if (c === '"' || c === "'" || c === "`") quote = c;
		else if ("{[(".includes(c)) depth++;
		else if ("}])".includes(c) && --depth === 0) return i + 1;
	}
	throw new Error(`Llave sin cerrar en la posición ${start}`);
}

/** Props de una etiqueta JSX: `a="x"` o `a={expresión}` (contenido del repo: se evalúa como literal). */
function propsOf(tag: string): Props {
	const props: Props = {};
	const re = /([A-Za-z]+)=(?:"([^"]*)"|\{)/g;
	let m: RegExpExecArray | null = re.exec(tag);
	while (m) {
		if (m[2] !== undefined) props[m[1] as string] = m[2];
		else {
			const open = m.index + m[0].length - 1;
			const end = balanced(tag, open);
			// Un icono (`icon={Stars02}`) es un identificador importado, no un literal: en la guía no pinta nada
			try {
				props[m[1] as string] = new Function(`return (${tag.slice(open + 1, end - 1)});`)();
			} catch (error) {
				if (!(error instanceof ReferenceError)) throw error;
			}
			re.lastIndex = end;
		}
		m = re.exec(tag);
	}
	return props;
}

/** El cuerpo MDX de una página, en markdown: los `##` bajan un nivel (cada página es un `##` del README). */
export function mdxToMarkdown(source: string, file = "página"): string {
	// Sin frontmatter ni comentarios MDX (`{/* … */}`, también de varias líneas)
	const body = source.replace(/^---[\s\S]*?\n---\n/, "").replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "");
	const out: string[] = [];
	let i = 0;
	while (i < body.length) {
		const rest = body.slice(i);
		const tag = rest.match(/^<([A-Z][A-Za-z]*)/);
		const lineStart = i === 0 || body[i - 1] === "\n";
		if (lineStart && tag) {
			const name = tag[1] as string;
			// La etiqueta de apertura acaba en el primer `>` fuera de llaves y comillas
			let j = 1;
			while (j < rest.length && rest[j] !== ">") {
				const c = rest[j] as string;
				if ("{[(".includes(c)) j = balanced(rest, j);
				else if (c === '"' || c === "'") j = rest.indexOf(c, j + 1) + 1;
				else j++;
			}
			const open = rest.slice(0, j + 1);
			const selfClosing = open.endsWith("/>");
			const close = selfClosing ? j + 1 : rest.indexOf(`</${name}>`) + `</${name}>`.length;
			if (!selfClosing && close < `</${name}>`.length) throw new Error(`${file}: <${name}> sin cerrar`);
			if (name === "Pair") out.push(`${pairToMarkdown(open, rest.slice(j + 1, close), file)}\n`);
			else if (TEXT[name]) out.push(`${(TEXT[name] as (p: Props) => string)(propsOf(open))}\n`);
			else if (!VISUAL.has(name))
				throw new Error(`${file}: <${name}> no sabe pasar a markdown (guide.ts)`);
			i += close;
			continue;
		}
		const next = body.indexOf("\n", i);
		const line = body.slice(i, next < 0 ? body.length : next);
		i = next < 0 ? body.length : next + 1;
		if (/^import\s/.test(line) || /^\{\/\*.*\*\/\}\s*$/.test(line)) continue;
		out.push(line.replace(/^(#{2,5}) /, "#$1 "));
	}
	return dropEmptyHeadings(
		out
			.join("\n")
			.replace(/\n{3,}/g, "\n\n")
			.trim(),
	);
}

/** Quita los títulos que se quedan sin texto (su sección solo tenía piezas visuales, como el explorador de tokens). */
function dropEmptyHeadings(md: string): string {
	const lines = md.split("\n");
	const level = (l: string) => l.match(/^(#{1,6}) /)?.[1]?.length ?? 0;
	const keep = lines.filter((line, i) => {
		const h = level(line);
		if (!h) return true;
		const next = lines.slice(i + 1).find((l) => l.trim() !== "");
		return next !== undefined && (level(next) === 0 || level(next) > h);
	});
	return keep
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

const titleOf = (source: string) => source.match(/^title: "([^"]+)"/m)?.[1] ?? "";

/** Las páginas de fundamentos en el orden de la web (Stream, que tiene sección propia, al final). */
export function guidePages(): string[] {
	return [...FOUNDATIONS.map((f) => f.slug), "stream"];
}

export function buildGuide(intro: string): string {
	const dir = join(DOCS, "src/content/foundations");
	const sections = guidePages().map((slug) => {
		const file = [`${slug}.mdx`, `${slug}.md`].find((f) => {
			try {
				readFileSync(join(dir, f));
				return true;
			} catch {
				return false;
			}
		});
		if (!file) throw new Error(`No está la página de fundamentos ${slug}`);
		const source = readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n");
		return `## ${titleOf(source)}\n\n${mdxToMarkdown(source, file)}`;
	});
	return `${intro.trim()}\n\n${sections.join("\n\n")}\n`;
}
