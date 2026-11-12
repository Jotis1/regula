// Los puntos de partida de todos los grupos, juntos. Cada grupo vive en su fichero (design D3).
import type { Start } from "../playground";
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

export const STARTS: Record<string, Start> = {
	...acciones,
	...etiquetasEIdentidad,
	...avisosYCarga,
	...fondosYMaquetas,
	...capas,
	...formularios,
	...contenidoYMedios,
	...navegacion,
	...datos,
	...estructuraDePagina,
	...graficas,
	...stream,
};
