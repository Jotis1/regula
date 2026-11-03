// Puertos de las vistas previas de Stream de la guía (reference/components/*/preview.html). Todas ponen la página
// entera en oscuro (`data-theme="dark"` en <html>): la página de comparación hace lo mismo (`DARK_PREVIEWS`).

import {
	Button,
	CamFrame,
	ChannelBanner,
	ChannelPanel,
	ChatBadge,
	ChatBox,
	type ChatMessage,
	NowPlaying,
	StreamAlert,
	StreamCountdown,
	type StreamEventItem,
	StreamEvents,
	StreamGoal,
	StreamScene,
	StreamStatus,
} from "@jotis-me/react";
import { useState } from "react";

export function StreamAlertExample() {
	const [n, setN] = useState(0);
	return (
		<div>
			{/* Dos columnas de 480px, como la vista previa de la guía (que también las corta a 800px). En la caja de
			    variantes de la web, que es un contenedor, pasa a una si no caben las dos */}
			<div className="grid grid-cols-[repeat(2,480px)] items-start gap-4 @max-[976px]:grid-cols-[480px]">
				<StreamAlert key={`f${n}`} type="follow" user="lucia_pixel" state={n ? "enter" : undefined} />
				<StreamAlert
					type="sub"
					user="nachoXL"
					tier={1}
					message="Primera vez que me suscribo a algo que no es una plataforma de series."
				/>
				<StreamAlert type="raid" user="TioBigotes" amount={1284} />
				<StreamAlert
					type="donation"
					user="Marta_en_Directo"
					amount={5}
					message="Para el café. Que se note la ojera."
				/>
			</div>
			<div className="mt-4">
				<Button hierarchy="secondary" size="sm" onClick={() => setN(n + 1)}>
					Repetir entrada
				</Button>
			</div>
		</div>
	);
}

