import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Link from "next/link";
import { Album } from "@/types/type";
import axiosInstance from "@/api/axiosInstance";

export default async function Albums() {
  const albums: Album[] = await axiosInstance
    .get("/albums")
    .then((res) => res.data)
    .catch((error) => {
      console.error("Fetchに失敗しました: ", error);
    });

  return (
    <div>
      <NavigationBar />
      <div className={styles.wrap}>
        {albums.map((album) => (
          <Link href={`/albums/${album.id}`} key={album.id}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{album.title}</h2>
              <time className={styles.cardDate}>{album.createdAt}</time>
              <img
                className={styles.cardImg}
                src={album.coverImg}
                alt={album.title}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
