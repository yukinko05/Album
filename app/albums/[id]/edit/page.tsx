"use client";

import AlbumForm, { FormFields } from "@/components/AlbumForm/AlbumForm";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import type { AlbumUpdateInput } from "@/types/albumTypes";
import { updateAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";

export default function EditAlbumPage({ params }: { params: { id: string } }) {
	// const uid = useSelector((state: RootState) => state.user.data?.uid);
	// const albums = useSelector((state: RootState) => state.albums.albums);
	// const id = params.id;
	// const album = albums.find((album) => album.userId === id);
	// const dispatch = useDispatch<AppDispatch>();
	// const router = useRouter();

	// useEffect(() => {
	//   if (!uid) {
	//     alert("ユーザーIDが取得できません。ログインしてください。");
	//     router.push('/login');
	//   }
	// }, [uid, router]);

	// const onSubmit: SubmitHandler<FormFields> = async (data) => {
	//   try {
	//     const requestData = {
	//       data: {
	//         title: data.title,
	//         coverPhotoUrl: data.coverPhotoUrl,
	//       },
	//       uid,
	//     };
	//     await dispatch(updateAlbum({ data: requestData.data, uid: uid as string, id })).unwrap();
	//     router.push("/albums");
	//   } catch (error) {
	//     console.error(error);
	//   }
	// }

	return (
		<div>
			{/* <AlbumForm
        onSubmit={onSubmit}
        formTitle="アルバム編集"
        submitButtonText="更新"
        initialTitle={album?.title}
        initialCoverPhotoUrl={album?.coverPhotoUrl}
      /> */}
		</div>
	);
}
