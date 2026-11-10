// Puertos de las vistas previas de Badge, Tag y los avatares (reference/components/*/preview.html).

import { FlagMexicoCircle, FlagPortugalCircle, FlagSpainCircle } from "@jotis-me/icons/flags";
import { SocialStripeLogo } from "@jotis-me/icons/logos";
import { Avatar, AvatarGroup, AvatarLabel, Badge, BadgeGroup, Kbd, Tag } from "@jotis-me/react";
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
				<Badge size="sm" flag={<FlagSpainCircle />}>
					España
				</Badge>
				<Badge type="badge" color="brand" flag={<FlagPortugalCircle />}>
					Portugal
				</Badge>
				<Badge type="modern" size="lg" flag={<FlagMexicoCircle />}>
					México
				</Badge>
				<Badge color="success" avatar={<Avatar size="xs" />}>
					Lucía
				</Badge>
			</div>
			<div className={row}>
				<Badge size="sm" color="brand" iconTrailing="arrow-right">
					Ver
				</Badge>
				<Badge type="badge" iconTrailing="arrow-up-right">
					Abrir
				</Badge>
				<Badge type="modern" size="lg" color="error" iconTrailing="arrow-right">
					Revisar
				</Badge>
				<Badge size="sm" iconOnly="plus" label="Añadir" />
				<Badge color="brand" iconOnly="plus" label="Añadir" />
				<Badge type="badge" size="lg" color="success" iconOnly="check" label="Hecho" />
				<Badge type="modern" iconOnly="arrow-right" label="Siguiente" />
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
				<Tag flag={<FlagSpainCircle />}>España</Tag>
				<Tag size="md" flag={<FlagPortugalCircle />} onRemove={noop}>
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
				<Tag size="md" checkable flag={<FlagMexicoCircle />}>
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
 * contador y empresa) en los seis tamaños. El logo de empresa es uno de `@jotis-me/icons/logos`.
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
