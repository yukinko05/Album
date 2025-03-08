"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { AuthProvider } from "@/features/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<AuthProvider>{children}</AuthProvider>
		</Provider>
	);
}
