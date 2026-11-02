"use client";

import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cx } from "./cx.js";
import { STREAM_ROOT } from "./stream.js";

// En servidor useLayoutEffect avisa; allí no hay nada que medir.
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

export interface StreamStageProps {
	/** Tamaño real del lienzo en px (StreamScene 1920×1080, ChannelBanner 1200×480). */
	width: number;
	height: number;
	/** Escala fija: mide `width × scale`. Sin ella, se ajusta al ancho del contenedor. */
	scale?: number;
	className?: string;
	/** Clases del lienzo interior, que mide siempre `width × height`. */
	stageClassName?: string;
	children?: ReactNode;
}

/**
 * Lienzo de tamaño fijo escalado con `transform` (`stFit` + `.jm-st-fit` / `.jm-st-stage` del bundle).
 * El alto del contenedor sale de `aspect-ratio`, así que el hueco es el correcto desde el primer pintado; el
 * contenido espera a la primera medida para no verse a tamaño real un instante. Con `scale` no mide nada.
 */
export function StreamStage({ width, height, scale, className, stageClassName, children }: StreamStageProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [measured, setMeasured] = useState<number | null>(null);

	useIsoLayoutEffect(() => {
		if (scale) return;
		const el = ref.current;
		if (!el) return;
		const update = () => {
			if (el.clientWidth) setMeasured(el.clientWidth / width);
		};
		update();
		if (typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [scale, width]);

	const s = scale ?? measured;
	const outer: CSSProperties = scale
		? { width: width * scale, height: height * scale }
		: { width: "100%", aspectRatio: `${width} / ${height}` };

	return (
		<div
			ref={ref}
			className={cx(STREAM_ROOT, "relative overflow-hidden bg-primary", className)}
			style={outer}
		>
			<div
				className={cx(
					"absolute top-0 left-0 origin-top-left overflow-hidden bg-primary text-primary",
					s == null && "invisible",
					stageClassName,
				)}
				style={{ width, height, transform: s == null ? undefined : `scale(${s})` }}
			>
				{children}
			</div>
		</div>
	);
}
