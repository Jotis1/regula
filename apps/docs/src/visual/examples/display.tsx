// Puertos de las vistas previas de Badge, Tag y los avatares (reference/components/*/preview.html).

import { SocialStripeLogo } from "@jotis-me/assets/logos";
import {
	Avatar,
	AvatarGroup,
	AvatarLabel,
	AvatarProfilePhoto,
	Badge,
	BadgeGroup,
	CheckIcon,
	CheckItem,
	CopyTooltip,
	IconTile,
	Kbd,
	Rating,
	RatingBadge,
	Tag,
	TokenSwatch,
} from "@jotis-me/react";
import { FlagEs, FlagMx, FlagPt } from "@untitledui/country-flags";
import {
	ArrowRight,
	ArrowUpRight,
	Calendar,
	Check,
	Clock,
	Download01,
	HomeLine,
	Mail01,
	Plus,
} from "@untitledui/icons";
import { row, stack } from "./actions";

const noop = () => {};

/** Los cinco colores en `pill` con el badge delante, y `modern` y el badge detrás en los dos tamaños. */
export function BadgeGroupExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<BadgeGroup badge="Versión 0.6" color="gray" href="#">
				Ya puedes exportar a CSV
			</BadgeGroup>
			<BadgeGroup badge="Nuevo" href="#">
				Hemos publicado los estados vacíos
			</BadgeGroup>
			<BadgeGroup badge="Error" color="error" href="#">
				No se pudo sincronizar el banco
			</BadgeGroup>
			<BadgeGroup badge="Aviso" color="warning" href="#">
				Tu tarjeta caduca este mes
			</BadgeGroup>
			<BadgeGroup badge="Listo" color="success" href="#">
				Has completado tu perfil
			</BadgeGroup>
			<BadgeGroup badge="Ver" badgePosition="trailing" size="lg" href="#">
				Novedades de noviembre
			</BadgeGroup>
			<BadgeGroup badge="Nuevo" type="modern" href="#">
				Hemos publicado los estados vacíos
			</BadgeGroup>
			<BadgeGroup
				badge="Arreglar"
				type="modern"
				color="error"
				badgePosition="trailing"
				size="lg"
				href="#"
			>
				No se pudo sincronizar el banco
			</BadgeGroup>
		</div>
	);
}

export function BadgeExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<Badge color="gray">Borrador</Badge>
				<Badge color="brand">Nuevo</Badge>
				<Badge color="success">Pagado</Badge>
				<Badge color="warning">Pendiente</Badge>
				<Badge color="error">Vencido</Badge>
				<Badge color="sky">Info</Badge>
				<Badge color="purple">Beta</Badge>
			</div>
			<div className={row}>
				<Badge type="badge" color="brand" dot>
					Activo
				</Badge>
				<Badge type="modern" dot color="success">
					En línea
				</Badge>
				<Badge size="sm">sm</Badge>
				<Badge size="lg" color="indigo">
					lg
				</Badge>
				<Badge color="gray" onRemove={noop}>
					Filtro
				</Badge>
			</div>
			<div className={row}>
				<Badge size="sm" flag={<FlagEs />}>
					España
				</Badge>
				<Badge type="badge" color="brand" flag={<FlagPt />}>
					Portugal
				</Badge>
				<Badge type="modern" size="lg" flag={<FlagMx />}>
					México
				</Badge>
				<Badge color="success" avatar={<Avatar size="xs" />}>
					Lucía
				</Badge>
			</div>
			<div className={row}>
				<Badge size="sm" color="brand" iconTrailing={ArrowRight}>
					Ver
				</Badge>
				<Badge type="badge" iconTrailing={ArrowUpRight}>
					Abrir
				</Badge>
				<Badge type="modern" size="lg" color="error" iconTrailing={ArrowRight}>
					Revisar
				</Badge>
				<Badge size="sm" iconOnly={Plus} label="Añadir" />
				<Badge color="brand" iconOnly={Plus} label="Añadir" />
				<Badge type="badge" size="lg" color="success" iconOnly={Check} label="Hecho" />
				<Badge type="modern" iconOnly={ArrowRight} label="Siguiente" />
			</div>
		</div>
	);
}

