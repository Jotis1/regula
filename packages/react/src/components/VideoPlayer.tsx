"use client";

import { Maximize01, PauseCircle, Play, VolumeMax, VolumeX } from "@untitledui/icons";
import { type CSSProperties, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { DynIcon } from "../internal/icon.js";

export interface VideoPlayerLabels {
	play: string;
	pause: string;
	seek: string;
	mute: string;
	unmute: string;
	fullscreen: string;
	/** Texto de la posición para lectores de pantalla: "1:05 de 4:12". */
	position: (current: string, total: string) => string;
	/** Nombre del control de volumen (`size="lg"`). */
	volume: string;
	/** Nombre del botón de velocidad (`size="lg"`). */
	speed: string;
}

export type VideoPlayerSize = "sm" | "md" | "lg";

export interface VideoPlayerProps {
	/** Fichero de vídeo. Sin él, el reproductor es una maqueta (con `poster` y `duration`). */
	src?: string;
	/** Imagen antes de reproducir. */
	poster?: string;
	/** Duración en segundos cuando no hay `src`. */
	duration?: number;
	/**
	 * Tamaño del Figma (nodo `9264:576771`), que cambia los controles y la barra de acciones:
	 * - `sm`: barra de 4px de relleno con reproducir, volumen y pantalla completa, sin barra de progreso;
	 * - `md`: reproducir, tiempo, progreso con el tiempo que queda, volumen y pantalla completa;
	 * - `lg`: como `md`, con control de volumen deslizante y velocidad.
	 *
	 * Sin `size`, el reproductor de siempre (barra con tiempo y posición, a 16:9 y a todo el ancho).
	 */
	size?: VideoPlayerSize;
	/** Textos de los controles (ampliación sobre la guía). */
	labels?: Partial<VideoPlayerLabels>;
	className?: string;
	style?: CSSProperties;
}

const DEFAULT_LABELS: VideoPlayerLabels = {
	play: "Reproducir",
	pause: "Pausa",
	seek: "Posición",
	mute: "Silenciar",
	unmute: "Activar sonido",
	fullscreen: "Pantalla completa",
	position: (current, total) => `${current} de ${total}`,
	volume: "Volumen",
	speed: "Velocidad",
};

/** `252` → `04:12`, como el Figma de los tamaños. */
const clock2 = (s: number) => {
	const t = Math.max(0, Math.floor(s || 0));
	return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

const SPEEDS = [1, 1.25, 1.5, 2, 0.5];

// Barra de acciones de cada tamaño: relleno, hueco entre botones y radio del reproductor (Figma 9264:576771)
const BAR: Record<VideoPlayerSize, string> = {
	sm: "gap-0.5 px-1 pt-6 pb-1",
	md: "gap-0.5 px-5 pt-10 pb-4",
	lg: "gap-1 px-8 pt-12 pb-6",
};
const RADIUS: Record<VideoPlayerSize, string> = { sm: "rounded-lg", md: "rounded-lg", lg: "rounded-xl" };

/** `252` → `4:12`. */
const clock = (s: number) => {
	const t = Math.max(0, Math.floor(s || 0));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// Controles en blanco y negro fijos: van sobre el vídeo, no sobre la interfaz (excepción de la ficha).
const FOCUS = "focus-visible:shadow-focus-ring focus-visible:outline-none";
const BTN = cx(
	"inline-flex cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-[#ffffff] transition-colors duration-100 hover:bg-[#ffffff33]",
	FOCUS,
);
// Botón de los tamaños del Figma: 8px de relleno y icono de 16
const SBTN = BTN.replace("p-1.5", "p-2");
const THUMB =
	"[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffffff] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#ffffff]";

/** Reproductor de vídeo 16:9 con botón central, barra de controles, tiempo, volumen y pantalla completa. */
export function VideoPlayer({ src, poster, duration = 0, size, labels, className, style }: VideoPlayerProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const video = useRef<HTMLVideoElement>(null);
	const wrap = useRef<HTMLDivElement>(null);
	const [playing, setPlaying] = useState(false);
	const [time, setTime] = useState(0);
	const [total, setTotal] = useState(duration);
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState(1);
	const [speedIndex, setSpeedIndex] = useState(0);
	const speed = SPEEDS[speedIndex] ?? 1;

	const seek = (n: number) => {
		setTime(n);
		if (video.current) video.current.currentTime = n;
	};
	const toggleMute = () => {
		if (video.current) video.current.muted = !muted;
		setMuted(!muted);
	};
	const nextSpeed = () => {
		const i = (speedIndex + 1) % SPEEDS.length;
		setSpeedIndex(i);
		if (video.current) video.current.playbackRate = SPEEDS[i] ?? 1;
	};

	const toggle = () => {
		const v = video.current;
		if (!v) setPlaying((p) => !p);
		else if (v.paused) void v.play();
		else v.pause();
	};

	return (
		<div
			ref={wrap}
			className={cx(
				"relative aspect-video overflow-hidden",
				size ? RADIUS[size] : "rounded-xl",
				"bg-[#000000] font-body",
				className,
			)}
			style={style}
		>
			{src ? (
				// Clic en el vídeo: atajo de ratón; con teclado está el botón de la barra
				<video
					ref={video}
					src={src}
					poster={poster}
					playsInline
					muted={muted}
					onClick={toggle}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
					onLoadedMetadata={(e) => setTotal(e.currentTarget.duration)}
					className="block size-full object-cover"
				/>
			) : (
				<div
					className="block size-full bg-primary-solid bg-cover bg-center"
					style={poster ? { backgroundImage: `url(${poster})` } : undefined}
				/>
			)}
			{playing ? null : (
				// Atajo de ratón: con teclado se usa el botón de la barra, que es el mismo control
				<button
					type="button"
					tabIndex={-1}
					aria-hidden="true"
					onClick={toggle}
					className="absolute top-1/2 left-1/2 -mt-8 -ml-8 inline-flex size-16 cursor-pointer items-center justify-center rounded-full border-0 bg-[#ffffff4d] text-[#ffffff] [backdrop-filter:var(--backdrop-blur-lg)]"
				>
					<Play size={28} />
				</button>
			)}
			{size ? (
				<div
					className={cx(
						"absolute inset-x-0 bottom-0 flex items-center bg-[linear-gradient(to_bottom,#00000000,#0000004d)] text-[#ffffff]",
						BAR[size],
					)}
				>
					<button
						type="button"
						className={SBTN}
						onClick={toggle}
						aria-label={playing ? l.pause : l.play}
					>
						<DynIcon icon={playing ? PauseCircle : Play} size={16} />
					</button>
					{size === "sm" ? null : (
						<>
							{size === "lg" ? (
								<>
									<button
										type="button"
										className={SBTN}
										onClick={toggleMute}
										aria-label={muted ? l.unmute : l.mute}
									>
										<DynIcon
											icon={muted || volume === 0 ? VolumeX : VolumeMax}
											size={16}
										/>
									</button>
									<input
										type="range"
										min={0}
										max={1}
										step={0.05}
										value={muted ? 0 : volume}
										aria-label={l.volume}
										onChange={(e) => {
											const n = Number(e.target.value);
											setVolume(n);
											setMuted(n === 0);
											if (video.current) {
												video.current.volume = n;
												video.current.muted = n === 0;
											}
										}}
										className={cx(
											"mr-2 h-1 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#ffffff_var(--p),#ffffff4d_var(--p))]",
											FOCUS,
											THUMB,
										)}
										style={{ "--p": `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
									/>
								</>
							) : null}
							<div className="flex min-w-0 flex-1 items-center gap-2 px-1 text-xs font-semibold tabular-nums">
								<span className="w-9 shrink-0">{clock2(time)}</span>
								<input
									type="range"
									min={0}
									max={total || 1}
									step={0.1}
									value={time}
									aria-label={l.seek}
									aria-valuetext={l.position(clock(time), clock(total))}
									onChange={(e) => seek(Number(e.target.value))}
									className={cx(
										"h-2 min-w-px flex-1 cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#ffffff_var(--p),#ffffff4d_var(--p))]",
										FOCUS,
										THUMB,
									)}
									style={{ "--p": `${total ? (time / total) * 100 : 0}%` } as CSSProperties}
								/>
								<span className="w-[42px] shrink-0">-{clock2(total - time)}</span>
							</div>
							{size === "lg" ? (
								<button
									type="button"
									className={cx(SBTN, "min-w-8 justify-center text-xs font-semibold")}
									onClick={nextSpeed}
									aria-label={`${l.speed}: ${speed}x`}
								>
									{speed}x
								</button>
							) : (
								<button
									type="button"
									className={SBTN}
									onClick={toggleMute}
									aria-label={muted ? l.unmute : l.mute}
								>
									<DynIcon icon={muted ? VolumeX : VolumeMax} size={16} />
								</button>
							)}
						</>
					)}
					{size === "sm" ? (
						<>
							<button
								type="button"
								className={SBTN}
								onClick={toggleMute}
								aria-label={muted ? l.unmute : l.mute}
							>
								<DynIcon icon={muted ? VolumeX : VolumeMax} size={16} />
							</button>
							<span className="flex-1" />
						</>
					) : null}
					<button
						type="button"
						className={SBTN}
						aria-label={l.fullscreen}
						onClick={() => void wrap.current?.requestFullscreen?.()}
					>
						<Maximize01 size={16} />
					</button>
				</div>
			) : (
				<div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-[linear-gradient(to_top,#000000b2,#00000000)] px-4 pt-6 pb-3 text-[#ffffff]">
					<button
						type="button"
						className={BTN}
						onClick={toggle}
						aria-label={playing ? l.pause : l.play}
					>
						<DynIcon icon={playing ? PauseCircle : Play} size={20} />
					</button>
					<span className="text-sm font-medium whitespace-nowrap tabular-nums">
						{clock(time)} / {clock(total)}
					</span>
					<input
						type="range"
						min={0}
						max={total || 1}
						step={0.1}
						value={time}
						aria-label={l.seek}
						aria-valuetext={l.position(clock(time), clock(total))}
						onChange={(e) => {
							const n = Number(e.target.value);
							setTime(n);
							if (video.current) video.current.currentTime = n;
						}}
						className={cx(
							"h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#ffffff_var(--p),#ffffff4d_var(--p))]",
							FOCUS,
							THUMB,
						)}
						style={{ "--p": `${total ? (time / total) * 100 : 0}%` } as CSSProperties}
					/>
					<button
						type="button"
						className={BTN}
						onClick={() => {
							if (video.current) video.current.muted = !muted;
							setMuted(!muted);
						}}
						aria-label={muted ? l.unmute : l.mute}
					>
						<DynIcon icon={muted ? VolumeX : VolumeMax} size={20} />
					</button>
					<button
						type="button"
						className={BTN}
						aria-label={l.fullscreen}
						onClick={() => void wrap.current?.requestFullscreen?.()}
					>
						<Maximize01 size={20} />
					</button>
				</div>
			)}
		</div>
	);
}
