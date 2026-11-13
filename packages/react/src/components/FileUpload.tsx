"use client";

import { AlertCircle, CheckCircle, File04, Loading02, Trash01, UploadCloud02 } from "@untitledui/icons";
import { type DragEvent, type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import { formatBytes } from "../internal/format.js";
import { defaultStrings } from "../internal/strings.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { ProgressBar } from "./ProgressBar.js";

export interface UploadFile {
	name: string;
	/** Tamaño en bytes. */
	size?: number;
	/** De 0 a 100. */
	progress?: number;
	status?: "complete" | "error";
	/** Mensaje si `status` es `error`. */
	error?: string;
	/**
	 * Icono del archivo en lugar del genérico: el de su tipo, como `<FileIcon type="pdf" />` de `@untitledui/file-icons`. El
	 * paquete no los importa. Con error se sigue pintando el aviso.
	 */
	icon?: ReactNode;
}

export interface FileUploadLabels {
	upload: string;
	orDrag: string;
	complete: string;
	uploading: string;
	failed: string;
	remove: (name: string) => string;
	progress: (name: string) => string;
}

export interface FileUploadProps {
	/** Formatos aceptados, como en `<input type="file">`: `.csv,.md`, `image/*`. */
	accept?: string;
	multiple?: boolean;
	/** Formatos y tamaño máximo. Dilo siempre antes de que el usuario lo intente. */
	hint?: ReactNode;
	/** Archivos elegidos con clic o soltados. El componente no sube nada. */
	onFiles?: (files: File[]) => void;
	/** Archivos en curso, con el progreso que gestionas tú. */
	files?: UploadFile[];
	onRemove?: (index: number) => void;
	disabled?: boolean;
	/**
	 * Cómo se ve el progreso: `bar` (una barra bajo el nombre, el de siempre) o `fill` (el fondo del elemento se va
	 * llenando y el porcentaje va junto al tamaño), como en el Figma.
	 * @default "bar"
	 */
	progressStyle?: "bar" | "fill";
	/**
	 * Icono de cada archivo cuando el archivo no trae el suyo (`UploadFile.icon`): recibe el archivo y devuelve un nodo,
	 * por ejemplo según su extensión.
	 */
	fileIcon?: (file: UploadFile) => ReactNode;
	/** Textos sustituibles. */
	labels?: Partial<FileUploadLabels>;
	id?: string;
	className?: string;
}

const DEFAULT_LABELS: FileUploadLabels = {
	upload: defaultStrings.upload,
	orDrag: defaultStrings.orDrag,
	complete: defaultStrings.uploadComplete,
	uploading: defaultStrings.uploading,
	failed: defaultStrings.uploadFailed,
	remove: defaultStrings.removeFile,
	progress: defaultStrings.uploadProgress,
};

/** Zona para subir archivos con clic o arrastrando, y lista de archivos con su progreso. */
export function FileUpload({
	accept,
	multiple,
	hint,
	onFiles,
	files = [],
	onRemove,
	disabled,
	progressStyle = "bar",
	fileIcon,
	labels,
	id: givenId,
	className,
}: FileUploadProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const t = { ...DEFAULT_LABELS, ...labels };
	const [dragging, setDragging] = useState(false);
	const take = (list: FileList | null) => {
		if (!disabled && onFiles && list?.length) onFiles(Array.from(list));
	};
	const onDrop = (e: DragEvent) => {
		e.preventDefault();
		setDragging(false);
		take(e.dataTransfer.files);
	};

	return (
		<div className={cx("flex flex-col gap-4 font-body", className)}>
			<label
				htmlFor={id}
				onDragOver={(e) => {
					e.preventDefault();
					if (!disabled) setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={onDrop}
				className={cx(
					"flex cursor-pointer flex-col items-center gap-3 rounded-xl bg-primary px-6 py-4 text-center shadow-[inset_0_0_0_1px_var(--border-secondary)] focus-within:shadow-[inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)]",
					disabled
						? "cursor-not-allowed opacity-50"
						: "hover:shadow-[inset_0_0_0_2px_var(--border-brand)]",
					dragging && "shadow-[inset_0_0_0_2px_var(--border-brand)]",
				)}
				data-dragging={dragging || undefined}
			>
				<input
					id={id}
					type="file"
					accept={accept}
					multiple={multiple}
					disabled={disabled}
					onChange={(e) => {
						take(e.target.files);
						e.target.value = "";
					}}
					className="sr-only"
				/>
				<FeaturedIcon icon={UploadCloud02} variant="modern" size="md" color="gray" />
				<span className="text-sm text-tertiary">
					<span className="font-semibold text-brand-secondary">{t.upload}</span> {t.orDrag}
				</span>
				{hint ? <span className="-mt-2 text-xs text-tertiary">{hint}</span> : null}
			</label>
			{files.length ? (
				<ul className="m-0 flex list-none flex-col gap-3 p-0">
					{files.map((f, i) => {
						const failed = f.status === "error";
						const done = !failed && (f.status === "complete" || (f.progress ?? 0) >= 100);
						const fill = progressStyle === "fill";
						const percent = done ? 100 : Math.round(f.progress ?? 0);
						const own = failed ? null : (f.icon ?? fileIcon?.(f) ?? null);
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: la lista la gestiona el padre por índice (onRemove(index))
								key={i}
								className={cx(
									"relative flex gap-3 rounded-xl bg-primary p-4",
									fill && "overflow-hidden",
									failed
										? "shadow-[inset_0_0_0_2px_var(--border-error_subtle)]"
										: "shadow-[inset_0_0_0_1px_var(--border-secondary)]",
								)}
							>
								{fill && !failed ? (
									<div
										role="progressbar"
										aria-label={t.progress(f.name)}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-valuenow={percent}
										className="absolute top-px bottom-px left-px rounded-l-[11px] bg-secondary transition-[width] duration-200"
										// 1px de margen para no tapar el borde de la tarjeta, que es una sombra interior
										style={{ width: `calc(${percent}% - 2px)` }}
									/>
								) : null}
								{own ? (
									<span className="relative flex size-10 flex-none items-center justify-center [&_svg]:size-10">
										{own}
									</span>
								) : (
									<FeaturedIcon
										icon={failed ? AlertCircle : File04}
										variant="modern"
										size="md"
										color={failed ? "error" : "gray"}
									/>
								)}
								<div
									className={cx(
										"flex min-w-0 flex-1 flex-col gap-1 pr-8",
										fill && "relative",
									)}
								>
									<div className="truncate text-sm font-medium text-secondary">
										{f.name}
									</div>
									<div className="flex items-center gap-1 text-sm text-tertiary [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1">
										{failed ? (
											<span className="text-error-primary">{f.error || t.failed}</span>
										) : fill ? (
											<>
												{formatBytes(f.size ?? 0)}
												<span aria-hidden="true"> | </span>
												{done ? (
													<span className="font-medium text-success-primary">
														<CheckCircle size={14} /> {percent}%
														<span className="sr-only">, {t.complete}</span>
													</span>
												) : (
													<span>
														<UploadCloud02 size={14} /> {percent}%
														<span className="sr-only">, {t.uploading}</span>
													</span>
												)}
											</>
										) : (
											<>
												{formatBytes(f.size ?? 0)}
												<span aria-hidden="true"> | </span>
												{done ? (
													<span className="font-medium text-success-primary">
														<CheckCircle size={14} /> {t.complete}
													</span>
												) : (
													<span>
														<Loading02
															size={14}
															className="animate-spin motion-reduce:animate-none"
														/>{" "}
														{t.uploading}
													</span>
												)}
											</>
										)}
									</div>
									{!done && !failed && !fill ? (
										<ProgressBar
											value={f.progress ?? 0}
											aria-label={t.progress(f.name)}
											className="mt-1"
										/>
									) : null}
								</div>
								<button
									type="button"
									onClick={() => onRemove?.(i)}
									aria-label={t.remove(f.name)}
									className="absolute top-3 right-3 inline-flex cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
								>
									<Trash01 size={16} />
								</button>
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}
