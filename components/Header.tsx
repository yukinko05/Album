import Link from "next/link";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import type { ReactNode } from "react";

const Header = ({ children }: { children?: ReactNode }) => {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;

	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-20 border-b bg-white">
			<div className="flex h-full items-center px-4">
				<div className="absolute left-4">
					<Link
						href="/albums"
						className="text-3xl font-bold text-gray-900 hover:text-gray-500 transition-colors"
					>
						ALBUM
					</Link>
				</div>
				<div className="flex-1 text-center">
					{children && (
						<h1 className="text-2xl font-bold text-gray-700">{children}</h1>
					)}
				</div>
				<div className="absolute right-4">
					<nav>
						{!userId && (
							<Link
								href="/login"
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
							>
								ログイン
							</Link>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
