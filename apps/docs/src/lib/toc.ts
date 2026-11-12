// Índice «En esta página» (design D1 de redesign-docs-site-v2): `Tabs` vertical `line` con `href` de ancla, que el
// servidor pinta como una `<nav>` de enlaces. Sin JavaScript queda como lista de enlaces con el primero marcado; con
// él, `initToc` mueve `aria-current="location"` al de la sección que se lee. Lo usan las páginas de fundamentos y de
// componente.

/**
 * Marca en cada `[data-toc]` la sección que se lee con `aria-current="location"`: la última cuyo título ya ha pasado
 * del 30 % superior de la ventana, o la última de todas al llegar al final (si no, la última sección corta no se
 * marcaría nunca). Los enlaces son los de ancla (`href="#…"`) del índice; los demás (relacionados) no se tocan.
 */
export function initToc(): void {
	for (const toc of document.querySelectorAll<HTMLElement>("[data-toc]")) {
		const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
		const targets = links
			.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
			.filter((el): el is HTMLElement => !!el);
		if (!targets.length) continue;
		let frame = 0;
		const mark = () => {
			frame = 0;
			let current: HTMLElement | undefined = targets[0];
			for (const t of targets) if (t.getBoundingClientRect().top < innerHeight * 0.3) current = t;
			if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = targets.at(-1);
			for (const a of links) {
				if (a.hash.slice(1) === current?.id) a.setAttribute("aria-current", "location");
				else a.removeAttribute("aria-current");
			}
		};
		addEventListener(
			"scroll",
			() => {
				if (!frame) frame = requestAnimationFrame(mark);
			},
			{ passive: true },
		);
		mark();
	}
}

/** Clases de un enlace suelto de la columna del índice (los relacionados). */
export const TOC_LINK =
	"block py-1 pl-3 text-[13px] leading-5 text-tertiary hover:text-primary focus-visible:rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none";
