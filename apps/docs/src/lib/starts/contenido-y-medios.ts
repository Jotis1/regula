// Puntos de partida del ejemplo interactivo del grupo «contenido-y-medios» del catálogo (design D3).
import type { Start } from "../playground";

export const contenidoYMedios: Record<string, Start> = {
	MessageInput: {
		props: { placeholder: "Pregunta a Emptor…" },
	},
	Message: {
		props: { author: "Emptor", avatar: { initials: "Em" }, time: "10:24" },
		children: "He encontrado tres opciones por debajo de 200 €.",
	},
	CodeSnippet: {
		props: { language: "bash", code: "bun add @jotis-me/react" },
		wide: true,
	},
	VideoPlayer: {
		props: { duration: 125 },
	},
	Carousel: {
		props: { slides: "Tres diapositivas" },
		wide: true,
	},
};
