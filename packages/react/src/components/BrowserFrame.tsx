import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Icon } from "./Icon.js";

export interface BrowserFrameProps {
	/**
	 * `safari` semáforo, navegación, dirección y acciones · `minimal` semáforo gris y dirección.
	 * @default "safari"
	 */
	variant?: "safari" | "minimal";
	/** Dirección que se muestra en la barra. @default "jotis.me" */
	url?: string;
	/** Alto del área de contenido. */
	height?: number | string;
	/** La pantalla: componentes reales, no capturas, para que cambien con el tema. */
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

/** Marco de navegador para enseñar una pantalla de la app dentro de una página. Decorativo salvo su contenido. */
export function BrowserFrame({
	variant = "safari",
	url = "jotis.me",
	height,
	children,
	className,
	style,
}: BrowserFrameProps) {
	const minimal = variant === "minimal";
	const dot = cx(
		"size-3 rounded-full",
		minimal ? "bg-[var(--border-primary)]" : "shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]",
	);
	const address = (
		<div
			className={cx(
				"mx-auto flex min-w-0 flex-[0_1_516px] items-center justify-center gap-1.5 rounded-lg px-3 font-medium text-tertiary",
				minimal
					? "h-6 bg-primary text-xs shadow-[inset_0_0_0_1px_var(--border-secondary)]"
					: "h-7 bg-secondary text-[13px] leading-[18px]",
			)}
		>
			<Icon name="lock-01" size={12} />
			<span className="truncate">{url}</span>
		</div>
	);
	const nav = "flex shrink-0 items-center gap-3 max-[560px]:hidden";
	return (
		<div
			className={cx(
				"overflow-hidden rounded-xl border border-secondary bg-primary font-body shadow-xl",
				className,
			)}
			style={style}
		>
			<div
				className={cx(
					"flex items-center gap-4 px-4 text-fg-quaternary shadow-[inset_0_-1px_0_var(--border-secondary)]",
					minimal ? "h-9 bg-secondary" : "h-11 bg-primary",
				)}
			>
				{/* Semáforo: colores fijos de la ficha */}
				<div aria-hidden="true" className="flex shrink-0 gap-2">
					<span className={cx(dot, !minimal && "bg-[#ee6a5f]")} />
					<span className={cx(dot, !minimal && "bg-[#f5bd4f]")} />
					<span className={cx(dot, !minimal && "bg-[#61c454]")} />
				</div>
				{minimal ? (
					<>
						{address}
						<span className="w-[52px] shrink-0" />
					</>
				) : (
					<>
						<div className={nav}>
							<Icon name="chevron-left" size={18} />
							<Icon name="chevron-right" size={18} />
						</div>
						{address}
						<div className={cx(nav, "ml-auto")}>
							<Icon name="refresh-cw-01" size={16} />
							<Icon name="plus" size={18} />
							<Icon name="copy-01" size={16} />
						</div>
					</>
				)}
			</div>
			{/* Región con foco: si la pantalla no cabe (alto fijo o un ancho estrecho), se desplaza y tiene que poder
			    hacerse con el teclado. Su nombre es la dirección de la barra */}
			<section
				aria-label={url}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: el contenido puede desplazarse y necesita foco de teclado
				tabIndex={0}
				className="relative overflow-auto focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none"
				style={height !== undefined ? { height } : undefined}
			>
				{children}
			</section>
		</div>
	);
}
