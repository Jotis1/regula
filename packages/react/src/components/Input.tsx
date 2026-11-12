"use client";

import { AlertCircle, Calendar, Eye, EyeOff } from "@untitledui/icons";
import {
	type ChangeEvent,
	type HTMLInputTypeAttribute,
	type InputHTMLAttributes,
	type MouseEventHandler,
	type ReactNode,
	useId,
	useRef,
	useState,
} from "react";
import { cx } from "../internal/cx.js";
import {
	addonClasses,
	controlClasses,
	describedBy,
	type FieldProps,
	FieldShell,
	type FieldSize,
	fieldPadding,
	fieldSeparator,
	nativeClasses,
} from "../internal/field.js";
import { DynIcon, type IconProp, iconSlot } from "../internal/icon.js";
import { OptionSelect, type SelectOption } from "../internal/option-select.js";
import { defaultStrings } from "../internal/strings.js";

/** Desplegable dentro del campo: prefijo telefónico, divisa… Su valor va aparte del texto. */
export interface InputAddonSelect {
	/** Lista corta de opciones, como en `Select` (texto, o con apoyo, icono, avatar o punto). */
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Nombre accesible del desplegable (p. ej. "Prefijo"). Obligatorio: no tiene etiqueta visible. */
	label: string;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
}

/** Redes de tarjeta que reconoce `type="card"` por el principio del número. */
export type CardNetwork =
	| "visa"
	| "mastercard"
	| "amex"
	| "discover"
	| "diners"
	| "jcb"
	| "unionpay"
	| "maestro";

/** Red de una tarjeta por sus primeros dígitos, o `undefined` si aún no se sabe. */
export function detectCardNetwork(number: string): CardNetwork | undefined {
	const n = number.replace(/\D/g, "");
	if (/^4/.test(n)) return "visa";
	if (/^3[47]/.test(n)) return "amex";
	if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(n)) return "mastercard";
	if (/^35(2[89]|[3-8])/.test(n)) return "jcb";
	if (/^(36|30[0-5]|3095|38|39)/.test(n)) return "diners";
	if (/^(6011|65|64[4-9])/.test(n)) return "discover";
	if (/^62/.test(n)) return "unionpay";
	if (/^(50|5[6-8]|6304|67)/.test(n)) return "maestro";
	return undefined;
}

/** Deja solo los dígitos (hasta 19) y los agrupa de cuatro en cuatro. */
export function formatCardNumber(value: string): string {
	return (
		value
			.replace(/\D/g, "")
			.slice(0, 19)
			.match(/.{1,4}/g)
			?.join(" ") ?? ""
	);
}

