// The public JSON `/tokens.json` (spec mcp-server, «Datos públicos en JSON»): the tokens of `@jotis-me/tokens`
// flattened to `{ name, category, value, usage }`. `value` is a string, or `{ light, dark }` when the token changes
// between themes. Type styles have no single value: their parts go in `value` as an object and the family in `font`.

export type TokenValue = string | { light: string; dark: string };

export interface FlatToken {
	name: string;
	category: string;
	value: TokenValue | { fontSize: string; lineHeight: string; fontWeight: number; letterSpacing: string };
	font?: string;
	/** What it is for; `null` when the source does not say (some type styles). */
	usage: string | null;
}

interface SimpleCategory {
	tokens: { name: string; value: TokenValue; usage: string }[];
}

/** The part of `tokens.json` this reads; the rest (meta, fonts) is not published again. */
export interface TokensSource {
	color: SimpleCategory;
	type: {
		families: Record<string, string>;
		groups: {
			family: string;
			styles: {
				name: string;
				fontSize: string;
				lineHeight: string;
				fontWeight: number;
				letterSpacing: string;
				usage?: string;
			}[];
		}[];
	};
	spacing: SimpleCategory;
	radius: SimpleCategory;
	width: SimpleCategory;
	shadow: SimpleCategory;
	blur: SimpleCategory;
}

/** Categories as the package names them, in reading order. */
export const TOKEN_CATEGORIES = ["color", "type", "spacing", "radius", "width", "shadow", "blur"] as const;
export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];

export function tokensJson(source: TokensSource, version: string) {
	const tokens: FlatToken[] = [];
	for (const category of TOKEN_CATEGORIES) {
		if (category === "type") {
			for (const group of source.type.groups)
				for (const { name, usage, ...value } of group.styles)
					tokens.push({
						name,
						category,
						value,
						font: source.type.families[group.family],
						usage: usage ?? null,
					});
			continue;
		}
		for (const t of source[category].tokens)
			tokens.push({ name: t.name, category, value: t.value, usage: t.usage });
	}
	return { version, categories: TOKEN_CATEGORIES, tokens };
}
