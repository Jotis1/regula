// Puertos de las vistas previas de FeaturedIcon, Spinner, Skeleton, ProgressBar y ProgressCircle.

import { FeaturedIcon, ProgressBar, ProgressCircle, Skeleton, Spinner } from "@jotis-me/react";
import { row, stack } from "./actions";

export function FeaturedIconExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<FeaturedIcon icon="zap" color="brand" size="lg" />
				<FeaturedIcon icon="settings-02" color="gray" size="lg" />
				<FeaturedIcon icon="check-circle" color="success" size="lg" />
				<FeaturedIcon icon="alert-triangle" color="warning" size="lg" />
				<FeaturedIcon icon="alert-circle" color="error" size="lg" />
			</div>
			<div className={row}>
				<FeaturedIcon icon="search-lg" variant="modern" size="lg" />
				<FeaturedIcon icon="info-circle" variant="outline" size="md" />
				<FeaturedIcon icon="zap" size="sm" />
				<FeaturedIcon icon="zap" size="xl" />
			</div>
		</div>
	);
}

export function SpinnerExample() {
	return (
		<div className={`${row} items-start gap-12`}>
			<Spinner size="sm" label={false} />
			<Spinner size="md" />
			<Spinner size="lg" label="Importando extracto…" />
		</div>
	);
}

export function SkeletonExample() {
	return (
		<div className="flex max-w-[420px] gap-4">
			<Skeleton circle width={40} height={40} />
			<div className="flex-1">
				<Skeleton width="40%" height={14} />
				<div className="h-3" />
				<Skeleton lines={3} />
			</div>
		</div>
	);
}

export function ProgressBarExample() {
	return (
		<div className={stack}>
			<div className="max-w-[360px]">
				<ProgressBar value={62} aria-label="Presupuesto usado" />
			</div>
			<div className="max-w-[360px]">
				<ProgressBar value={30} label="bottom" aria-label="Subida" />
			</div>
		</div>
	);
}

const SIZES = ["xxs", "xs", "sm", "md", "lg"] as const;

export function ProgressCircleExample() {
	return (
		<div className="flex flex-col gap-10">
			{(["circle", "half"] as const).map((shape) => (
				<div key={shape} className="flex flex-wrap items-end gap-x-8 gap-y-6">
					{SIZES.map((size) => (
						<ProgressCircle
							key={size}
							size={size}
							shape={shape}
							value={40}
							label={size === "xxs" ? "Usuarios" : "Usuarios activos"}
						/>
					))}
				</div>
			))}
		</div>
	);
}
