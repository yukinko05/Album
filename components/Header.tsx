import Link from "next/link";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import type { ReactNode } from "react";

const Header = ({ children }: { children?: ReactNode }) => {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;

	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-[150px] border-b bg-white sm:h-24">
			<div className="flex flex-col h-full items-center justify-center sm:flex-row px-4">
				<div className="sm:left-4 my-4 sm:pr-4">
					<Link
						href="/albums"
						className="text-4xl font-bold text-gray-900 hover:text-gray-700 font-cherry"
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
