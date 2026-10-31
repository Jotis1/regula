"use client";

import {
	cloneElement,
	type DOMAttributes,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useId,
} from "react";
import { Tooltip as AriaTooltip, Focusable, OverlayArrow, TooltipTrigger } from "react-aria-components";
import { cx } from "../internal/cx.js";

// Lo que Focusable de React Aria pide a su hijo: un elemento del DOM que reciba sus props
type FocusableChild = ReactElement<DOMAttributes<Element>, string>;

export interface TooltipProps {
	title: ReactNode;
	/** Segunda línea, en `tooltip-supporting-text`. */
	text?: ReactNode;
	/** Fuerza el tooltip visible (vistas previas y capturas). */
	open?: boolean;
	/** El elemento que lo dispara: tiene que poder recibir el foco y pasar `ref` y props al DOM, como `Button`. */
	children: ReactNode;
}

const BUBBLE =
	"z-20 w-max max-w-[320px] rounded-lg bg-primary-solid font-body text-xs font-semibold text-white shadow-lg";
const SUB = "mt-1 block font-medium text-tooltip-supporting-text";
// Flecha de 12×6 centrada abajo, del color de la burbuja
const ARROW =
	"after:absolute after:top-full after:left-1/2 after:-ml-1.5 after:border-[6px] after:border-b-0 after:border-transparent after:border-t-[var(--bg-primary-solid)]";

/**
 * Burbuja oscura que explica un control al pasar el ratón o al enfocarlo; Escape la cierra.
 * Nada imprescindible dentro: en móvil no hay hover.
 */
export function Tooltip({ title, text, open, children }: TooltipProps) {
	const id = useId();
	const padding = text ? "p-3" : "px-3 py-2";
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
						ARROW,
						padding,
						"pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
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
			<AriaTooltip placement="top" offset={10} className={cx(BUBBLE, padding)}>
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
				{content}
			</AriaTooltip>
		</TooltipTrigger>
	);
}
