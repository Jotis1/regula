import { Zap } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import type { IconProp } from "../internal/icon.js";
import { Badge } from "./Badge.js";
import { BadgeGroup } from "./BadgeGroup.js";
import type { CheckIconColor, CheckIconType } from "./CheckIcon.js";
import { CheckItem } from "./CheckItem.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

export type PricingCardType =
	| "icon"
	| "call-out"
	| "icon-offset"
	| "dual-check-items"
	| "badge"
	| "badge-group"
	| "dual-action"
	| "banner"
	| "primary-simple"
	| "primary-icon";

export interface PricingCardProps {
	/** Los diez tipos del Figma. @default "icon" */
	type?: PricingCardType;
	/** El plan: «Básico». */
	name: ReactNode;
	/** «10 €/mes», o la cifra sola con `period`. */
	price: ReactNode;
	/** Tras la cifra, pequeño: «al mes». */
	period?: ReactNode;
	description?: ReactNode;
	/** Etiqueta junto al plan: «Popular». */
	badge?: ReactNode;
	/** Icono del plan en `icon`, `icon-offset` y `primary-icon`. @default "zap" */
	icon?: IconProp;
	/** Lo que incluye, una línea por elemento. */
	features: ReactNode[];
	/** Encima de la lista: «Funciones» y una línea («Todo lo del plan gratis, y…»). */
	featuresTitle?: ReactNode;
	featuresDescription?: ReactNode;
	/** Los botones, a todo el ancho. */
	actions: ReactNode;
	/** La banda de `banner`: «El plan más elegido». */
	banner?: ReactNode;
	/** La nota de `call-out`, encima a la derecha: «¡El más elegido!». */
	callout?: ReactNode;
	className?: string;
}

// Estilo de los checks por tipo, como el Figma
const CHECKS: Record<PricingCardType, { type: CheckIconType; color: CheckIconColor }> = {
	icon: { type: "default", color: "brand" },
	"call-out": { type: "default", color: "success" },
	"icon-offset": { type: "line", color: "brand" },
	"dual-check-items": { type: "default", color: "success" },
	badge: { type: "line", color: "success" },
	"badge-group": { type: "line", color: "brand" },
	"dual-action": { type: "line", color: "brand" },
	banner: { type: "line", color: "success" },
	"primary-simple": { type: "filled", color: "brand" },
	"primary-icon": { type: "filled", color: "brand" },
};

/**
 * Tarjeta de un plan de precios (Figma `_Pricing tier card`, `1346:182709`): el plan, la cifra, lo que incluye y los
 * botones, en diez tipos. Se encoge con su contenedor; en `dual-check-items`, la lista va en dos columnas desde 480 px.
 */
