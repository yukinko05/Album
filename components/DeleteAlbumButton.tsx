"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deleteAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";

type Props = {
  albumId: string;
};

export default function AlbumDeleteButton({ albumId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  if (!albumId) return null;

  const handleClick = async () => {
    try {
      await dispatch(deleteAlbum(albumId));
      router.push("/albums");
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      alert("エラーが発生しました。再度お試しください。");
    };
  }

  return (
    <button type="submit" onClick={handleClick}>
      アルバム削除
    </button>
  );
}
