// PricingCard en el ejemplo interactivo (un fichero por componente: design D4): las acciones son nodos, que se eligen
// entre opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { PricingCard as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Empezar y comparar",
				value: (
					<>
						<Button size="lg">Empezar</Button>
						<Button hierarchy="secondary" size="lg">
							Comparar planes
						</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button size="lg">Empezar</Button>',
					'\t<Button hierarchy="secondary" size="lg">Comparar planes</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
			{
				label: "Solo empezar",
				value: <Button size="lg">Empezar</Button>,
				code: '<Button size="lg">Empezar</Button>',
				imports: ["Button"],
			},
		],
	},
};
