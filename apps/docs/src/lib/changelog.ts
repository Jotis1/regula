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
 * líneas "Updated dependencies" y las que solo nombran un paquete con su versión (`- @jotis-me/tokens@0.9.0`): en un
 * grupo `fixed` solo repiten la versión.
 */
const DEPENDENCY_BUMP = /^@[\w.-]+\/[\w.-]+@\d+\.\d+\.\d+(-[\w.]+)?$/;

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
			// Una subida de dependencias puede nombrar varios paquetes, uno por línea
			const bump = text?.split("\n").every((l) => DEPENDENCY_BUMP.test(l.trim().replace(/^- /, "")));
			if (kind && text && !text.startsWith("Updated dependencies") && !bump)
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

/** Un elemento de lista, con sus sublistas si las lleva. */
export interface ChangeItem {
	text: string;
	items?: ChangeItem[];
}

export type ChangeBlock = { type: "p"; text: string } | { type: "ul"; items: ChangeItem[] };

/**
 * Parte el texto de una entrada en párrafos y listas. Una línea en blanco cierra el bloque; las líneas que empiezan por
 * `- ` son los elementos de una lista (aunque vayan pegadas al párrafo que las introduce), y con más sangría que el
 * elemento de encima van en su sublista, a cualquier profundidad. Una línea sin guion que sigue a un elemento continúa
 * ese elemento. El texto se queda en Markdown: lo de dentro (`código`, **negrita**) lo pinta `inline`.
 */
export function changeBlocks(text: string): ChangeBlock[] {
	const blocks: ChangeBlock[] = [];
	// La lista abierta, como pila de niveles: la sangría de sus elementos y la lista donde van
	let stack: { indent: number; items: ChangeItem[] }[] = [];
	let para: { type: "p"; text: string } | undefined;
	const close = () => {
		stack = [];
		para = undefined;
	};
	for (const line of text.split("\n")) {
		if (!line.trim()) {
			close();
			continue;
		}
		const m = line.match(/^( *)- (.*)$/);
		if (m) {
			const indent = m[1]?.length ?? 0;
			const item: ChangeItem = { text: m[2] ?? "" };
			para = undefined;
			while (stack.length > 1 && indent < (stack.at(-1)?.indent ?? 0)) stack.pop();
			const top = stack.at(-1);
			if (!top) {
				const ul: ChangeBlock = { type: "ul", items: [item] };
				blocks.push(ul);
				stack = [{ indent, items: ul.items }];
			} else if (indent > top.indent) {
				// Sublista del último elemento del nivel de arriba
				const parent = top.items.at(-1) as ChangeItem;
				parent.items = [item];
				stack.push({ indent, items: parent.items });
			} else top.items.push(item);
			continue;
		}
		const last = stack.at(-1)?.items.at(-1);
		if (last) {
			// Continúa el elemento más profundo abierto; si ya tiene sublista, su último elemento
			let deepest = last;
			while (deepest.items?.length) deepest = deepest.items.at(-1) as ChangeItem;
			deepest.text += ` ${line.trim()}`;
		} else if (para) para.text += ` ${line.trim()}`;
		else {
			para = { type: "p", text: line.trim() };
			blocks.push(para);
		}
	}
	return blocks;
}
