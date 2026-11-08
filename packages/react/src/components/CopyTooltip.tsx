"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ARROW, ARROW_UP, BUBBLE } from "../internal/bubble.js";
import { copyText, onCopy } from "../internal/copy.js";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export interface CopyTooltipLabels {
	/** @default "Copiado" */
	copied: string;
	/** @default "No se pudo copiar: selecciónalo a mano" */
	failed: string;
}

export interface CopyTooltipProps {
	/**
	 * Un atributo cuyo valor se copia al pulsar cualquier elemento que lo lleve (`data-copy`): para HTML sin JavaScript
	 * propio, como las tablas de la web. Sin él, solo avisa de lo que se copie con `useCopy`.
	 */
	copyAttribute?: string;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<CopyTooltipLabels>;
	/**
	 * Cuánto se queda la burbuja, en ms.
	 * @default 1500
	 */
	duration?: number;
}

interface Placed {
	ok: boolean;
	/** Centro horizontal del elemento pulsado. */
	x: number;
	/** Borde de la burbuja que toca al elemento: su arriba (burbuja debajo) o su abajo (burbuja encima). */
	y: number;
	below: boolean;
	/** Cuánto se ha movido la burbuja para no salirse de la ventana: la flecha sigue apuntando al elemento. */
	shift: number;
}

const GAP = 10;
const MARGIN = 8;
// La burbuja mide unos 32px de alto: si no cabe encima del elemento, va debajo
const ROOM_ABOVE = 32 + GAP + MARGIN;

/**
 * Burbuja «Copiado» como la de `Tooltip`, junto al elemento pulsado, que se va sola. Móntalo una vez por página: lo que
 * se copie con `useCopy`, o con `copyAttribute`, avisa aquí. Dice solo «Copiado», sin repetir el valor, que podría ser
 * largo. Se anuncia a lectores de pantalla sin mover el foco.
 */
export function CopyTooltip({ copyAttribute, labels, duration = 1500 }: CopyTooltipProps) {
	const t = { copied: defaultStrings.copied, failed: defaultStrings.copyFailed, ...labels };
	const [placed, setPlaced] = useState<Placed | null>(null);
	const [pending, setPending] = useState<Omit<Placed, "shift"> | null>(null);
	const root = useRef<HTMLDivElement>(null);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	// El aviso de cada copia: dónde va (encima del elemento, o debajo si no cabe) y cuándo se va
	useEffect(
		() =>
			onCopy(({ ok, anchor }) => {
				const rect = anchor.getBoundingClientRect();
				const below = rect.top < ROOM_ABOVE;
				setPending({ ok, below, x: rect.left + rect.width / 2, y: below ? rect.bottom : rect.top });
				clearTimeout(timer.current);
				timer.current = setTimeout(() => {
					setPending(null);
					setPlaced(null);
				}, duration);
			}),
		[duration],
	);
	useEffect(() => () => clearTimeout(timer.current), []);

	// Se va también al desplazar la página: ya no estaría junto a lo copiado
	useEffect(() => {
		const hide = () => {
			clearTimeout(timer.current);
			setPending(null);
			setPlaced(null);
		};
		window.addEventListener("scroll", hide, true);
		return () => window.removeEventListener("scroll", hide, true);
	}, []);

	// Con `copyAttribute`, pulsar un elemento que lo lleve copia su valor
	useEffect(() => {
		if (!copyAttribute) return;
		const onClick = (event: MouseEvent) => {
			const target = (event.target as Element | null)?.closest?.(`[${copyAttribute}]`);
			if (target) void copyText(target.getAttribute(copyAttribute) ?? "", target);
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [copyAttribute]);

	// Ya pintada, se mide la burbuja para que no se salga de la ventana por los lados
	useLayoutEffect(() => {
		if (!pending) return;
		const half = (root.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
		const min = half / 2 + MARGIN;
		const max = Math.max(min, window.innerWidth - half / 2 - MARGIN);
		const x = Math.min(Math.max(pending.x, min), max);
		setPlaced({ ...pending, x, shift: pending.x - x });
	}, [pending]);

	const shown = placed ?? pending;
	return (
		// Siempre en el documento: un `role="status"` que ya existe y cambia de texto es lo que los lectores anuncian
		<div
			ref={root}
			role="status"
			aria-live="polite"
			data-copy-tooltip=""
			className="pointer-events-none fixed z-50"
			style={
				shown
					? {
							left: shown.x,
							top: shown.below ? shown.y + GAP : shown.y - GAP,
							transform: shown.below ? "translate(-50%, 0)" : "translate(-50%, -100%)",
						}
					: undefined
			}
		>
			{shown ? (
				<span
					className={cx(
						BUBBLE,
						shown.below ? ARROW_UP : ARROW,
						"relative block px-3 py-2 whitespace-nowrap transition-opacity duration-150 starting:opacity-0 after:left-[calc(50%+var(--shift,0px))]",
					)}
					style={{ "--shift": `${placed?.shift ?? 0}px` } as CSSProperties}
				>
					{shown.ok ? t.copied : t.failed}
				</span>
			) : null}
		</div>
	);
}
