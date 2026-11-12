// Badge en el ejemplo interactivo (un fichero por componente: design D4): la bandera y el avatar son nodos, que se
// eligen entre opciones preparadas.
import { FlagSpainCircle } from "@jotis-me/icons/flags";
import { Avatar } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { Badge as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	flag: {
		kind: "content",
		options: [
			{
				label: "Bandera",
				value: <FlagSpainCircle />,
				code: "<FlagSpainCircle />",
				imports: { "@jotis-me/icons/flags": ["FlagSpainCircle"] },
			},
		],
	},
	avatar: {
		kind: "content",
		options: [
			{
				label: "Avatar",
				value: <Avatar size="xs" initials="AD" alt="Administrador" />,
				code: '<Avatar size="xs" initials="AD" alt="Administrador" />',
				imports: ["Avatar"],
			},
		],
	},
};
