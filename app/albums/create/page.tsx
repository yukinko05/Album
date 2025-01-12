"use client";

import { SubmitHandler } from "react-hook-form";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Inputs = {
	title: string;
	coverImg: string | null;
};

export default function CreatePage() {
	const uid = useSelector((state: RootState) => state.user.user.uid);
	const router = useRouter();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const documentData: any = {
				coverImg: data.coverImg,
				createdAt: serverTimestamp(),
				title: data.title,
			};

			const albumId = crypto.randomUUID();
			const albumRef = doc(db, "users", uid, "albums", albumId);

			await setDoc(albumRef, documentData);
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
