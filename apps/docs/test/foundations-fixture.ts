// The foundations as the collection gives them, read from their files, for the tests that run without Astro. The
// anchors are worked out the way the page's processor does (lowercase, no punctuation, hyphens for spaces); that they
// are the page's own is checked against the built site (e2e/foundations-json.spec.ts).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type } from "@jotis-me/tokens";
import { parse } from "yaml";
import type { FoundationDeps, FoundationEntry } from "../src/lib/foundations-json";
import { tokenSections } from "../src/lib/tokens";

const dir = join(import.meta.dirname, "../src/content/foundations");

/** Splits a file into its frontmatter and its body. */
export function entryOf(id: string, raw: string, filePath: string): FoundationEntry {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
	if (!match) throw new Error(`${filePath} has no frontmatter`);
	return { id, data: parse(match[1] as string), body: match[2], filePath };
}

export const entries: FoundationEntry[] = readdirSync(dir).map((file) =>
	entryOf(
		file.replace(/\.mdx?$/, ""),
		readFileSync(join(dir, file), "utf8"),
		`src/content/foundations/${file}`,
	),
);

const anchor = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.trim()
		.replace(/\s/g, "-");

export const deps: FoundationDeps = {
	anchorsOf: (entry) =>
		[...(entry.body ?? "").matchAll(/^## (.+)$/gm)].map((m) =>
			anchor((m[1] as string).replace(/[`*]/g, "")),
		),
	tokenSectionsOf: (id) => tokenSections(id, type.groups),
};
