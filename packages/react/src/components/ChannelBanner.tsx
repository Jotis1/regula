import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { keyText, stableKeys, streamGrid, TABULAR } from "../internal/stream.js";
import { StreamStage } from "../internal/stream-stage.js";

export interface ChannelBannerSlot {
	day: ReactNode;
	time: ReactNode;
}

export interface ChannelBannerProps {
	/** @default "Tu canal" */
	name?: ReactNode;
	tagline?: ReactNode;
	/** @default "Directos en Twitch" */
	eyebrow?: ReactNode;
	/** Horario a la derecha, dentro de la zona segura; no más de cuatro filas. */
	schedule?: ChannelBannerSlot[];
	/** Nombre del horario para lectores de pantalla (ampliación sobre la guía). @default "Horario de directos" */
	scheduleLabel?: string;
	/** Mide `1200 × scale` (`scale={1}` para exportarlo tal cual). Sin él se ajusta al ancho del contenedor. */
	scale?: number;
	className?: string;
}

const GRID = streamGrid(80, "80% 90%");

/**
 * Banner de perfil de 1200×480, siempre en oscuro. Twitch lo recorta en móvil y tapa parte con el avatar: todo
 * el contenido queda a 120px de cada lado (zona segura). Es de servidor: solo el lienzo, que mide, es de cliente.
 */
export function ChannelBanner({
	name,
	tagline,
	eyebrow,
	schedule,
	scheduleLabel,
	scale,
	className,
}: ChannelBannerProps) {
	const keys = stableKeys(schedule ?? [], (r) => `${keyText(r.day)}|${keyText(r.time)}`);
	return (
		<StreamStage width={1200} height={480} scale={scale} className={className}>
			<div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GRID} />
			<div className="absolute top-0 bottom-0 left-[120px] flex w-[560px] flex-col justify-center gap-3">
				<span className="text-xl leading-7 font-medium text-tertiary">
					{eyebrow ?? "Directos en Twitch"}
				</span>
				<h2 className="m-0 font-display text-[96px] leading-[1.04] font-semibold tracking-[-0.02em] wrap-anywhere text-primary">
					{name ?? "Tu canal"}
				</h2>
				{tagline ? <p className="m-0 text-[28px] leading-10 text-tertiary">{tagline}</p> : null}
			</div>
			{schedule?.length ? (
				<ul
					aria-label={scheduleLabel ?? "Horario de directos"}
					className="absolute top-1/2 right-[120px] m-0 w-[300px] -translate-y-1/2 list-none overflow-hidden rounded-xl border-2 border-secondary bg-primary_alt p-0"
				>
					{schedule.map((r, i) => (
						<li
							key={keys[i]}
							className="flex justify-between gap-4 border-t border-secondary px-6 py-4 text-[24px] leading-8 text-tertiary first:border-t-0"
						>
							<span>{r.day}</span>
							<b className={cx(TABULAR, "font-semibold text-primary")}>{r.time}</b>
						</li>
					))}
				</ul>
			) : null}
		</StreamStage>
	);
}
