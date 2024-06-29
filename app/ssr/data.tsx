import {Album} from "@/types/type";
import Albums from "@/app/ssr/albums/page";

export default async function Data() {
    const albumsData: Album[] = await fetch("http://localhost:3000/albums").then(
        res => res.json());
    console.log(albumsData);
    return (
        <Albums albums={albumsData} basePath="/ssr"/>
    )
}