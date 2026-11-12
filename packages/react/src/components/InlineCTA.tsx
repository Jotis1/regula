import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { InlineCTAEmail } from "../internal/inline-cta-email.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

/** Los siete tipos del Figma (`Inline CTA`, `1255:131915`). */
export type InlineCTAType =
	| "image"
	| "actions"
	| "email"
	| "change-plan"
	| "upgrade-plan"
	| "payment-method"
	| "receipt";

export interface InlineCTAPlan {
	name: ReactNode;
	/** Icono del plan, en un `FeaturedIcon` pequeño. */
	icon?: IconName | ReactNode;
	/** Precio, como «10 €». */
	price: ReactNode;
	/** Tras el precio, como «al mes». */
	period?: ReactNode;
	description?: ReactNode;
}

export interface InlineCTAFeature {
	title: ReactNode;
	description?: ReactNode;
}

export interface InlineCTAPayment {
	/** Logo de la tarjeta, como `<PaymentVisa />` de `@jotis-me/icons/payments`. */
	logo?: ReactNode;
	/** «Visa terminada en 1234». */
	label: ReactNode;
	/** «Caduca el 06/2028». */
	expiry?: ReactNode;
	/** Correo de facturación. */
	email?: ReactNode;
}

export interface InlineCTAFile {
	name: ReactNode;
	/** Tamaño ya escrito, como «200 KB». */
	size?: ReactNode;
	/** Icono del tipo de archivo, como `<FileTypePdf />` de `@jotis-me/icons/files`. */
	icon?: ReactNode;
}

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
	/**
	 * Plantilla del Figma sobre estas mismas props. Sin él, la tarjeta de siempre. `image` y `actions` son la de siempre
	 * con el diseño adaptable; `email` añade el campo de correo y su botón; `change-plan` la tarjeta de `plan`;
	 * `upgrade-plan` la lista de `features`; `payment-method` la tarjeta de `payment`; `receipt` el archivo de `file`.
	 * En un contenedor estrecho, la imagen va arriba y los botones ocupan todo el ancho.
	 */
	type?: InlineCTAType;
	/** Etiqueta del campo de `email`. @default "Suscríbete a las novedades" */
	emailLabel?: string;
	/** @default "tu@correo.com" */
	emailPlaceholder?: string;
	/** Texto del botón de `email`. @default "Suscribirse" */
	submitLabel?: string;
	/** Avisa con el correo escrito al pulsar el botón (o Enter) en `email`. */
	onSubmit?: (email: string) => void;
	/** El plan de `change-plan`. */
	plan?: InlineCTAPlan;
	/** Lo que incluye el plan de `upgrade-plan`, cada cosa con su check. */
	features?: InlineCTAFeature[];
	/** El método de pago de `payment-method`. */
	payment?: InlineCTAPayment;
	/** El archivo de `receipt`. */
	file?: InlineCTAFile;
	className?: string;
}

/** Tarjeta de invitación dentro de una página para animar a una acción secundaria. Una por pantalla como mucho. */
export function InlineCTA(props: InlineCTAProps) {
	return props.type === undefined ? <ClassicInlineCTA {...props} /> : <TypedInlineCTA {...props} />;
}

