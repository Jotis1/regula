import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Ejemplo Next · jotis.me" };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="es">
			<body className="bg-primary p-8 text-primary antialiased">{children}</body>
		</html>
	);
}
