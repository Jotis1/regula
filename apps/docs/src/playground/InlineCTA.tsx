// InlineCTA en el ejemplo interactivo (un fichero por componente: design D4): las acciones y la imagen son nodos, que
// se eligen entre opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { InlineCTA as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Ahora no y novedades",
				value: (
					<>
						<Button hierarchy="tertiary" size="sm">
							Ahora no
						</Button>
						<Button size="sm">Novedades</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="tertiary" size="sm">Ahora no</Button>',
					'\t<Button size="sm">Novedades</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
			{
				label: "Mejorar plan",
				value: (
					<>
						<Button hierarchy="secondary" size="sm">
							Saber más
						</Button>
						<Button size="sm">Mejorar plan</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary" size="sm">Saber más</Button>',
					'\t<Button size="sm">Mejorar plan</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
	image: {
		kind: "content",
		options: [
			{
				label: "Portada",
				value: <div className="size-full bg-brand-solid" />,
				code: '<div className="size-full bg-brand-solid" />',
			},
		],
	},
};
