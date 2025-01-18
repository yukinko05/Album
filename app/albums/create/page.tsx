"use client";

import AlbumForm from "@/components/AlbumForm/AlbumForm";
import { albumRepository } from "@/repositories/albumRepository";
import type { RootState } from "@/store/store";
import type { AlbumCreateInputs } from "@/types/type";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";

export default function CreatePage() {
	const uid = useSelector((state: RootState) => state.user.data?.uid);
	const router = useRouter();

	if (!uid) {
		alert("ユーザーIDが取得できません。ログインしてください。");
		return;
	}

	const onSubmit: SubmitHandler<AlbumCreateInputs> = async (data) => {
		try {
			await albumRepository.createAlbum(data, uid);

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
