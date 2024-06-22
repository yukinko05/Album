"use client";

import styles from "./styles.module.css";
import {useEffect, useState} from "react";

type Album = {
    id: string,
    title: string,
    createdAt: string,
    coverImg: string
    altText: string
}

export default function Albums() {
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/albums")
            .then((res) => res.json())
            .then((data) => {
                setAlbums(data);
            })
            .catch((error) => {
                console.error("Fetchに失敗しました: ",error)
            })
    }, [])

    return (
        <div>
            <h1 className={styles.title}>ALBUM</h1>

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

        </div>
    )
}