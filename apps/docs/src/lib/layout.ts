// Esqueleto común de las páginas con contenido (design D1 de redesign-docs-site-v2). Son cadenas completas, no
// piezas sueltas, para que Tailwind las vea en el código fuente.

/**
 * Columna de lectura: los textos miden 720 px como máximo; los especímenes, las tablas y el ejemplo interactivo (los
 * `not-prose`) van al ancho del contenido.
 */
export const PAGE_BODY =
	"prose min-w-0 max-w-none flex-1 prose-headings:max-w-[720px] prose-ol:max-w-[720px] prose-p:max-w-[720px] prose-ul:max-w-[720px]";

/** La página de componente reparte sus secciones en columna, a 56 px una de otra. */
export const PAGE_SECTIONS = `${PAGE_BODY} flex flex-col gap-14`;
