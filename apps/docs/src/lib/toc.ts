// Índice «En esta página» (design §7): marca la sección que se está leyendo. Sin JavaScript queda como lista de
// enlaces. Lo usan las páginas de fundamentos y de componente.

/**
 * Marca en cada `[data-toc]` la sección que se lee: la última cuyo título ya ha pasado del 30 % superior de la
 * ventana, o la última de todas al llegar al final (si no, la última sección corta no se marcaría nunca).
 */
export function initToc(): void {
	for (const toc of document.querySelectorAll<HTMLElement>("[data-toc]")) {
		const links = [...toc.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];
		const targets = links
			.map((a) => document.getElementById(a.dataset.tocLink ?? ""))
			.filter((el): el is HTMLElement => !!el);
		if (!targets.length) continue;
		let frame = 0;
		const mark = () => {
			frame = 0;
			let current: HTMLElement | undefined = targets[0];
			for (const t of targets) if (t.getBoundingClientRect().top < innerHeight * 0.3) current = t;
			if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = targets.at(-1);
			for (const a of links) a.setAttribute("aria-current", String(a.dataset.tocLink === current?.id));
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

/** Clases de un enlace del índice en columna, con la sección actual marcada en la marca. */
export const TOC_LINK =
	"block py-1 pl-3 text-[13px] leading-5 text-tertiary shadow-[inset_1px_0_0_var(--border-secondary)] hover:text-primary focus-visible:rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=true]:font-medium aria-[current=true]:text-primary aria-[current=true]:shadow-[inset_2px_0_0_var(--fg-brand-primary)]";

/** Clases de las tarjetas de anterior y siguiente. */
export const PAGER =
	"flex flex-1 basis-60 flex-col gap-0.5 rounded-xl p-4 text-primary no-underline shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none";
