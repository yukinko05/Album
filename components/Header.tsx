import Link from "next/link";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";

interface HeaderProps {
	children?: ReactNode;
	currentUser?: User | null;
	isAuthenticated?: boolean;
}

const Header = ({
	children,
	currentUser,
	isAuthenticated = false,
}: HeaderProps) => {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white">
			<div className="flex h-full items-center justify-center px-4">
				<div className="absolute left-4">
					<Link
						href="/dashboard"
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
						{!isAuthenticated && (
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
