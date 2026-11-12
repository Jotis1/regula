// Puntos de partida del ejemplo interactivo del grupo «stream» del catálogo (design D3).
import type { Start } from "../playground";

export const stream: Record<string, Start> = {
	StreamAlert: { props: { user: "TioBigotes", amount: 1284 } },
	StreamEvents: {
		props: {
			items: [
				{ id: 2, type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
				{ id: 1, type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
			],
		},
	},
	StreamStatus: { props: { viewers: 1284, uptime: "2:14:05", category: "Just Chatting" } },
	ChatBadge: {},
	ChatBox: {
		props: {
			messages: [
				{ id: 1, user: "TioBigotes", tone: "sky", badges: ["mod"], text: "Bienvenidos todos." },
				{
					id: 2,
					user: "lucia_pixel",
					tone: "pink",
					badges: ["sub"],
					text: "Esa jugada la he visto yo.",
				},
			],
		},
	},
	CamFrame: { props: { width: 360, name: "Tu canal", role: "ella/él" } },
	NowPlaying: {
		props: { title: "Cuatro paredes y un techo", artist: "Los Vecinos del Quinto", progress: 0.42 },
	},
	StreamCountdown: { props: { seconds: 600, label: "Empezamos en" } },
	StreamScene: { props: { variant: "brb", seconds: 480, countdownLabel: "Vuelvo en" }, wide: true },
};
