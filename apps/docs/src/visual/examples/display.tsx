// Puertos de las vistas previas de Badge, Tag y los avatares (reference/components/*/preview.html).

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
		</div>
	);
}

export function TagExample() {
	return (
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
	);
}

export function AvatarExample() {
	return (
		<div className={stack}>
			<div className={row}>
				{(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
					<Avatar key={size} size={size} initials="AD" alt="Administrador" />
				))}
			</div>
			<div className={row}>
				<Avatar size="md" status="online" />
				<AvatarGroup
					items={[{ initials: "AB" }, { initials: "CD" }, { initials: "EF" }, { initials: "+3" }]}
				/>
			</div>
		</div>
	);
}

export function AvatarGroupExample() {
	return (
		<div className={row}>
			<AvatarGroup
				size="md"
				items={[{ initials: "AB" }, { initials: "CD" }, { initials: "EF" }, { initials: "GH" }]}
			/>
		</div>
	);
}

export function AvatarLabelExample() {
	return (
		<div className={row}>
			<AvatarLabel
				initials="AD"
				name="Responsable de seguridad"
				supporting="admin@jotis.me"
				status="online"
			/>
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
