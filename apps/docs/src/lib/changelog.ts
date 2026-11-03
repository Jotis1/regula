// Historial de cambios de /changelog/ (design §10): lee los CHANGELOG.md de los paquetes que genera Changesets y
// junta las versiones. Los tres paquetes comparten versión (`fixed`), así que cada versión sale una vez, con las
// entradas de todos. Sin CHANGELOG (aún no se ha publicado nada) no hay versiones y la página muestra un estado vacío.

export type ChangeKind = "major" | "minor" | "patch";

export interface ChangeEntry {
	/** Los paquetes cuyo CHANGELOG la trae (`@jotis-me/react`); un changeset puede tocar varios. */
	pkgs: string[];
	kind: ChangeKind;
	/** El texto del changeset, en Markdown, sin el hash del commit. */
	text: string;
}

export interface ChangelogVersion {
	version: string;
	entries: ChangeEntry[];
}

const KINDS: Record<string, ChangeKind> = {
	"Major Changes": "major",
	"Minor Changes": "minor",
	"Patch Changes": "patch",
};

const compare = (a: string, b: string) => {
	const [pa, pb] = [a, b].map((v) => v.split("-")[0]?.split(".").map(Number) ?? []);
	for (let i = 0; i < 3; i++) {
		const d = (pb?.[i] ?? 0) - (pa?.[i] ?? 0);
		if (d) return d;
	}
	// Con los mismos números, la versión final va antes que su prerrelease (1.0.0 antes que 1.0.0-beta.1)
	return Number(a.includes("-")) - Number(b.includes("-"));
};

/**
 * Las versiones de un CHANGELOG de Changesets (`## 0.2.0`, `### Minor Changes`, `- abc1234: texto`). Se descartan las
 * líneas "Updated dependencies": en un grupo `fixed` solo repiten la versión.
 */
export function parseChangelog(markdown: string): { pkg: string; versions: ChangelogVersion[] } {
	const pkg = markdown.match(/^# (.+)$/m)?.[1]?.trim() ?? "";
	const versions: ChangelogVersion[] = [];
	for (const block of markdown.split(/^## /m).slice(1)) {
		const [heading = "", ...lines] = block.split("\n");
		const entries: ChangeEntry[] = [];
		let kind: ChangeKind | undefined;
		let current: string[] | undefined;
		const flush = () => {
			const text = current
				?.map((l) => l.replace(/^ {2}/, ""))
				.join("\n")
				.trim();
			if (kind && text && !text.startsWith("Updated dependencies"))
				entries.push({ pkgs: [pkg], kind, text });
			current = undefined;
		};
		for (const line of lines) {
			const title = line.match(/^### (.+)$/)?.[1]?.trim();
			if (title !== undefined) {
				flush();
				kind = KINDS[title];
			} else if (line.startsWith("- ")) {
				flush();
				current = [line.slice(2).replace(/^[0-9a-f]{7,40}: /, "")];
			} else if (current) current.push(line);
		}
		flush();
		versions.push({ version: heading.trim(), entries });
	}
	return { pkg, versions };
}

/** Une los CHANGELOG de varios paquetes: cada versión una vez, de la más nueva a la más antigua. */
export function mergeChangelogs(markdowns: string[]): ChangelogVersion[] {
	const byVersion = new Map<string, ChangeEntry[]>();
	for (const md of markdowns)
		for (const { version, entries } of parseChangelog(md).versions) {
			// La misma entrada en varios paquetes (un changeset que los toca a todos) se muestra una sola vez
			const list = byVersion.get(version) ?? [];
			for (const e of entries) {
				const same = list.find((o) => o.text === e.text && o.kind === e.kind);
				if (same) same.pkgs.push(...e.pkgs.filter((p) => !same.pkgs.includes(p)));
				else list.push(e);
			}
			byVersion.set(version, list);
		}
	return [...byVersion]
		.map(([version, entries]) => ({ version, entries }))
		.filter((v) => v.entries.length > 0)
		.sort((a, b) => compare(a.version, b.version));
}
