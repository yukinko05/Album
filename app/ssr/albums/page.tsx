import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar";
import Link from "next/link";
import { Album } from "@/types/type";

export default async function Albums() {
  const albums: Album[] = await
    fetch("http://localhost:4000/albums")
      .then((res) => res.json())
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
