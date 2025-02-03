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

const NavigationBar = () => {
	const { currentUser } = useContext(authContext);
	const uid = currentUser?.uid;
	return (
		<Navbar position="static" isBordered maxWidth="full">
			<NavbarBrand>
				<Link className="font-bold text-inherit" href="/albums">
					ALBUM
				</Link>
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					{!uid && <Button as={Link} color="primary" href="/signup" variant="flat">
						新規登録
					</Button>}
					<SignOut />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavigationBar;
