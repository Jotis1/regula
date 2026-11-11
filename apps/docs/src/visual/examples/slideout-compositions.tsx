// Composiciones de Slideout: los tipos del Figma (`Slide out menu`, `1240:137582`) hechos solo con componentes de
// Regula. No se exportan del paquete: son ejemplos para copiar. Cada una pinta el panel abierto en su lienzo
// (`contained`).

import {
	IconBookOpen01,
	IconCircle,
	IconCode02,
	IconCreditCard02,
	IconLayersThree01,
	IconLayersTwo01,
	IconLink01,
	IconMarkerPin01,
	IconStars02,
	IconSwitchHorizontal01,
	IconTag03,
	IconUserPlus01,
	IconZap,
} from "@jotis-me/icons";
import {
	ActivityFeed,
	Avatar,
	AvatarGroup,
	AvatarLabel,
	Badge,
	Button,
	ButtonGroup,
	ButtonUtility,
	Checkbox,
	CheckItem,
	ContentDivider,
	CreditCard,
	FileUpload,
	Icon,
	Input,
	Message,
	MessageInput,
	RadioGroup,
	Select,
	Slideout,
	Tabs,
	Tag,
	Textarea,
} from "@jotis-me/react";
import type { ReactNode } from "react";

/** El lienzo de cada composición: el panel abierto con su velo, del alto que pide. */
function Lienzo({ alto, children }: { alto: number; children: ReactNode }) {
	return (
		<div className="relative overflow-hidden rounded-xl" style={{ height: alto }}>
			{children}
		</div>
	);
}
const cerrar = () => {};
const cancelar = <Button hierarchy="secondary">Cancelar</Button>;
/** Un bloque con el título de su sección y el texto de apoyo. */
const Seccion = ({ titulo, texto, children }: { titulo: string; texto?: string; children?: ReactNode }) => (
	<section className="flex flex-col gap-3">
		<div>
			<h3 className="m-0 text-sm font-semibold text-secondary">{titulo}</h3>
			{texto ? <p className="m-0 text-sm text-tertiary">{texto}</p> : null}
		</div>
		{children}
	</section>
);
const PERSONAS = [
	["Candela Ruiz", "candela@regula.app", "Diseño"],
	["Diego Prieto", "diego@regula.app", "Producto"],
	["Elena Cano", "elena@regula.app", "Producto"],
	["Nacho Gil", "nacho@regula.app", "Finanzas"],
	["Rosa Vega", "rosa@regula.app", "Finanzas"],
];
const iniciales = (nombre: string) =>
	nombre
		.split(" ")
		.map((p) => p[0])
		.join("");

/* ——— Básicos ——— */

