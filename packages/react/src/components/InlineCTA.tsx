import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import type { IconName } from "./Icon.js";

export interface InlineCTAProps {
	/** Qué se propone, como "Conecta tu banco" (`<h3>`). */
	title: ReactNode;
	/** Qué gana quien lo haga. */
	description?: ReactNode;
	/** Los botones: siempre uno para descartar ("Ahora no") y la acción, la última. */
	actions?: ReactNode;
	/** Icono destacado (`FeaturedIcon` modern gris de 48px) sobre el título. */
	icon?: IconName | ReactNode;
	/** Imagen a la izquierda (240px de ancho): una URL o un nodo. */
	image?: string | ReactNode;
	/** Texto alternativo de la imagen cuando es una URL. Sin él, la imagen es decorativa. */
	imageAlt?: string;
	className?: string;
}

/** Tarjeta de invitación dentro de una página para animar a una acción secundaria. Una por pantalla como mucho. */
export function InlineCTA({ title, description, actions, icon, image, imageAlt, className }: InlineCTAProps) {
	return (
		<div
			className={cx(
				"flex overflow-hidden rounded-xl bg-primary font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			{image ? (
				<div className="shrink-0 grow-0 basis-60 bg-tertiary">
					{typeof image === "string" ? (
						<img src={image} alt={imageAlt ?? ""} className="block size-full object-cover" />
					) : (
						image
					)}
				</div>
			) : null}
			<div className="flex flex-1 flex-col gap-5 p-6">
				{icon ? <FeaturedIcon icon={icon} variant="modern" size="lg" color="gray" /> : null}
				<div>
					<h3 className="m-0 text-lg font-semibold text-primary">{title}</h3>
					{description ? <p className="mt-0.5 mb-0 text-sm text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
		</div>
	);
}
