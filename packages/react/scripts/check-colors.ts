// Prohíbe colores hex y utilidades de la paleta cruda de Tailwind en los componentes:
// todo color sale de un token semántico. Uso: bun run scripts/check-colors.ts src
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** Ficheros con paleta propia documentada en la guía. Cada excepción lleva su motivo. */
export const ALLOWED: Record<string, string> = {
	"components/AppIcon.tsx": "El tono de cada app vive solo en su icono (guía, «Iconos de app»).",
	"components/CreditCard.tsx":
		"La tarjeta es un objeto: sus colores no cambian con el tema (ficha de CreditCard).",
	"components/BrowserFrame.tsx": "Los colores del semáforo son fijos (ficha de BrowserFrame).",
	"components/VideoPlayer.tsx": "Controles en blanco y negro fijos sobre el vídeo (ficha de VideoPlayer).",
	"components/TextEditor.tsx":
		"Las 16 muestras del selector de color del texto son datos que se escriben en el contenido, no estilo (ficha de TextEditor).",
};

const PALETTE =
	"slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PREFIX =
	"bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|via|to|divide|placeholder|shadow|decoration|accent|caret";
// `bg-indigo-600`, `hover:text-gray-500/50`; no `bg-utility-neutral-300`, que es un token
const RAW_UTILITY = new RegExp(
	String.raw`(?<![\w-])(?:[\w-]+:)*(?:${PREFIX})-(?:(?:${PALETTE})-\d{2,3}|white|black)(?:\/\d+)?(?![\w-])`,
	"g",
);
const HEX = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi;
// Colores escritos como función: también cuentan, para que no se cuelen como `rgb(…)`
const FUNCTION = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(\s*[\d.]/gi;
// `text-white` y `fg-white` son tokens de la guía, no paleta cruda
const TOKENS = new Set(["text-white", "text-fg-white"]);
/** Excepción de una línea con su motivo: `// color-fijo: <motivo de la guía>` en la línea anterior. */
const EXCEPTION = /\/\/\s*color-fijo:\s*\S/;

export interface Finding {
	line: number;
	match: string;
	kind: "hex" | "paleta" | "función";
}

export function findRawColors(code: string): Finding[] {
	const out: Finding[] = [];
	const lines = code.split("\n");
	lines.forEach((text, i) => {
		if (i > 0 && EXCEPTION.test(lines[i - 1] as string)) return;
		for (const m of text.matchAll(HEX)) out.push({ line: i + 1, match: m[0], kind: "hex" });
		for (const m of text.matchAll(FUNCTION)) out.push({ line: i + 1, match: m[0], kind: "función" });
		for (const m of text.matchAll(RAW_UTILITY))
			if (!TOKENS.has(m[0].split(":").at(-1) as string))
				out.push({ line: i + 1, match: m[0], kind: "paleta" });
	});
	return out;
}

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(f) ? [p] : [];
	});
}

export function checkDir(dir: string): string[] {
	const problems: string[] = [];
	for (const file of files(dir)) {
		const rel = relative(dir, file).split(sep).join("/");
		if (rel in ALLOWED) continue;
		for (const f of findRawColors(readFileSync(file, "utf8")))
			problems.push(
				`${rel}:${f.line} ${f.kind === "hex" ? "color hex" : f.kind === "función" ? "color en función" : "paleta cruda"} «${f.match}»: usa un token semántico`,
			);
	}
	return problems;
}

if (import.meta.main) {
	const dir = process.argv[2] ?? "src";
	const problems = checkDir(dir);
	for (const p of problems) console.error(p);
	if (problems.length) {
		console.error(`\n${problems.length} colores fuera de los tokens.`);
		process.exit(1);
	}
	console.log("Sin colores fuera de los tokens.");
}
