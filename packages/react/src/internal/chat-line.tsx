// Fila de un mensaje del chat: la comparten ChatBox y StreamPinnedMessage para que se vean igual.
import type { ReactNode } from "react";
import { ChatBadge, type ChatBadgeKind } from "../components/ChatBadge.js";
import { cx } from "./cx.js";
import { splitLinks } from "./links.js";

export type ChatTone = "brand" | "sky" | "emerald" | "pink" | "purple" | "orange" | "indigo" | "neutral";

export interface ChatMessage {
	user: ReactNode;
	/**
	 * Lo que escribe el espectador. Siempre texto plano: llega del público y se pinta tal cual, nunca como HTML
	 * (por eso es `string` y no un nodo).
	 */
	text: string;
	/**
	 * Tono del nombre: escala `utility-<tono>-700`.
	 * @default "neutral"
	 */
	tone?: ChatTone;
	/** Insignias delante del nombre; no más de tres. */
	badges?: ChatBadgeKind[];
	/** Clave estable. Sin ella se deriva del usuario y el texto. Con `onSelect` en ChatBox, hace falta para elegirlo. */
	id?: string | number;
	/**
	 * Con `onSelect` en ChatBox, `false` lo deja fuera de la selección (un bot, por ejemplo).
	 * @default true
	 */
	selectable?: boolean;
}

// Clases enteras: Tailwind solo genera las que ve escritas.
const TONE: Record<ChatTone, string> = {
	brand: "text-utility-brand-700",
	sky: "text-utility-sky-700",
	emerald: "text-utility-emerald-700",
	pink: "text-utility-pink-700",
	purple: "text-utility-purple-700",
	orange: "text-utility-orange-700",
	indigo: "text-utility-indigo-700",
	neutral: "text-utility-neutral-700",
};

/**
 * Insignias, nombre con dos puntos y texto de un mensaje, en línea (design D7 y D8 de add-live-interaction-pieces).
 * Las insignias y el nombre van en un grupo que no se parte; el texto sigue detrás y parte donde haga falta. Las
 * insignias van en una caja de una línea de alto, así que quedan centradas con el nombre a cualquier tamaño.
 */
export function ChatLine({ message: m }: { message: ChatMessage }) {
	return (
		<>
			<span className="whitespace-nowrap">
				{m.badges?.length ? (
					<span className="mr-2 inline-flex h-[1lh] items-center gap-1 align-top">
						{m.badges.map((b) => (
							<ChatBadge key={b} kind={b} />
						))}
					</span>
				) : null}
				<span className={cx("font-semibold", TONE[m.tone ?? "neutral"] ?? TONE.neutral)}>
					{m.user}
					<span className="mr-2">:</span>
				</span>
			</span>
			{/* Sin espacio entre el nombre y el texto no habría dónde partir la línea, y `wrap-anywhere` cortaría la
			    primera palabra por la mitad. `<wbr>` da ese punto de corte sin ocupar sitio. */}
			<wbr />
			<span className="text-primary">
				{splitLinks(m.text).map((p, i) =>
					p.link ? (
						// biome-ignore lint/suspicious/noArrayIndexKey: los trozos no cambian de orden.
						<span key={i} className="text-brand-secondary underline underline-offset-2">
							{p.text}
						</span>
					) : (
						p.text
					),
				)}
			</span>
		</>
	);
}
