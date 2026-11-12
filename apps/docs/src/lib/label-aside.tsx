// Valor preparado de `labelAside` para el ejemplo interactivo de los campos y de Toggle: un nodo, que no cruza de Astro.
import { Badge, Button } from "@jotis-me/react";
import type { Tweak } from "./playground";

export const labelAsideTweaks: Record<string, Tweak> = {
	labelAside: {
		kind: "content",
		options: [
			{
				label: "Cambiado + Restablecer",
				value: (
					<>
						<Badge color="brand" size="sm">
							Cambiado
						</Badge>
						<Button hierarchy="link-gray" size="xs">
							Restablecer
						</Button>
					</>
				),
				code: [
					"<>",
					'\t<Badge color="brand" size="sm">Cambiado</Badge>',
					'\t<Button hierarchy="link-gray" size="xs">Restablecer</Button>',
					"</>",
				].join("\n"),
				imports: ["Badge", "Button"],
			},
		],
	},
};
