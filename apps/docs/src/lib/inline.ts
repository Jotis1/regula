// Texto de la guía dentro de las piezas de composición: se escapa, lo que va entre comillas invertidas pasa a
// <code> y lo que va entre dobles asteriscos a <strong>, como en el Markdown de la guía. Sin más marcado, para que
// el texto no se reescriba al pasarlo a una pieza.

const escapeHtml = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const CODE =
	"rounded-sm bg-secondary px-1 py-px font-mono text-[0.875em] text-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)]";

// **negrita** y _cursiva_ (esta, solo entre espacios o signos, para no tocar nombres_con_guion_bajo)
const strong = (s: string) =>
	s
		.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
		.replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,;:)]|$)/g, "$1<em>$2</em>");

/** `text-primary` → <code>text-primary</code> y **así** → <strong>así</strong>, con el resto escapado. */
export function inline(text: string): string {
	return text
		.split("`")
		.map((part, i) =>
			i % 2 ? `<code class="${CODE}">${escapeHtml(part)}</code>` : strong(escapeHtml(part)),
		)
		.join("");
}
