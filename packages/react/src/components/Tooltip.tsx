"use client";

import {
	cloneElement,
	type DOMAttributes,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useId,
} from "react";
import {
	Tooltip as AriaTooltip,
	Focusable,
	OverlayArrow,
	type Placement,
	TooltipTrigger,
} from "react-aria-components";
import { ARROWS, BUBBLE, type BubbleAlign, type BubbleSide, OPEN_POSITION } from "../internal/bubble.js";
import { cx } from "../internal/cx.js";

// Lo que Focusable de React Aria pide a su hijo: un elemento del DOM que reciba sus props
type FocusableChild = ReactElement<DOMAttributes<Element>, string>;

export interface TooltipProps {
	title: ReactNode;
	/** Segunda línea, en `tooltip-supporting-text`. */
	text?: ReactNode;
	/** Fuerza el tooltip visible (vistas previas y capturas). */
	open?: boolean;
	/**
	 * Lado del elemento en el que sale la burbuja. Si no cabe, se voltea.
	 * @default "top"
	 */
	placement?: BubbleSide;
	/**
	 * Flecha: `center` (sobre el centro del elemento), `start` o `end` (a 12px de la esquina de la burbuja), o `false`
	 * para quitarla.
	 * @default "center"
	 */
	arrow?: BubbleAlign | false;
	/** El elemento que lo dispara: tiene que poder recibir el foco y pasar `ref` y props al DOM, como `Button`. */
	children: ReactNode;
}

const SUB = "mt-1 block font-medium text-tooltip-supporting-text";
/**
 * Burbuja oscura que explica un control al pasar el ratón o al enfocarlo; Escape la cierra.
 * Nada imprescindible dentro: en móvil no hay hover.
 */
export function Tooltip({ title, text, open, placement = "top", arrow = "center", children }: TooltipProps) {
	const id = useId();
	const padding = text ? "p-3" : "px-3 py-2";
	const align = arrow === false ? "center" : arrow;
	const vertical = placement === "top" || placement === "bottom";
	// Arriba o abajo y centrada, la flecha la coloca React Aria sobre el centro del elemento; el resto, a mano en el borde
	const centered = arrow === "center" && vertical;
	const staticArrow = arrow !== false && !centered;
	const ariaPlacement = (
		align === "center"
			? placement
			: `${placement} ${align === "start" ? (vertical ? "start" : "top") : vertical ? "end" : "bottom"}`
	) as Placement;
	const content = (
		<>
			{title}
			{text ? <span className={SUB}>{text}</span> : null}
		</>
	);

	if (open) {
		// Forzado (vista previa): en línea sobre el disparador, como en la guía, sin capa flotante
		return (
			<span className="relative inline-flex">
				{isValidElement(children)
					? cloneElement(children as ReactElement<Record<string, unknown>>, {
							"aria-describedby": id,
						})
					: children}
				<span
					id={id}
					role="tooltip"
					className={cx(
						BUBBLE,
						arrow === false ? null : ARROWS[placement][arrow],
						padding,
						"pointer-events-none absolute",
						OPEN_POSITION[placement][align],
					)}
				>
					{content}
				</span>
			</span>
		);
	}

	return (
		<TooltipTrigger delay={300} closeDelay={0}>
			<Focusable>{children as FocusableChild}</Focusable>
			<AriaTooltip
				placement={ariaPlacement}
				offset={10}
				className={({ placement: actual }) =>
					cx(
						BUBBLE,
						padding,
						staticArrow && ARROWS[(actual as BubbleSide | null) ?? placement][align],
					)
				}
			>
				{centered ? (
					<OverlayArrow className="group">
						<svg
							width={12}
							height={6}
							viewBox="0 0 12 6"
							aria-hidden="true"
							className="block fill-[var(--bg-primary-solid)] group-data-[placement=bottom]:rotate-180"
						>
							<path d="M0 0 L6 6 L12 0 Z" />
						</svg>
					</OverlayArrow>
				) : null}
				{content}
			</AriaTooltip>
		</TooltipTrigger>
	);
}
