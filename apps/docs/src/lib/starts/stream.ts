// Puntos de partida del ejemplo interactivo de los grupos de Stream del catálogo (design D3).
import type { Start } from "../playground";

export const stream: Record<string, Start> = {
	StreamAlert: {
		props: { user: "TioBigotes", amount: 1284 },
		presets: [
			{ label: "Seguidor", props: { type: "follow", amount: undefined } },
			{ label: "Suscripción", props: { type: "sub", tier: 1 } },
			{ label: "Resuscripción", props: { type: "resub", months: 6, tier: 1 } },
			{ label: "Regalo", props: { type: "gift", amount: 5 } },
			{ label: "Incursión", props: { type: "raid", amount: 1284 } },
			{ label: "Bits", props: { type: "bits", amount: 500 } },
			{
				label: "Donación",
				props: { type: "donation", amount: 10, message: "¡Gracias por el directo!" },
			},
		],
	},
	StreamEvents: {
		props: {
			items: [
				{ id: 2, type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
				{ id: 1, type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
			],
		},
		presets: [
			{ label: "Con animación", props: { animate: true } },
			{ label: "Solo el último", props: { max: 1 } },
		],
	},
	StreamStatus: {
		props: { viewers: 1284, uptime: "2:14:05", category: "Just Chatting" },
		presets: [
			{ label: "En directo", props: { status: "live" } },
			{ label: "Desconectado", props: { status: "offline" } },
			{ label: "Repetición", props: { status: "rerun" } },
		],
	},
	StreamGoal: {
		props: { label: "Meta de seguidores", current: 840, goal: 1000, unit: "seguidores" },
		presets: [
			{ label: "Casi", props: { current: 960 } },
			{ label: "Cumplida", props: { current: 1000 } },
			{ label: "Al empezar", props: { current: 40 } },
		],
	},
	ChatBadge: {
		props: {},
		presets: [
			{ label: "Streamer", props: { kind: "broadcaster" } },
			{ label: "Moderador", props: { kind: "mod" } },
			{ label: "VIP", props: { kind: "vip" } },
			{ label: "Suscriptor", props: { kind: "sub" } },
			{ label: "Bits", props: { kind: "bits" } },
		],
	},
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
		presets: [
			{ label: "Translúcido", props: { translucent: true } },
			{ label: "Sin desvanecer", props: { fade: false } },
			{ label: "Con animación", props: { animate: true } },
		],
	},
	CamFrame: {
		props: { width: 360, name: "Tu canal", role: "ella/él" },
		presets: [
			{ label: "16:9", props: { ratio: "16:9" } },
			{ label: "4:3", props: { ratio: "4:3" } },
			{ label: "Cuadrado", props: { ratio: "1:1" } },
			{ label: "En directo", props: { live: true } },
		],
	},
	NowPlaying: {
		props: { title: "Cuatro paredes y un techo", artist: "Los Vecinos del Quinto", progress: 0.42 },
		tweaks: { progress: { kind: "number", min: 0, max: 1, step: 0.01 } },
		presets: [
			{ label: "Sonando", props: { paused: false } },
			{ label: "En pausa", props: { paused: true } },
		],
	},
	StreamCountdown: {
		props: { seconds: 600, label: "Empezamos en" },
		presets: [
			{ label: "Pequeño", props: { size: "sm" } },
			{ label: "Mediano", props: { size: "md" } },
			{ label: "Grande", props: { size: "lg" } },
			{ label: "En pausa", props: { paused: true } },
		],
	},
	StreamScene: {
		props: { variant: "brb", seconds: 480, countdownLabel: "Vuelvo en" },
		wide: true,
		presets: [
			{
				label: "Empezando",
				props: { variant: "starting", seconds: 300, countdownLabel: "Para empezar" },
			},
			{
				label: "Vuelvo enseguida",
				props: { variant: "brb", seconds: 480, countdownLabel: "Vuelvo en" },
			},
			{ label: "Terminando", props: { variant: "ending" } },
			{ label: "Desconectado", props: { variant: "offline" } },
		],
	},
	ChannelPanel: {
		props: {
			title: "Horario",
			rows: [
				{ label: "Lunes", value: "20:00" },
				{ label: "Miércoles", value: "20:00" },
				{ label: "Sábado", value: "17:00" },
			],
		},
		presets: [
			{ label: "Con botón", props: { action: { label: "Suscribirme", href: "#" } } },
			{ label: "Con icono", props: { icon: "calendar" } },
			{ label: "Ancho", props: { width: 420 } },
		],
	},
	ChannelBanner: {
		props: {
			name: "Tu canal",
			tagline: "Cuentas claras, directos tranquilos.",
			schedule: [
				{ day: "Lun", time: "20:00" },
				{ day: "Mié", time: "20:00" },
				{ day: "Sáb", time: "17:00" },
			],
			scale: 0.4,
		},
		wide: true,
	},
};
