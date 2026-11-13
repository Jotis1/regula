"use client";

import { MinusCircle, PlusCircle } from "@untitledui/icons";
import { type KeyboardEvent, type ReactNode, useId, useRef } from "react";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";

export interface AccordionItem {
	/** Identificador estable; por defecto, la posición. */
	id?: string;
	/** La pregunta. */
	title: ReactNode;
	/** La respuesta. */
	content: ReactNode;
}

export interface AccordionProps {
	items: AccordionItem[];
	/** Abiertos (controlado): los `id` (o posiciones como texto). */
	expanded?: string[];
	/** @default [] */
	defaultExpanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	/** Solo uno abierto a la vez: abrir uno cierra el resto. */
	single?: boolean;
	/** El icono de abrir y cerrar a la izquierda o a la derecha. @default "right" */
	iconPosition?: "left" | "right";
	/** Una raya entre las preguntas. */
	divider?: boolean;
	/** Nivel del encabezado de cada pregunta. @default 3 */
	headingLevel?: 2 | 3 | 4;
	className?: string;
}

/**
 * Preguntas frecuentes (Figma `_FAQ item`, `1358:191490`): cada pregunta es un botón con `aria-expanded` que abre su
 * respuesta en una región con nombre. El icono (más y menos en un círculo) va a la izquierda o a la derecha, con o sin
 * raya entre preguntas, y con `single` solo queda una abierta. Las flechas arriba y abajo, Inicio y Fin mueven el foco
 * entre preguntas.
 */
export function Accordion({
	items,
	expanded,
	defaultExpanded = [],
	onExpandedChange,
	single,
	iconPosition = "right",
	divider,
	headingLevel = 3,
	className,
}: AccordionProps) {
	const base = useId();
	const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);
	const Heading = `h${headingLevel}` as "h3";
	const keyOf = (item: AccordionItem, i: number) => item.id ?? String(i);
	const toggle = (key: string) => {
		const isOpen = open.includes(key);
		setOpen(isOpen ? open.filter((k) => k !== key) : single ? [key] : [...open, key]);
	};
	const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
		const last = items.length - 1;
		const to =
			e.key === "ArrowDown"
				? i === last
					? 0
					: i + 1
				: e.key === "ArrowUp"
					? i === 0
						? last
						: i - 1
					: e.key === "Home"
						? 0
						: e.key === "End"
							? last
							: -1;
		if (to < 0) return;
		e.preventDefault();
		buttons.current[to]?.focus();
	};
	const Plus = iconPosition === "left" ? "mt-0.5" : "";
	return (
		<div className={cx("flex flex-col font-body", divider ? "" : "gap-8", className)}>
			{items.map((item, i) => {
				const key = keyOf(item, i);
				const isOpen = open.includes(key);
				const id = `${base}-${i}`;
				const icon = (
					<span aria-hidden="true" className={cx("flex shrink-0 text-fg-quaternary", Plus)}>
						{isOpen ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
					</span>
				);
				return (
					<div
						key={key}
						className={cx(
							divider && "border-t border-secondary py-6 first:border-t-0 first:pt-0",
						)}
					>
						<Heading className="m-0">
							<button
								ref={(el) => {
									buttons.current[i] = el;
								}}
								type="button"
								id={`${id}-button`}
								aria-expanded={isOpen}
								aria-controls={`${id}-panel`}
								onClick={() => toggle(key)}
								onKeyDown={(e) => onKeyDown(e, i)}
								className="flex w-full cursor-pointer items-start gap-6 rounded-md border-0 bg-transparent p-0 text-left text-lg font-semibold text-primary outline-none focus-visible:shadow-focus-ring @container"
							>
								{iconPosition === "left" ? icon : null}
								<span className="min-w-0 flex-1">{item.title}</span>
								{iconPosition === "right" ? icon : null}
							</button>
						</Heading>
						<section
							id={`${id}-panel`}
							aria-labelledby={`${id}-button`}
							hidden={!isOpen}
							className={cx(
								"mt-2 text-md text-tertiary",
								iconPosition === "left" ? "pl-12" : "pr-12",
							)}
						>
							{item.content}
						</section>
					</div>
				);
			})}
		</div>
	);
}