const EVENTS: StreamEventItem[] = [
	{ type: "follow", user: "lucia_pixel", time: "ahora" },
	{ type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
	{ type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
	{ type: "resub", user: "nachoXL", months: 14, time: "12 min" },
	{ type: "gift", user: "ElSilencioso", amount: 5, time: "20 min" },
	{ type: "bits", user: "Pixel_Panda", amount: 500, time: "31 min" },
	{ type: "sub", user: "cafeconleche", time: "40 min" },
];

// Estas tres vistas previas usan 24px de margen; la página de comparación pone 16.
export function StreamEventsExample() {
	return (
		<div className="flex items-start gap-6 p-2">
			<StreamEvents items={EVENTS} max={7} animate />
			<StreamEvents title="Hoy" items={EVENTS.slice(0, 3)} width={300} />
		</div>
	);
}

export function StreamStatusExample() {
	return (
		<div className="flex flex-col items-start gap-4 p-2">
			<StreamStatus status="live" viewers={1284} uptime="2:14:05" category="Just Chatting" />
			<StreamStatus status="rerun" category="Reemisión del jueves" />
			<StreamStatus status="offline" />
		</div>
	);
}

const KINDS = ["broadcaster", "mod", "vip", "sub", "bits"] as const;

export function ChatBadgeExample() {
	return (
		<div className="p-2 text-sm text-secondary">
			{[18, 20, 28].map((size) => (
				<div key={size} className="mb-4 flex items-center gap-3">
					<span className="w-[72px] text-tertiary">{size} px</span>
					{KINDS.map((k) => (
						<ChatBadge key={k} kind={k} size={size} />
					))}
				</div>
			))}
		</div>
	);
}

const CHAT: ChatMessage[] = [
	{
		user: "TioBigotes",
		tone: "sky",
		badges: ["mod"],
		text: "Bienvenidos todos, el sillón de la derecha es mío.",
	},
	{
		user: "lucia_pixel",
		tone: "pink",
		badges: ["sub", "vip"],
		text: "Esa jugada la he visto yo en un tutorial.",
	},
	{ user: "nachoXL", tone: "emerald", badges: ["sub"], text: "Cuenta atrás para el primer susto." },
	{
		user: "Marta_en_Directo",
		tone: "purple",
		badges: ["bits"],
		text: "Cien bits para el café, que hace falta.",
	},
	{ user: "ElSilencioso", tone: "neutral", text: "Llego tarde pero llego." },
	{
		user: "TioBigotes",
		tone: "sky",
		badges: ["mod"],
		text: "Recordad las normas, que luego me toca a mí.",
	},
];

export function ChatBoxExample() {
	return (
		<div className="flex items-start gap-6 p-2">
			<ChatBox messages={CHAT} height={440} animate />
			{/* Fondo de juego de mentira, para ver la transparencia (como la vista previa) */}
			<div
				className="rounded-2xl bg-secondary p-5"
				style={{
					backgroundImage:
						"repeating-linear-gradient(135deg, var(--bg-tertiary) 0 12px, var(--bg-quaternary) 12px 24px)",
				}}
			>
				<ChatBox messages={CHAT} height={400} width={400} translucent />
			</div>
		</div>
	);
}

// Cuadrícula de damas: así se ve que el interior del marco está vacío (en OBS, ahí va la cámara).
const CHECKER = {
	backgroundImage:
		"linear-gradient(45deg, var(--bg-tertiary) 25%, transparent 25%, transparent 75%, var(--bg-tertiary) 75%), linear-gradient(45deg, var(--bg-tertiary) 25%, transparent 25%, transparent 75%, var(--bg-tertiary) 75%)",
	backgroundSize: "32px 32px",
	backgroundPosition: "0 0, 16px 16px",
};

export function CamFrameExample() {
	return (
		<div className="p-2">
			<div className="rounded-2xl bg-secondary p-6" style={CHECKER}>
				<div className="flex items-end gap-6">
					<CamFrame ratio="16:9" width={400} live name="Tu canal" role="ella/él" />
					<CamFrame ratio="4:3" width={280} name="Invitada" />
					<CamFrame ratio="1:1" width={200} name="Mod" />
				</div>
			</div>
		</div>
	);
}

export function StreamGoalExample() {
	return (
		<div className="flex flex-wrap gap-6 p-2">
			<StreamGoal label="Meta de seguidores" current={1284} goal={2000} />
			<StreamGoal label="Suscripciones del mes" current={50} goal={50} unit="subs" />
			<StreamGoal label="Café para el directo" current={0} goal={40} unit="€" />
		</div>
	);
}

export function NowPlayingExample() {
	return (
		<div className="flex flex-wrap gap-6 p-2">
			<NowPlaying title="Cuatro paredes y un techo" artist="Los Vecinos del Quinto" progress={0.42} />
			<NowPlaying title="Silencio incómodo" artist="Banda sin nombre" progress={0.9} paused />
			<NowPlaying
				title="Una canción con un título bastante más largo de lo razonable para esta tarjeta"
				artist="Artista con nombre igual de largo que la canción"
				progress={0.15}
			/>
		</div>
	);
}

export function StreamCountdownExample() {
	return (
		<div className="flex items-end gap-16 p-2">
			<StreamCountdown size="md" seconds={125} paused label="Pausa" />
			<StreamCountdown size="lg" seconds={600} paused label="Empezamos en" />
			<StreamCountdown size="xl" seconds={3725} paused label="Falta una hora y pico" />
		</div>
	);
}

// Como la vista previa: sin `scale`, cada escena se ajusta a su columna (y la cuenta corre).
export function StreamSceneExample() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<StreamScene variant="starting" seconds={300} countdownLabel="Para empezar" />
			<StreamScene variant="brb" seconds={480} countdownLabel="Vuelvo en" />
			<StreamScene variant="ending" next="Próximo directo: jueves, 20:00" />
			<StreamScene variant="offline" next="Lunes, miércoles y viernes · 20:00" />
		</div>
	);
}

export function ChannelPanelExample() {
	return (
		<div className="flex items-start gap-6 p-2">
			<ChannelPanel
				title="Sobre el canal"
				icon="user-01"
				action={{ label: "Ver todos los enlaces", icon: "arrow-right", href: "#" }}
			>
				<p>Directos tranquilos, juegos a medias y conversación sin guion.</p>
				<p>Si es tu primera vez, siéntate. Hay sitio.</p>
			</ChannelPanel>
			<ChannelPanel
				title="Horario"
				icon="calendar"
				rows={[
					{ label: "Lunes", value: "20:00" },
					{ label: "Miércoles", value: "20:00" },
					{ label: "Viernes", value: "22:00" },
				]}
			/>
			<ChannelPanel title="Normas" icon="shield-tick">
				<p>Respeto, sin spoilers y sin pedir que haga lo mismo que el streamer de ayer.</p>
				<p>Los moderadores tienen la última palabra y mucha paciencia.</p>
			</ChannelPanel>
		</div>
	);
}

export function ChannelBannerExample() {
	return (
		<ChannelBanner
			name="Tu canal"
			tagline="Directos tranquilos y conversación sin guion."
			schedule={[
				{ day: "Lunes", time: "20:00" },
				{ day: "Miércoles", time: "20:00" },
				{ day: "Viernes", time: "22:00" },
			]}
		/>
	);
}