/** Botón pegado al campo por la derecha, con el filo compartido (`Trailing button` del Figma). */
export interface InputTrailingButton {
	label: ReactNode;
	/** Icono de 20px delante del texto. */
	icon?: IconProp;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface InputProps
	extends FieldProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "type"> {
	/**
	 * Como el nativo, más `card`: número de tarjeta que agrupa los dígitos de cuatro en cuatro y enseña la red detectada
	 * (`cardLogos`). `datetime-local` pinta fecha y hora con el icono del calendario, y `file` el campo de archivo con el
	 * botón «Elegir archivo».
	 */
	type?: HTMLInputTypeAttribute | "card";
	/**
	 * Logo de cada red para `type="card"`, como un nodo de `@jotis-me/assets/payments`. El paquete no los importa. Sin el de la
	 * red detectada, no se pinta ninguno.
	 */
	cardLogos?: Partial<Record<CardNetwork, ReactNode>>;
	/** Botón detrás del campo, pegado a él (copiar, aplicar…). */
	trailingButton?: InputTrailingButton;
	/** Texto del botón de `type="file"`. Por defecto, «Elegir archivo». */
	chooseFileLabel?: string;
	/** Texto de `type="file"` sin archivo. Por defecto, «Ningún archivo seleccionado». */
	noFileLabel?: string;
	/** Nombre del botón del calendario de `type="datetime-local"`. Por defecto, «Elegir fecha». */
	pickerLabel?: string;
	/**
	 * Alto: `sm` 36 · `md` 40 · `lg` 44. En `md` y `lg` el valor va a 16px para que iOS no haga zoom.
	 * @default "md"
	 */
	size?: FieldSize;
	/** Icono inicial, 20px en `fg-quaternary`. */
	icon?: IconProp;
	/** Icono final, 16px. Con error se sustituye por el de alerta. */
	trailing?: IconProp;
	/** Texto fijo delante del valor (`https://`), en `text-tertiary` y separado por un borde. No forma parte del valor. */
	prefix?: ReactNode;
	/** Desplegable delante del valor, sin separador (prefijo telefónico). */
	leadingSelect?: InputAddonSelect;
	/** Desplegable detrás del valor, sin separador (divisa). */
	trailingSelect?: InputAddonSelect;
	/**
	 * Con `type="password"`, botón para mostrar u ocultar lo escrito.
	 * @default true
	 */
	revealable?: boolean;
	/** Nombres del botón de la contraseña. Por defecto, "Mostrar contraseña" y "Ocultar contraseña". */
	revealLabels?: { show: string; hide: string };
}

function AddonSelect({
	select,
	size,
	position,
	disabled,
}: {
	select: InputAddonSelect;
	size: FieldSize;
	position: "leading" | "trailing";
	disabled?: boolean;
}) {
	const { options, value, defaultValue, onChange, label, name } = select;
	return (
		<OptionSelect
			variant="addon"
			position={position}
			size={size}
			options={options}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
			disabled={disabled}
			aria-label={label}
		/>
	);
}

/** Campo de texto de una línea con etiqueta, pista y error, en tres alturas. */
export function Input({
	label,
	labelAside,
	required,
	hint,
	error,
	size = "md",
	icon,
	trailing,
	prefix,
	leadingSelect,
	trailingSelect,
	revealable = true,
	revealLabels,
	cardLogos,
	trailingButton,
	chooseFileLabel = defaultStrings.chooseFile,
	noFileLabel = defaultStrings.noFileChosen,
	pickerLabel = defaultStrings.pickDate,
	id: givenId,
	className,
	disabled,
	type,
	...rest
}: InputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const inputRef = useRef<HTMLInputElement>(null);
	const [revealed, setRevealed] = useState(false);
	const [cardText, setCardText] = useState(() =>
		formatCardNumber(String(rest.value ?? rest.defaultValue ?? "")),
	);
	const [fileName, setFileName] = useState("");
	const password = type === "password" && revealable;
	const card = type === "card";
	const file = type === "file";
	const dateTime = type === "datetime-local";
	const split =
		prefix != null || leadingSelect != null || trailingSelect != null || trailingButton != null || file;

	// Tarjeta: el valor que se enseña va agrupado y el que recibe quien lo usa, también (`e.target.value`)
	const cardValue = card && rest.value !== undefined ? formatCardNumber(String(rest.value)) : cardText;
	const network = card ? detectCardNetwork(cardValue) : undefined;
	const logo = network ? cardLogos?.[network] : undefined;
	const onCardChange = (e: ChangeEvent<HTMLInputElement>) => {
		const next = formatCardNumber(e.target.value);
		e.target.value = next;
		setCardText(next);
		rest.onChange?.(e);
	};
	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFileName(
			Array.from(e.target.files ?? [])
				.map((f) => f.name)
				.join(", "),
		);
		rest.onChange?.(e);
	};

	const nativeProps = card
		? {
				...rest,
				type: "text" as const,
				inputMode: "numeric" as const,
				autoComplete: rest.autoComplete ?? "cc-number",
				placeholder: rest.placeholder ?? "0000 0000 0000 0000",
				maxLength: 23,
				value: cardValue,
				defaultValue: undefined,
				onChange: onCardChange,
			}
		: file
			? { ...rest, type: "file" as const, onChange: onFileChange }
			: { ...rest, type: password && revealed ? "text" : type };

	const { type: nativeType, ...nativeRest } = nativeProps;

