"use client";

import { SubmitHandler } from "react-hook-form";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { albumRepository } from "@/repositories/albumRepository";
import { AlbumCreateInputs } from "@/types/type";

export default function CreatePage() {
	const uid = useSelector((state: RootState) => state.user.user.uid);
	const router = useRouter();

	const onSubmit: SubmitHandler<AlbumCreateInputs> = async (data) => {
		try {
			albumRepository.createAlbum(data, uid);

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
