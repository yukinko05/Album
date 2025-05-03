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
					<h1 className="text-4xl font-bold text-orange-800 font-cherry">
						ALBUM
					</h1>
				</div>
				<div className="flex-1 text-center">
					{children && (
						<h1 className="text-2xl font-bold text-gray-700">{children}</h1>
					)}
				</div>
				<nav>
					{!isAuthenticated && (
						<div className="flex gap-4">
							<Link
								href="/login"
								className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
							>
								ログイン
							</Link>
							<Link
								href="/signup"
								className="px-4 py-2 text-sm bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 font-medium rounded-md transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
							>
								新規登録
							</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
