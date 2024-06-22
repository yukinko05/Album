import {Button, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const NavigationBar = () => {
    return(
        <Navbar position="static" isBordered maxWidth="full">
            <NavbarBrand>
                <Link className="font-bold text-inherit" href="/albums">ALBUM</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="/login" variant="flat">
                        Login
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}


export default NavigationBar;