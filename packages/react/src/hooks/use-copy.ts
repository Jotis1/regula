"use client";

import { useCallback } from "react";
import { copyText } from "../internal/copy.js";

/**
 * Devuelve `copy(texto, elemento)`: copia el texto al portapapeles y, si hay un `CopyTooltip` montado, pone su aviso
 * «Copiado» sobre ese elemento (normalmente el botón pulsado: `event.currentTarget`). Devuelve si se pudo copiar.
 */
export function useCopy(): (text: string, anchor: Element) => Promise<boolean> {
	return useCallback((text, anchor) => copyText(text, anchor), []);
}
