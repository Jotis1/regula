// TeamMemberCard en el ejemplo interactivo (un fichero por componente: design D4): la foto y las redes son nodos, que
// se eligen entre opciones preparadas.
import { ButtonUtility } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { TeamMemberCard as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	image: {
		kind: "content",
		options: [
			{
				label: "Foto",
				value: <div className="size-full bg-utility-brand-200" />,
				code: '<div className="size-full bg-utility-brand-200" />',
			},
		],
	},
	socials: {
		kind: "content",
		options: [
			{
				label: "Redes",
				value: (
					<>
						<ButtonUtility icon="link-01" label="Sitio web" hierarchy="tertiary" />
						<ButtonUtility icon="mail-01" label="Correo" hierarchy="tertiary" />
					</>
				),
				code: [
					"<>",
					'\t<ButtonUtility icon="link-01" label="Sitio web" hierarchy="tertiary" />',
					'\t<ButtonUtility icon="mail-01" label="Correo" hierarchy="tertiary" />',
					"</>",
				].join("\n"),
				imports: ["ButtonUtility"],
			},
		],
	},
};
