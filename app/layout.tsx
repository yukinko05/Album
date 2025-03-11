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
		<html lang="ja">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
