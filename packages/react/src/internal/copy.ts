// Copiar al portapapeles y avisar a los `CopyTooltip` montados, que ponen su burbuja sobre el elemento pulsado. Un solo
// módulo compartido: lo usan `useCopy` (desde React) y `CopyTooltip` con `copyAttribute` (desde HTML sin JavaScript).

export interface CopyNotice {
	/** Si el portapapeles aceptó el texto. */
	ok: boolean;
	/** El elemento pulsado, sobre el que va la burbuja. */
	anchor: Element;
}

const listeners = new Set<(notice: CopyNotice) => void>();

/** Se suscribe a los avisos de copia. Devuelve cómo dejar de oír. */
export function onCopy(fn: (notice: CopyNotice) => void): () => void {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
}

/**
 * Copia `text` y avisa del resultado. Devuelve si se pudo. Aunque no haya ningún `CopyTooltip` montado, copia igual.
 * No se espera a que nadie lo muestre: el aviso nunca retrasa ni cambia lo copiado. Si hay varios `CopyTooltip` montados
 * (el de la página y el de un ejemplo, por ejemplo), avisa solo al primero: así sale una sola burbuja.
 */
export async function copyText(text: string, anchor: Element): Promise<boolean> {
	let ok = true;
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		ok = false;
	}
	listeners.values().next().value?.({ ok, anchor });
	return ok;
}
