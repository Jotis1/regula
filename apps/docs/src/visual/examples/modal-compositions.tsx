// Composiciones de Modal: los tipos del Figma (`Modal`, `4057:415205`) hechos solo con componentes de Regula. No se
// exportan del paquete: son ejemplos para copiar. Cada una pinta el modal abierto en su lienzo (`contained`).

import { SocialAppleLogoGray, SocialFacebookLogoGray, SocialGoogleLogo } from "@jotis-me/assets/logos";
import {
	Avatar,
	AvatarGroup,
	AvatarLabel,
	Badge,
	Button,
	Checkbox,
	CheckItem,
	ContentDivider,
	CreditCard,
	FileUpload,
	Input,
	Modal,
	NumberInput,
	PaginationDots,
	RadioGroup,
	Select,
	SocialButton,
	TagInput,
	Textarea,
	TextEditor,
	Toggle,
	VerificationCodeInput,
} from "@jotis-me/react";
import {
	Bell01,
	BookOpen01,
	Building07,
	Calendar,
	CheckCircle,
	Clock,
	Code02,
	Copy01,
	CreditCard02,
	Crop01,
	CurrencyDollarCircle,
	Edit05,
	Flag05,
	Folder,
	HelpCircle,
	LayersThree01,
	Lock01,
	Mail01,
	MarkerPin01,
	MessageChatCircle,
	Play,
	Plus,
	Save01,
	SearchLg,
	Shield01,
	Stars02,
	Sun,
	Tag01,
	Trash01,
	UserPlus01,
	Users01,
} from "@untitledui/icons";
import type { ReactNode } from "react";

/** El lienzo de cada composición: el modal abierto con su velo, del alto que pide. */
function Lienzo({ alto, children }: { alto: number; children: ReactNode }) {
	return (
		<div className="relative overflow-hidden rounded-xl" style={{ height: alto }}>
			{children}
		</div>
	);
}
const cerrar = () => {};
const cancelar = <Button hierarchy="secondary">Cancelar</Button>;
const noMostrar = <Checkbox label="No volver a mostrar" size="sm" />;
/** Una foto sin foto: un degradado con formas. */
const Dibujo = ({ tono, alto = 160 }: { tono: string; alto?: number }) => (
	<div className={`relative w-full overflow-hidden rounded-xl ${tono}`} style={{ height: alto }}>
		<div className="absolute top-1/4 left-1/3 size-1/2 rounded-full bg-primary/40" />
	</div>
);
const EQUIPO = [{ initials: "AM" }, { initials: "LR" }, { initials: "PG" }];

/* ——— Confirmaciones ——— */

