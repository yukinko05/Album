"use client"
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import React, {useEffect, useState} from "react";
import {Album, Photos} from "@/types/type";
import Link from "next/link";
import styles from "./page.module.css";


export default function AlbumPhotosPage({params}: { params: { id: string } }) {
    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhoto] = useState<Photos[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/albums/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setAlbum(data)
            })
            .catch((error) => {
                console.log("Fetchに失敗しました: ", error)
            })
    }, [])

    useEffect(() => {

        fetch(`http://localhost:3000/photos?albumId=${params.id}`)
            .then((res) => res.json())
            .then((data) => {
               setPhoto(data)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, []);

    return (
        <div>
            <NavigationBar/>
                <div className={styles.warp}>
                    {photos.map((photo) => (
                        <img className={styles.photo} src={photo.url} alt={photo.altText} key={photo.id}/>
                    ))}
                </div>
        </div>
    )
}