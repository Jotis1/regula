// SectionFooter en el ejemplo interactivo (un fichero por componente: design D4): las acciones y lo de la izquierda
// son nodos, que se eligen entre opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { SectionFooter as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Cancelar y guardar",
				value: (
					<>
						<Button hierarchy="secondary">Cancelar</Button>
						<Button>Guardar</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary">Cancelar</Button>',
					"\t<Button>Guardar</Button>",
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
	start: {
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
