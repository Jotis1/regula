// El índice de componentes (`/components/`) en el navegador (design D5 y D8 de redesign-docs-site-v2): el buscador
// filtra las cards que ya pintó el servidor, el desplegable lleva al ancla de un grupo y cada captura quita su
// `Skeleton` al cargar. Sin isla: el `Select` del paquete se monta sobre su HTML del servidor la primera vez que se
// usa (`group-select.tsx`, import dinámico), así que no pesa al cargar la página.
import { fold } from "../search/entries";

/** Lo que se busca en una card: su nombre como se lee y como se escribe en el código, su descripción y sus palabras clave. */
export function searchText(label: string, slug: string, description: string, keywords = ""): string {
	return fold(`${label} ${slug.replaceAll("-", "")} ${description} ${keywords}`);
}

/** Las palabras de lo escrito, sin tildes ni mayúsculas. */
export function queryWords(query: string): string[] {
	return fold(query).split(/\s+/).filter(Boolean);
}

/** Una card coincide si contiene todas las palabras escritas, en cualquier orden. */
export function matches(text: string, words: readonly string[]): boolean {
	return words.every((w) => text.includes(w));
}

/** El recuento que se anuncia mientras se busca. */
export function countText(shown: number, total: number): string {
	if (shown === 0) return "Sin resultados";
	return `${shown} de ${total} componentes`;
}

function readJson<T>(el: Element | null, fallback: T): T {
	try {
		return JSON.parse(el?.textContent || "") as T;
	} catch {
		return fallback;
	}
}

export function initComponentIndex(root: HTMLElement) {
	const input = root.querySelector<HTMLInputElement>("[data-index-search] input");
	const count = root.querySelector<HTMLElement>("[data-index-count]");
	const empty = root.querySelector<HTMLElement>("[data-index-empty]");
	const map = root.querySelector<HTMLElement>("[data-index-map]");
	if (!input || !count || !empty) return;
	const term = empty.querySelector<HTMLElement>("[data-index-term]");
	const keywords = readJson<Record<string, string>>(root.querySelector("[data-index-keywords]"), {});

	const groups = [...root.querySelectorAll<HTMLElement>("[data-index-group]")].map((section) => ({
		section,
		cards: [...section.querySelectorAll<HTMLElement>("[data-group] > li")].map((li) => {
			const a = li.querySelector<HTMLAnchorElement>(":scope > a");
			const slug = a?.getAttribute("href")?.split("/")[2] ?? "";
			const [label = "", description = ""] = [...(a?.children ?? [])].map((c) => c.textContent ?? "");
			return { li, text: searchText(label, slug, description, keywords[slug]) };
		}),
	}));
	const total = groups.reduce((n, g) => n + g.cards.length, 0);

	const apply = () => {
		const words = queryWords(input.value);
		let shown = 0;
		for (const g of groups) {
			let hits = 0;
			for (const c of g.cards) {
				const hit = matches(c.text, words);
				c.li.hidden = !hit;
				if (hit) hits++;
			}
			g.section.hidden = hits === 0;
			shown += hits;
		}
		// Mientras se busca, el mapa de grupos se aparta: los resultados quedan bajo el buscador
		if (map) map.hidden = words.length > 0;
		empty.hidden = shown > 0;
		if (term) term.textContent = input.value.trim();
		count.textContent = words.length ? countText(shown, total) : "";
	};
	const clear = () => {
		if (!input.value) return;
		input.value = "";
		apply();
	};

	input.addEventListener("input", apply);
	input.addEventListener("keydown", (e) => {
		if (e.key === "Escape") clear();
	});
	empty.querySelector("button")?.addEventListener("click", () => {
		clear();
		input.focus();
	});
	// El navegador puede devolver lo escrito al volver atrás
	if (input.value) apply();

	initGroupSelect(root, (id) => {
		// Con una búsqueda a medias el grupo puede estar escondido: ir a un grupo la limpia
		clear();
		if (location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView();
		else location.hash = id;
	});
	initSkeletons(root);
}

/**
 * El desplegable de grupo. El servidor pinta el `Select` del paquete sin vida; al acercarse (ratón o foco) se pide su
 * código y al pulsarlo se monta ya abierto. Sus props viajan en `data-select`.
 */
function initGroupSelect(root: HTMLElement, onChange: (id: string) => void) {
	const host = root.querySelector<HTMLElement>("[data-index-select]");
	if (!host) return;
	let mounted = false;
	const load = () => import("./group-select");
	const open = async (e: Event) => {
		if (mounted) return;
		mounted = true;
		e.preventDefault();
		const { mountGroupSelect } = await load();
		mountGroupSelect(host, { ...readJson(host.querySelector("[data-select]"), {}), onChange });
	};
	host.addEventListener("pointerenter", load, { once: true });
	host.addEventListener("focusin", load, { once: true });
	host.addEventListener("click", open);
	host.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") open(e);
	});
}

/**
 * Cada captura lleva un `Skeleton` debajo (ShowcaseImage.astro) que la imagen tapa al pintarse; aquí se retira del
 * todo al cargar (o al fallar), para que no siga latiendo sin verse. Un solo oyente para todas: `load` no burbujea,
 * pero se captura.
 */
function initSkeletons(root: HTMLElement) {
	const done = (img: HTMLImageElement) =>
		img.closest("[data-showcase-card]")?.setAttribute("data-loaded", "");
	const onImage = (e: Event) => {
		if (e.target instanceof HTMLImageElement) done(e.target);
	};
	root.addEventListener("load", onImage, true);
	root.addEventListener("error", onImage, true);
	for (const img of root.querySelectorAll<HTMLImageElement>("[data-showcase-card] img"))
		if (img.complete && img.naturalWidth > 0) done(img);
}