/** Lo de siempre, bandera y avatar delante, y la casilla del Figma en los tres tamaños (se marca sin hidratar: es nativa). */
export function TagExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<Tag>Diseño</Tag>
				<Tag size="md" count={5}>
					Facturas
				</Tag>
				<Tag size="md" onRemove={noop}>
					León
				</Tag>
				<Tag size="lg" dot>
					Sincronizado
				</Tag>
			</div>
			<div className={row}>
				<Tag flag={<FlagEs />}>España</Tag>
				<Tag size="md" flag={<FlagPt />} onRemove={noop}>
					Portugal
				</Tag>
				<Tag size="lg" avatar={<Avatar size="xs" />} count={3}>
					Lucía
				</Tag>
			</div>
			<div className={row}>
				<Tag checkable defaultChecked>
					Diseño
				</Tag>
				<Tag size="md" checkable flag={<FlagMx />}>
					México
				</Tag>
				<Tag size="lg" checkable defaultChecked avatar={<Avatar size="xs" />} onRemove={noop}>
					Lucía
				</Tag>
			</div>
		</div>
	);
}

const AVATAR_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Los seis tamaños con iniciales, el estado y el icono sin foto, y las tres insignias del Figma (verificado,
 * contador y empresa) en los seis tamaños. El logo de empresa es uno de `@jotis-me/assets/logos`.
 */
export function AvatarExample() {
	return (
		<div className={stack}>
			<div className={row}>
				{AVATAR_SIZES.map((size) => (
					<Avatar key={size} size={size} initials="AD" alt="Administrador" />
				))}
			</div>
			<div className={row}>
				<Avatar size="md" status="online" />
				<AvatarGroup
					items={[{ initials: "AB" }, { initials: "CD" }, { initials: "EF" }, { initials: "+3" }]}
				/>
			</div>
			<div className={row}>
				{AVATAR_SIZES.map((size) => (
					<Avatar key={size} size={size} initials="LP" alt="Lucía Pérez" badge="verified" />
				))}
			</div>
			<div className={row}>
				{AVATAR_SIZES.map((size) => (
					<Avatar key={size} size={size} initials="MG" alt="Marta Gil" badge="count" count={8} />
				))}
			</div>
			<div className={row}>
				{AVATAR_SIZES.map((size) => (
					<Avatar
						key={size}
						size={size}
						initials="JR"
						alt="Javier Ruiz"
						badge="company"
						company={<SocialStripeLogo />}
						badgeLabel="Stripe"
					/>
				))}
			</div>
		</div>
	);
}

/** El grupo en `md` y, con `onAdd`, el botón de añadir en los tres tamaños del Figma. */
export function AvatarGroupExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<AvatarGroup
					size="md"
					items={[{ initials: "AB" }, { initials: "CD" }, { initials: "EF" }, { initials: "GH" }]}
				/>
			</div>
			{(["xs", "sm", "md"] as const).map((size) => (
				<div key={size} className={row}>
					<AvatarGroup
						size={size}
						items={[
							{ initials: "AB" },
							{ initials: "CD" },
							{ initials: "EF" },
							{ initials: "+5" },
						]}
						onAdd={noop}
						addLabel="Invitar"
					/>
				</div>
			))}
		</div>
	);
}

/** Los tres tamaños del Figma: `sm`, `md` (el de siempre) y `lg`. */
/** Los tres tipos de check en los tres colores, en los cuatro tamaños. */
export function CheckIconExample() {
	return (
		<div className={stack}>
			{(["default", "line", "filled"] as const).flatMap((type) =>
				(["brand", "gray", "success"] as const).map((color) => (
					<div key={type + color} className={`${row} items-center gap-4`}>
						{(["sm", "md", "lg", "xl"] as const).map((size) => (
							<CheckIcon key={size} type={type} color={color} size={size} />
						))}
					</div>
				)),
			)}
		</div>
	);
}

/** Una lista por tipo, con los tres tamaños. */
export function CheckItemExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
			{(["default", "line", "filled"] as const).map((type, i) => (
				<ul key={type} className="m-0 flex flex-col gap-3 p-0">
					{(["sm", "md", "lg"] as const).map((size) => (
						<CheckItem key={size} type={type} color={i === 1 ? "success" : "brand"} size={size}>
							Todas las funciones y soporte prioritario
						</CheckItem>
					))}
				</ul>
			))}
		</div>
	);
}

