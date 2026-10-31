// Construye dist/ a partir de src/tokens.json. Uso: bun run scripts/build.ts
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import {
	type FontFile,
	fontsCss,
	indexDts,
	indexJs,
	type TokensFile,
	themeCss,
	tokensCss,
} from "../src/generate.ts";

const root = join(import.meta.dirname, "..");
const dist = join(root, "dist");
const require = createRequire(import.meta.url);
const tokens: TokensFile = JSON.parse(readFileSync(join(root, "src/tokens.json"), "utf8"));

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "fonts"), { recursive: true });

// Fuentes: mismas tipografías OFL que la guía, tomadas de npm (el artefacto no deja extraer binarios)
const geist = join(dirname(require.resolve("geist/package.json")), "dist/fonts");
const bricolage = join(
	dirname(require.resolve("@fontsource-variable/bricolage-grotesque/package.json")),
	"files",
);
const LATIN =
	"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
	"U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const sources: [string, FontFile][] = [
	[
		join(geist, "geist-sans/Geist-Variable.woff2"),
		{ family: "Geist", file: "Geist-Variable.woff2", weight: "100 900", style: "normal" },
	],
	[
		join(geist, "geist-sans/Geist-Italic[wght].woff2"),
		{ family: "Geist", file: "Geist-Variable-Italic.woff2", weight: "100 900", style: "italic" },
	],
	[
		join(geist, "geist-mono/GeistMono-Variable.woff2"),
		{ family: "Geist Mono", file: "GeistMono-Variable.woff2", weight: "100 900", style: "normal" },
	],
	[
		join(bricolage, "bricolage-grotesque-latin-wght-normal.woff2"),
		{
			family: "Bricolage Grotesque",
			file: "BricolageGrotesque-Variable-latin.woff2",
			weight: "200 800",
			style: "normal",
			unicodeRange: LATIN,
		},
	],
	[
		join(bricolage, "bricolage-grotesque-latin-ext-wght-normal.woff2"),
		{
			family: "Bricolage Grotesque",
			file: "BricolageGrotesque-Variable-latin-ext.woff2",
			weight: "200 800",
			style: "normal",
			unicodeRange: LATIN_EXT,
		},
	],
];
for (const [from, font] of sources) copyFileSync(from, join(dist, "fonts", font.file));
copyFileSync(
	join(dirname(require.resolve("geist/package.json")), "LICENSE.txt"),
	join(dist, "fonts/LICENSE-Geist.txt"),
);
copyFileSync(
	join(dirname(require.resolve("@fontsource-variable/bricolage-grotesque/package.json")), "LICENSE"),
	join(dist, "fonts/LICENSE-BricolageGrotesque.txt"),
);

writeFileSync(join(dist, "tokens.css"), tokensCss(tokens));
writeFileSync(join(dist, "theme.css"), themeCss(tokens));
writeFileSync(join(dist, "fonts.css"), fontsCss(sources.map(([, f]) => f)));
writeFileSync(join(dist, "index.js"), indexJs(tokens));
writeFileSync(join(dist, "index.d.ts"), indexDts(tokens));
writeFileSync(join(dist, "tokens.json"), JSON.stringify(tokens, null, "\t"));

console.log(`@jotis-me/tokens: ${tokens.color.tokens.length} colores, ${sources.length} fuentes → dist/`);
