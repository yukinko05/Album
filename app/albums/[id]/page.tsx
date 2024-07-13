"use client"
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Spinner} from "@nextui-org/spinner";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import styles from "./page.module.css";
import {setPhotos} from "@/features/photos/photosSlice";
import Image from 'next/image'


export default function AlbumPhotosPage({params}: { params: { id: string } }) {
    const photos = useSelector((state: RootState) => state.photos.photos);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [base64Image, setBase64Image] = useState<string | null>(null);

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

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return
        }

        const reader = new FileReader();

        reader.onloadend = (evt) => {
            if (evt.target !== null) {
                setBase64Image(evt.target.result as string)
            }
        }

        reader.readAsDataURL(e.target.files[0]);
    }

    const handleSubmit = () => {
        const newPhoto = {
            url: base64Image,
            albumId: params.id,
            altText: "",
        }

        fetch("http://localhost:3000/photos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPhoto),
        })
            .catch((error) => console.log(error))
    };

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
            <input
                type="file"
                id="photo"
                onChange={handleChangeFile}
                accept="image/*"
            />
            {base64Image && <img src={base64Image} alt=""/>}
            <button onClick={handleSubmit}>送信</button>
        </div>
    )
}