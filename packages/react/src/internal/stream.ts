// Base común de la familia Stream (Twitch), design §12. Sin "use client": la usan componentes de servidor.
import type { CSSProperties } from "react";
import type { IconName } from "../components/Icon.js";
import { formatCurrency, formatNumber } from "./format.js";

/**
 * Raíz de cada componente de Stream: siempre en oscuro. `dark-mode` redefine los tokens en su subárbol (el
 * `data-theme="dark"` del bundle), así que se ve igual dentro de una página clara (`.jm-st` del bundle).
 */
export const STREAM_ROOT = "dark-mode font-body text-primary antialiased";

/** Cifras de reloj y contadores: Geist con números tabulares, para que no bailen al cambiar. */
export const TABULAR = "font-body tabular-nums";

export type StreamMotion = "enter" | "exit";

/**
 * Entrada y salida, la excepción acotada a "sin animaciones decorativas" (guía, Stream · Movimiento).
 * Entra en 250 ms con fundido y 8px de subida; sale en 200 ms subiendo 8px. Con `prefers-reduced-motion`,
 * solo fundido. Sin keyframes: la entrada es una transición desde `@starting-style` (variante `starting:`), así
 * que se ve al montar el elemento; la salida, una transición al cambiar `state` a `exit`. Curvas del bundle.
 * Con menos movimiento solo se anima `opacity` y el desplazamiento se queda en 0 (sin saltos).
 */
export function streamMotion(state: StreamMotion | undefined): string | undefined {
	if (state === "enter")
		return "transition-[opacity,translate] duration-250 ease-[cubic-bezier(.2,.7,.2,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-opacity motion-reduce:starting:translate-y-0";
	if (state === "exit")
		return "-translate-y-2 opacity-0 transition-[opacity,translate] duration-200 ease-in motion-reduce:translate-y-0 motion-reduce:transition-opacity";
	return undefined;
}

export type StreamEventType = "follow" | "sub" | "resub" | "gift" | "raid" | "bits" | "donation";

/** Icono y etiqueta de cada tipo de evento, compartidos por StreamAlert y StreamEvents. */
export const STREAM_EVENTS: Record<StreamEventType, { icon: IconName; label: string }> = {
	follow: { icon: "user-plus-01", label: "Nuevo seguidor" },
	sub: { icon: "star-01", label: "Nueva suscripción" },
	resub: { icon: "refresh-cw-01", label: "Suscripción renovada" },
	gift: { icon: "stars-02", label: "Suscripciones regaladas" },
	raid: { icon: "users-01", label: "Raid entrante" },
	bits: { icon: "zap", label: "Bits" },
	donation: { icon: "currency-euro", label: "Donación" },
};

export interface StreamEventData {
	amount?: number;
	months?: number;
	tier?: number | string;
}

/** Texto por defecto de una alerta, con la voz de la suite (`stDetail` del bundle). */
export function streamDetail(type: StreamEventType, e: StreamEventData): string {
	switch (type) {
		case "follow":
			return "Ya no hay vuelta atrás.";
		case "sub":
			return e.tier ? `Suscripción de nivel ${e.tier}.` : "Gracias por el apoyo.";
		case "resub":
			return e.months ? `Lleva ${e.months} meses por aquí.` : "Sigue por aquí.";
		case "gift": {
			const n = e.amount ?? 1;
			return `${formatNumber(n)} ${n === 1 ? "suscripción regalada" : "suscripciones regaladas"} al chat.`;
		}
		case "raid":
			return `${formatNumber(e.amount ?? 0)} espectadores acaban de aterrizar.`;
		case "bits":
			return `${formatNumber(e.amount ?? 0)} bits.`;
		case "donation":
			return typeof e.amount === "number" ? formatCurrency(e.amount) : "";
	}
}

/** Línea corta de un evento en una lista: "Donación · 5,00 €", "Raid entrante · 1.284" (`stShort`). */
export function streamShort(type: StreamEventType, e: StreamEventData): string {
	let extra = "";
	if (type === "donation" && typeof e.amount === "number") extra = formatCurrency(e.amount);
	else if (type === "resub" && e.months) extra = `${e.months} meses`;
	else if ((type === "bits" || type === "raid" || type === "gift") && e.amount != null)
		extra = formatNumber(e.amount);
	return STREAM_EVENTS[type].label + (extra ? ` · ${extra}` : "");
}

/**
 * Claves estables para listas que crecen por un extremo (StreamEvents, ChatBox): `id` si lo hay y, si no, el
 * contenido, con un contador para los repetidos. Con la posición como clave, al entrar un elemento nuevo con la
 * lista llena no se monta nada y la entrada (`starting:`) no se ve.
 */
export function stableKeys<T>(items: T[], content: (item: T) => string): string[] {
	const seen = new Map<string, number>();
	return items.map((it) => {
		const id = (it as { id?: string | number }).id;
		const base = id != null ? `id:${id}` : content(it);
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		return `${base}#${n}`;
	});
}

/** Texto de un nodo para derivar una clave: solo cadenas y números. */
export const keyText = (node: unknown) =>
	typeof node === "string" || typeof node === "number" ? String(node) : "";

/** Fecha de StreamCountdown y StreamScene: `Date`, texto ISO o milisegundos. */
export type StreamTime = Date | string | number;

const ms = (t: StreamTime) => new Date(t).getTime();

/** Segundos que quedan (nunca negativos): hasta `target` desde `now` (o la hora actual), o `seconds`. */
export function secondsLeft(p: { seconds?: number; target?: StreamTime; now?: StreamTime }): number {
	if (p.target != null)
		return Math.max(0, Math.round((ms(p.target) - (p.now != null ? ms(p.now) : Date.now())) / 1000));
	return Math.max(0, Math.floor(p.seconds ?? 0));
}

/** `90` → `01:30`; `3725` → `1:02:05` (h:mm:ss si pasa de una hora). */
export function streamClock(total: number): string {
	const t = Math.max(0, Math.floor(total));
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = t % 60;
	const z = (n: number) => String(n).padStart(2, "0");
	return `${h ? `${h}:${z(m)}` : z(m)}:${z(s)}`;
}

/**
 * Rejilla de `border-secondary` desvanecida hacia los bordes (`.jm-st-grid` del bundle): StreamScene la usa cada
 * 96px con elipse 70 % × 65 %; ChannelBanner, cada 80px con 80 % × 90 %.
 */
export function streamGrid(size: number, ellipse: string): CSSProperties {
	// color-fijo: máscara de desvanecido (solo cuenta el alfa), como BackgroundPattern
	const mask = `radial-gradient(ellipse ${ellipse} at 50% 50%, black, transparent)`;
	return {
		backgroundImage:
			"linear-gradient(to right, var(--border-secondary) 1px, transparent 1px), linear-gradient(to bottom, var(--border-secondary) 1px, transparent 1px)",
		backgroundSize: `${size}px ${size}px`,
		backgroundPosition: "center",
		maskImage: mask,
		WebkitMaskImage: mask,
	};
}
