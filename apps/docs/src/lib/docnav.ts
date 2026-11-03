// Filtro de la navegación lateral (SideNav.astro), en el navegador. Se activa sobre cada <nav data-docnav>: la del
// lateral al cargar y la del menú móvil al abrirse, que hasta entonces no está en la página.
import { fold } from "../search/entries";

/** Muestra el filtro y lo hace funcionar. Llamarla dos veces sobre la misma navegación no hace nada. */
export function initDocNav(nav: HTMLElement) {
	if (nav.dataset.docnavReady) return;
	const box = nav.querySelector<HTMLElement>("[data-docnav-filter]");
	const input = box?.querySelector<HTMLInputElement>("input");
	const empty = nav.querySelector<HTMLElement>("[data-docnav-empty]");
	if (!box || !input || !empty) return;
	nav.dataset.docnavReady = "true";
	box.hidden = false;
	const groups = [...nav.querySelectorAll<HTMLDetailsElement>("[data-docnav-group]")];
	// Lo que el usuario abrió o cerró sin filtrar se recupera al vaciar el filtro
	let opened = groups.map((g) => g.open);

	input.addEventListener("focus", () => {
		if (!input.value) opened = groups.map((g) => g.open);
	});
	input.addEventListener("input", () => {
		const q = fold(input.value.trim());
		let shown = 0;
		for (const a of nav.querySelectorAll<HTMLElement>("[data-docnav-link]")) {
			const hit = !q || (a.dataset.docnavLink ?? "").includes(q);
			a.hidden = !hit;
			if (hit) shown++;
		}
		groups.forEach((g, i) => {
			const hits = g.querySelectorAll("[data-docnav-link]:not([hidden])").length;
			g.hidden = hits === 0;
			g.open = q ? hits > 0 : (opened[i] as boolean);
		});
		for (const s of nav.querySelectorAll<HTMLElement>("[data-docnav-section]"))
			s.hidden = !s.querySelector("[data-docnav-link]:not([hidden])");
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
		const input = [
			...document.querySelectorAll<HTMLInputElement>("[data-docnav-ready] [data-docnav-filter] input"),
		].find((i) => i.checkVisibility());
		if (!input) return;
		e.preventDefault();
		input.focus();
	});
}