export function PricingCard({
	type = "icon",
	name,
	price,
	period,
	description,
	badge,
	icon = Zap,
	features,
	featuresTitle,
	featuresDescription,
	actions,
	banner,
	callout,
	className,
}: PricingCardProps) {
	const checks = CHECKS[type];
	const primary = type === "primary-simple" || type === "primary-icon";
	const left = type === "dual-check-items" || type === "dual-action";
	const priceNode = (size: "lg" | "md") => (
		<p
			className={cx(
				"m-0 font-display font-semibold text-primary tracking-[-0.02em]",
				size === "lg" ? "text-display-lg @max-sm:text-display-md" : "text-display-md",
			)}
		>
			{price}
			{period ? (
				<span className="ml-1 font-body text-md font-medium tracking-normal text-tertiary">
					{period}
				</span>
			) : null}
		</p>
	);
	const desc = description ? <p className="m-0 text-md text-tertiary">{description}</p> : null;
	const list = (
		<div className="flex flex-col gap-6">
			{featuresTitle || featuresDescription ? (
				<div className="flex flex-col gap-1">
					{featuresTitle ? (
						<p className="m-0 text-sm font-semibold uppercase text-primary">{featuresTitle}</p>
					) : null}
					{featuresDescription ? (
						<p className="m-0 text-md text-tertiary">{featuresDescription}</p>
					) : null}
				</div>
			) : null}
			<ul
				className={cx(
					"m-0 grid list-none gap-4 p-0",
					type === "dual-check-items" && "@lg:grid-cols-2 @lg:gap-x-8",
				)}
			>
				{features.map((f, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; los elementos pueden ser nodos
					<CheckItem key={i} type={checks.type} color={checks.color} size="md">
						{f}
					</CheckItem>
				))}
			</ul>
		</div>
	);
	const actionsNode = <div className="flex flex-col gap-3 [&>*]:w-full">{actions}</div>;

	let header: ReactNode;
	if (type === "icon")
		header = (
			<div className="flex flex-col items-center gap-2 text-center">
				<FeaturedIcon icon={icon} variant="light" color="brand" size="lg" className="mb-2" />
				<p className="m-0 text-xl font-semibold text-brand-secondary">{name}</p>
				{priceNode("lg")}
				{desc}
			</div>
		);
	else if (type === "primary-icon")
		header = (
			<div className="flex flex-col items-center gap-2 text-center">
				<FeaturedIcon icon={icon} variant="light" color="brand" size="lg" className="mb-2" />
				{priceNode("lg")}
				<p className="m-0 text-xl font-semibold text-primary">{name}</p>
				{desc}
			</div>
		);
	else if (type === "icon-offset")
		header = (
			<div className="flex flex-col items-center gap-2 text-center">
				<p className="m-0 text-xl font-semibold text-primary">{name}</p>
				{priceNode("lg")}
				{desc}
			</div>
		);
	else if (type === "badge" || type === "badge-group")
		header = (
			<div className="flex flex-col items-center gap-4 text-center">
				{type === "badge" ? (
					<Badge size="md" color="brand">
						{name}
					</Badge>
				) : (
					<BadgeGroup badge={name} color="brand" size="md">
						{badge}
					</BadgeGroup>
				)}
				{priceNode("lg")}
				{desc}
			</div>
		);
	else if (left)
		header = (
			<div
				className={cx(
					"flex gap-4",
					type === "dual-check-items" ? "flex-wrap items-start justify-between" : "flex-col",
				)}
			>
				<div className="flex flex-col gap-1">
					<p className="m-0 flex flex-wrap items-center gap-2 text-xl font-semibold text-primary">
						{name}
						{badge ? (
							<Badge size="md" color="brand">
								{badge}
							</Badge>
						) : null}
					</p>
					{type === "dual-check-items" ? desc : null}
				</div>
				{priceNode("md")}
				{type === "dual-action" ? desc : null}
			</div>
		);
	else
		header = (
			<div className="flex flex-col items-center gap-2 text-center">
				{priceNode("lg")}
				<p className="m-0 text-xl font-semibold text-primary">{name}</p>
				{desc}
			</div>
		);

	return (
		<article
			className={cx(
				"@container relative flex w-full flex-col font-body",
				type === "icon-offset" && "mt-6",
				primary
					? "rounded-2xl bg-brand-primary_alt"
					: "rounded-2xl bg-primary shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
				type === "dual-check-items" ? "max-w-[576px]" : "max-w-[400px]",
				className,
			)}
		>
			{callout && type === "call-out" ? (
				<span className="absolute -top-7 right-4 text-sm font-semibold text-brand-secondary">
					{callout}
				</span>
			) : null}
			{type === "icon-offset" ? (
				<span className="absolute -top-6 left-1/2 -translate-x-1/2">
					<FeaturedIcon icon={icon} variant="modern" color="gray" size="lg" />
				</span>
			) : null}
			{type === "banner" && banner ? (
				<p className="m-0 rounded-t-2xl bg-brand-solid px-6 py-3 text-center text-md font-semibold text-white">
					{banner}
				</p>
			) : null}
			<div className={cx("flex flex-col gap-8 p-8 @max-sm:p-6", type === "icon-offset" && "pt-12")}>
				{header}
				{type === "badge" || type === "dual-action" ? actionsNode : null}
				{list}
				{type === "icon" || type === "badge" || type === "dual-action" ? null : actionsNode}
			</div>
			{type === "icon" ? (
				<div className="rounded-b-2xl border-t border-secondary bg-secondary p-8 @max-sm:p-6">
					{actionsNode}
				</div>
			) : null}
		</article>
	);
}
