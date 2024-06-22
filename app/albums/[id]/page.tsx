"use client"
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import React, {useEffect, useState} from "react";

type Album = {
    id: string,
    title: string,
    createdAt: string,
    coverImg: string
    altText: string
}
export default function AlbumPhotosPage({params}: { params: { id: string } }) {
    const [album, setAlbum] = useState<Album | null>(null);

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

    return (
        <div>
            <NavigationBar/>
            {album && <h1>{album.title}</h1>}
        </div>
    )
}