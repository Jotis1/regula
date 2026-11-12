// Los puntos de partida de todos los grupos, juntos. Cada grupo vive en su fichero (design D3).
import type { Start, Tweak } from "../playground";
import { acciones } from "./acciones";
import { avisosYCarga } from "./avisos-y-carga";
import { capas } from "./capas";
import { contenidoYMedios } from "./contenido-y-medios";
import { datos } from "./datos";
import { estructuraDePagina } from "./estructura-de-pagina";
import { etiquetasEIdentidad } from "./etiquetas-e-identidad";
import { fondosYMaquetas } from "./fondos-y-maquetas";
import { formularios } from "./formularios";
import { graficas } from "./graficas";
import { navegacion } from "./navegacion";
import { stream } from "./stream";
import { SELECTORES, TIPOS_DEL_FIGMA } from "./tipos-del-figma";
import { webDeMarketing } from "./web-de-marketing";

const BASE: Record<string, Start> = {
	...acciones,
	...etiquetasEIdentidad,
	...avisosYCarga,
	...fondosYMaquetas,
	...webDeMarketing,
	...capas,
	...formularios,
	...contenidoYMedios,
	...navegacion,
	...datos,
	...estructuraDePagina,
	...graficas,
	...stream,
};

/**
 * Los puntos de partida con lo que el Figma pedía y antes solo alcanzaban los atajos: valores preparados y selectores para
 * las props de contenido y de tipo alias. Lo que ya ajusta el propio punto de partida manda.
 */
function withFigma(base: Record<string, Start>): Record<string, Start> {
	const out: Record<string, Start> = {};
	for (const [name, start] of Object.entries(base)) {
		const tweaks: Record<string, Tweak> = {};
		for (const [prop, options] of Object.entries(TIPOS_DEL_FIGMA[name] ?? {}))
			tweaks[prop] = { kind: "content", options };
		for (const [prop, choice] of Object.entries(SELECTORES[name] ?? {}))
			tweaks[prop] = { kind: "choice", ...choice };
		out[name] = Object.keys(tweaks).length ? { ...start, tweaks: { ...tweaks, ...start.tweaks } } : start;
	}
	return out;
}

export const STARTS: Record<string, Start> = withFigma(BASE);
