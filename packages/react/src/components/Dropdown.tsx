"use client";

import { isValidElement, type ReactElement, type ReactNode, useState } from "react";
import {
	Input as AriaInput,
	Autocomplete,
	Header,
	Menu,
	MenuItem,
	MenuSection,
	MenuTrigger,
	Popover,
	Pressable,
	SearchField,
	Separator,
	useFilter,
} from "react-aria-components";
import { cx } from "../internal/cx.js";
import { MENU_PANEL, MenuItemContent, menuItemClasses } from "../internal/menu-item.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Avatar, type AvatarStatus } from "./Avatar.js";
import { Button } from "./Button.js";
import { Icon, type IconName } from "./Icon.js";

export interface DropdownAction {
	icon?: IconName | ReactNode;
	label: ReactNode;
	/** Atajo de teclado que se muestra a la derecha (solo texto; no lo registra). */
	shortcut?: string;
	/** Acción destructiva: va al final, tras un separador. */
	danger?: boolean;
	onSelect?: () => void;
	/**
	 * Identifica la opción en un menú con elección (`selectedValue`): con él se marca y se avisa en `onSelectionChange`.
	 * Cada opción de un menú con elección necesita el suyo.
	 */
	value?: string;
	/** Texto para la búsqueda por teclado (y para `searchable`) si `label` no es texto. */
	textValue?: string;
}

/**
 * Lo que va en la lista: una acción, un separador, un título de grupo (`heading`, no se puede elegir) o el sitio donde
 * va la lista de cuentas (`accounts`). Sin ese marcador, la lista de cuentas va al final.
 */
export type DropdownItem = DropdownAction | { divider: true } | { heading: ReactNode } | { accounts: true };

/** Una cuenta de la lista de cuentas de las variantes `account-*`. */
export interface DropdownAccount {
	value: string;
	name: string;
	email?: string;
	/** URL de la foto. Sin ella, las iniciales o el icono de usuario. */
	avatar?: string;
	initials?: string;
	status?: AvatarStatus;
}

export type DropdownVariant =
	| "default"
	| "integrations"
	| "account-button"
	| "account-avatar"
	| "account-card-xs"
	| "account-card-sm"
	| "account-card-md"
	| "account-breadcrumb";

export interface DropdownProps {
	/**
	 * Texto del botón que abre el menú.
	 * @default "Opciones"
	 */
	label?: ReactNode;
	/** Disparador propio en lugar del botón: un elemento que pase `ref` y props al DOM, como un `Button` solo icono. */
	trigger?: ReactNode;
	/**
	 * `button` (por defecto) o `link`: texto con el chevron, sin caja, como en un campo de «Puede editar».
	 * @default "button"
	 */
	triggerVariant?: "button" | "link";
	/**
	 * Tipo de menú del Figma. `integrations` pinta los logos de `icon` a 20px. Las `account-*` cambian el disparador (el
	 * botón de siempre, el avatar, la tarjeta `xs`, `sm` o `md`, o las migas) y llevan la lista de `accounts`; salvo
	 * `account-button` y `account-avatar`, el disparador muestra la cuenta elegida.
	 * @default "default"
	 */
	variant?: DropdownVariant;
	/** Cabecera del panel, por ejemplo un `AvatarLabel` o el nombre del plan. */
	header?: ReactNode;
	/** Pie del panel, separado por una raya: un texto (versión, copyright) o un botón. */
	footer?: ReactNode;
	/** Cuadro de búsqueda arriba del menú: al escribir solo quedan las opciones cuyo texto lo contiene. */
	searchable?: boolean;
	/** Texto del cuadro de búsqueda. */
	searchPlaceholder?: string;
	/** Texto cuando la búsqueda no encuentra nada. */
	emptyLabel?: string;
	/** Lista de cuentas para cambiar de cuenta (variantes `account-*`). */
	accounts?: DropdownAccount[];
	/** Cuenta elegida (controlado). */
	account?: string;
	/** Cuenta elegida al principio (no controlado). Si falta, la primera. */
	defaultAccount?: string;
	/** Se llama con el `value` de la cuenta elegida. */
	onAccountChange?: (value: string) => void;
	/** Título de la lista de cuentas. */
	accountsLabel?: string;
	/** Con ella, al final de las cuentas sale la fila «Añadir cuenta». */
	onAddAccount?: () => void;
	addAccountLabel?: string;
	/** Abierto (controlado). */
	open?: boolean;
	/** Abierto al principio (no controlado). Así abierto no se lleva el foco ni bloquea la página. */
	defaultOpen?: boolean;
	/** Avisa al abrir y cerrar (ampliación sobre la guía, para el modo controlado). */
	onOpenChange?: (open: boolean) => void;
	items: DropdownItem[];
	/**
	 * Valor de la opción elegida. Con él, el menú es de elección única: la opción elegida lleva un check a la derecha y se
	 * anuncia como opción de radio de menú marcada (`menuitemradio`). Es controlado: cambia cuando cambie este valor.
	 * Sin él, el menú es de acciones, como siempre.
	 */
	selectedValue?: string;
	/** Se llama con el `value` de la opción elegida, que cierra el menú. Solo con `selectedValue`. */
	onSelectionChange?: (value: string) => void;
	/** Nombre del menú para lectores de pantalla. Por defecto, el texto del botón. */
	"aria-label"?: string;
	className?: string;
}

