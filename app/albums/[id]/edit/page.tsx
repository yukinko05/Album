import AlbumForm from "@/components/AlbumForm/AlbumForm";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function EditAlbumPage({ params,
}: { params: { id: string } }) {
  const uid = useSelector((state: RootState) => state.user.data?.uid);
  const album = useSelector((state: RootState) => state.albums.albums);
  const albumId = params.id;

  if (!uid) {
    alert("ユーザーIDが取得できません。ログインしてください。");
    return;
  };

  const onSubmit = async () => {
    // TODO:データを更新するを呼び出す
  }

  return (
    <div>
      <AlbumForm
        onSubmit={onSubmit}
        formTitle="アルバム編集"
        submitButtonText="更新"
      />
    </div>
  )
}