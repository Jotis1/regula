// The public JSON `/foundations.json` (spec mcp-server, «Fundamentos en JSON»): every design foundation with its
// sections, as Markdown. Much of what a foundation says lives in the props of the pieces of `components/compose/`
// (the caption of a `Rule`, the items of `Essentials`), so the text is read from the MDX tree and not only from its
// Markdown. A component nobody has classified stops the build instead of losing its text without notice.
import { defaultStrings } from "@jotis-me/react";
import { type Expression, parseExpressionAt } from "acorn";
import { markdownToMdast, mdxToMdast } from "satteri";
import { CONTRAST_EXCEPTIONS, exceptionRatio } from "./contrast-exceptions";

export interface FoundationEntry {
	/** File name without extension: the last segment of `/foundations/<id>/`. */
	id: string;
	data: { title: string; description: string; order: number };
	/** The page as written, without its frontmatter. */
	body?: string | undefined;
	/** Path of the file, for the errors and to tell Markdown from MDX. */
	filePath?: string | undefined;
}

export interface FoundationDeps {
	/** The anchors of the `##` of the page, in order: the ones the page itself carries. */
	anchorsOf: (entry: FoundationEntry) => string[];
	/** The sections the token tables add at the end of the page. */
	tokenSectionsOf: (id: string) => { slug: string; text: string; category: string }[];
}

interface Attribute {
	type: string;
	name?: string;
	value?: string | { value: string } | null;
}

/** The part of an mdast node this reads. */
interface Node {
	type: string;
	value?: string;
	depth?: number;
	ordered?: boolean;
	url?: string;
	name?: string | null;
	attributes?: Attribute[];
	children?: Node[];
}

type Props = Record<string, unknown>;
type Item = Record<string, string>;

const VERDICT: Record<string, string> = {
	do: defaultStrings.exampleDo,
	dont: defaultStrings.exampleDont,
	instead: defaultStrings.exampleInstead,
	better: defaultStrings.exampleBetter,
};

const items = (p: Props) => (p.items ?? []) as Item[];
const list = (label: unknown, values: unknown) => `**${label}:** ${(values as string[]).join(", ")}`;

/** The components that say something of the guide in their props: which props, and the lines they become. */
const TEXT: Record<string, { props: string[]; lines: (p: Props) => string[] }> = {
	Rule: {
		props: ["verdict", "caption"],
		lines: (p) => [`**${VERDICT[p.verdict as string]}.** ${p.caption}`],
	},
	Example: { props: ["caption"], lines: (p) => (p.caption ? [String(p.caption)] : []) },
	Essentials: { props: ["items"], lines: (p) => items(p).map((i) => `**${i.title}.** ${i.text}`) },
	Terms: { props: ["items"], lines: (p) => items(p).map((i) => `**${i.term}.** ${i.text}`) },
	Formats: { props: ["items"], lines: (p) => items(p).map((i) => `**${i.label}.** ${i.value}`) },
	Fit: {
		props: ["fits", "nots", "fitsLabel", "notsLabel"],
		lines: (p) => [list(p.fitsLabel ?? "Cabe", p.fits), list(p.notsLabel ?? "No cabe", p.nots)],
	},
	// These two take no props: what they show comes from the tokens
	ContrastExceptions: {
		props: [],
		lines: () => [
			CONTRAST_EXCEPTIONS.map((e) => {
				const on = e.on === "white" ? " con texto blanco" : "";
				return `- \`${e.name}\`${on} (${exceptionRatio(e, "light")} en claro, ${exceptionRatio(e, "dark")} en oscuro): ${e.how}`;
			}).join("\n"),
		],
	},
	TokenExplorer: {
		props: [],
		lines: () => ["Los tokens de color están en `search_tokens`, categoría `color`."],
	},
};
/** Their children are read; `title` names the case the pair shows. */
const CONTAINERS = new Set(["Pair"]);
/** They only paint a demo: nothing of theirs is text of the guide. */
const DEMOS = new Set([
	"Alert",
	"BackgroundPattern",
	"Badge",
	"Banner",
	"Button",
	"Calendar",
	"EmptyState",
	"Input",
	"OversizedIcon",
]);

/** The value of a literal (`[{ title: "Fondos" }]`), read from its syntax tree: nothing is evaluated (SEC-015). */
function literal(node: Expression): unknown {
	switch (node.type) {
		case "Literal":
			return node.value;
		case "TemplateLiteral":
			if (node.expressions.length) break;
			return node.quasis.map((q) => q.value.cooked).join("");
		case "ArrayExpression":
			return node.elements.map((e) => {
				if (!e || e.type === "SpreadElement") throw new Error("not a literal");
				return literal(e);
			});
		case "ObjectExpression":
			return Object.fromEntries(
				node.properties.map((p) => {
					if (p.type !== "Property" || p.computed) throw new Error("not a literal");
					const key = p.key.type === "Identifier" ? p.key.name : literal(p.key);
					return [key, literal(p.value)];
				}),
			);
	}
	throw new Error("not a literal");
}

/** The props of a component that `wanted` names; the rest (an icon, a width) are not read. */
function propsOf(node: Node, wanted: readonly string[], where: string): Props {
	const props: Props = {};
	for (const attribute of node.attributes ?? []) {
		const { name, value } = attribute;
		if (!name || !wanted.includes(name) || value == null) continue;
		if (typeof value === "string") {
			props[name] = value;
			continue;
		}
		try {
			props[name] = literal(parseExpressionAt(value.value, 0, { ecmaVersion: "latest" }));
		} catch {
			throw new Error(
				`${where}: the prop \`${name}\` of <${node.name}> is not a literal, so its text cannot be read`,
			);
		}
	}
	return props;
}

