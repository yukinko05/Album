import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata = {
	title: "ALBUM",
	description: "ユーザー同士でお気に入りのアルバムを共有できるサービスです",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="ja" className="h-full bg-white">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="h-full">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
