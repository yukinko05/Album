import SignOut from "@/app/signout/signout";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import type { ReactNode } from "react";

const NavigationBar = ({ children }: { children?: ReactNode }) => {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;

	return (
		<Navbar position="static" isBordered maxWidth="full">
			<NavbarBrand>
				<Link className="font-bold text-inherit" href="/albums">
					ALBUM
				</Link>
				{children && <h1>{children}</h1>}
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					{userId ? (
						<SignOut />
					) : (
						<Button as={Link} color="primary" href="/login" variant="flat">
							ログイン
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavigationBar;