/** The nodes that are part of a line of text. */
const INLINE = new Set([
	"text",
	"inlineCode",
	"strong",
	"emphasis",
	"link",
	"mdxJsxTextElement",
	"mdxTextExpression",
]);
const isComment = (source: string) => /^\s*\/\*[\s\S]*\*\/\s*$/.test(source);
const squash = (text: string) => text.replace(/\s+/g, " ").trim();

/** Reads one page: the text before the first `##` and one block of Markdown per `##`. */
function read(tree: Node, where: string) {
	const unknown = (what: string) =>
		new Error(
			`${where}: ${what}. Say in src/lib/foundations-json.ts whether it carries text of the guide, so /foundations.json does not lose it`,
		);

	/** The lines a JSX element adds, each one a block of its own. */
	function jsx(node: Node): string[] {
		const name = node.name ?? "";
		// A plain HTML element (or a fragment): whatever text it has inside is kept
		if (!/^[A-Z]/.test(name)) {
			const children = node.children ?? [];
			if (!children.every((child) => INLINE.has(child.type))) return children.flatMap(block);
			const text = squash(children.map(inline).join(""));
			return text ? [text] : [];
		}
		const text = TEXT[name];
		if (text) return text.lines(propsOf(node, text.props, where));
		if (CONTAINERS.has(name)) {
			const { title } = propsOf(node, ["title"], where);
			return [...(title ? [`**${title}**`] : []), ...(node.children ?? []).flatMap(block)];
		}
		if (DEMOS.has(name)) return [];
		throw unknown(`<${name}> is not classified`);
	}

	function inline(node: Node): string {
		const inner = () => (node.children ?? []).map(inline).join("");
		switch (node.type) {
			case "text":
				return node.value ?? "";
			case "inlineCode":
				return `\`${node.value}\``;
			case "strong":
				return `**${inner()}**`;
			case "emphasis":
				return `_${inner()}_`;
			case "link":
				return `[${inner()}](${node.url})`;
			case "paragraph":
				return inner();
			case "mdxJsxTextElement":
			case "mdxJsxFlowElement":
				return jsx(node).join(" ");
			case "mdxTextExpression":
			case "mdxFlowExpression":
				if (isComment(node.value ?? "")) return "";
		}
		throw unknown(`a \`${node.type}\` node is not handled`);
	}

	function items(node: Node, indent: string): string[] {
		return (node.children ?? []).flatMap((item, index) => {
			const [first, ...rest] = (item.children ?? []).flatMap((child) =>
				child.type === "list" ? items(child, `${indent}  `) : [`${indent}${squash(inline(child))}`],
			);
			const mark = node.ordered ? `${index + 1}.` : "-";
			return [`${indent}${mark} ${(first ?? "").trim()}`, ...rest];
		});
	}

	function table(node: Node): string {
		const rows = (node.children ?? []).map(
			(row) =>
				`| ${(row.children ?? []).map((cell) => squash((cell.children ?? []).map(inline).join(""))).join(" | ")} |`,
		);
		const columns = node.children?.[0]?.children?.length ?? 0;
		return [rows[0], `| ${Array(columns).fill("---").join(" | ")} |`, ...rows.slice(1)].join("\n");
	}

	/** The blocks of Markdown a node becomes; none for an import, a comment or a demo. */
	function block(node: Node): string[] {
		switch (node.type) {
			case "mdxjsEsm":
				return [];
			case "heading":
				return [`${"#".repeat(node.depth ?? 3)} ${squash(inline({ ...node, type: "paragraph" }))}`];
			case "list":
				return [items(node, "").join("\n")];
			case "table":
				return [table(node)];
			case "mdxJsxFlowElement":
			case "mdxJsxTextElement":
				return jsx(node);
			default: {
				const text = squash(inline(node));
				return text ? [text] : [];
			}
		}
	}

	const intro: string[] = [];
	const sections: { title: string; blocks: string[] }[] = [];
	for (const node of tree.children ?? []) {
		if (node.type === "heading" && node.depth === 2) {
			// The title as plain text, without the marks of its Markdown
			const plain = (n: Node): string => n.value ?? (n.children ?? []).map(plain).join("");
			sections.push({ title: squash(plain(node)), blocks: [] });
			continue;
		}
		(sections.at(-1)?.blocks ?? intro).push(...block(node));
	}
	return { intro: intro.join("\n\n"), sections };
}

export function foundationsJson(
	entries: readonly FoundationEntry[],
	deps: FoundationDeps,
	version: string,
	site: string,
) {
	const foundations = [...entries]
		.sort((a, b) => a.data.order - b.data.order)
		.map((entry) => {
			const where = entry.filePath ?? entry.id;
			const parse = where.endsWith(".md") ? markdownToMdast : mdxToMdast;
			const { intro, sections } = read(parse(entry.body ?? "") as unknown as Node, where);
			const anchors = deps.anchorsOf(entry);
			if (anchors.length !== sections.length)
				throw new Error(
					`${where}: ${sections.length} \`##\` sections were read but the page has ${anchors.length} anchors`,
				);
			const url = new URL(`foundations/${entry.id}/`, site).href;
			return {
				id: entry.id,
				title: entry.data.title,
				description: entry.data.description,
				order: entry.data.order,
				url,
				intro,
				sections: [
					...sections.map((section, index) => ({
						title: section.title,
						url: `${url}#${anchors[index]}`,
						text: section.blocks.join("\n\n"),
					})),
					...deps.tokenSectionsOf(entry.id).map((section) => ({
						title: section.text,
						url: `${url}#${section.slug}`,
						text: `Los tokens de esta sección están en \`search_tokens\`, categoría \`${section.category}\`.`,
					})),
				],
			};
		});
	return { version, foundations };
}