export function SlideoutPlaceholderExample() {
	return (
		<Lienzo alto={720}>
			<Slideout
				contained
				icon={<IconCircle size={24} />}
				title="Encabezado"
				description="Un texto corto que explica el panel."
				onClose={cerrar}
				width={440}
				actions={
					<>
						{cancelar}
						<Button>Guardar</Button>
					</>
				}
			>
				{[1, 2, 3].map((n) => (
					<Seccion
						key={n}
						titulo="Etiqueta"
						texto="Aquí va el contenido del panel: un formulario, un detalle o una lista."
					>
						<div className="h-20 rounded-xl bg-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)]" />
					</Seccion>
				))}
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutUserProfileExample() {
	return (
		<Lienzo alto={760}>
			<Slideout contained title="Autónoma" onClose={cerrar} width={440}>
				<div className="flex flex-col gap-4">
					<div className="relative h-32 rounded-xl bg-utility-brand-200">
						<Avatar
							size="2xl"
							initials="AM"
							badge="verified"
							className="absolute -bottom-12 left-4"
						/>
					</div>
					<div className="mt-10 flex flex-col gap-1">
						<p className="m-0 text-lg font-semibold text-primary">Ana Martín</p>
						<p className="m-0 text-md text-tertiary">ana@regula.app</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Tag size="sm">Diseño</Tag>
						<Tag size="sm">Producto</Tag>
						<Tag size="sm">Finanzas</Tag>
					</div>
					<div className="flex gap-3">
						<Button hierarchy="secondary">Añadir al presupuesto</Button>
						<Button>Nuevo presupuesto</Button>
					</div>
				</div>
				<Seccion
					titulo="Sobre mí"
					texto="Diseñadora en Madrid. Llevo las cuentas de casa y de mi estudio con Regula."
				/>
				<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-tertiary">
					<li className="flex items-center gap-2">
						<IconMarkerPin01 size={16} /> Madrid, España
					</li>
					<li className="flex items-center gap-2">
						<IconLink01 size={16} /> anamartin.es
					</li>
				</ul>
				<Seccion titulo="Experiencia">
					{[
						["Fundadora", "Estudio Capas", "2020 – hoy"],
						["Diseñadora", "Panadería Rey", "2018 – 2020"],
					].map(([cargo, sitio, fechas]) => (
						<div key={cargo} className="flex gap-3">
							<Avatar size="md" initials={sitio?.slice(0, 1)} />
							<div className="text-sm">
								<p className="m-0 font-semibold text-primary">{cargo}</p>
								<p className="m-0 text-tertiary">{sitio}</p>
								<p className="m-0 text-tertiary">{fechas}</p>
							</div>
						</div>
					))}
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutMessagesExample() {
	return (
		<Lienzo alto={760}>
			<Slideout
				contained
				title="Mensajes"
				description="Lo último de tu equipo."
				onClose={cerrar}
				width={440}
			>
				<Tabs
					type="button-border"
					fullWidth
					items={[
						{ id: "recientes", label: "Recientes" },
						{ id: "grupos", label: "Grupos" },
						{ id: "archivo", label: "Archivo" },
					]}
				/>
				<ActivityFeed
					type="messages"
					items={[
						{
							author: "Diego Prieto",
							avatar: { initials: "DP" },
							handle: "@diego",
							time: "Ahora",
							text: "¡Me parece bien!",
							unread: true,
							online: true,
						},
						{
							author: "Elena Cano",
							avatar: { initials: "EC" },
							handle: "@elena",
							time: "Hace 2 min",
							text: "Gracias, me encaja.",
							unread: true,
						},
						{
							author: "Nacho Gil",
							avatar: { initials: "NG" },
							handle: "@nacho",
							time: "Hace 2 min",
							text: "Te he pasado el recibo.",
							online: true,
						},
						{
							author: "Rosa Vega",
							avatar: { initials: "RV" },
							handle: "@rosa",
							time: "Hace 3 h",
							text: "¡Qué bien veros!",
						},
					]}
				/>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutMessageChatExample() {
	return (
		<Lienzo alto={760}>
			<Slideout
				contained
				title="Chat del equipo"
				onClose={cerrar}
				width={440}
				actions={<MessageInput placeholder="Mensaje" className="w-full" />}
			>
				<Tabs
					type="button-border"
					fullWidth
					items={[
						{ id: "recientes", label: "Recientes" },
						{ id: "grupos", label: "Grupos" },
						{ id: "archivo", label: "Archivo" },
					]}
				/>
				<div className="flex flex-col gap-4">
					<Message
						author="Nacho Gil"
						avatar={{ initials: "NG" }}
						time="Jueves 10:16"
						type="audio"
						audio={{ duration: "00:28" }}
					/>
					<Message author="Elena Cano" avatar={{ initials: "EC" }} time="Jueves 11:40">
						He terminado el presupuesto de las vacaciones.
					</Message>
					<Message
						author="Elena Cano"
						avatar={{ initials: "EC" }}
						time="Jueves 11:40"
						type="file"
						file={{ name: "presupuesto.pdf", size: "1,2 MB" }}
					/>
					<Message sent time="Jueves 11:41">
						¡Genial, gracias!
					</Message>
					<ContentDivider label="Hoy" />
					<Message author="Diego Prieto" avatar={{ initials: "DP" }} time="Viernes 14:20">
						Ana, ¿puedes revisar el último gasto?
					</Message>
				</div>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Pagos y planes ——— */

const contactoFacturas = (
	<>
		<ContentDivider />
		<Seccion titulo="Contacto de facturación" texto="Añade un segundo correo para las facturas.">
			<Input label="Correo" required type="email" icon="mail-01" defaultValue="cuentas@regula.app" />
		</Seccion>
	</>
);
const confirmar = (
	<>
		{cancelar}
		<Button>Confirmar</Button>
	</>
);

export function SlideoutPaymentMethodExample() {
	return (
		<Lienzo alto={800}>
			<Slideout
				contained
				icon={<IconCreditCard02 size={24} />}
				title="Método de pago"
				description="Cambia cómo pagas tu plan."
				onClose={cerrar}
				width={440}
				actions={confirmar}
			>
				<RadioGroup
					aria-label="Método de pago"
					appearance="card"
					indicator="checkbox"
					defaultValue="visa"
					options={[
						{ value: "visa", label: "Visa terminada en 1234", hint: "Caduca 06/2028" },
						{
							value: "mastercard",
							label: "Mastercard terminada en 1234",
							hint: "Caduca 08/2029",
						},
						{ value: "apple", label: "Apple Pay", hint: "Caduca 10/2028" },
					]}
				/>
				<Button hierarchy="link-color" iconLeading="plus" className="self-end">
					Añadir método de pago
				</Button>
				{contactoFacturas}
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutPaymentDetailsExample() {
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				icon={<IconCreditCard02 size={24} />}
				title="Datos de pago"
				description="Cambia los datos de tu tarjeta."
				onClose={cerrar}
				width={440}
				actions={confirmar}
			>
				<CreditCard
					theme="brand-dark"
					holder="Ana Martín"
					expiry="06/28"
					aria-label="Tarjeta de Ana Martín"
					className="w-full"
				/>
				<Input label="Nombre en la tarjeta" required defaultValue="Ana Martín" />
				<Input label="Número de tarjeta" required defaultValue="1234 1234 1234 1234" />
				<div className="grid grid-cols-2 gap-4">
					<Input label="Caducidad" required defaultValue="06 / 2028" />
					<Input label="CVV" required type="password" defaultValue="123" />
				</div>
				{contactoFacturas}
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutPlanExample() {
	return (
		<Lienzo alto={760}>
			<Slideout
				contained
				icon={<IconLayersThree01 size={24} />}
				title="Cambia de plan"
				description="Precios que crecen contigo."
				onClose={cerrar}
				width={440}
				actions={confirmar}
			>
				<RadioGroup
					aria-label="Plan"
					appearance="card"
					indicator="checkbox"
					defaultValue="basico"
					options={[
						{
							value: "basico",
							label: "Básico · 10 €/mes",
							hint: "Hasta 10 cuentas, 20 GB de documentos y todas las funciones.",
							icon: <IconLayersTwo01 size={16} />,
						},
						{
							value: "negocio",
							label: "Negocio · 20 €/mes",
							hint: "Hasta 20 cuentas, 40 GB de documentos y todas las funciones.",
							icon: <IconLayersTwo01 size={16} />,
						},
						{
							value: "empresa",
							label: "Empresa · 40 €/mes",
							hint: "Cuentas y documentos sin límite, y todas las funciones.",
							icon: <IconZap size={16} />,
						},
					]}
				/>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Equipo y filtros ——— */

const guardarFiltro = <Button hierarchy="link-color">Guardar filtro</Button>;

export function SlideoutTeamMembersExample() {
	const grupos = {
		Diseño: PERSONAS.slice(0, 1),
		Producto: PERSONAS.slice(1, 3),
		Finanzas: PERSONAS.slice(3),
	};
	return (
		<Lienzo alto={800}>
			<Slideout
				contained
				title="Personas del equipo"
				onClose={cerrar}
				width={440}
				footerStart={guardarFiltro}
				actions={confirmar}
			>
				<Input aria-label="Buscar" icon="search-lg" placeholder="Buscar" />
				{Object.entries(grupos).map(([grupo, lista]) => (
					<Seccion key={grupo} titulo={grupo}>
						<ul className="m-0 flex list-none flex-col gap-3 p-0">
							{lista.map(([nombre, correo]) => (
								<li key={nombre} className="flex items-center justify-between gap-3">
									<AvatarLabel
										size="md"
										name={nombre as string}
										supporting={correo}
										initials={iniciales(nombre as string)}
									/>
									<ButtonUtility
										hierarchy="tertiary"
										icon="mail-01"
										label={`Escribir a ${nombre}`}
									/>
								</li>
							))}
						</ul>
					</Seccion>
				))}
			</Slideout>
		</Lienzo>
	);
}

const ETIQUETAS: [string, "brand" | "blue" | "pink" | "success" | "gray" | "indigo" | "purple" | "orange"][] =
	[
		["Diseño", "brand"],
		["Producto", "blue"],
		["Marketing", "indigo"],
		["Dirección", "pink"],
		["Ventas", "success"],
		["Operaciones", "blue"],
		["Atención", "purple"],
		["Personas", "indigo"],
		["Cumplimiento", "orange"],
		["Finanzas", "gray"],
	];

export function SlideoutFiltersExample() {
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				title="Filtros"
				description="Filtra los datos de la tabla."
				onClose={cerrar}
				width={440}
				footerStart={guardarFiltro}
				actions={
					<>
						{cancelar}
						<Button>Aplicar</Button>
					</>
				}
			>
				<Select
					aria-label="Filtro guardado"
					placeholder="Elige un filtro guardado"
					options={[
						{ value: "mes", label: "Gastos del mes" },
						{ value: "fijos", label: "Gastos fijos" },
					]}
				/>
				<Seccion titulo="Equipos">
					<div className="flex flex-col gap-3">
						{ETIQUETAS.slice(0, 6).map(([t, c]) => (
							<div key={t} className="flex items-center gap-3">
								<Checkbox aria-label={t} />
								<Badge size="sm" color={c}>
									{t}
								</Badge>
							</div>
						))}
					</div>
				</Seccion>
				<Seccion titulo="Rol">
					<Input aria-label="Buscar rol" icon="search-lg" placeholder="Buscar" />
					<div className="flex flex-col gap-3">
						{["Administración", "Edición", "Lectura", "Gestoría"].map((r) => (
							<Checkbox key={r} label={r} />
						))}
					</div>
					<Button hierarchy="link-color" className="self-start">
						Ver 10 más
					</Button>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutLabelsExample() {
	return (
		<Lienzo alto={800}>
			<Slideout
				contained
				icon={<IconTag03 size={24} />}
				title="Etiquetas del presupuesto"
				description="Las etiquetas ordenan los presupuestos."
				onClose={cerrar}
				width={440}
				footerStart={<Button hierarchy="link-color">Gestionar etiquetas</Button>}
				actions={
					<>
						{cancelar}
						<Button>Aplicar</Button>
					</>
				}
			>
				<Input aria-label="Buscar etiqueta" icon="search-lg" placeholder="Busca una etiqueta" />
				<Seccion titulo="Etiquetas propias">
					<div className="flex flex-col gap-3">
						{ETIQUETAS.map(([t, c], i) => (
							<div key={t} className="flex items-center gap-3">
								<Checkbox aria-label={t} defaultChecked={i < 4} />
								<Badge size="sm" color={c}>
									{t}
								</Badge>
							</div>
						))}
					</div>
					<Button hierarchy="link-color" iconLeading="plus" className="self-start">
						Añadir etiqueta
					</Button>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutProjectDetailsExample() {
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				title="Presupuesto de la reforma"
				description="Cocina y baño de casa."
				onClose={cerrar}
				width={440}
				footerStart={guardarFiltro}
				actions={
					<>
						{cancelar}
						<Button>Aplicar</Button>
					</>
				}
			>
				<Seccion titulo="Compartir presupuesto" texto="regula.app/presupuestos/reforma">
					<Button hierarchy="secondary" size="sm" iconLeading="copy-01" className="self-start">
						Copiar enlace
					</Button>
				</Seccion>
				<Input label="Nombre del presupuesto" required defaultValue="Reforma de casa" />
				<Textarea
					label="Descripción"
					defaultValue="Lo que cuesta la cocina, el baño y los muebles nuevos."
				/>
				<Select
					label="Estado"
					defaultValue="curso"
					options={[
						{ value: "curso", label: "En curso" },
						{ value: "hecho", label: "Terminado" },
					]}
				/>
				<Seccion titulo="Personas" texto="Estas personas llevan el presupuesto.">
					<ul className="m-0 flex list-none flex-col gap-3 p-0">
						{PERSONAS.slice(0, 3).map(([nombre, correo]) => (
							<li key={nombre} className="flex items-center justify-between gap-3">
								<AvatarLabel
									size="md"
									name={nombre as string}
									supporting={correo}
									initials={iniciales(nombre as string)}
								/>
								<Button hierarchy="link-color" destructive size="sm">
									Quitar
								</Button>
							</li>
						))}
					</ul>
					<Button hierarchy="link-color" iconLeading="plus" className="self-start">
						Añadir persona
					</Button>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Archivos ——— */

export function SlideoutFileUploadExample() {
	return (
		<Lienzo alto={720}>
			<Slideout
				contained
				title="Sube y adjunta archivos"
				description="Adjunta los justificantes al presupuesto."
				onClose={cerrar}
				width={440}
				actions={
					<>
						{cancelar}
						<Button>Adjuntar</Button>
					</>
				}
			>
				<FileUpload
					hint="PDF, JPG o PNG (máx. 10 MB)"
					files={[
						{ name: "factura-octubre.pdf", size: 200_000, progress: 100 },
						{ name: "obra-cocina.mp4", size: 16_000_000, progress: 40 },
						{ name: "planos-baño.pdf", size: 4_200_000, progress: 80 },
					]}
				/>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Avisos ——— */

const guardar = (
	<>
		{cancelar}
		<Button>Guardar</Button>
	</>
);

export function SlideoutNotificationSettingsCheckboxesExample() {
	const avisos = [
		["Menciones", "Cuando te mencionan en un comentario."],
		["Respuestas", "Cuando responden a un comentario tuyo."],
		["Presupuestos nuevos", "Cuando tu equipo crea un presupuesto."],
	];
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				title="Avisos"
				description="Elige cuándo te avisamos."
				onClose={cerrar}
				width={440}
				actions={guardar}
			>
				<Seccion titulo="En la app" texto="Elige qué te avisamos dentro de Regula.">
					<div className="flex flex-col gap-4">
						{avisos.map(([t, h]) => (
							<Checkbox key={t} label={t} hint={h} defaultChecked />
						))}
						<Checkbox
							label="Gastos sin revisar"
							hint="Cuando un gasto lleva sin revisar más de:"
							defaultChecked
						/>
						<RadioGroup
							aria-label="Tiempo sin revisar"
							className="pl-7"
							defaultValue="1h"
							options={[
								{ value: "1h", label: "1 hora" },
								{ value: "24h", label: "24 horas" },
								{ value: "1s", label: "1 semana" },
							]}
						/>
					</div>
				</Seccion>
				<ContentDivider />
				<Seccion titulo="Por correo" texto="Elige qué te mandamos por correo.">
					<div className="flex flex-col gap-4">
						{avisos.map(([t, h]) => (
							<Checkbox key={t} label={t} hint={h} defaultChecked />
						))}
					</div>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutNotificationSettingsButtonGroupsExample() {
	const canal = (valor: string) => (
		<ButtonGroup
			className="w-fit"
			defaultValue={valor}
			items={[
				{ value: "nada", label: "Nada" },
				{ value: "app", label: "En la app" },
				{ value: "correo", label: "Correo" },
			]}
		/>
	);
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				title="Avisos"
				description="Elige cuándo te avisamos."
				onClose={cerrar}
				width={440}
				actions={guardar}
			>
				<Seccion titulo="Menciones" texto="Cuando te mencionan en un comentario.">
					{canal("correo")}
				</Seccion>
				<Seccion titulo="Respuestas" texto="Cuando responden a un comentario tuyo.">
					{canal("correo")}
				</Seccion>
				<Seccion titulo="Presupuestos nuevos" texto="Cuando tu equipo crea un presupuesto.">
					{canal("app")}
				</Seccion>
				<Seccion titulo="Gastos sin revisar" texto="Cuando un gasto lleva sin revisar más de:">
					<div className="flex gap-3">
						<Input aria-label="Cantidad" defaultValue="24" className="w-16" />
						<Select
							aria-label="Unidad"
							defaultValue="horas"
							className="w-32"
							options={[
								{ value: "horas", label: "Horas" },
								{ value: "dias", label: "Días" },
							]}
						/>
					</div>
					{canal("app")}
				</Seccion>
				<Button hierarchy="link-color" iconLeading="plus" className="self-start">
					Añadir un aviso
				</Button>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutNotificationsExample() {
	return (
		<Lienzo alto={760}>
			<Slideout contained title="Avisos" onClose={cerrar} width={440}>
				<ActivityFeed
					divider="connector"
					items={[
						{
							author: "Diego Prieto",
							avatar: { initials: "DP" },
							time: "Ahora",
							text: (
								<>
									Subió un archivo a <strong>Reforma de casa</strong>
								</>
							),
							supporting: { type: "file", name: "presupuesto-obra.pdf", size: "720 KB" },
							unread: true,
							online: true,
						},
						{
							author: "Elena Cano",
							avatar: { initials: "EC" },
							time: "Hace 2 min",
							text: (
								<>
									Invitó a <strong>Rosa Vega</strong> al equipo
								</>
							),
							unread: true,
						},
						{
							author: "Nacho Gil",
							avatar: { initials: "NG" },
							time: "Hace 3 h",
							text: (
								<>
									Comentó en <strong>Reforma de casa</strong>
								</>
							),
						},
						{
							author: "Candela Ruiz",
							avatar: { initials: "CR" },
							time: "Hace 6 h",
							text: (
								<>
									Añadió 3 etiquetas a <strong>Reforma de casa</strong>
								</>
							),
							supporting: { type: "tags", tags: ["Obra", "Casa", "2027"] },
						},
					]}
				/>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Compras ——— */

export function SlideoutOrderSummaryExample() {
	return (
		<Lienzo alto={640}>
			<Slideout contained title="Resumen del pedido" onClose={cerrar} width={440}>
				<div className="flex items-center justify-between">
					<Badge size="sm" color="gray" dot>
						4 artículos
					</Badge>
					<span className="font-display text-display-xs font-semibold text-primary">49,00 €</span>
				</div>
				<ContentDivider />
				<Select
					label="Envío"
					defaultValue="urgente"
					options={[
						{ value: "urgente", label: "Urgente · +3,99 €" },
						{ value: "normal", label: "Normal · gratis" },
					]}
				/>
				<div className="flex items-end gap-3">
					<Input label="Código de descuento" defaultValue="AMIGOS" className="flex-1" />
					<ButtonUtility icon="copy-01" label="Copiar el código" />
				</div>
				<ContentDivider />
				<dl className="m-0 grid grid-cols-[1fr_auto] gap-3 text-sm">
					<dt className="flex items-center gap-2 text-tertiary">
						Descuento <Tag size="sm">AMIGOS</Tag>
					</dt>
					<dd className="m-0 text-right text-tertiary">10 % (4,90 €)</dd>
					<dt className="text-tertiary">Envío urgente</dt>
					<dd className="m-0 text-right text-tertiary">3,99 €</dd>
					<dt className="font-semibold text-primary">Subtotal</dt>
					<dd className="m-0 text-right font-semibold text-primary">48,09 €</dd>
				</dl>
				<ContentDivider />
				<Button size="lg">Ir a pagar</Button>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Calendario y ajustes ——— */

const fecha = (
	<span className="flex flex-col items-center rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-tertiary shadow-[inset_0_0_0_1px_var(--border-secondary)]">
		ENE<span className="text-lg text-brand-secondary">10</span>
	</span>
);

export function SlideoutCalendarEventExample() {
	return (
		<Lienzo alto={800}>
			<Slideout
				contained
				icon={fecha}
				title="Revisión de cuentas"
				onClose={cerrar}
				width={440}
				footerStart={<span className="text-sm text-tertiary">¿Vas?</span>}
				actions={
					<ButtonGroup
						defaultValue="si"
						items={[
							{ value: "si", label: "Sí" },
							{ value: "no", label: "No" },
							{ value: "quiza", label: "Quizá" },
						]}
					/>
				}
			>
				<Seccion titulo="Detalles">
					<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-tertiary">
						<li className="flex items-center gap-2">
							<Icon name="calendar" size={16} /> Viernes, 10 de enero de 2027
						</li>
						<li className="flex items-center gap-2">
							<Icon name="clock" size={16} /> 13:30 – 15:30
						</li>
						<li className="flex items-center gap-2">
							<Icon name="bell-01" size={16} /> 10 minutos antes
						</li>
					</ul>
				</Seccion>
				<Seccion titulo="Organiza">
					<AvatarLabel size="md" name="Sara Hervás" supporting="sara@regula.app" initials="SH" />
				</Seccion>
				<Seccion titulo="Invitados" texto="6 invitados · 5 sí · 1 pendiente">
					<AvatarGroup
						size="md"
						items={[
							{ initials: "AM" },
							{ initials: "LR" },
							{ initials: "PG" },
							{ initials: "EC" },
							{ initials: "NG" },
							{ initials: "OR" },
						]}
					/>
				</Seccion>
				<Seccion
					titulo="Sobre la reunión"
					texto="Sara te invita a revisar las cuentas del trimestre y el presupuesto de la reforma. Trae los recibos que falten."
				/>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutUserSettingsExample() {
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				title="Sara Hervás"
				description="@sarahervas"
				onClose={cerrar}
				width={440}
				actions={guardar}
			>
				<div className="relative h-24 rounded-xl bg-utility-brand-200">
					<Avatar size="xl" initials="SH" badge="verified" className="absolute -bottom-8 left-4" />
				</div>
				<dl className="m-0 mt-6 grid grid-cols-4 gap-2 text-sm">
					{[
						["Seguidores", "32.086"],
						["Siguiendo", "4.698"],
						["Notas", "128"],
						["Listas", "24"],
					].map(([k, v]) => (
						<div key={k}>
							<dt className="text-xs text-tertiary">{k}</dt>
							<dd className="m-0 text-lg font-semibold text-primary">{v}</dd>
						</div>
					))}
				</dl>
				<ContentDivider />
				<div className="grid grid-cols-2 gap-4">
					<Input label="Nombre" required defaultValue="Sara" />
					<Input label="Apellidos" required defaultValue="Hervás" />
				</div>
				<Input
					label="Correo"
					required
					icon="mail-01"
					defaultValue="sara@regula.app"
					hint="Verificado el 2 de enero de 2027"
				/>
				<Input label="Usuario" required prefix="regula.app/@" defaultValue="sarahervas" />
				<Select
					label="País"
					defaultValue="es"
					hint="Según tu dirección IP."
					options={[
						{ value: "es", label: "España · UTC/GMT +1" },
						{ value: "pt", label: "Portugal · UTC/GMT +0" },
					]}
				/>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Asistente ——— */

const preguntar = (
	<MessageInput
		variant="advanced"
		placeholder="Pregunta lo que quieras…"
		onShortcuts={() => {}}
		onAttach={() => {}}
		className="w-full"
	/>
);

export function SlideoutAIAssistantIntroExample() {
	return (
		<Lienzo alto={760}>
			<Slideout contained title="Asistente" onClose={cerrar} width={440} actions={preguntar}>
				<div className="flex flex-col items-center gap-4 pt-10 text-center">
					<span className="flex size-14 items-center justify-center rounded-full bg-brand-solid text-primary_on-brand">
						<IconStars02 size={28} />
					</span>
					<div>
						<p className="m-0 text-lg text-tertiary">Hola, Ana:</p>
						<p className="m-0 text-lg font-semibold text-primary">¿En qué te ayudo?</p>
					</div>
					<p className="m-0 text-sm text-tertiary">
						Elige una de estas ideas o cuéntame qué necesitas.
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						{[
							"Ordena mis gastos",
							"Analiza el mes",
							"Haz un plan",
							"Resume el informe",
							"Escribe una nota",
							"Más",
						].map((t) => (
							<Badge key={t} size="md" color="gray" type="modern">
								{t}
							</Badge>
						))}
					</div>
				</div>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutAIAssistantMessageExample() {
	const ia = { initials: "IA" };
	return (
		<Lienzo alto={800}>
			<Slideout contained title="Asistente" onClose={cerrar} width={440} actions={preguntar}>
				<div className="flex flex-col gap-4">
					<Message avatar={ia}>Hola de nuevo. ¿En qué te ayudo?</Message>
					<Message sent>Mañana como con Sara a mediodía. ¿Me cuadras la agenda?</Message>
					<Message avatar={ia}>
						Te propongo: la revisión de cuentas pasa a las 13:30 y la reunión con Sara, al jueves
						a las 15:00.
					</Message>
					<Message
						avatar={ia}
						footer={<span className="text-sm text-tertiary">Cancelar · Sí, cámbialo</span>}
					>
						¿Cambio el calendario y aviso a Sara?
					</Message>
					<Message type="audio" sent audio={{ duration: "00:28" }} />
					<Message avatar={ia} typing />
				</div>
			</Slideout>
		</Lienzo>
	);
}

/* ——— Proyectos ——— */

export function SlideoutShareProjectExample() {
	return (
		<Lienzo alto={800}>
			<Slideout
				contained
				icon={<IconUserPlus01 size={24} />}
				title="Comparte este presupuesto"
				description="Invita a tu equipo a revisarlo."
				onClose={cerrar}
				width={440}
				footerStart={
					<Button hierarchy="link-gray" iconLeading={<IconCode02 size={20} />}>
						Código para incrustar
					</Button>
				}
				actions={
					<>
						{cancelar}
						<Button>Hecho</Button>
					</>
				}
			>
				<Input
					label="Cualquiera con el enlace puede editar"
					defaultValue="regula.app/presupuestos/reforma"
					readOnly
				/>
				<ContentDivider />
				<Seccion titulo="Quién tiene acceso" texto="Invita a otras personas a verlo y editarlo.">
					<Input
						aria-label="Buscar personas"
						icon="search-lg"
						placeholder="Busca por nombre o correo"
					/>
					<ul className="m-0 flex list-none flex-col gap-3 p-0">
						{PERSONAS.map(([nombre, correo], i) => (
							<li key={nombre} className="flex items-center justify-between gap-3">
								<AvatarLabel
									size="md"
									name={nombre as string}
									supporting={correo}
									initials={iniciales(nombre as string)}
								/>
								<Select
									aria-label={`Permiso de ${nombre}`}
									size="sm"
									defaultValue={i === 0 ? "propietaria" : "editar"}
									className="w-36"
									options={[
										{ value: "propietaria", label: "Propietaria" },
										{ value: "editar", label: "Puede editar" },
										{ value: "ver", label: "Puede ver" },
									]}
								/>
							</li>
						))}
					</ul>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutCreateEventExample() {
	return (
		<Lienzo alto={860}>
			<Slideout
				contained
				icon="calendar"
				title="Nuevo recordatorio"
				description="Pon la fecha y los detalles."
				onClose={cerrar}
				width={440}
				actions={
					<>
						{cancelar}
						<Button>Crear recordatorio</Button>
					</>
				}
			>
				<Input label="Título" required defaultValue="Pagar el seguro del coche" />
				<Input label="Empieza" required type="datetime-local" defaultValue="2027-01-08T09:00" />
				<Input label="Termina" required type="datetime-local" defaultValue="2027-01-14T12:00" />
				<Input label="Lugar" icon={<IconMarkerPin01 size={20} />} placeholder="Añade un lugar" />
				<Textarea label="Descripción" placeholder="Escribe una descripción" />
				<ContentDivider />
				<Seccion titulo="Permisos de los invitados">
					<div className="flex flex-col gap-3">
						<Checkbox label="Cambiar el recordatorio" />
						<Checkbox label="Invitar a otros" defaultChecked />
						<Checkbox label="Ver la lista de invitados" defaultChecked />
					</div>
				</Seccion>
			</Slideout>
		</Lienzo>
	);
}

export function SlideoutIntegrationExample() {
	return (
		<Lienzo alto={720}>
			<Slideout
				contained
				title="Conecta Regula con tu banco"
				onClose={cerrar}
				width={440}
				footerStart={
					<Button hierarchy="secondary" iconLeading={<IconBookOpen01 size={20} />}>
						Documentación
					</Button>
				}
				actions={<Button>Conectar</Button>}
			>
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex items-center gap-3 text-fg-quaternary">
						<Avatar size="lg" initials="R" />
						<IconSwitchHorizontal01 size={20} />
						<Avatar size="lg" initials="B" />
					</div>
					<p className="m-0 text-sm text-tertiary">
						Importa los movimientos cada día y ten las cuentas al día sin subir extractos.
					</p>
				</div>
				<ContentDivider />
				<Seccion titulo="Regula podrá">
					<ul className="m-0 flex list-none flex-col gap-2 p-0">
						{[
							"Leer los movimientos de tus cuentas",
							"Leer los saldos",
							"Ver los recibos domiciliados",
							"Avisarte de cargos raros",
						].map((t) => (
							<CheckItem key={t} type="line" color="gray" size="sm">
								{t}
							</CheckItem>
						))}
					</ul>
				</Seccion>
				<ContentDivider />
				<Input
					aria-label="Dirección de la conexión"
					defaultValue="regula.app/conexiones/banco"
					readOnly
				/>
			</Slideout>
		</Lienzo>
	);
}
