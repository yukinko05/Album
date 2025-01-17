"use client";

import { store } from "@/store/store";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<Provider store={store}>{children}</Provider>
		</NextUIProvider>
	);
}
