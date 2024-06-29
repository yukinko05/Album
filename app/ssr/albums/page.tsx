import {AlbumsProps} from "@/types/type";
import React from "react";
import Link from "next/link";
import styles from "./styles.module.css"

const Albums: React.FC<AlbumsProps> = ({albums, basePath}) => {
    return (
        <div>
            {albums.map((album) => (
                <Link href={`${basePath}/albums/${album.id}`} key={album.id}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{album.title}</h2>
                        <time className={styles.cardDate}>{album.createdAt}</time>
                        <img className={styles.cardImg} src={album.coverImg} alt={album.altText}/>

                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Albums;