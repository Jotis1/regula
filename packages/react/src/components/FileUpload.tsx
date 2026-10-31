"use client";

import { type DragEvent, type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import { formatBytes } from "../internal/format.js";
import { defaultStrings } from "../internal/strings.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { Icon } from "./Icon.js";
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
				<FeaturedIcon icon="upload-cloud-02" variant="modern" size="md" color="gray" />
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
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: la lista la gestiona el padre por índice (onRemove(index))
								key={i}
								className={cx(
									"relative flex gap-3 rounded-xl bg-primary p-4",
									failed
										? "shadow-[inset_0_0_0_2px_var(--border-error_subtle)]"
										: "shadow-[inset_0_0_0_1px_var(--border-secondary)]",
								)}
							>
								<FeaturedIcon
									icon={failed ? "alert-circle" : "file-04"}
									variant="modern"
									size="md"
									color={failed ? "error" : "gray"}
								/>
								<div className="flex min-w-0 flex-1 flex-col gap-1 pr-8">
									<div className="truncate text-sm font-medium text-secondary">
										{f.name}
									</div>
									<div className="flex items-center gap-1 text-sm text-tertiary [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1">
										{failed ? (
											<span className="text-error-primary">{f.error || t.failed}</span>
										) : (
											<>
												{formatBytes(f.size ?? 0)}
												<span aria-hidden="true"> | </span>
												{done ? (
													<span className="font-medium text-success-primary">
														<Icon name="check-circle" size={14} /> {t.complete}
													</span>
												) : (
													<span>
														<Icon name="loading-02" size={14} spin />{" "}
														{t.uploading}
													</span>
												)}
											</>
										)}
									</div>
									{!done && !failed ? (
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
									<Icon name="trash-01" size={16} />
								</button>
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}
