import { ArrowLeft } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs.js";

export interface PageHeaderProps {
	/** Título de la página (`<h1>`), en Bricolage Grotesque 30/38 semibold. */
	title: ReactNode;
	/** Una frase en `text-tertiary` bajo el título. */
	description?: ReactNode;
	/** Ruta encima del título (`Breadcrumbs`). */
	breadcrumbs?: BreadcrumbItem[];
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/** Lo que va bajo el título, como unas `Tabs`. */
	children?: ReactNode;
	/**
	 * Línea inferior en `border-secondary`.
	 * @default true
	 */
	divider?: boolean;
	/**
	 * Avatar junto al título (el de una persona o una cuenta), como un `Avatar`. Con `banner`, se monta sobre su borde
	 * inferior; sin él, va a la izquierda del título, como el Figma (`Page header`, `1239:122640`).
	 */
	avatar?: ReactNode;
	/** Banda de portada encima de todo: `true` pinta el degradado de marca; también admite un nodo (una imagen). */
	banner?: boolean | ReactNode;
	/** Todo centrado: migas, avatar, título, descripción y acciones. */
	centered?: boolean;
	/** En pantallas estrechas, un enlace «Volver» en lugar de las migas. */
	back?: { href: string; label?: string };
	className?: string;
}

/** Cabecera de página de app: migas, título, descripción, acciones y línea inferior. */
export function PageHeader(props: PageHeaderProps) {
	const { avatar, banner, centered, back } = props;
	return avatar || banner || centered || back ? (
		<TypedPageHeader {...props} />
	) : (
		<ClassicPageHeader {...props} />
	);
}

/** La de siempre: su HTML no cambia. */
function ClassicPageHeader({
	title,
	description,
	breadcrumbs,
	actions,
	children,
	divider = true,
	className,
}: PageHeaderProps) {
	return (
		<header className={cx("flex flex-col gap-5 font-body", className)}>
			{breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="m-0 font-display text-display-sm font-semibold text-primary">{title}</h1>
					{description ? <p className="mt-1 mb-0 text-md text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
			{children ?? null}
			{divider ? <Line /> : null}
		</header>
	);
}

function TypedPageHeader({
	title,
	description,
	breadcrumbs,
	actions,
	children,
	divider = true,
	avatar,
	banner,
	centered,
	back,
	className,
}: PageHeaderProps) {
	const hasBanner = !!banner;
	const crumbs = breadcrumbs ? (
		<div className={cx(back && "@max-md:hidden", centered && "flex justify-center")}>
			<Breadcrumbs items={breadcrumbs} />
		</div>
	) : null;
	const backLink = back ? (
		<a
			href={back.href}
			className={cx(
				"inline-flex w-fit items-center gap-1 rounded-sm text-sm font-semibold text-tertiary no-underline hover:text-tertiary_hover focus-visible:shadow-focus-ring focus-visible:outline-none @md:hidden [&_svg]:text-fg-quaternary",
				centered && "self-center",
			)}
		>
			<ArrowLeft size={16} />
			{back.label ?? "Volver"}
		</a>
	) : null;
	const avatarNode = avatar ? (
		<div
			className={cx(
				"flex-none [&>*]:shadow-[0_0_0_4px_var(--bg-primary)]",
				hasBanner && "-mt-16 @max-md:-mt-12",
				centered && "self-center",
			)}
		>
			{avatar}
		</div>
	) : null;
	const text = (
		<div className={cx("min-w-0", centered && "text-center")}>
			<h1 className="m-0 font-display text-display-sm font-semibold text-primary @max-md:text-display-xs">
				{title}
			</h1>
			{description ? <p className="mt-1 mb-0 text-md text-tertiary">{description}</p> : null}
		</div>
	);
	const actionsNode = actions ? (
		<div className={cx("flex flex-wrap items-center gap-3", centered && "justify-center")}>{actions}</div>
	) : null;
	return (
		<header className={cx("@container flex flex-col gap-5 font-body", className)}>
			{hasBanner ? (
				<div
					aria-hidden={banner === true ? "true" : undefined}
					className="h-40 overflow-hidden rounded-xl bg-[linear-gradient(180deg,var(--utility-brand-200),var(--utility-pink-200))] @max-md:h-28"
				>
					{banner === true ? null : banner}
				</div>
			) : null}
			<div className={cx("flex flex-col gap-5", hasBanner && "px-8 @max-md:px-4")}>
				{centered ? (
					<div className="flex flex-col items-center gap-4">
						{avatarNode}
						{crumbs}
						{backLink}
						{text}
						{actionsNode}
						{children ?? null}
					</div>
				) : (
					<>
						{/* Sin banda, las migas van encima de la fila del avatar; con banda, a su derecha, como el Figma */}
						{hasBanner ? null : crumbs}
						{hasBanner ? null : backLink}
						<div
							className={cx(
								"flex items-start gap-5",
								hasBanner && avatar && "@max-md:flex-col",
							)}
						>
							{avatarNode}
							<div className="flex min-w-0 flex-1 flex-col gap-3">
								{hasBanner ? crumbs : null}
								{hasBanner ? backLink : null}
								<div className="flex flex-wrap items-start justify-between gap-4 @max-md:flex-col">
									{text}
									{actionsNode}
								</div>
							</div>
						</div>
						{children ?? null}
					</>
				)}
				{divider ? <Line /> : null}
			</div>
		</header>
	);
}