const PANEL = MENU_PANEL;

const isDivider = (item: DropdownItem): item is { divider: true } => "divider" in item;
const isHeading = (item: DropdownItem): item is { heading: ReactNode } => "heading" in item;
const isAccounts = (item: DropdownItem): item is { accounts: true } => "accounts" in item;
const isAction = (item: DropdownItem): item is DropdownAction => "label" in item;

const HEADING = "px-4 pt-1.5 pb-0.5 text-xs font-semibold text-brand-secondary";

/** Marca de radio de una cuenta: círculo vacío, o relleno de marca con punto blanco si es la elegida. */
function RadioMark({ checked }: { checked: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={cx(
				"inline-flex size-4 flex-none items-center justify-center rounded-full",
				checked ? "bg-brand-solid" : "bg-primary shadow-[inset_0_0_0_1px_var(--border-primary)]",
			)}
		>
			{checked ? <span className="size-1.5 rounded-full bg-fg-white" /> : null}
		</span>
	);
}

// Disparadores de las variantes de cuenta con aspecto propio: caja, alto, tamaño del avatar
const ACCOUNT_TRIGGER = {
	"account-avatar": { box: "rounded-full p-0", avatar: "sm", name: false },
	"account-card-xs": {
		box: "h-9 w-38 gap-2 rounded-lg border border-primary bg-primary_alt px-2 shadow-[var(--shadow-xs)]",
		avatar: "xs",
		name: true,
	},
	"account-card-sm": {
		box: "h-11 w-42 gap-2 rounded-lg border border-primary bg-primary_alt px-2 shadow-[var(--shadow-xs)]",
		avatar: "sm",
		name: true,
	},
	"account-card-md": {
		box: "h-14 w-60 gap-2 rounded-lg border border-secondary bg-primary_alt p-2",
		avatar: "md",
		name: true,
	},
	"account-breadcrumb": { box: "h-7 gap-2 rounded-md px-0", avatar: "xs", name: true },
} as const;

