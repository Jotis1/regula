import { VolumeMax } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { STREAM_ROOT } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export interface NowPlayingLabels {
	/** @default "Suena ahora" */
	playing: string;
	/** @default "En pausa" */
	paused: string;
	/** Nombre de la barra. @default "Progreso de la canción" */
	progress: string;
}

export interface NowPlayingProps {
	title: ReactNode;
	artist?: ReactNode;
	/** URL de la carátula; sin ella, icono de volumen. */
	cover?: string;
	/** De 0 a 1. Sin él no hay barra. Avanza cuando llega un valor nuevo: no se anima por su cuenta. */
	progress?: number;
	paused?: boolean;
	/** @default 360 */
	width?: number | string;
	/** Sustituye los textos (ampliación sobre la guía). */
	labels?: Partial<NowPlayingLabels>;
	className?: string;
}

/** Tarjeta de "suena ahora" con carátula, título, artista y una línea fina de progreso, siempre en oscuro. */
export function NowPlaying({
	title,
	artist,
	cover,
	progress,
	paused,
	width,
	labels,
	className,
}: NowPlayingProps) {
	const t: NowPlayingLabels = {
		playing: defaultStrings.nowPlaying,
		paused: defaultStrings.paused,
		progress: defaultStrings.songProgress,
		...labels,
	};
	const pct = progress == null ? null : Math.min(100, Math.max(0, progress * 100));
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"relative flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-secondary bg-primary_alt p-3 pb-[15px]",
				width == null && "w-[360px]",
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<div className="inline-flex size-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-tertiary text-fg-secondary">
				{cover ? (
					<img src={cover} alt="" className="size-full object-cover" />
				) : (
					<VolumeMax size={24} />
				)}
			</div>
			<div className="flex min-w-0 flex-col">
				<span className="block text-sm font-medium text-tertiary">
					{paused ? t.paused : t.playing}
				</span>
				<span className="truncate text-md font-semibold text-primary">{title}</span>
				{artist ? <span className="truncate text-sm text-tertiary">{artist}</span> : null}
			</div>
			{pct != null ? (
				<div
					role="progressbar"
					aria-label={t.progress}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(pct)}
					className="absolute inset-x-0 bottom-0 h-[3px] bg-quaternary"
				>
					<div className="h-full bg-brand-solid" style={{ width: `${pct}%` }} />
				</div>
			) : null}
		</div>
	);
}
