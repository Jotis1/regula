// Puerto de la vista previa de AppIcon: familia × variantes y escala de tamaños.

import { AppIcon, type AppName, appIcons } from "@jotis-me/react";
import { Fragment } from "react";

const apps: AppName[] = ["ornatus", "vinculum", "pecunia", "emptor", "regula"];
const cols = [
	["default", "Principal"],
	["solid", "Sólido"],
	["light", "Claro"],
	["mono", "Mono"],
	["maskable", "Maskable"],
] as const;
const cap = "text-xs text-tertiary";

export function AppIconExample() {
	return (
		<div className="text-secondary">
			<h4 className="m-0 mb-3 text-sm leading-[normal] font-semibold text-primary">
				Familia y variantes
			</h4>
			<div className="grid grid-cols-[88px_repeat(5,64px)] items-center justify-items-center gap-x-4 gap-y-3">
				<span />
				{cols.map(([id, label]) => (
					<span key={id} className={cap}>
						{label}
					</span>
				))}
				{apps.map((app) => (
					<Fragment key={app}>
						<span className="justify-self-start text-sm leading-[normal] font-semibold text-primary">
							{appIcons[app].name}
						</span>
						{cols.map(([id]) =>
							id === "maskable" ? (
								<AppIcon key={id} app={app} size={48} shape="square" />
							) : (
								<AppIcon key={id} app={app} size={48} variant={id} />
							),
						)}
					</Fragment>
				))}
			</div>
			<div className="mt-7 flex items-end gap-5">
				{[128, 96, 64, 48, 32, 24, 20, 16].map((s) => (
					<figure key={s} className="m-0 flex flex-col items-center gap-2">
						<AppIcon app="ornatus" size={s} />
						<figcaption className={cap}>{s} px</figcaption>
					</figure>
				))}
			</div>
		</div>
	);
}
