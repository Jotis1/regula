// PageHeader en el ejemplo interactivo (un fichero por componente: design D4): las acciones y el avatar son nodos, que
// se eligen entre opciones preparadas.
import { Avatar, Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { PageHeader as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Exportar y nuevo gasto",
				value: (
					<>
						<Button hierarchy="secondary">Exportar</Button>
						<Button>Nuevo gasto</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary">Exportar</Button>',
					"\t<Button>Nuevo gasto</Button>",
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
	avatar: {
		kind: "content",
		options: [
			{
				label: "Avatar",
				value: <Avatar size="2xl" initials="AD" alt="Administrador" />,
				code: '<Avatar size="2xl" initials="AD" alt="Administrador" />',
				imports: ["Avatar"],
			},
		],
	},
};