function ClassicInlineCTA({ title, description, actions, icon, image, imageAlt, className }: InlineCTAProps) {
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

// Los botones van a todo el ancho y en columna (la acción arriba) cuando la tarjeta es estrecha, como el Figma en móvil
const ACTIONS =
	"flex flex-wrap items-center gap-3 @max-md:flex-col-reverse @max-md:items-stretch @max-md:[&>*]:w-full";
const INNER_CARD = "rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)]";

function TypedInlineCTA({
	type,
	title,
	description,
	actions,
	icon,
	image,
	imageAlt,
	emailLabel = "Suscríbete a las novedades",
	emailPlaceholder = "tu@correo.com",
	submitLabel = "Suscribirse",
	onSubmit,
	plan,
	features,
	payment,
	file,
	className,
}: InlineCTAProps) {
	const heading = (
		<div>
			<h3 className="m-0 text-md font-semibold text-primary">{title}</h3>
			{description ? <p className="mt-0.5 mb-0 text-sm text-tertiary">{description}</p> : null}
		</div>
	);
	const buttons = actions ? <div className={ACTIONS}>{actions}</div> : null;

	let body: ReactNode = (
		<>
			{icon ? <FeaturedIcon icon={icon} variant="modern" size="lg" color="gray" /> : null}
			{heading}
			{buttons}
		</>
	);
	if (type === "email") {
		body = (
			<>
				{heading}
				<InlineCTAEmail
					label={emailLabel}
					placeholder={emailPlaceholder}
					submitLabel={submitLabel}
					onSubmit={onSubmit}
				/>
			</>
		);
	} else if (type === "change-plan" && plan) {
		body = (
			<>
				{heading}
				<div className={cx(INNER_CARD, "flex flex-col gap-4 p-0")}>
					<div className="flex items-center gap-3 px-4 pt-4">
						{plan.icon ? (
							<span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-secondary text-fg-brand-secondary">
								{iconSlot(plan.icon, 16)}
							</span>
						) : null}
						<span className="text-md font-semibold text-secondary">{plan.name}</span>
					</div>
					<div className="flex flex-col gap-1 border-0 border-t border-solid border-secondary px-4 pt-4">
						<p className="m-0 flex items-baseline gap-1">
							<span className="font-display text-display-xs font-semibold text-primary">
								{plan.price}
							</span>
							{plan.period ? (
								<span className="text-sm text-tertiary">{plan.period}</span>
							) : null}
						</p>
						{plan.description ? (
							<p className="m-0 text-sm text-tertiary">{plan.description}</p>
						) : null}
					</div>
					{actions ? (
						<div className={cx(ACTIONS, "px-4 pb-4 @max-md:flex-row @max-md:[&>*]:w-auto")}>
							{actions}
						</div>
					) : (
						<span className="pb-0" />
					)}
				</div>
			</>
		);
	} else if (type === "upgrade-plan") {
		body = (
			<>
				{heading}
				{features?.length ? (
					<ul className="m-0 flex list-none flex-col gap-4 p-0">
						{features.map((f, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: lista fija del plan
							<li key={i} className="flex gap-3">
								<span className="mt-0.5 flex flex-none text-fg-success-primary">
									<Icon name="check-circle" size={20} />
								</span>
								<span className="flex flex-col">
									<span className="text-md font-medium text-secondary">{f.title}</span>
									{f.description ? (
										<span className="text-md text-tertiary">{f.description}</span>
									) : null}
								</span>
							</li>
						))}
					</ul>
				) : null}
				{buttons}
			</>
		);
	} else if (type === "payment-method" && payment) {
		body = (
			<>
				{heading}
				<div className={cx(INNER_CARD, "flex items-start gap-4")}>
					{payment.logo ? (
						<span className="flex flex-none [&_svg]:h-8 [&_svg]:w-auto">{payment.logo}</span>
					) : null}
					<div className="flex min-w-0 flex-1 flex-col text-sm">
						<span className="font-medium text-secondary">{payment.label}</span>
						{payment.expiry ? <span className="text-tertiary">{payment.expiry}</span> : null}
						{payment.email ? (
							<span className="mt-2 inline-flex items-center gap-1.5 text-tertiary [&_svg]:text-fg-quaternary">
								<Icon name="mail-01" size={16} />
								{payment.email}
							</span>
						) : null}
					</div>
					{actions ? <div className="flex flex-none gap-3">{actions}</div> : null}
				</div>
			</>
		);
	} else if (type === "receipt" && file) {
		body = (
			<>
				{heading}
				<div
					className={cx(
						INNER_CARD,
						"flex items-center gap-3 @max-md:flex-col @max-md:items-stretch",
					)}
				>
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<span className="flex size-10 flex-none items-center justify-center [&_svg]:size-10">
							{file.icon ?? <Icon name="file-04" size={32} />}
						</span>
						<span className="flex min-w-0 flex-col text-sm">
							<span className="truncate font-medium text-secondary">{file.name}</span>
							{file.size ? <span className="text-tertiary">{file.size}</span> : null}
						</span>
					</div>
					{buttons}
				</div>
			</>
		);
	}

	return (
		<div
			className={cx(
				"@container overflow-hidden rounded-xl bg-primary font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			<div className={cx("flex", type === "image" && image ? "@max-md:flex-col" : undefined)}>
				{type === "image" && image ? (
					<div className="shrink-0 grow-0 basis-60 bg-tertiary @max-md:aspect-[16/9] @max-md:basis-auto">
						{typeof image === "string" ? (
							<img src={image} alt={imageAlt ?? ""} className="block size-full object-cover" />
						) : (
							image
						)}
					</div>
				) : null}
				<div
					className={cx(
						"flex min-w-0 flex-1 flex-col gap-4",
						type === "image" ? "p-4" : "p-5 @max-md:p-4",
					)}
				>
					{body}
				</div>
			</div>
		</div>
	);
}