/** Los once rellenos del Figma (de 0 a 5 en medios puntos), en amarillo y en gris, y los tres tamaños. */
export function RatingExample() {
	return (
		<div className={stack}>
			{[5, 4.5, 3.7, 2.2, 0].map((v) => (
				<div key={v} className={`${row} items-center gap-6`}>
					<Rating value={v} />
					<Rating value={v} color="gray" />
				</div>
			))}
			<div className={`${row} items-center gap-6`}>
				<Rating value={4} size="sm" />
				<Rating value={4} size="md" />
				<Rating value={4} size="lg" />
			</div>
		</div>
	);
}

/** Con estrellas y sin ellas. */
export function RatingBadgeExample() {
	return (
		<div className={`${row} items-center gap-8`}>
			<RatingBadge title="Mejor herramienta de diseño" supportingText="2.000+ reseñas" />
			<RatingBadge title="Producto del día" supportingText="Votado por la comunidad" stars={false} />
		</div>
	);
}

/** Foto de perfil: con iniciales y sello, el icono de usuario y las iniciales sin sello, en los tres tamaños. */
export function AvatarProfilePhotoExample() {
	return (
		<div className={stack}>
			{(
				[
					[true, "OR"],
					[false, undefined],
					[false, "AD"],
				] as const
			).map(([verified, initials]) => (
				<div key={String(initials) + verified} className={`${row} items-end gap-8`}>
					{(["sm", "md", "lg"] as const).map((size) => (
						<AvatarProfilePhoto
							key={size}
							size={size}
							initials={initials}
							alt={initials ? (initials === "OR" ? "Olivia Rhye" : "Administrador") : undefined}
							verified={verified}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function AvatarLabelExample() {
	return (
		<div className={stack}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<div key={size} className={row}>
					<AvatarLabel
						size={size}
						initials="AD"
						name="Responsable de seguridad"
						supporting="admin@jotis.me"
						status="online"
					/>
				</div>
			))}
		</div>
	);
}

export function KbdExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<Kbd>⌘P</Kbd>
				<Kbd>⌘K</Kbd>
				<Kbd>esc</Kbd>
				<Kbd>↵</Kbd>
			</div>
			<div className={row}>
				<Kbd variant="field">Ctrl K</Kbd>
				<Kbd variant="field">⌘ K</Kbd>
				<Kbd variant="field">/</Kbd>
			</div>
		</div>
	);
}

/** Rejilla de baldosas: una elegida, un enlace y los tres tamaños de vista previa. */
export function IconTileExample() {
	return (
		<div className={stack}>
			<div className="grid w-[420px] max-w-full grid-cols-4 gap-3">
				<IconTile icon={Mail01} label="Mail01" onSelect={noop} />
				<IconTile icon={HomeLine} label="HomeLine" selected onSelect={noop} />
				<IconTile icon={Calendar} label="Calendar" onSelect={noop} />
				<IconTile icon={Download01} label="Download01" href="#" />
			</div>
			<div className="grid w-[420px] max-w-full grid-cols-4 gap-3">
				<IconTile icon={Clock} label="Clock" size={16} onSelect={noop} />
				<IconTile icon={Clock} label="Clock" size={20} onSelect={noop} />
				<IconTile icon={Clock} label="Clock" size={24} onSelect={noop} />
				<IconTile icon={Clock} label="AlignHorizontalCentre02" onSelect={noop} />
			</div>
		</div>
	);
}

/** Un token en fila (para una celda de tabla) y en tarjeta. Lleva su CopyTooltip, que avisa al copiar. */
export function TokenSwatchExample() {
	return (
		<div className={stack}>
			<TokenSwatch name="text-primary" light="#171717" dark="#fafafa" utility="text-primary" />
			<TokenSwatch name="bg-brand-solid" light="#4f39f6" dark="#4f39f6" utility="bg-brand-solid" />
			<div className="w-[280px] max-w-full">
				<TokenSwatch
					layout="card"
					name="border-primary"
					light="#d4d4d4"
					dark="#404040"
					utility="border-primary"
					usage="Bordes de inputs, botones secundarios y checkboxes."
				/>
			</div>
			<CopyTooltip />
		</div>
	);
}
