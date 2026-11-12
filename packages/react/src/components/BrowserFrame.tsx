import { ChevronLeft, ChevronRight, Copy01, Lock01, Plus, RefreshCw01 } from "@untitledui/icons";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";

export interface BrowserFrameProps {
	/**
	 * `safari` semáforo, navegación, dirección y acciones · `minimal` semáforo gris y dirección · `minimal-color` como
	 * `minimal` con el semáforo en color (Figma `Browser toolbar`, `7333:23578`).
	 * @default "safari"
	 */
	variant?: "safari" | "minimal" | "minimal-color";
	/**
	 * Tema del navegador: `dark` pinta el marco, la barra y el contenido con los tokens del tema oscuro aunque la página
	 * esté en claro (la clase `dark-mode`). `light` o sin él, sigue al tema de la página: los tokens no tienen una clase
	 * que fuerce el claro dentro de una página oscura.
	 */
	theme?: "light" | "dark";
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
	theme,
	url = "jotis.me",
	height,
	children,
	className,
	style,
}: BrowserFrameProps) {
	const minimal = variant === "minimal" || variant === "minimal-color";
	const colored = variant !== "minimal";
	const dot = cx(
		"size-3 rounded-full",
		colored ? "shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]" : "bg-[var(--border-primary)]",
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
			<Lock01 size={12} />
			<span className="truncate">{url}</span>
		</div>
	);
	const nav = "flex shrink-0 items-center gap-3 max-[560px]:hidden";
	return (
		<div
			className={cx(
				"overflow-hidden rounded-xl border border-secondary bg-primary font-body shadow-xl",
				theme === "dark" && "dark-mode text-primary",
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
					<span className={cx(dot, colored && "bg-[#ee6a5f]")} />
					<span className={cx(dot, colored && "bg-[#f5bd4f]")} />
					<span className={cx(dot, colored && "bg-[#61c454]")} />
				</div>
				{minimal ? (
					<>
						{address}
						<span className="w-[52px] shrink-0" />
					</>
				) : (
					<>
						<div className={nav}>
							<ChevronLeft size={18} />
							<ChevronRight size={18} />
						</div>
						{address}
						<div className={cx(nav, "ml-auto")}>
							<RefreshCw01 size={16} />
							<Plus size={18} />
							<Copy01 size={16} />
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
