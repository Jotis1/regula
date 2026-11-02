import { cx } from "../internal/cx.js";
import { STREAM_ROOT } from "../internal/stream.js";
import { Icon, type IconName } from "./Icon.js";

export type ChatBadgeKind = "broadcaster" | "mod" | "vip" | "sub" | "bits";

export interface ChatBadgeProps {
	/** @default "sub" */
	kind?: ChatBadgeKind;
	/**
	 * Lado en px; 18 como mínimo en el chat.
	 * @default 20
	 */
	size?: number;
	/** Sustituye al texto accesible y al del `title` ("Streamer", "Moderador", "VIP", "Suscriptor", "Bits"). */
	title?: string;
	className?: string;
}

// Receta de Badge sobre las escalas utility en oscuro: fondo -50, borde -200, icono -700. Cada rol lleva además su
// icono, así que no depende solo del color. Clases enteras: Tailwind solo genera las que ve escritas.
const BADGES: Record<ChatBadgeKind, { icon: IconName; label: string; tone: string }> = {
	broadcaster: {
		icon: "play",
		label: "Streamer",
		tone: "bg-utility-brand-50 text-utility-brand-700 inset-ring-utility-brand-200",
	},
	mod: {
		icon: "shield-tick",
		label: "Moderador",
		tone: "bg-utility-emerald-50 text-utility-emerald-700 inset-ring-utility-emerald-200",
	},
	vip: {
		icon: "stars-02",
		label: "VIP",
		tone: "bg-utility-pink-50 text-utility-pink-700 inset-ring-utility-pink-200",
	},
	sub: {
		icon: "star-01",
		label: "Suscriptor",
		tone: "bg-utility-sky-50 text-utility-sky-700 inset-ring-utility-sky-200",
	},
	bits: {
		icon: "zap",
		label: "Bits",
		tone: "bg-utility-purple-50 text-utility-purple-700 inset-ring-utility-purple-200",
	},
};

/** Insignia cuadrada de chat para el rol del usuario, siempre en oscuro. */
export function ChatBadge({ kind = "sub", size = 20, title, className }: ChatBadgeProps) {
	const b = BADGES[kind] ?? BADGES.sub;
	const name = title ?? b.label;
	return (
		<span
			role="img"
			aria-label={name}
			title={name}
			className={cx(
				STREAM_ROOT,
				"inline-flex flex-none items-center justify-center rounded-sm inset-ring",
				b.tone,
				className,
			)}
			style={{ width: size, height: size }}
		>
			<Icon name={b.icon} size={Math.round(size * 0.65)} strokeWidth={2.25} />
		</span>
	);
}
