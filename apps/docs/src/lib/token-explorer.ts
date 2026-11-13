// El script del explorador de tokens (design D6 de redesign-docs-site-v2). El servidor pinta todos los tokens, cada
// familia en su `section` y cada token dos veces (fila de `Table` en escritorio, tarjeta por debajo de `lg`); esto solo
// esconde lo que no toca: elige la familia, filtra por nombre, valor o uso, anuncia el recuento y hace que la utilidad
// de `TokenSwatch` se copie con el `CopyTooltip` de la página. Sin islas: 241 tokens no se hidratan.
import { fold } from "../search/entries";

/** El recuento que se anuncia: «23 tokens de Texto», «1 de 23 tokens de Texto con «placeholder»». */
export function tokenStatus(shown: number, total: number, family: string, term: string): string {
	const tokens = (n: number) => (n === 1 ? "1 token" : `${n} tokens`);
	if (!term) return `${tokens(total)} de ${family}`;
	if (shown === 0) return `Ningún token de ${family} con «${term}»`;
	return `${shown} de ${tokens(total)} de ${family} con «${term}»`;
}

/** Si un token (su texto de búsqueda, ya sin tildes) coincide con lo escrito. */
export function tokenMatches(search: string, term: string): boolean {
	const q = fold(term.trim());
	return !q || search.includes(q);
}

export function initTokenExplorer(): void {
	for (const root of document.querySelectorAll<HTMLElement>("[data-tokens]")) {
		const input = root.querySelector<HTMLInputElement>("[data-tokens-filter] input");
		const status = root.querySelector<HTMLElement>("[data-tokens-status]");
		const empty = root.querySelector<HTMLElement>("[data-tokens-empty]");
		const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-tokens-families] a[href^="#"]')];
		const families = [...root.querySelectorAll<HTMLElement>("[data-token-family]")].map((section) => {
			// La fila y la tarjeta de un token van en el mismo orden: el texto de búsqueda lo lleva la tarjeta
			const cards = [...section.querySelectorAll<HTMLElement>("[data-token-search]")];
			const rows = [...section.querySelectorAll<HTMLElement>("tbody tr")];
			const tab = tabs.find((a) => a.hash === `#${section.id}`);
			return { section, cards, rows, tab, count: tab?.querySelector("span") };
		});
		if (!input || !status || !empty || !families.length) continue;

		let current = families.find((f) => f.tab?.hasAttribute("aria-current")) ?? families[0];
		const apply = () => {
			const term = input.value.trim();
			for (const f of families) {
				let shown = 0;
				f.cards.forEach((card, i) => {
					const hit = tokenMatches(card.dataset.tokenSearch ?? "", term);
					card.hidden = !hit;
					const row = f.rows[i];
					if (row) row.hidden = !hit;
					if (hit) shown++;
				});
				// La pestaña de cada familia dice cuántos coinciden, para saber dónde mirar
				if (f.count) f.count.textContent = String(shown);
				if (f.tab) {
					if (f === current) f.tab.setAttribute("aria-current", "location");
					else f.tab.removeAttribute("aria-current");
				}
				f.section.toggleAttribute("data-collapsed", f !== current || shown === 0);
				if (f !== current) continue;
				const label = f.section.dataset.label ?? "";
				status.textContent = tokenStatus(shown, f.cards.length, label, term);
				empty.hidden = shown > 0;
				for (const [slot, text] of [
					["[data-tokens-term]", term],
					["[data-tokens-family-name]", label],
				] as const) {
					const el = empty.querySelector(slot);
					if (el) el.textContent = text;
				}
			}
		};

		for (const f of families)
			f.tab?.addEventListener("click", (event) => {
				// Sin JavaScript el enlace lleva a su familia; con él, la cambia sin mover la página
				event.preventDefault();
				current = f;
				history.replaceState(null, "", f.tab?.hash);
				apply();
			});
		input.addEventListener("input", apply);
		empty.querySelector("[data-tokens-clear]")?.addEventListener("click", () => {
			input.value = "";
			apply();
			input.focus();
		});
		// `TokenSwatch` se pinta en el servidor, así que su botón no trae quien copie: al pulsarlo se le pone `data-copy`
		// con su utilidad y el `CopyTooltip` de la página, que escucha en el documento, la copia y avisa
		root.addEventListener("click", (event) => {
			const button = (event.target as Element | null)?.closest<HTMLElement>("[data-layout] button");
			if (button && !button.dataset.copy) button.dataset.copy = button.textContent ?? "";
		});

		// Un enlace a una familia (`/foundations/color/#tokens-bg`) la abre, con el filtro y las pestañas a la vista
		const open = () => {
			const linked = families.find((f) => `#${f.section.id}` === location.hash);
			if (!linked) return;
			current = linked;
			apply();
			// Su `scroll-margin-top` deja sitio al filtro y a las pestañas
			linked.section.scrollIntoView();
		};
		addEventListener("hashchange", open);
		if (input.value) apply();
		open();
	}
}
