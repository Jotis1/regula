import type { ReactNode } from "react";
import { type StreamTime, streamGrid } from "../internal/stream.js";
import { StreamStage } from "../internal/stream-stage.js";
import { CountdownView } from "./StreamCountdown.js";

export type StreamSceneVariant = "starting" | "brb" | "ending" | "offline";

export interface StreamSceneProps {
	/** @default "starting" */
	variant?: StreamSceneVariant;
	/** Titular en Bricolage a 152px; no más de 24 caracteres. */
	title?: ReactNode;
	/** `false` lo oculta. */
	subtitle?: ReactNode | false;
	/** Texto de la insignia de estado. */
	badge?: ReactNode;
	/** Cuenta atrás en segundos (solo en `starting` y `brb`). */
	seconds?: number;
	/** Fecha objetivo de la cuenta atrás (solo en `starting` y `brb`). */
	target?: StreamTime;
	/** Hora fija para la cuenta atrás (pruebas). */
	now?: StreamTime;
	paused?: boolean;
	countdownLabel?: ReactNode;
	/** @default "Tu canal" */
	channel?: ReactNode;
	/** Línea central del pie, como la próxima fecha. Una sola información de horario. */
	next?: ReactNode;
	/** @default "twitch.tv/tucanal" */
	handle?: ReactNode;
	/**
	 * Ancho del lienzo lógico; el alto es siempre 1080. Para 3440×1440, `width={2580}` con `scale={4/3}`. Un entero de
	 * al menos 1920; cualquier otro valor se trata como 1920.
	 * @default 1920
	 */
	width?: number;
	/** Mide `width × scale`. Sin él se ajusta al ancho del contenedor (en OBS, a 1920, queda 1:1). */
	scale?: number;
	className?: string;
}

// Textos por defecto: una broma seca por escena y ninguna más (ficha).
const SCENES: Record<StreamSceneVariant, { badge: string; title: string; sub: string }> = {
	starting: {
		badge: "Empezamos pronto",
		title: "Ya casi",
		sub: "Últimos retoques. Mientras, el chat puede ir calentando.",
	},
	brb: { badge: "Pausa", title: "Vuelvo enseguida", sub: "Hidratación, no drama." },
	ending: {
		badge: "Fin del directo",
		title: "Hasta la próxima",
		sub: "Gracias por quedarte. Ahora toca dormir como personas.",
	},
	offline: {
		badge: "Sin directo",
		title: "Ahora mismo, silencio",
		sub: "Aquí no emite nadie. Mira el horario o vuelve más tarde.",
	},
};

const GRID = streamGrid(96, "70% 65%");
const BASE_WIDTH = 1920;

/** El ancho pedido si es un entero de al menos 1920; si no, 1920. */
function canvasWidth(width: number | undefined): number {
	return Number.isInteger(width) && (width as number) >= BASE_WIDTH ? (width as number) : BASE_WIDTH;
}

/**
 * Escena de 1920×1080 (o más ancha, con `width`) para los momentos sin juego (empezando, pausa, final, offline), siempre en oscuro. Es de
 * servidor: solo el lienzo (que mide su contenedor sin `scale`) y la cuenta atrás son de cliente.
 */
export function StreamScene({
	variant = "starting",
	title,
	subtitle,
	badge,
	seconds,
	target,
	now,
	paused,
	countdownLabel,
	channel,
	next,
	handle,
	width,
	scale,
	className,
}: StreamSceneProps) {
	const d = SCENES[variant] ?? SCENES.starting;
	const countdown = (variant === "starting" || variant === "brb") && (seconds != null || target != null);
	return (
		<StreamStage width={canvasWidth(width)} height={1080} scale={scale} className={className}>
			<div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GRID} />
			<div className="absolute inset-[0_0_128px_0] flex flex-col items-center justify-center gap-8 px-[240px] text-center">
				<span className="inline-flex h-14 items-center gap-3.5 rounded-full border-2 border-primary bg-primary_alt px-7 text-[28px] leading-9 font-medium text-secondary">
					<span
						aria-hidden="true"
						className="inline-block size-3.5 flex-none rounded-full bg-fg-brand-primary"
					/>
					{badge ?? d.badge}
				</span>
				<h1 className="m-0 font-display text-[152px] leading-[1.04] font-semibold tracking-[-0.02em] text-primary">
					{title ?? d.title}
				</h1>
				{subtitle !== false ? (
					<p className="m-0 max-w-[1040px] text-[40px] leading-14 text-tertiary">
						{subtitle ?? d.sub}
					</p>
				) : null}
				{countdown ? (
					<CountdownView
						seconds={seconds}
						target={target}
						now={now}
						paused={paused}
						size={176}
						label={countdownLabel}
						className="mt-4 gap-2"
						labelClassName="text-[28px] leading-9"
					/>
				) : null}
			</div>
			<div className="absolute right-20 bottom-14 left-20 flex items-center justify-between gap-10 text-[28px] leading-9 font-medium text-tertiary">
				<span className="font-display font-semibold text-primary">{channel ?? "Tu canal"}</span>
				{next ? <span>{next}</span> : null}
				<span>{handle ?? "twitch.tv/tucanal"}</span>
			</div>
		</StreamStage>
	);
}