export function ModalHorizontalExample() {
	return (
		<Lienzo alto={300}>
			<Modal
				contained
				layout="horizontal"
				icon={CheckCircle}
				color="success"
				iconVariant="modern"
				title="Informe publicado"
				description="El informe de octubre ya está publicado. Tu equipo puede verlo y comentarlo."
				onClose={cerrar}
				width={544}
				footerStart={noMostrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalWarningHorizontalExample() {
	return (
		<Lienzo alto={300}>
			<Modal
				contained
				layout="horizontal"
				icon={<Save01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Cambios sin guardar"
				description="¿Quieres guardar o descartar los cambios?"
				onClose={cerrar}
				width={544}
				footerStart={noMostrar}
				actions={
					<>
						<Button hierarchy="secondary">Descartar</Button>
						<Button>Guardar cambios</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalDestructiveHorizontalExample() {
	return (
		<Lienzo alto={300}>
			<Modal
				contained
				layout="horizontal"
				icon={Trash01}
				destructive
				iconVariant="modern"
				title="Eliminar el informe"
				description="¿Seguro que quieres eliminar este informe?"
				onClose={cerrar}
				width={544}
				footerStart={noMostrar}
				actions={
					<>
						{cancelar}
						<Button destructive>Eliminar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalStackedLeftAlignedExample() {
	return (
		<Lienzo alto={340}>
			<Modal
				contained
				icon={CheckCircle}
				color="success"
				iconVariant="modern"
				title="Informe publicado"
				description="El informe de octubre ya está publicado. Tu equipo puede verlo y comentarlo."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalWarningStackedLeftAlignedExample() {
	return (
		<Lienzo alto={320}>
			<Modal
				contained
				icon={<Save01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Cambios sin guardar"
				description="¿Quieres guardar o descartar los cambios?"
				onClose={cerrar}
				actions={
					<>
						<Button hierarchy="secondary">Descartar</Button>
						<Button>Guardar cambios</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalDestructiveStackedLeftAlignedExample() {
	return (
		<Lienzo alto={320}>
			<Modal
				contained
				icon={Trash01}
				destructive
				iconVariant="modern"
				title="Eliminar el informe"
				description="¿Seguro que quieres eliminar este informe?"
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button destructive>Eliminar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

/* ——— Equipo ——— */

export function ModalStackedWithTeamExample() {
	return (
		<Lienzo alto={360}>
			<Modal
				contained
				align="center"
				dividers
				icon={<AvatarGroup size="md" items={EQUIPO} />}
				iconVariant="light"
				color="gray"
				title="Ya estás en el equipo"
				description="Gracias por aceptar la invitación. Ahora eres editora de las cuentas de casa."
				actions={
					<>
						{cancelar}
						<Button>Empezar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalStackedWithTeamAndLinkExample() {
	return (
		<Lienzo alto={420}>
			<Modal
				contained
				align="center"
				dividers
				title="Invita a tu equipo"
				description="Has creado un presupuesto compartido. Invita a quien vaya a usarlo."
				media={
					<div className="flex justify-center">
						<AvatarGroup size="md" items={EQUIPO} />
					</div>
				}
				actions={
					<>
						{cancelar}
						<Button>Continuar</Button>
					</>
				}
			>
				<Input label="Enlace para compartir" defaultValue="regula.app/unirse/casa" readOnly />
			</Modal>
		</Lienzo>
	);
}

export function ModalStackedWithTeamAndInvitesExample() {
	const personas = [
		["Candela Ruiz", "@candela", "Admin"],
		["Diego Prieto", "@diego", "Admin"],
		["Elena Cano", "@elena", "Edición"],
		["Nacho Gil", "@nacho", "Edición"],
	];
	return (
		<Lienzo alto={560}>
			<Modal
				contained
				align="center"
				dividers
				title="Añade a tu equipo"
				description="Elige quién trabaja contigo en este presupuesto."
				media={
					<div className="flex justify-center">
						<AvatarGroup size="md" items={EQUIPO} />
					</div>
				}
				actions={
					<>
						{cancelar}
						<Button>Añadir al presupuesto</Button>
					</>
				}
			>
				<ul className="m-0 flex list-none flex-col gap-3 p-0">
					{personas.map(([nombre, usuario, rol]) => (
						<li key={nombre} className="flex items-center gap-3">
							<Checkbox defaultChecked aria-label={`Añadir a ${nombre}`} />
							<AvatarLabel
								size="sm"
								name={nombre as string}
								supporting={usuario}
								initials={(nombre as string).slice(0, 1)}
							/>
							<span className="ml-auto text-sm font-semibold text-tertiary">{rol}</span>
						</li>
					))}
				</ul>
			</Modal>
		</Lienzo>
	);
}

/* ——— Imagen y carrusel ——— */

export function ModalCenteredPhotoExample() {
	return (
		<Lienzo alto={480}>
			<Modal
				contained
				align="center"
				media={<Dibujo tono="bg-utility-green-200" alto={200} />}
				title="Informe publicado"
				description="El informe de octubre ya está publicado. Tu equipo puede verlo y comentarlo."
				actions={
					<>
						<Button hierarchy="secondary" iconLeading={Copy01}>
							Copiar enlace
						</Button>
						<Button>Terminar</Button>
					</>
				}
			/>
		</Lienzo>
	);
}

export function ModalCenteredPhotoCarouselExample() {
	return (
		<Lienzo alto={480}>
			<Modal
				contained
				align="center"
				media={<Dibujo tono="bg-utility-brand-100" alto={180} />}
				title="Bienvenida a tu panel"
				description="Nos alegra tenerte. Aquí tienes unos consejos para empezar."
				actions={
					<>
						<Button hierarchy="secondary">Saltar</Button>
						<Button>Siguiente</Button>
					</>
				}
			>
				<div className="flex justify-center">
					<PaginationDots total={4} current={1} />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalCenteredVideoCarouselExample() {
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				align="center"
				width={640}
				media={
					<div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl bg-utility-sky-200">
						<span className="flex size-14 items-center justify-center rounded-full bg-primary/80 text-fg-secondary">
							<Play size={24} />
						</span>
					</div>
				}
				title="Bienvenida a tu panel"
				description="Mira en dos minutos cómo ordenar tus cuentas."
				actions={
					<>
						<Button hierarchy="secondary">Saltar</Button>
						<Button>Continuar</Button>
					</>
				}
			>
				<div className="flex justify-center">
					<PaginationDots total={4} current={1} />
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Campos ——— */

export function ModalCheckboxesExample() {
	return (
		<Lienzo alto={420}>
			<Modal
				contained
				icon={CheckCircle}
				color="gray"
				iconVariant="modern"
				title="Informe publicado"
				description="Elige dónde compartirlo."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-3">
					<Checkbox label="Compartir con la familia" />
					<Checkbox label="Compartir con la gestoría" />
					<Checkbox label="Enviar por correo" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalTogglesExample() {
	return (
		<Lienzo alto={440}>
			<Modal
				contained
				icon={CheckCircle}
				color="gray"
				iconVariant="modern"
				title="Informe publicado"
				description="Elige dónde avisar a tu equipo."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Toggle label="Avisar por correo" hint="tu@regula.app" defaultChecked />
					<Toggle label="Avisar en el móvil" hint="Notificación en la app" defaultChecked />
					<Toggle label="Avisar en Slack" hint="#finanzas" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalLinkFieldExample() {
	return (
		<Lienzo alto={380}>
			<Modal
				contained
				icon={CheckCircle}
				color="gray"
				iconVariant="modern"
				title="Informe publicado"
				description="Compártelo con este enlace."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<Input label="Enlace" defaultValue="regula.app/informes/octubre" readOnly />
			</Modal>
		</Lienzo>
	);
}

export function ModalInputFieldExample() {
	return (
		<Lienzo alto={380}>
			<Modal
				contained
				icon={Folder}
				color="gray"
				iconVariant="modern"
				title="Presupuesto creado"
				description="Ponle un nombre."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<Input label="Nombre del presupuesto" placeholder="p. ej. Vacaciones de verano" />
			</Modal>
		</Lienzo>
	);
}

export function ModalLabelsExample() {
	return (
		<Lienzo alto={380}>
			<Modal
				contained
				icon={<Tag01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Etiquetas del gasto"
				description="Las etiquetas ayudan a ordenar tus gastos."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Guardar etiquetas</Button>
					</>
				}
			>
				<TagInput
					aria-label="Etiquetas"
					defaultValue={["Casa", "Mensual", "Fijo"]}
					placeholder="Busca o crea una etiqueta"
				/>
			</Modal>
		</Lienzo>
	);
}

export function ModalDropdownExample() {
	return (
		<Lienzo alto={380}>
			<Modal
				contained
				icon={CheckCircle}
				color="gray"
				iconVariant="modern"
				title="Informe publicado"
				description="Elige quién lo revisa."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<Select
					label="Persona"
					defaultValue="ana"
					options={[
						{ value: "ana", label: "Ana Martín" },
						{ value: "luis", label: "Luis Rey" },
					]}
				/>
			</Modal>
		</Lienzo>
	);
}

export function ModalEmailInviteExample() {
	return (
		<Lienzo alto={460}>
			<Modal
				contained
				icon={<UserPlus01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Invita a quien colabore"
				description="Has creado un presupuesto compartido. Invita a quien vaya a usarlo."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Enviar invitaciones</Button>
					</>
				}
			>
				<div className="flex flex-col gap-3">
					<Input label="Correo" type="email" icon={Mail01} placeholder="tu@regula.app" />
					<Input aria-label="Otro correo" type="email" icon={Mail01} placeholder="tu@regula.app" />
					<Button hierarchy="link-color" iconLeading={Plus} className="self-start">
						Añadir otro
					</Button>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalUserInviteExample() {
	const personas = [
		["Candela Ruiz", "candela@regula.app"],
		["Diego Prieto", "diego@regula.app"],
		["Elena Cano", "elena@regula.app"],
	];
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				icon={<UserPlus01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Compartir con personas"
				description="Estas personas pueden ver este presupuesto."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Hecho</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<ul className="m-0 flex list-none flex-col gap-3 p-0">
						{personas.map(([nombre, correo]) => (
							<li key={nombre} className="flex items-center justify-between gap-3">
								<AvatarLabel
									size="sm"
									name={nombre as string}
									supporting={correo}
									initials={(nombre as string).slice(0, 1)}
								/>
								<Button hierarchy="link-gray" destructive size="sm">
									Quitar
								</Button>
							</li>
						))}
					</ul>
					<Select
						label="Persona del equipo"
						placeholder="Elige a alguien"
						options={[
							{ value: "nacho", label: "Nacho Gil" },
							{ value: "rosa", label: "Rosa Vega" },
						]}
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalAccessRequestExample() {
	return (
		<Lienzo alto={380}>
			<Modal
				contained
				icon={<UserPlus01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Candela pide permiso para editar"
				description="Alguien de tu equipo pide editar el presupuesto «Vacaciones de verano»."
				onClose={cerrar}
				width={440}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<AvatarLabel
					name="Candela Ruiz"
					supporting="candela@regula.app"
					initials="CR"
					status="online"
				/>
			</Modal>
		</Lienzo>
	);
}

/* ——— Seguridad ——— */

/** Un código QR de mentira, dibujado con cuadros fijos. */
function Qr() {
	const esquina = (x: number, y: number) =>
		[0, 14].some((ox) =>
			[0, 14].some((oy) => !(ox === 14 && oy === 14) && x >= ox && x < ox + 7 && y >= oy && y < oy + 7),
		);
	const marco = (x: number, y: number) => {
		const cx = x % 14 === x ? x : x - 14;
		const cy = y % 14 === y ? y : y - 14;
		return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4);
	};
	const celdas = Array.from({ length: 21 * 21 }, (_, i) => {
		const x = i % 21;
		const y = Math.floor(i / 21);
		const on = esquina(x, y) ? marco(x, y) : (x * 7 + y * 13 + x * y * 3) % 5 < 2;
		return { x, y, on };
	}).filter((c) => c.on);
	return (
		<div className="flex justify-center rounded-xl bg-secondary p-4">
			<svg viewBox="0 0 21 21" width={120} height={120} role="img" aria-label="Código QR">
				{celdas.map(({ x, y }) => (
					<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="var(--fg-primary)" />
				))}
			</svg>
		</div>
	);
}

export function Modal2FaCodeExample() {
	return (
		<Lienzo alto={600}>
			<Modal
				contained
				icon={Lock01}
				color="gray"
				iconVariant="modern"
				title="Activa la verificación en dos pasos"
				description="Escanea este código con tu app de autenticación y escribe el código que te dé."
				onClose={cerrar}
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-5">
					<Qr />
					<VerificationCodeInput digits={6} size="sm" />
					<p className="m-0 text-sm text-tertiary">¿No te llega el código? Pídelo otra vez.</p>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalVerificationCodeExample() {
	return (
		<Lienzo alto={420}>
			<Modal
				contained
				align="center"
				icon={Mail01}
				color="gray"
				iconVariant="modern"
				title="Revisa tu correo"
				description="Te hemos enviado un código a ana@regula.app."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Verificar</Button>
					</>
				}
			>
				<div className="flex flex-col items-center gap-3">
					<VerificationCodeInput digits={4} defaultValue="3066" />
					<p className="m-0 text-sm text-tertiary">¿No te llega? Pídelo otra vez.</p>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalPasswordPromptExample() {
	return (
		<Lienzo alto={440}>
			<Modal
				contained
				align="center"
				icon={<Shield01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Escribe tu contraseña"
				description="Hace falta para hacer este cambio."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Verificar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Input label="Correo o usuario" icon={Mail01} defaultValue="ana@regula.app" />
					<Input
						label="Contraseña"
						type="password"
						icon={Lock01}
						defaultValue="contraseña"
						revealable
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Entrar ——— */

const marca = (
	<span className="flex size-10 items-center justify-center rounded-lg bg-brand-solid font-display text-lg font-semibold text-primary_on-brand">
		R
	</span>
);

export function ModalLogInExample() {
	return (
		<Lienzo alto={540}>
			<Modal
				contained
				align="center"
				icon={marca}
				iconVariant="modern"
				color="gray"
				title="Entra en tu cuenta"
				description="Hola de nuevo. Escribe tus datos."
				onClose={cerrar}
				actions={
					<div className="flex w-full flex-col gap-3">
						<Button>Entrar</Button>
						<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />
					</div>
				}
			>
				<div className="flex flex-col gap-4">
					<Input label="Correo" type="email" placeholder="tu@regula.app" />
					<Input label="Contraseña" type="password" revealable defaultValue="contraseña" />
					<div className="flex items-center justify-between">
						<Checkbox label="Recordarme 30 días" size="sm" />
						<Button hierarchy="link-color" size="sm">
							¿Olvidaste la contraseña?
						</Button>
					</div>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalSignUp01Example() {
	return (
		<Lienzo alto={580}>
			<Modal
				contained
				icon={marca}
				iconVariant="modern"
				color="gray"
				title="Crea tu cuenta"
				description="Prueba Regula gratis durante 30 días."
				onClose={cerrar}
				actions={
					<div className="flex w-full flex-col gap-3">
						<Button>Crear cuenta</Button>
						<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />
					</div>
				}
			>
				<div className="flex flex-col gap-4">
					<Input label="Nombre" placeholder="Tu nombre" />
					<Input label="Correo" type="email" placeholder="tu@regula.app" />
					<Input label="Contraseña" type="password" revealable hint="Al menos 8 caracteres." />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalSignUp02Example() {
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				align="center"
				icon={marca}
				iconVariant="modern"
				color="gray"
				title="Crea tu cuenta"
				description="Prueba Regula gratis durante 30 días. Cancela cuando quieras."
				onClose={cerrar}
			>
				<div className="flex flex-col gap-4 pb-6">
					<Input aria-label="Correo" type="email" placeholder="tu@regula.app" />
					<Button>Empezar</Button>
					<ContentDivider label="o" />
					<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />
					<SocialButton provider="facebook" theme="color" logo={<SocialFacebookLogoGray />} />
					<SocialButton provider="apple" theme="color" logo={<SocialAppleLogoGray />} />
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Planes y pagos ——— */

export function ModalPlan01Example() {
	return (
		<Lienzo alto={540}>
			<Modal
				contained
				icon={<LayersThree01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Cambia de plan"
				description="Precios que crecen contigo."
				onClose={cerrar}
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
			>
				<RadioGroup
					aria-label="Plan"
					appearance="card"
					indicator="checkbox"
					defaultValue="basico"
					options={[
						{
							value: "basico",
							label: "Básico 10 €/mes",
							hint: "Hasta 10 cuentas y 20 GB de documentos.",
						},
						{
							value: "pro",
							label: "Pro 20 €/mes",
							hint: "Hasta 20 cuentas y 40 GB de documentos.",
						},
						{
							value: "empresa",
							label: "Empresa 40 €/mes",
							hint: "Cuentas y documentos sin límite.",
						},
					]}
				/>
			</Modal>
		</Lienzo>
	);
}

export function ModalPlan02Example() {
	const plan = (precio: string, nombre: string, lista: string[], elegido?: boolean) => (
		<div
			className={`flex flex-1 flex-col gap-4 rounded-xl p-5 ${elegido ? "shadow-[inset_0_0_0_2px_var(--border-brand)]" : "shadow-[inset_0_0_0_1px_var(--border-secondary)]"}`}
		>
			<div>
				<p className="m-0 font-display text-display-xs font-semibold text-primary">{precio}</p>
				<p className="m-0 text-sm font-semibold text-primary">{nombre}</p>
				<p className="m-0 text-sm text-tertiary">Cobro anual</p>
			</div>
			<ul className="m-0 flex list-none flex-col gap-2 p-0">
				{lista.map((l) => (
					<CheckItem key={l} type="line" size="sm">
						{l}
					</CheckItem>
				))}
			</ul>
		</div>
	);
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				layout="horizontal"
				icon={<LayersThree01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Elige un plan"
				description="Precio sencillo por persona."
				onClose={cerrar}
				width={600}
				footerStart={
					<Button hierarchy="secondary" iconLeading={<MessageChatCircle size={20} />}>
						Hablar con ventas
					</Button>
				}
				actions={
					<>
						{cancelar}
						<Button>Elegir plan</Button>
					</>
				}
			>
				<div className="flex flex-wrap gap-4">
					{plan("10 €/mes", "Básico", ["Funciones básicas", "Informes", "Hasta 10 cuentas"], true)}
					{plan("20 €/mes", "Pro", [
						"Todo lo del básico",
						"Informes avanzados",
						"Hasta 20 cuentas",
					])}
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalPaymentMethodExample() {
	return (
		<Lienzo alto={560}>
			<Modal
				contained
				icon={<CurrencyDollarCircle size={24} />}
				color="gray"
				iconVariant="modern"
				title="Cambia el método de pago"
				description="Actualiza cómo pagas tu plan."
				onClose={cerrar}
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Confirmar</Button>
					</>
				}
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
			</Modal>
		</Lienzo>
	);
}

const camposTarjeta = (
	<div className="grid grid-cols-[1fr_auto] gap-4">
		<Input label="Nombre en la tarjeta" defaultValue="Ana Martín" />
		<Input label="Caducidad" defaultValue="06 / 2028" className="w-28" />
		<Input label="Número de tarjeta" defaultValue="1234 1234 1234 1234" />
		<Input label="CVV" type="password" defaultValue="123" className="w-28" />
	</div>
);

export function ModalPaymentDetailsExample() {
	return (
		<Lienzo alto={460}>
			<Modal
				contained
				icon={<CreditCard02 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Cambia la tarjeta"
				description="Actualiza los datos de tu tarjeta."
				onClose={cerrar}
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Actualizar</Button>
					</>
				}
			>
				{camposTarjeta}
			</Modal>
		</Lienzo>
	);
}

export function ModalPaymentDetailsWithImageExample() {
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				media={
					<CreditCard
						theme="brand-dark"
						holder="Ana Martín"
						expiry="06/28"
						aria-label="Tarjeta de Ana Martín"
						className="w-full"
					/>
				}
				title="Cambia la tarjeta"
				description="Actualiza los datos de tu tarjeta."
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Actualizar</Button>
					</>
				}
			>
				{camposTarjeta}
			</Modal>
		</Lienzo>
	);
}

export function ModalUserSelectionExample() {
	return (
		<Lienzo alto={440}>
			<Modal
				contained
				icon={Users01}
				color="gray"
				iconVariant="modern"
				title="Compra plazas"
				description="Elige cuántas plazas necesitas."
				onClose={cerrar}
				dividers
				width={480}
				actions={
					<>
						{cancelar}
						<Button>Comprar plazas</Button>
					</>
				}
			>
				<div className="flex flex-col gap-5">
					<div className="flex justify-center">
						<NumberInput label="Plazas" defaultValue={32} min={1} />
					</div>
					<dl className="m-0 grid grid-cols-2 gap-2 text-sm">
						<dt className="text-tertiary">Precio por plaza</dt>
						<dd className="m-0 text-right font-semibold text-primary">10 €</dd>
						<dt className="font-semibold text-primary">Total</dt>
						<dd className="m-0 text-right font-semibold text-primary">320 €</dd>
					</dl>
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Archivos e imagen ——— */

export function ModalFileUploadExample() {
	return (
		<Lienzo alto={720}>
			<Modal
				contained
				title="Sube y adjunta archivos"
				description="Adjunta los justificantes a este gasto."
				onClose={cerrar}
				width={480}
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
						{ name: "ticket-super.jpg", size: 6_400_000, progress: 40 },
						{ name: "recibo-luz.pdf", size: 3_400_000, progress: 80 },
					]}
				/>
			</Modal>
		</Lienzo>
	);
}

export function ModalImageCropExample() {
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				layout="horizontal"
				icon={<Crop01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Recorta la imagen de portada"
				description="Sube una imagen de 1600 × 480 px para que se vea bien."
				onClose={cerrar}
				width={560}
				dividers
				actions={
					<>
						{cancelar}
						<Button>Guardar cambios</Button>
					</>
				}
			>
				<div className="relative">
					<Dibujo tono="bg-utility-pink-200" alto={200} />
					<div className="absolute inset-x-0 top-12 h-24 shadow-[inset_0_0_0_2px_var(--fg-white)]" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalProfileSettingsExample() {
	return (
		<Lienzo alto={680}>
			<Modal
				contained
				title="Completa tu perfil"
				description="Elige un usuario y escribe una presentación corta."
				onClose={cerrar}
				width={560}
				footerStart={
					<Button hierarchy="link-gray" iconLeading={Copy01}>
						Copiar enlace
					</Button>
				}
				actions={
					<>
						{cancelar}
						<Button>Publicar perfil</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<div className="flex items-start gap-4">
						<Avatar size="xl" initials="AM" badge="verified" />
						<div className="flex-1">
							<FileUpload hint="SVG, PNG o JPG (máx. 800 × 400 px)" />
						</div>
					</div>
					<Input label="Usuario" required prefix="regula.app/" defaultValue="anamartin" />
					<Textarea
						label="Presentación"
						required
						placeholder="Unas líneas sobre ti para tu perfil…"
					/>
					<Checkbox label="Acepto los términos y condiciones" size="sm" />
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Formularios y ajustes ——— */

export function ModalDatePickerExample() {
	return (
		<Lienzo alto={440}>
			<Modal
				contained
				icon={Calendar}
				color="gray"
				iconVariant="modern"
				title="Elige las fechas"
				description="El informe cubrirá este periodo."
				onClose={cerrar}
				actions={
					<>
						{cancelar}
						<Button>Aplicar</Button>
					</>
				}
			>
				<div className="grid grid-cols-2 gap-4">
					<Input label="Desde" type="date" defaultValue="2027-01-08" />
					<Input label="Hasta" type="date" defaultValue="2027-01-14" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalBannerAppearanceExample() {
	const opcion = (titulo: string, texto: string, tono: string) => ({
		value: titulo,
		label: titulo,
		hint: texto,
		media: (
			<div
				className={`h-12 w-16 rounded-md shadow-[inset_0_0_0_1px_var(--border-secondary)] ${tono}`}
			/>
		),
	});
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				title="Aspecto de los avisos"
				description="Cambia cómo ven los avisos las personas que entran."
				onClose={cerrar}
				width={560}
				footerStart={
					<Button hierarchy="link-gray" iconLeading={HelpCircle}>
						¿Necesitas ayuda?
					</Button>
				}
				actions={
					<>
						{cancelar}
						<Button>Guardar cambios</Button>
					</>
				}
			>
				<div className="grid grid-cols-2 gap-4">
					<RadioGroup
						aria-label="Aspecto"
						appearance="card"
						defaultValue="Sencillo"
						className="col-span-2 grid grid-cols-2 gap-4"
						options={[
							opcion("Por defecto", "Color de la marca.", "bg-utility-brand-100"),
							opcion("Sencillo", "Mínimo y limpio.", "bg-secondary"),
							opcion("Ninguno", "Sin avisos.", "bg-tertiary"),
							opcion("A medida", "Con tu propio CSS.", "bg-utility-neutral-200"),
						]}
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalAppearanceSettingsExample() {
	return (
		<Lienzo alto={600}>
			<Modal
				contained
				icon={Sun}
				color="gray"
				iconVariant="modern"
				title="Apariencia"
				description="Cambia cómo se ve tu panel en este navegador."
				onClose={cerrar}
				width={560}
				dividers
				footerStart={<Checkbox label="Aplicar a todos los equipos" size="sm" />}
				actions={
					<>
						{cancelar}
						<Button>Guardar cambios</Button>
					</>
				}
			>
				<RadioGroup
					aria-label="Tema"
					appearance="card"
					defaultValue="sistema"
					className="grid grid-cols-3 gap-3"
					options={[
						{
							value: "sistema",
							label: "Del sistema",
							media: (
								<div className="h-10 w-10 rounded-md shadow-[inset_0_0_0_1px_var(--border-secondary)] bg-[linear-gradient(90deg,var(--bg-secondary)_50%,var(--bg-primary-solid)_50%)]" />
							),
						},
						{
							value: "claro",
							label: "Claro",
							media: (
								<div className="h-10 w-10 rounded-md shadow-[inset_0_0_0_1px_var(--border-secondary)] bg-secondary" />
							),
						},
						{
							value: "oscuro",
							label: "Oscuro",
							media: (
								<div className="h-10 w-10 rounded-md shadow-[inset_0_0_0_1px_var(--border-secondary)] bg-primary-solid" />
							),
						},
					]}
				/>
			</Modal>
		</Lienzo>
	);
}

export function ModalForm01Example() {
	return (
		<Lienzo alto={680}>
			<Modal
				contained
				icon={<Flag05 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Añade un ingreso fijo"
				description="Cuéntanos de dónde viene tu sueldo."
				onClose={cerrar}
				width={560}
				actions={
					<>
						<Button hierarchy="secondary" iconLeading={<Save01 size={20} />}>
							Guardar borrador
						</Button>
						<Button>Añadir ingreso</Button>
					</>
				}
			>
				<div className="grid grid-cols-2 gap-4">
					<Input label="Concepto" placeholder="¿De qué es?" className="col-span-2" />
					<Input label="Empresa" icon={SearchLg} placeholder="Busca la empresa" />
					<Input label="Web" prefix="https://" placeholder="www.ejemplo.com" />
					<Input label="Importe" placeholder="0,00 €" />
					<Select
						label="Frecuencia"
						defaultValue="mensual"
						options={[
							{ value: "mensual", label: "Mensual" },
							{ value: "anual", label: "Anual" },
						]}
					/>
					<Textarea label="Notas" placeholder="Algo que quieras recordar…" className="col-span-2" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalForm02Example() {
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				layout="horizontal"
				icon={<Building07 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Añade tu negocio"
				description="Crea su ficha en menos de cinco minutos."
				onClose={cerrar}
				width={600}
				dividers
				actions={
					<>
						{cancelar}
						<Button>Añadir negocio</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Input label="Nombre" placeholder="p. ej. Panadería Rey" />
					<Input label="Web" placeholder="www.ejemplo.com" />
					<Input label="Usuario" prefix="regula.app/" placeholder="ejemplo" />
					<Textarea label="Descripción" placeholder="Unas líneas sobre el negocio…" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalCalendarEventExample() {
	return (
		<Lienzo alto={600}>
			<Modal
				contained
				align="center"
				icon={
					<span className="flex flex-col items-center rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-brand-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)]">
						ENE<span className="text-lg text-primary">10</span>
					</span>
				}
				iconVariant="modern"
				color="gray"
				title="Invitación: revisión de cuentas"
				description="Sara Hervás · viernes, 8 de enero"
				dividers
				width={400}
				footerStart={<Button hierarchy="link-gray">Quizá</Button>}
				actions={
					<>
						<Button hierarchy="secondary">Rechazar</Button>
						<Button>Aceptar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4 text-sm">
					<ul className="m-0 flex list-none flex-col gap-2 p-0 text-tertiary">
						<li className="flex items-center gap-2">
							<Calendar size={16} /> Viernes, 8 de enero
						</li>
						<li className="flex items-center gap-2">
							<Clock size={16} /> 13:30 – 15:30
						</li>
						<li className="flex items-center gap-2">
							<Bell01 size={16} /> 10 minutos antes
						</li>
					</ul>
					<AvatarLabel size="sm" name="Sara Hervás" supporting="Organiza" initials="SH" />
					<AvatarGroup size="sm" items={[...EQUIPO, { initials: "OR" }]} />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalCreateEventExample() {
	return (
		<Lienzo alto={700}>
			<Modal
				contained
				layout="horizontal"
				icon={Calendar}
				color="gray"
				iconVariant="modern"
				title="Nuevo recordatorio"
				description="Elige la fecha y los detalles del recordatorio."
				onClose={cerrar}
				width={600}
				dividers
				footerStart={<Checkbox label="Avisar a la familia" size="sm" defaultChecked />}
				actions={
					<>
						{cancelar}
						<Button>Crear recordatorio</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Input label="Título" required defaultValue="Pagar el seguro del coche" />
					<div className="grid grid-cols-2 gap-4">
						<Input label="Desde" type="date" defaultValue="2027-01-08" />
						<Input label="Hasta" type="date" defaultValue="2027-01-14" />
					</div>
					<Input label="Lugar" icon={<MarkerPin01 size={20} />} placeholder="Añade un lugar" />
					<Textarea label="Descripción" placeholder="Escribe una descripción" />
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Equipo y proyectos ——— */

export function ModalUserSettingsExample() {
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				media={<Dibujo tono="bg-utility-brand-200" alto={110} />}
				title="Sara Hervás"
				description="@sarahervas"
				width={560}
				dividers
				actions={
					<>
						<Button hierarchy="secondary" iconLeading={<Save01 size={20} />}>
							Guardar borrador
						</Button>
						<Button>Publicar cambios</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<Input label="Nombre" defaultValue="Sara" />
						<Input label="Apellidos" defaultValue="Hervás" />
					</div>
					<Input
						label="Correo"
						icon={Mail01}
						defaultValue="sara@regula.app"
						hint="Verificado el 2 de enero de 2027"
					/>
					<Input label="Usuario" prefix="regula.app/@" defaultValue="sarahervas" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalNewProjectExample() {
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				title="Nuevo presupuesto"
				description="Sube una imagen para la portada."
				onClose={cerrar}
				width={480}
				footerStart={<Button hierarchy="link-gray">Guardar borrador</Button>}
				actions={
					<>
						<Button hierarchy="secondary" iconLeading={Calendar}>
							Programar
						</Button>
						<Button>Crear presupuesto</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Dibujo tono="bg-utility-sky-200" alto={140} />
					<div className="grid grid-cols-2 gap-4">
						<Input label="Nombre" defaultValue="Vacaciones" />
						<Select
							label="Equipo"
							defaultValue="casa"
							options={[
								{ value: "casa", label: "Casa" },
								{ value: "negocio", label: "Negocio" },
							]}
						/>
					</div>
					<TagInput
						aria-label="Etiquetas"
						defaultValue={["Viajes", "Verano"]}
						placeholder="Escribe para buscar…"
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalShareProjectExample() {
	const personas = [
		["Sara Hervás", "sara@regula.app", "Propietaria"],
		["Andrés Fole", "andres@regula.app", "Puede editar"],
		["Marta Luis", "marta@regula.app", "Puede editar"],
	];
	return (
		<Lienzo alto={600}>
			<Modal
				contained
				icon={<UserPlus01 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Comparte este presupuesto"
				description="Invita a tu equipo a revisarlo y editarlo."
				onClose={cerrar}
				width={480}
				dividers
				footerStart={
					<Button hierarchy="link-gray" iconLeading={<Code02 size={20} />}>
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
				<div className="flex flex-col gap-4">
					<Input
						label="Cualquiera con el enlace puede editar"
						defaultValue="regula.app/presupuestos/vacaciones"
						readOnly
					/>
					<Input
						aria-label="Buscar personas"
						icon={SearchLg}
						placeholder="Busca por nombre o correo"
					/>
					<ul className="m-0 flex list-none flex-col gap-3 p-0">
						{personas.map(([nombre, correo, rol]) => (
							<li key={nombre} className="flex items-center justify-between gap-3">
								<AvatarLabel
									size="sm"
									name={nombre as string}
									supporting={correo}
									initials={(nombre as string).slice(0, 1)}
								/>
								<span className="text-sm font-semibold text-tertiary">{rol}</span>
							</li>
						))}
					</ul>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalIntegrationExample() {
	return (
		<Lienzo alto={560}>
			<Modal
				contained
				align="center"
				icon={<Stars02 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Conecta Regula con tu banco"
				description="Importa los movimientos cada día y ten las cuentas al día sin subir extractos."
				onClose={cerrar}
				width={440}
				dividers
				footerStart={
					<Button hierarchy="secondary" iconLeading={<BookOpen01 size={20} />}>
						Documentación
					</Button>
				}
				actions={<Button>Conectar</Button>}
			>
				<div className="flex flex-col gap-3">
					<p className="m-0 text-sm font-semibold text-primary">Regula podrá:</p>
					<ul className="m-0 flex list-none flex-col gap-2 p-0">
						<CheckItem type="line" color="gray" size="sm">
							Leer los movimientos de tus cuentas
						</CheckItem>
						<CheckItem type="line" color="gray" size="sm">
							Leer los saldos
						</CheckItem>
						<CheckItem type="line" color="gray" size="sm">
							Ver los recibos domiciliados
						</CheckItem>
					</ul>
					<Input
						aria-label="Dirección de la conexión"
						defaultValue="regula.app/conexiones/banco"
						readOnly
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

/* ——— Asistente, editor y mensajes ——— */

export function ModalAIAssistantExample() {
	return (
		<Lienzo alto={520}>
			<Modal
				contained
				align="center"
				icon={<Stars02 size={24} />}
				iconVariant="modern"
				color="gray"
				title="Hola, Ana. ¿En qué te ayudo?"
				description="Puedo ordenar tus gastos, preparar un informe o hacer un presupuesto."
				width={480}
			>
				<div className="flex flex-col gap-4 pb-6">
					<div className="flex flex-wrap justify-center gap-2">
						{[
							"Ordena mis gastos",
							"Haz un informe",
							"Prepara un presupuesto",
							"Resume el mes",
						].map((t) => (
							<Badge key={t} size="md" color="gray" type="modern">
								{t}
							</Badge>
						))}
					</div>
					<Textarea aria-label="Pregunta lo que quieras" placeholder="Pregunta lo que quieras…" />
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalTextEditorExample() {
	return (
		<Lienzo alto={640}>
			<Modal
				contained
				icon={<Edit05 size={24} />}
				color="gray"
				iconVariant="modern"
				title="Edita la nota del mes"
				description="Saldrá en el informe de octubre."
				onClose={cerrar}
				width={560}
				footerStart={
					<Button hierarchy="link-gray" iconLeading={<Stars02 size={20} />}>
						Preguntar a la IA
					</Button>
				}
				actions={
					<>
						{cancelar}
						<Button>Guardar cambios</Button>
					</>
				}
			>
				<TextEditor
					aria-label="Nota del mes"
					defaultValue="<p>Este mes hemos gastado <strong>un 12 % menos</strong> en el súper.</p><p>Toca revisar los seguros.</p>"
					minHeight={200}
				/>
			</Modal>
		</Lienzo>
	);
}

function MensajeNuevo({ lleno }: { lleno?: boolean }) {
	return (
		<Lienzo alto={560}>
			<Modal
				contained
				title="Mensaje nuevo"
				onClose={cerrar}
				width={600}
				dividers
				footerStart={<AvatarLabel size="xs" name="Ana Martín" initials="AM" />}
				actions={
					<>
						<Button hierarchy="secondary">Enviar más tarde</Button>
						<Button>Enviar</Button>
					</>
				}
			>
				<div className="flex flex-col gap-3">
					<TagInput
						aria-label="Para"
						defaultValue={lleno ? ["marta@regula.app", "andres@regula.app"] : []}
						placeholder="Para"
					/>
					<Input
						aria-label="Asunto"
						placeholder="Asunto"
						defaultValue={lleno ? "Cuentas del tercer trimestre" : undefined}
					/>
					<Textarea
						aria-label="Mensaje"
						placeholder="Escribe aquí…"
						defaultValue={
							lleno
								? "Hola a todos:\n\nOs dejo el resumen del trimestre. Si veis algo raro, decidme.\n\nGracias,\nAna"
								: undefined
						}
					/>
				</div>
			</Modal>
		</Lienzo>
	);
}

export function ModalNewMessageEmptyStateExample() {
	return <MensajeNuevo />;
}

export function ModalNewMessageFilledExample() {
	return <MensajeNuevo lleno />;
}
