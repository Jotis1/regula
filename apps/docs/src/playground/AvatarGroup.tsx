// AvatarGroup en el ejemplo interactivo (un fichero por componente: design D4): el botón de añadir aparece con una
// función, que se elige entre opciones preparadas.
import type { Tweak } from "../lib/playground";

export { AvatarGroup as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	onAdd: {
		kind: "content",
		options: [{ label: "Con botón de añadir", value: () => {}, code: "() => {}" }],
	},
};
