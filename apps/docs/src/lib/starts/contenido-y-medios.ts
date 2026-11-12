// Puntos de partida del ejemplo interactivo del grupo «contenido-y-medios» del catálogo (design D3).
import type { Start } from "../playground";

export const contenidoYMedios: Record<string, Start> = {
	MessageInput: {
		props: { placeholder: "Pregunta a Emptor…" },
		presets: [
			{ label: "Mínimo", props: { variant: "minimal" } },
			{ label: "Con área de texto", props: { variant: "textarea" } },
			{ label: "Avanzado", props: { variant: "advanced" } },
		],
	},
	Message: {
		props: { author: "Emptor", avatar: { initials: "Em" }, time: "10:24" },
		children: "He encontrado tres opciones por debajo de 200 €.",
		presets: [
			{ label: "Mensaje", props: { type: "message" } },
			{ label: "Enviado", props: { sent: true, status: "read" } },
			{ label: "Con respuesta", props: { type: "reply", reply: "Respuesta" } },
			{
				label: "Con reacciones",
				props: {
					reactions: [
						{ emoji: "👍", count: 2 },
						{ emoji: "🎉", count: 1 },
					],
				},
			},
			{
				label: "Con archivo",
				props: { type: "file", file: { name: "Presupuesto.pdf", size: "240 KB" } },
			},
			{ label: "Escribiendo", props: { type: "typing", typing: true } },
			{ label: "En línea", props: { online: true } },
		],
	},
	CodeSnippet: {
		props: { language: "bash", code: "bun add @jotis-me/react" },
		wide: true,
		presets: [
			{ label: "Horizontal", props: { variant: "horizontal" } },
			{ label: "Vertical", props: { variant: "vertical" } },
			{
				label: "Con pestañas",
				props: {
					tabs: [
						{ label: "bun", code: "bun add @jotis-me/react", language: "bash" },
						{ label: "npm", code: "npm install @jotis-me/react", language: "bash" },
					],
				},
			},
			{ label: "Sin números de línea", props: { lineNumbers: false } },
		],
	},
	VideoPlayer: {
		props: { duration: 125 },
		presets: [
			{ label: "Pequeño", props: { size: "sm" } },
			{ label: "Mediano", props: { size: "md" } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	Carousel: {
		props: { slides: "Tres diapositivas" },
		wide: true,
		presets: [
			{ label: "Botones con flecha", props: { arrowStyle: "button-chevron" } },
			{ label: "Botones con flecha larga", props: { arrowStyle: "button-arrow" } },
			{ label: "Solo flechas", props: { arrowStyle: "arrow" } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
};
