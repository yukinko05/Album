"use client";

import { store } from "@/store/store";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { AuthProvider } from "@/features/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<Provider store={store}>
				<AuthProvider>
					{children}
				</AuthProvider>
			</Provider>
		</NextUIProvider>
	);
}
