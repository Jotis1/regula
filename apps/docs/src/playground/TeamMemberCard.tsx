// TeamMemberCard en el ejemplo interactivo (un fichero por componente: design D4): la foto y las redes son nodos, que
// se eligen entre opciones preparadas.
import { ButtonUtility } from "@jotis-me/react";
import { Link01, Mail01 } from "@untitledui/icons";
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
						<ButtonUtility icon={Link01} label="Sitio web" hierarchy="tertiary" />
						<ButtonUtility icon={Mail01} label="Correo" hierarchy="tertiary" />
					</>
				),
				code: [
					"<>",
					'\t<ButtonUtility icon={Link01} label="Sitio web" hierarchy="tertiary" />',
					'\t<ButtonUtility icon={Mail01} label="Correo" hierarchy="tertiary" />',
					"</>",
				].join("\n"),
				imports: ["ButtonUtility"],
			},
		],
	},
};
