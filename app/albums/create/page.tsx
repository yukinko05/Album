"use client";

import AlbumForm from "@/components/AlbumForm/AlbumForm";
import type { RootState, AppDispatch } from "@/store/store";
import type { AlbumCreateInputs } from "@/types/type";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createAlbum } from "@/services/albumService";
import { useEffect } from "react";

export default function CreatePage() {
	const uid = useSelector((state: RootState) => state.user.data?.uid);
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!uid) {
			alert("ユーザーIDが取得できません。ログインしてください。");
			router.push('/login');
		}
	}, [uid, router]);

	const onSubmit: SubmitHandler<AlbumCreateInputs> = async (data) => {
		try {
			const albumData = {
				...data,
				id: null,
			};
			await dispatch(createAlbum({ data: albumData, uid: uid as string })).unwrap();
			router.push("/albums");

		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			alert("エラーが発生しました。再度お試しください。");
		}
	};

	return (
		<div>
			<AlbumForm
				onSubmit={onSubmit}
				formTitle="アルバム作成"
				submitButtonText="作成"
			/>
		</div>
	);
}
