// LinkCard en el ejemplo interactivo (un fichero por componente: design D4): la muestra de arriba es un nodo, que se
// elige entre opciones preparadas.
import { Badge, Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { LinkCard as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	preview: {
		kind: "content",
		options: [
			{
				label: "Muestra",
				value: (
					<div className="flex items-center justify-center gap-2 bg-secondary py-8">
						<Button size="sm" tabIndex={-1}>
							Guardar
						</Button>
						<Badge color="brand" size="sm">
							Nuevo
						</Badge>
					</div>
				),
				code: [
					'<div className="flex items-center justify-center gap-2 bg-secondary py-8">',
					'\t<Button size="sm">Guardar</Button>',
					'\t<Badge color="brand" size="sm">Nuevo</Badge>',
					"</div>",
				].join("\n"),
				imports: ["Badge", "Button"],
			},
		],
	},
};
