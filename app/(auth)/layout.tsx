"use client";

import Header from "@/components/Header";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="pt-16">{children}</main>
		</div>
	);
}
