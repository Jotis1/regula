"use client";

import { type CSSProperties, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { Icon } from "./Icon.js";

export interface VideoPlayerLabels {
	play: string;
	pause: string;
	seek: string;
	mute: string;
	unmute: string;
	fullscreen: string;
	/** Texto de la posición para lectores de pantalla: "1:05 de 4:12". */
	position: (current: string, total: string) => string;
}

export interface VideoPlayerProps {
	/** Fichero de vídeo. Sin él, el reproductor es una maqueta (con `poster` y `duration`). */
	src?: string;
	/** Imagen antes de reproducir. */
	poster?: string;
	/** Duración en segundos cuando no hay `src`. */
	duration?: number;
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
};

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
const THUMB =
	"[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffffff] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#ffffff]";

/** Reproductor de vídeo 16:9 con botón central, barra de controles, tiempo, volumen y pantalla completa. */
export function VideoPlayer({ src, poster, duration = 0, labels, className, style }: VideoPlayerProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const video = useRef<HTMLVideoElement>(null);
	const wrap = useRef<HTMLDivElement>(null);
	const [playing, setPlaying] = useState(false);
	const [time, setTime] = useState(0);
	const [total, setTotal] = useState(duration);
	const [muted, setMuted] = useState(false);

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
				"relative aspect-video overflow-hidden rounded-xl bg-[#000000] font-body",
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
					<Icon name="play" size={28} />
				</button>
			)}
			<div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-[linear-gradient(to_top,#000000b2,#00000000)] px-4 pt-6 pb-3 text-[#ffffff]">
				<button
					type="button"
					className={BTN}
					onClick={toggle}
					aria-label={playing ? l.pause : l.play}
				>
					<Icon name={playing ? "pause-circle" : "play"} size={20} />
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
					<Icon name={muted ? "volume-x" : "volume-max"} size={20} />
				</button>
				<button
					type="button"
					className={BTN}
					aria-label={l.fullscreen}
					onClick={() => void wrap.current?.requestFullscreen?.()}
				>
					<Icon name="maximize-01" size={20} />
				</button>
			</div>
		</div>
	);
}
