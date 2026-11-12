// Slideout en el ejemplo interactivo (un fichero por componente: design D4): las acciones y lo que va al pie a la
// izquierda son nodos, que se eligen entre opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { Slideout as default } from "@jotis-me/react";

const GUARDAR_Y_CANCELAR = [
	"<>",
	'\t<Button hierarchy="secondary">Cancelar</Button>',
	"\t<Button>Guardar</Button>",
	"</>",
].join("\n");

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Guardar y cancelar",
				value: (
					<>
						<Button hierarchy="secondary">Cancelar</Button>
						<Button>Guardar</Button>
					</>
				),
				code: GUARDAR_Y_CANCELAR,
				imports: ["Button"],
			},
			{
				label: "Solo guardar",
				value: <Button>Guardar</Button>,
				code: "<Button>Guardar</Button>",
				imports: ["Button"],
			},
		],
	},
	footerStart: {
		kind: "content",
		options: [
			{
				label: "Ayuda",
				value: <Button hierarchy="link-color">Ayuda</Button>,
				code: '<Button hierarchy="link-color">Ayuda</Button>',
				imports: ["Button"],
			},
		],
	},
};
