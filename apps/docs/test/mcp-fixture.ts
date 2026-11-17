// Data for the MCP tests: built with the same functions that write the public JSON, from the real standards, tokens
// and galleries, and from three real component cards so it does not parse all 130 sources.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import source from "@jotis-me/tokens/tokens.json";
import { parse } from "yaml";
import type { RegulaData } from "../src/features/mcp/data";
import { type ComponentEntry, componentsJson } from "../src/lib/components-json";
import { galleryEntries } from "../src/lib/gallery-entries";
import { GALLERIES, iconsJson } from "../src/lib/icons-json";
import { nativeOf, propsOf } from "../src/lib/props";
import { snippetsOf } from "../src/lib/snippets";
import { standardsJson } from "../src/lib/standards";
import { type TokensSource, tokensJson } from "../src/lib/tokens-json";

const root = join(import.meta.dirname, "../../..");
const content = join(import.meta.dirname, "../src/content");
const SITE = "https://regula.jotis.me/";
export const VERSION = "1.2.3";

const standards = readdirSync(join(content, "standards"))
	.filter((f) => f.endsWith(".yaml"))
	.map((f) => ({
		id: f.replace(/\.yaml$/, ""),
		data: parse(readFileSync(join(content, "standards", f), "utf8")),
	}));

const components: ComponentEntry[] = ["button", "badge", "modal"].map((id) => {
	const raw = readFileSync(join(content, "components", `${id}.md`), "utf8");
	const [, front, body] = raw.split(/^---\s*$/m);
	return { id, data: parse(front as string), body };
});

const galleries = Object.fromEntries(GALLERIES.map((kind) => [kind, galleryEntries(kind)])) as Parameters<
	typeof iconsJson
>[0];

export const data: RegulaData = {
	standards: standardsJson(standards, VERSION, SITE),
	components: componentsJson(
		components,
		{
			propsOf: (e) =>
				propsOf(
					join(root, e.data.source ?? `packages/react/src/components/${e.data.name}.tsx`),
					e.data.name,
				),
			nativeOf: (e) =>
				nativeOf(
					join(root, e.data.source ?? `packages/react/src/components/${e.data.name}.tsx`),
					e.data.name,
				),
			snippetsOf,
		},
		VERSION,
		SITE,
	),
	tokens: tokensJson(source as unknown as TokensSource, VERSION),
	icons: iconsJson(galleries, VERSION, SITE),
};
