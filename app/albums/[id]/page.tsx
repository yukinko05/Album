"use client"
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import React, {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/spinner";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import styles from "./page.module.css";
import {setPhotos} from "@/features/photos/photosSlice";


export default function AlbumPhotosPage({params}: { params: { id: string } }) {
    const photos = useSelector((state: RootState) => state.photos.photos);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch(`http://localhost:3000/albums/${params.id}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             dispatch(setAlbums(data));
    //         })
    //         .catch((error) => {
    //             console.log("Fetchに失敗しました: ", error)
    //         })
    // }, [])

    useEffect(() => {
        fetch(`http://localhost:3000/photos?albumId=${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                dispatch(setPhotos(data));
                setLoading(false);
            })
            .catch((error) => {
                console.log("Fetchに失敗しました: ", error);
                setLoading(false);
            })
    }, []);

    return (
        <div>
            <NavigationBar/>
            {loading ?
                <div className={styles.loading}><Spinner/></div> :
                <div className={styles.warp}>
                    {photos.map((photo) => (
                        <img className={styles.photo} src={photo.url} alt={photo.altText} key={photo.id}/>
                    ))}
                </div>
            }
        </div>
    )
}