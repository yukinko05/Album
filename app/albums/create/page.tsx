"use client";

import { SubmitHandler } from "react-hook-form";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
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
				userId: uid,
			};

			const docRef = await addDoc(collection(db, "albums"), documentData);

			router.push("/albums");
		} catch (error) {
			console.error(error);
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
