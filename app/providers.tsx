"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
	const initialize = useAuthStore((state) => state.initialize);

	useEffect(() => {
		initialize();
	}, [initialize]);

	return <>{children}</>;
}
