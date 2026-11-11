"use client";

import { useRef, useState } from "react";
import { Icon } from "../components/Icon.js";
import { cx } from "./cx.js";

// Alturas fijas de la onda (no se analiza el audio): el dibujo del Figma, de 0 a 1
const WAVE = [
	0.3, 0.5, 0.4, 0.7, 0.5, 0.9, 0.6, 0.4, 0.8, 1, 0.7, 0.5, 0.6, 0.9, 0.4, 0.3, 0.6, 0.8, 0.5, 0.7, 1, 0.6,
	0.4, 0.5, 0.8, 0.6, 0.3, 0.5, 0.7, 0.4,
];

/** Reproductor del tipo `audio` de `Message`: botón, onda y duración. Va aparte, como isla, para que `Message` siga siendo de servidor. */
export function MessageAudioPlayer({
	src,
	duration,
	labels,
}: {
	src?: string;
	duration: string;
	labels: { play: string; pause: string; audio: string };
}) {
	const audio = useRef<HTMLAudioElement>(null);
	const [playing, setPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	return (
		<div className="flex items-center gap-3">
			{src ? (
				// biome-ignore lint/a11y/useMediaCaption: mensaje de voz; la transcripción, si la hay, va en el propio mensaje
				<audio
					ref={audio}
					src={src}
					preload="none"
					onEnded={() => {
						setPlaying(false);
						setProgress(0);
					}}
					onTimeUpdate={(e) => {
						const a = e.currentTarget;
						if (a.duration) setProgress(a.currentTime / a.duration);
					}}
					className="hidden"
				/>
			) : null}
			<button
				type="button"
				aria-label={playing ? labels.pause : labels.play}
				disabled={!src}
				onClick={() => {
					const a = audio.current;
					if (!a) return;
					if (a.paused) {
						void a.play();
						setPlaying(true);
					} else {
						a.pause();
						setPlaying(false);
					}
				}}
				className="inline-flex size-8 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-brand-solid text-fg-white hover:bg-brand-solid_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-default"
			>
				<Icon name={playing ? "pause-circle" : "play"} size={16} />
			</button>
			<span aria-hidden="true" className="flex h-8 min-w-0 flex-1 items-center gap-0.5">
				{WAVE.map((h, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: barras fijas de la onda
						key={i}
						className={cx(
							"w-0.5 flex-none rounded-full",
							i / WAVE.length < progress
								? "bg-fg-brand-primary"
								: "bg-fg-brand-secondary_alt opacity-60",
						)}
						style={{ height: `${Math.round(h * 100)}%` }}
					/>
				))}
			</span>
			<span className="flex-none text-sm text-tertiary">
				<span className="sr-only">{labels.audio}, </span>
				{duration}
			</span>
		</div>
	);
}
