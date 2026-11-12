// Filtro de la navegación lateral (SideNav.astro), en el navegador. Se activa sobre cada `[data-docnav]`: la del
// lateral al cargar y la del menú móvil al abrirse, que hasta entonces no está en la página. El campo es el `search`
// del `SidebarNav`, que la CSS esconde hasta que esto marca la navegación como lista.
import { fold } from "../search/entries";

/** Texto extra por el que se encuentra cada enlace (`href` a texto sin tildes), de la etiqueta JSON de SideNav. */
function readKeywords(root: HTMLElement): Record<string, string> {
	try {
		return JSON.parse(root.querySelector("[data-docnav-keywords]")?.textContent || "{}");
	} catch {
		return {};
	}
}

/** Muestra el filtro y lo hace funcionar. Llamarla dos veces sobre la misma navegación no hace nada. */
export function initDocNav(root: HTMLElement) {
	if (root.dataset.docnavReady) return;
	const input = root.querySelector<HTMLInputElement>("nav input");
	const empty = root.querySelector<HTMLElement>("[data-docnav-empty]");
	if (!input || !empty) return;
	root.dataset.docnavReady = "true";
	input.setAttribute("aria-keyshortcuts", "/");
	input.autocomplete = "off";
	const keywords = readKeywords(root);
	// Cada enlace con su fila (`<li>`) y lo que se busca en él: su texto y las palabras extra
	const links = [...root.querySelectorAll<HTMLAnchorElement>("nav a[href]")].map((a) => ({
		a,
		row: (a.closest("li") ?? a) as HTMLElement,
		words: fold(`${a.textContent ?? ""} ${keywords[a.getAttribute("href") ?? ""] ?? ""}`),
	}));
	const groups = [...root.querySelectorAll<HTMLDetailsElement>("nav details")].map((details) => ({
		details,
		row: (details.closest("li") ?? details) as HTMLElement,
		links: links.filter((l) => details.contains(l.a)),
	}));
	// Lo que el usuario abrió o cerró sin filtrar se recupera al vaciar el filtro
	let opened = groups.map((g) => g.details.open);

	input.addEventListener("focus", () => {
		if (!input.value) opened = groups.map((g) => g.details.open);
	});
	input.addEventListener("input", () => {
		const q = fold(input.value.trim());
		let shown = 0;
		for (const l of links) {
			const hit = !q || l.words.includes(q);
			l.row.hidden = !hit;
			if (hit) shown++;
		}
		groups.forEach((g, i) => {
			const hits = g.links.some((l) => !l.row.hidden);
			g.row.hidden = !hits;
			g.details.open = q ? hits : (opened[i] as boolean);
		});
		empty.hidden = shown > 0;
	});
	listenShortcut();
}

let listening = false;
/** "/" lleva al filtro de la navegación que se ve, salvo que se esté escribiendo en otro campo. */
function listenShortcut() {
	if (listening) return;
	listening = true;
	document.addEventListener("keydown", (e) => {
		if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
		if ((e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]")) return;
		const input = [...document.querySelectorAll<HTMLInputElement>("[data-docnav-ready] nav input")].find(
			(i) => i.checkVisibility(),
		);
		if (!input) return;
		e.preventDefault();
		input.focus();
	});
}
