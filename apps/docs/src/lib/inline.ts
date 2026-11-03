// Texto de la guía dentro de las piezas de composición: se escapa y lo que va entre comillas invertidas pasa a
// <code>, como en el Markdown de la guía. Sin más marcado, para que el texto no se reescriba al pasarlo a una pieza.

const escapeHtml = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const CODE =
	"rounded-sm bg-secondary px-1 py-px font-mono text-[0.875em] text-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)]";

/** `text-primary` → <code>text-primary</code>, con el resto escapado. */
export function inline(text: string): string {
	return text
		.split("`")
		.map((part, i) => (i % 2 ? `<code class="${CODE}">${escapeHtml(part)}</code>` : escapeHtml(part)))
		.join("");
}
