// Puertos de las vistas previas de FeaturedIcon, Spinner, Skeleton, ProgressBar y ProgressCircle.

import { FeaturedIcon, ProgressBar, ProgressCircle, ProgressSteps, Skeleton, Spinner } from "@jotis-me/react";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	HomeLine,
	InfoCircle,
	SearchLg,
	Settings02,
	Stars02,
	User01,
	Users01,
	Zap,
} from "@untitledui/icons";
import { row, stack } from "./actions";

export function FeaturedIconExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<FeaturedIcon icon={Zap} color="brand" size="lg" />
				<FeaturedIcon icon={Settings02} color="gray" size="lg" />
				<FeaturedIcon icon={CheckCircle} color="success" size="lg" />
				<FeaturedIcon icon={AlertTriangle} color="warning" size="lg" />
				<FeaturedIcon icon={AlertCircle} color="error" size="lg" />
			</div>
			<div className={row}>
				<FeaturedIcon icon={SearchLg} variant="modern" size="lg" />
				<FeaturedIcon icon={InfoCircle} variant="outline" size="md" />
				<FeaturedIcon icon={Zap} size="sm" />
				<FeaturedIcon icon={Zap} size="xl" />
			</div>
			{(["gradient", "dark"] as const).map((variant) => (
				<div key={variant} className={row}>
					<FeaturedIcon icon={Zap} variant={variant} color="brand" size="lg" />
					<FeaturedIcon icon={Settings02} variant={variant} color="gray" size="lg" />
					<FeaturedIcon icon={CheckCircle} variant={variant} color="success" size="lg" />
					<FeaturedIcon icon={AlertTriangle} variant={variant} color="warning" size="lg" />
					<FeaturedIcon icon={AlertCircle} variant={variant} color="error" size="lg" />
				</div>
			))}
			<div className={row}>
				<FeaturedIcon icon={CheckCircle} variant="modern-neue" size="sm" />
				<FeaturedIcon icon={CheckCircle} variant="modern-neue" size="md" />
				<FeaturedIcon icon={CheckCircle} variant="modern-neue" size="lg" />
				<FeaturedIcon icon={CheckCircle} variant="modern-neue" size="xl" />
			</div>
		</div>
	);
}

export function SpinnerExample() {
	return (
		<div className="flex flex-col gap-10">
			{(["line-simple", "line-spinner", "dot-circle"] as const).map((variant) => (
				<div key={variant} className={`${row} items-start gap-12`}>
					<Spinner variant={variant} size="sm" label={false} />
					<Spinner variant={variant} size="md" label={false} />
					<Spinner variant={variant} size="lg" label={false} />
					<Spinner
						variant={variant}
						size="xl"
						label={variant === "line-simple" ? "Importando extracto…" : false}
					/>
				</div>
			))}
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
			<div className="max-w-[360px]">
				<ProgressBar value={50} label="top-floating" aria-label="Importación" />
			</div>
			<div className="max-w-[360px]">
				<ProgressBar value={70} label="bottom-floating" aria-label="Copia de seguridad" />
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

const STEPS = [
	{ title: "Tus datos", description: "Nombre y correo", icon: User01 },
	{ title: "Tu empresa", description: "Web y ubicación", icon: HomeLine },
	{ title: "Tu equipo", description: "Empieza a colaborar", icon: Users01 },
	{ title: "Tus redes", description: "Publicación automática", icon: Stars02 },
];

export function ProgressStepsExample() {
	return (
		<div className="flex flex-col gap-10">
			<ProgressSteps aria-label="Alta" steps={STEPS} current={1} />
			<ProgressSteps
				aria-label="Alta con números"
				steps={STEPS}
				current={2}
				marker="number"
				size="sm"
			/>
			<ProgressSteps aria-label="Alta con iconos" steps={STEPS} current={1} marker="featured" />
			<ProgressSteps aria-label="Alta con rayas" steps={STEPS} current={1} type="text-line" />
			<div className="flex flex-wrap items-center gap-x-10 gap-y-4">
				<ProgressSteps aria-label="Alta mínima" steps={STEPS} current={2} type="minimal" />
				<ProgressSteps
					aria-label="Alta mínima con números"
					steps={STEPS}
					current={2}
					type="minimal"
					marker="number"
				/>
				<ProgressSteps aria-label="Alta unida" steps={STEPS} current={1} type="minimal-connected" />
			</div>
			<div className="grid grid-cols-3 gap-8">
				<ProgressSteps aria-label="Alta en columna" steps={STEPS} current={1} type="icons-text" />
				<ProgressSteps
					aria-label="Alta en columna con números"
					steps={STEPS}
					current={1}
					type="icons-centered"
					orientation="vertical"
					marker="number"
					size="sm"
				/>
				<ProgressSteps
					aria-label="Alta en columna con rayas"
					steps={STEPS}
					current={1}
					type="text-line"
					orientation="vertical"
					size="sm"
				/>
			</div>
		</div>
	);
}