	const leading =
		card && logo ? (
			<span
				aria-hidden="true"
				className="inline-flex h-6 w-[34px] flex-none items-center justify-center overflow-hidden rounded-xs bg-fg-white shadow-[inset_0_0_0_1px_var(--border-secondary)] [&>*]:h-full [&>*]:w-full"
			>
				{logo}
			</span>
		) : dateTime && !icon ? (
			<button
				type="button"
				aria-label={pickerLabel}
				disabled={disabled}
				onClick={() => inputRef.current?.showPicker?.()}
				className="inline-flex flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed"
			>
				<Calendar size={20} />
			</button>
		) : icon ? (
			iconSlot(icon, 20)
		) : null;

	const field = (
		<>
			{file ? null : leading}
			<input
				ref={inputRef}
				id={id}
				type={nativeType}
				required={required}
				disabled={disabled}
				{...describedBy(id, { hint, error })}
				{...nativeRest}
				className={
					file
						? "peer sr-only"
						: cx(
								nativeClasses(size),
								// La fecha y la hora van en el color del texto, y el calendario nativo lo pinta el botón de delante
								dateTime &&
									"[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit]:text-primary",
							)
				}
			/>
			{file ? (
				<span
					className={cx(
						"min-w-0 flex-1 truncate",
						size === "sm" ? "text-sm" : "text-md",
						fileName ? "text-primary" : "text-placeholder",
					)}
				>
					{fileName || noFileLabel}
				</span>
			) : null}
			{error ? (
				<span className="inline-flex text-fg-error-secondary">
					<AlertCircle size={16} />
				</span>
			) : trailing && !password ? (
				<span className="inline-flex">{iconSlot(trailing, 16)}</span>
			) : null}
			{password ? (
				<button
					type="button"
					aria-pressed={revealed}
					aria-label={
						revealed
							? (revealLabels?.hide ?? defaultStrings.hidePassword)
							: (revealLabels?.show ?? defaultStrings.showPassword)
					}
					disabled={disabled}
					onClick={() => setRevealed((r) => !r)}
					className="inline-flex flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 text-fg-quaternary transition-colors duration-100 hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed"
				>
					<DynIcon icon={revealed ? EyeOff : Eye} size={16} />
				</button>
			) : null}
		</>
	);

	// Botón pegado al campo: el del archivo (que abre el selector) o el de `trailingButton`
	const buttonClasses = cx(
		"inline-flex flex-none cursor-pointer items-center gap-1 self-stretch border-0 bg-transparent px-3.5 font-body font-semibold text-secondary outline-none transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-[inset_0_0_0_2px_var(--border-brand)] disabled:cursor-not-allowed",
		size === "sm" ? "text-sm" : "text-sm",
		fieldSeparator,
	);
	const endButton = file ? (
		// El selector lo abre el propio campo nativo (con el teclado, Espacio o Enter): este botón es para el ratón
		<button
			type="button"
			tabIndex={-1}
			aria-hidden="true"
			disabled={disabled}
			onClick={() => inputRef.current?.click()}
			className={buttonClasses}
		>
			{chooseFileLabel}
		</button>
	) : trailingButton ? (
		<button type="button" disabled={disabled} onClick={trailingButton.onClick} className={buttonClasses}>
			{trailingButton.icon ? iconSlot(trailingButton.icon, 20) : null}
			{trailingButton.label}
		</button>
	) : null;

	return (
		<FieldShell
			id={id}
			label={label}
			labelAside={labelAside}
			required={required}
			hint={hint}
			error={error}
			size={size}
			className={className}
		>
			{split ? (
				<div className={controlClasses(size, error, disabled, true)}>
					{leadingSelect ? (
						<AddonSelect
							select={leadingSelect}
							size={size}
							position="leading"
							disabled={disabled}
						/>
					) : null}
					{prefix != null ? <span className={addonClasses(size)}>{prefix}</span> : null}
					<div
						className={cx(
							"flex min-w-0 flex-1 items-center self-stretch",
							fieldPadding(size),
							prefix != null && fieldSeparator,
							leadingSelect && prefix == null && "pl-2.5",
							trailingSelect && "pr-0",
						)}
					>
						{field}
					</div>
					{trailingSelect ? (
						<AddonSelect
							select={trailingSelect}
							size={size}
							position="trailing"
							disabled={disabled}
						/>
					) : null}
					{endButton}
				</div>
			) : (
				<div className={controlClasses(size, error, disabled)}>{field}</div>
			)}
		</FieldShell>
	);
}