/** Menú de acciones que se abre desde un botón. La acción destructiva va al final, tras un separador, con `danger`. */
export function Dropdown({
	label,
	trigger,
	triggerVariant = "button",
	variant = "default",
	header,
	footer,
	searchable,
	searchPlaceholder = defaultStrings.search,
	emptyLabel = defaultStrings.noResults,
	accounts,
	account: accountProp,
	defaultAccount,
	onAccountChange,
	accountsLabel = defaultStrings.switchAccount,
	onAddAccount,
	addAccountLabel = defaultStrings.addAccount,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	items,
	selectedValue,
	onSelectionChange,
	className,
	...rest
}: DropdownProps) {
	const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
	// Abierto por el usuario: menú modal con el foco dentro, y React Aria lo devuelve al disparador al cerrar.
	// Abierto de inicio (defaultOpen): sin foco ni bloqueo de la página.
	const [byUser, setByUser] = useState(false);
	const [search, setSearch] = useState("");
	const { contains } = useFilter({ sensitivity: "base" });
	const [currentAccount, setCurrentAccount] = useControllable<string | undefined>(
		accountProp,
		defaultAccount ?? accounts?.[0]?.value,
	);
	const inline = open && !byUser;
	const current = accounts?.find((a) => a.value === currentAccount) ?? accounts?.[0];
	const menuLabel =
		rest["aria-label"] ?? (typeof label === "string" ? label : (current?.name ?? defaultStrings.options));
	// Menú de elección única: solo si hay `selectedValue`. Sin él, ni selección ni cambios en las opciones.
	const choosing = selectedValue !== undefined;
	const integrations = variant === "integrations";
	const breadcrumb = variant === "account-breadcrumb";

	const chooseAccount = (value: string) => {
		setCurrentAccount(value);
		onAccountChange?.(value);
	};

	const renderAction = (item: DropdownAction, i: number) => (
		<MenuItem
			key={i}
			id={choosing ? (item.value ?? `item-${i}`) : i}
			textValue={item.textValue ?? (typeof item.label === "string" ? item.label : undefined)}
			onAction={() => item.onSelect?.()}
			className={menuItemClasses(item.danger)}
		>
			{({ isSelected }) => (
				<MenuItemContent
					// Los logos de integraciones son nodos de 20px dentro de la caja de 16px del icono
					icon={
						integrations && item.icon && typeof item.icon !== "string" ? (
							<span className="flex size-4 flex-none items-center justify-center [&>*]:size-5 [&>*]:shrink-0">
								{item.icon}
							</span>
						) : (
							item.icon
						)
					}
					label={item.label}
					shortcut={item.shortcut}
					checked={choosing && isSelected}
				/>
			)}
		</MenuItem>
	);

	const accountsSection = accounts?.length ? (
		<MenuSection
			key="accounts"
			aria-label={accountsLabel}
			selectionMode="single"
			disallowEmptySelection
			selectedKeys={current ? [`account:${current.value}`] : []}
			onSelectionChange={(keys) => {
				const [key] = keys === "all" ? [] : keys;
				if (key !== undefined) chooseAccount(String(key).slice("account:".length));
			}}
		>
			<Header className={HEADING}>{accountsLabel}</Header>
			{accounts.map((a) => (
				<MenuItem
					key={a.value}
					id={`account:${a.value}`}
					textValue={a.name}
					className={cx(menuItemClasses(), breadcrumb && "py-2")}
				>
					{({ isSelected }) => (
						<>
							<span aria-hidden="true" className="flex flex-none">
								<Avatar
									size={breadcrumb ? "md" : "xs"}
									src={a.avatar}
									initials={a.initials}
									status={breadcrumb ? undefined : a.status}
									className={cx(!breadcrumb && "-my-1 -ml-1 size-5")}
								/>
							</span>
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate">{a.name}</span>
								{breadcrumb && a.email ? (
									<span className="truncate text-sm font-normal text-tertiary">
										{a.email}
									</span>
								) : null}
							</span>
							<RadioMark checked={isSelected} />
						</>
					)}
				</MenuItem>
			))}
		</MenuSection>
	) : null;
	const addAccountRow =
		accounts?.length && onAddAccount ? (
			<MenuItem
				key="account-add"
				id="account:add"
				textValue={addAccountLabel}
				onAction={onAddAccount}
				className={menuItemClasses()}
			>
				<MenuItemContent icon="plus" label={addAccountLabel} />
			</MenuItem>
		) : null;

	// La lista se parte en tramos por los títulos: cada título abre un grupo con su nombre para lectores
	const rendered: ReactNode[] = [];
	let group: { heading: ReactNode; key: string; nodes: ReactNode[] } | null = null;
	const flush = () => {
		if (!group) return;
		rendered.push(
			<MenuSection
				key={group.key}
				aria-label={typeof group.heading === "string" ? group.heading : undefined}
			>
				<Header className={HEADING}>{group.heading}</Header>
				{group.nodes}
			</MenuSection>,
		);
		group = null;
	};
	let accountsPlaced = false;
	items.forEach((item, i) => {
		if (isDivider(item)) {
			flush();
			rendered.push(
				<Separator
					// biome-ignore lint/suspicious/noArrayIndexKey: los separadores no tienen otra identidad
					key={`sep-${i}`}
					className="my-1 h-px border-0 bg-[var(--border-secondary)]"
				/>,
			);
		} else if (isHeading(item)) {
			flush();
			group = { heading: item.heading, key: `head-${i}`, nodes: [] };
		} else if (isAccounts(item)) {
			flush();
			accountsPlaced = true;
			rendered.push(accountsSection, addAccountRow);
		} else if (isAction(item)) {
			const node = renderAction(item, i);
			if (group) group.nodes.push(node);
			else rendered.push(node);
		}
	});
	flush();
	if (!accountsPlaced && accountsSection) {
		if (rendered.length > 0) {
			rendered.push(
				<Separator key="sep-accounts" className="my-1 h-px border-0 bg-[var(--border-secondary)]" />,
			);
		}
		rendered.push(accountsSection, addAccountRow);
	}

	const menu = (
		<Menu
			aria-label={menuLabel}
			{...(byUser ? {} : { autoFocus: false })}
			// En línea, fuera de MenuTrigger, nada lo cierra al elegir: se cierra aquí
			onAction={inline ? () => setOpen(false) : undefined}
			{...(searchable
				? {
						renderEmptyState: () => (
							<div className="px-4 py-3 text-sm text-tertiary">{emptyLabel}</div>
						),
					}
				: {})}
			{...(choosing
				? {
						selectionMode: "single" as const,
						disallowEmptySelection: true,
						selectedKeys: [selectedValue],
						onSelectionChange: (keys) => {
							const [key] = keys === "all" ? [] : keys;
							if (key !== undefined) onSelectionChange?.(String(key));
						},
					}
				: {})}
			className="outline-none"
		>
			{rendered}
		</Menu>
	);

	const panel = (
		<>
			{header ? (
				<div className="mb-1 flex items-center gap-3 px-4 py-3 shadow-[inset_0_-1px_0_var(--border-secondary)]">
					{header}
				</div>
			) : null}
			{searchable ? (
				<Autocomplete filter={contains} inputValue={search} onInputChange={setSearch}>
					<SearchField
						aria-label={searchPlaceholder}
						autoFocus={byUser}
						className="mb-1 flex items-center gap-2 px-3 pt-2 pb-3 shadow-[inset_0_-1px_0_var(--border-secondary)]"
					>
						<span className="flex h-9 w-full items-center gap-2 rounded-lg bg-primary pr-2 pl-3 text-fg-quaternary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-brand),var(--focus-ring-shadow)]">
							<Icon name="search-lg" size={16} />
							<AriaInput
								placeholder={searchPlaceholder}
								className="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-sm text-primary outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
							/>
						</span>
					</SearchField>
					{menu}
				</Autocomplete>
			) : (
				menu
			)}
			{footer ? (
				<div className="-mb-1 mt-1 flex items-center justify-between gap-3 px-4 py-3 font-body text-sm text-quaternary shadow-[inset_0_1px_0_var(--border-secondary)]">
					{footer}
				</div>
			) : null}
		</>
	);

	const panelClass = cx(PANEL, integrations && "min-w-54");

	// Disparador: el propio, el de la variante de cuenta o el botón de siempre
	const accountStyle =
		variant in ACCOUNT_TRIGGER ? ACCOUNT_TRIGGER[variant as keyof typeof ACCOUNT_TRIGGER] : null;
	const defaultTrigger = accountStyle ? (
		<button
			type="button"
			className={cx(
				"inline-flex shrink-0 cursor-pointer items-center border-0 bg-transparent text-left font-body outline-none focus-visible:shadow-focus-ring",
				accountStyle.box,
			)}
		>
			<span aria-hidden="true" className="flex flex-none">
				<Avatar
					size={accountStyle.avatar}
					src={current?.avatar}
					initials={current?.initials}
					status={current?.status}
				/>
			</span>
			{accountStyle.name ? null : <span className="sr-only">{menuLabel}</span>}
			{accountStyle.name ? (
				variant === "account-card-md" ? (
					<span className="flex min-w-0 flex-1 flex-col leading-5">
						<span className="truncate text-sm font-semibold text-primary">{current?.name}</span>
						<span className="truncate text-sm font-normal text-tertiary">{current?.email}</span>
					</span>
				) : (
					<span className="min-w-0 flex-1 truncate text-sm font-semibold text-secondary">
						{current?.name}
					</span>
				)
			) : null}
			{accountStyle.name ? (
				<Icon
					name={
						variant === "account-card-md" || breadcrumb
							? "chevron-selector-vertical"
							: "chevron-down"
					}
					size={16}
					className="flex-none text-fg-quaternary"
				/>
			) : null}
		</button>
	) : triggerVariant === "link" ? (
		<button
			type="button"
			className="inline-flex cursor-pointer items-center gap-1 rounded-sm border-0 bg-transparent p-0 font-body text-sm font-semibold text-secondary outline-none hover:text-secondary_hover focus-visible:shadow-focus-ring"
		>
			{label ?? defaultStrings.options}
			<Icon name="chevron-down" size={16} className="text-fg-quaternary" />
		</button>
	) : (
		<Button hierarchy="secondary" iconTrailing="chevron-down">
			{label ?? defaultStrings.options}
		</Button>
	);

	return (
		<div className={cx("relative inline-block", className)}>
			<MenuTrigger
				// Abierto de inicio, el panel va en línea fuera de MenuTrigger y para React Aria está cerrado. Dentro, cada
				// MenuItem recibiría las props del disparador (su id, aria-controls…) y el HTML de servidor repetiría el id
				// del botón en cada opción.
				isOpen={open && byUser}
				onOpenChange={(next) => {
					// Con el menú en línea abierto, el botón lo cierra (MenuTrigger solo abriría el popover)
					if (next && inline) {
						setOpen(false);
						return;
					}
					setByUser(next);
					setOpen(next);
					if (!next) setSearch("");
				}}
			>
				<Pressable>
					{trigger && isValidElement(trigger) ? (trigger as ReactElement) : defaultTrigger}
				</Pressable>
				<Popover placement="bottom start" offset={4} className={cx("z-30", panelClass)}>
					{panel}
				</Popover>
			</MenuTrigger>
			{inline ? (
				// Abierto de inicio (vista previa): el panel va en línea bajo el botón, como en la guía. Un popover
				// flotante se daría la vuelta, se recortaría a la ventana y se cerraría al desplazar la página.
				<div className={cx("absolute top-[calc(100%+4px)] left-0 z-30", panelClass)}>{panel}</div>
			) : null}
		</div>
	);
}
