"use client";

import styles from "./styles.module.css";
import React, {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/spinner";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import Link from "next/link";

type Album = {
    id: string,
    title: string,
    createdAt: string,
    coverImg: string
    altText: string
}

export default function Albums() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:3000/albums")
            .then((res) => res.json())
            .then((data) => {
                setAlbums(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Fetchに失敗しました: ", error)
                setLoading(false);
            })
    }, [])

    return (
        <div>
            <Navbar position="static" isBordered maxWidth="full">
                <NavbarBrand>
                    <p className="font-bold text-inherit">ALBUM</p>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} color="primary" href="/login" variant="flat">
                            Login
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {loading ?
                <div className={styles.loading}><Spinner/></div> :
                <div className={styles.wrap}>
                    {albums.map((album) => (
                        <div className={styles.card} key={album.id}>
                            <h2 className={styles.cardTitle}>{album.title}</h2>
                            <time className={styles.cardDate}>{album.createdAt}</time>
                            <img className={styles.cardImg} src={album.coverImg}
                                 alt={album.altText}/>
                        </div>
                    ))}
                </div>
            }

        </div>
    )
}