// ChatBox en el ejemplo interactivo: un fichero por componente para que cada página cargue solo el suyo (design D4).
// Con `animate`, el chat del ejemplo recibe un mensaje cada 2,5 s en ventana deslizante de 8, como en un directo: si no
// entrara ninguno, la animación no se vería (design D9 de add-live-interaction-pieces). El temporizador es de la web y
// no del componente: el código del ejemplo sigue enseñando solo `<ChatBox messages={…} animate />`.
// `onSelect` es una función y no cruza de Astro: se elige como «Seleccionable», y el envoltorio guarda el elegido.
import { ChatBox, type ChatBoxProps, type ChatMessage } from "@jotis-me/react";
import { useEffect, useState } from "react";
import type { Tweak } from "../lib/playground";

const FEED_MS = 2500;
const WINDOW = 8;

const FEED: Omit<ChatMessage, "id">[] = [
	{ user: "nachoXL", tone: "emerald", badges: ["sub"], text: "Cuenta atrás para el primer susto." },
	{ user: "ElSilencioso", text: "Llego tarde. El clip está en https://jotis.me/clips." },
	{
		user: "TioBigotes",
		tone: "sky",
		badges: ["mod", "sub", "vip"],
		text: "Recordad las normas: nada de spoilers del final, nada de mandar al streamer a la puerta equivocada y nada de gritar antes de tiempo.",
	},
	{
		user: "Marta_en_Directo",
		tone: "purple",
		badges: ["bits"],
		text: "Cien bits para el café, que hace falta.",
	},
	{ user: "lucia_pixel", tone: "pink", badges: ["sub"], text: "AAAH" },
];

export default function ChatBoxPlayground({
	onSelect,
	selectedId: _selectedId,
	...props
}: Omit<ChatBoxProps, "onSelect"> & { onSelect?: unknown }) {
	const { animate, messages } = props;
	const [extra, setExtra] = useState<ChatMessage[]>([]);
	const [selected, setSelected] = useState<string | number>();
	useEffect(() => {
		setExtra([]);
		if (!animate) return;
		let n = 0;
		const id = setInterval(() => {
			const next: ChatMessage = { ...(FEED[n % FEED.length] as ChatMessage), id: `feed-${n}` };
			n += 1;
			setExtra((prev) => [...prev, next].slice(-WINDOW));
		}, FEED_MS);
		return () => clearInterval(id);
	}, [animate]);
	return (
		<ChatBox
			{...props}
			messages={[...(messages ?? []), ...extra].slice(-WINDOW)}
			onSelect={onSelect != null ? (m) => setSelected(m.id) : undefined}
			selectedId={onSelect != null ? selected : undefined}
		/>
	);
}

export const tweaks: Record<string, Tweak> = {
	onSelect: {
		kind: "content",
		options: [{ label: "Seleccionable", value: true, code: "(message) => setSelected(message.id)" }],
	},
	selectedId: { kind: "hidden" },
};
