import { ArrowUpRight } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Avatar } from "./Avatar.js";
import { Badge, type BadgeColor } from "./Badge.js";
import { BadgeGroup } from "./BadgeGroup.js";

export type BlogPostCardType =
	| "simple-01"
	| "simple-02"
	| "simple-03"
	| "simple-04"
	| "card-01"
	| "card-02"
	| "card-03"
	| "card-04";

export interface BlogPostCardProps {
	/** La entrada. El título es el enlace y toda la tarjeta responde al clic. */
	href: string;
	title: ReactNode;
	description?: ReactNode;
	/** La imagen de portada (el paquete no trae fotos). */
	image?: ReactNode;
	/** Categoría: «Diseño». */
	category?: ReactNode;
	/** Tiempo de lectura, en `simple-02` y `card-02`: «8 min de lectura». */
	readTime?: ReactNode;
	author?: {
		name: string;
		/** URL de la foto; sin ella, las iniciales. */
		avatar?: string;
		date: ReactNode;
	};
	/** Etiquetas de color, en `simple-03` y `card-03`. */
	tags?: { label: ReactNode; color?: BadgeColor }[];
	/** Texto del enlace de `simple-04` y `card-04`. @default "Leer la entrada" */
	readLabel?: string;
	/**
	 * Los tipos del Figma: `simple` (la imagen suelta) o `card` (todo en una tarjeta con borde), cada uno con cuatro
	 * cabeceras: categoría (01), categoría y tiempo de lectura (02), autor y fecha con etiquetas (03), autor sobre la
	 * imagen y «Leer la entrada» (04).
	 * @default "simple-01"
	 */
	type?: BlogPostCardType;
	/**
	 * `horizontal` con la imagen a la izquierda; en un contenedor de menos de 576 px, vertical, como el Figma en móvil.
	 * @default "vertical"
	 */
	orientation?: "vertical" | "horizontal";
	className?: string;
}

const initialsOf = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

/**
 * Tarjeta de entrada del blog (Figma `Blog post card`, `1390:58`): imagen, categoría, título con su flecha,
 * resumen y autor, en ocho tipos y en vertical u horizontal.
 */
export function BlogPostCard({
	href,
	title,
	description,
	image,
	category,
	readTime,
	author,
	tags,
	readLabel = "Leer la entrada",
	type = "simple-01",
	orientation = "vertical",
	className,
}: BlogPostCardProps) {
	const card = type.startsWith("card");
	const variant = type.slice(-2);
	const horizontal = orientation === "horizontal";
	const authorRow = author ? (
		<div className="flex items-center gap-2">
			<Avatar size="md" src={author.avatar} initials={initialsOf(author.name)} alt="" />
			<div className="flex flex-col text-sm">
				<span className="font-semibold text-primary">{author.name}</span>
				<span className="text-tertiary">{author.date}</span>
			</div>
		</div>
	) : null;

	const over =
		variant === "04" && author ? (
			<div className="absolute inset-x-0 bottom-0 flex items-start justify-between gap-4 bg-overlay/60 px-5 pt-6 pb-5 text-sm font-semibold text-white backdrop-blur-[6px]">
				<div className="flex flex-col">
					<span>{author.name}</span>
					<span className="font-normal">{author.date}</span>
				</div>
				{category ? <span>{category}</span> : null}
			</div>
		) : null;

	const media = image ? (
		<div
			className={cx(
				"relative shrink-0 overflow-hidden bg-tertiary [&>img]:size-full [&>img]:object-cover",
				card ? "" : "rounded-2xl shadow-[inset_0_0_0_0.5px_var(--border-secondary_alt)]",
				horizontal ? "@xl:aspect-auto @xl:w-[48%] aspect-[3/2] w-full" : "aspect-[3/2] w-full",
			)}
		>
			{image}
			{over}
		</div>
	) : null;

	const eyebrow =
		variant === "01" && category ? (
			<p className="m-0 text-sm font-semibold text-brand-secondary">{category}</p>
		) : variant === "02" && (category || readTime) ? (
			<BadgeGroup badge={category} color="brand" size="md" className="self-start">
				{readTime}
			</BadgeGroup>
		) : variant === "03" && author ? (
			<p className="m-0 text-sm font-semibold text-brand-secondary">
				{author.name} • {author.date}
			</p>
		) : null;

	return (
		<article
			className={cx(
				"@container relative flex font-body",
				card &&
					"overflow-hidden rounded-2xl bg-primary shadow-[inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			<div
				className={cx(
					"flex w-full flex-col",
					horizontal && "@xl:flex-row",
					card ? "" : "gap-4",
					!card && horizontal && "@xl:gap-6",
				)}
			>
				{media}
				<div className={cx("flex min-w-0 flex-1 flex-col gap-5", card && "p-6")}>
					<div className="flex flex-col gap-2">
						{eyebrow}
						<div className="flex flex-col gap-1">
							<h3 className="m-0 flex items-start justify-between gap-4 text-lg font-semibold text-primary">
								<a
									href={href}
									className="text-inherit no-underline after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:shadow-focus-ring"
								>
									{title}
								</a>
								{variant === "04" ? null : (
									<span
										aria-hidden="true"
										className="flex shrink-0 pt-1 text-fg-quaternary"
									>
										<ArrowUpRight size={20} />
									</span>
								)}
							</h3>
							{description ? (
								<p
									className={cx(
										"m-0 text-md text-tertiary",
										horizontal ? "line-clamp-2" : "line-clamp-3",
									)}
								>
									{description}
								</p>
							) : null}
						</div>
					</div>
					{variant === "01" || variant === "02" ? authorRow : null}
					{variant === "03" && tags?.length ? (
						<ul className="m-0 flex list-none flex-wrap gap-2 p-0">
							{tags.map((t, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: etiquetas fijas; pueden ser nodos
								<li key={i}>
									<Badge size="md" color={t.color ?? "brand"}>
										{t.label}
									</Badge>
								</li>
							))}
						</ul>
					) : null}
					{variant === "04" ? (
						<span
							aria-hidden="true"
							className="flex items-center gap-2 text-md font-semibold text-brand-secondary"
						>
							{readLabel}
							<ArrowUpRight size={20} />
						</span>
					) : null}
				</div>
			</div>
		</article>
	);
}
