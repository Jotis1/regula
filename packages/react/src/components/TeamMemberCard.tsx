import { ArrowUpRight } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Avatar } from "./Avatar.js";

export type TeamMemberCardType =
	| "simple-left"
	| "simple-left-top"
	| "simple-center"
	| "image-top"
	| "image-left"
	| "image-glass-floating"
	| "image-glass-full-width";

export interface TeamMemberCardProps {
	name: string;
	/** Cargo: «Fundadora y directora». */
	role: ReactNode;
	bio?: ReactNode;
	/** URL de la foto: el avatar en los `simple-*`. Sin ella, las iniciales. */
	avatar?: string;
	/** La foto grande de los `image-*` (un nodo: una `<img>` con su `alt`). */
	image?: ReactNode;
	/** Enlaces a sus redes, con nombre (iconos de `@jotis-me/assets/logos`). */
	socials?: ReactNode;
	/** Con él, el nombre es un enlace (y la flecha del panel de cristal). */
	href?: string;
	/** Los siete tipos del Figma. @default "simple-left" */
	type?: TeamMemberCardType;
	className?: string;
}

const initialsOf = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

/**
 * Persona del equipo (Figma `_Team member`, `1458:240598`): avatar o foto, nombre, cargo, biografía y redes, en siete
 * tipos; los de cristal ponen el texto en un panel translúcido sobre la foto.
 */
export function TeamMemberCard({
	name,
	role,
	bio,
	avatar,
	image,
	socials,
	href,
	type = "simple-left",
	className,
}: TeamMemberCardProps) {
	const glass = type === "image-glass-floating" || type === "image-glass-full-width";
	const center = type === "simple-center";
	const nameNode = (
		<h3 className={cx("m-0 font-semibold", glass ? "text-lg text-white" : "text-md text-primary")}>
			{href ? (
				<a href={href} className="text-inherit no-underline hover:underline">
					{name}
				</a>
			) : (
				name
			)}
		</h3>
	);
	const text = (
		<div className={cx("flex min-w-0 flex-col gap-4", center && "items-center text-center")}>
			<div className="flex flex-col">
				{nameNode}
				<p className={cx("m-0 text-md", glass ? "font-semibold text-white" : "text-brand-secondary")}>
					{role}
				</p>
				{bio ? (
					<p className={cx("m-0 mt-2 text-md", glass ? "text-white" : "text-tertiary")}>{bio}</p>
				) : null}
			</div>
			{socials ? (
				<div
					className={cx(
						"flex items-center gap-5",
						glass ? "text-white [&_a]:text-white" : "[&_a]:text-fg-quaternary",
					)}
				>
					{socials}
				</div>
			) : null}
		</div>
	);

	if (type.startsWith("simple")) {
		const av = <Avatar size="xl" src={avatar} initials={initialsOf(name)} alt="" />;
		return (
			<article
				className={cx(
					"flex font-body",
					type === "simple-left" ? "flex-row gap-5" : "flex-col gap-5",
					center && "items-center",
					className,
				)}
			>
				{av}
				{text}
			</article>
		);
	}

	if (glass)
		return (
			<article className={cx("relative aspect-[3/4] w-full overflow-hidden font-body", className)}>
				<div className="absolute inset-0 bg-tertiary [&>img]:size-full [&>img]:object-cover">
					{image}
				</div>
				<div
					className={cx(
						"absolute flex flex-col gap-3 bg-overlay/60 p-5 backdrop-blur-md",
						type === "image-glass-floating"
							? "inset-x-4 bottom-4 rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg-white)_30%,transparent)]"
							: "inset-x-0 bottom-0 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--fg-white)_30%,transparent)]",
					)}
				>
					{href ? (
						<span aria-hidden="true" className="absolute top-5 right-5 flex text-white">
							<ArrowUpRight size={24} />
						</span>
					) : null}
					{text}
				</div>
			</article>
		);

	return (
		<article
			className={cx(
				"@container flex flex-col gap-5 font-body",
				type === "image-left" && "@lg:flex-row @lg:gap-6",
				className,
			)}
		>
			<div
				className={cx(
					"aspect-square w-full shrink-0 overflow-hidden bg-tertiary [&>img]:size-full [&>img]:object-cover",
					type === "image-left" && "@lg:w-[46%]",
				)}
			>
				{image}
			</div>
			{text}
		</article>
	);
}
