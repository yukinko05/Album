"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { createShareRoom } from "@/services/shareService";
import { useRouter } from "next/navigation";

const FORM_VALIDATION = {
	MIN_LENGTH: 1,
	ERROR_MESSAGE: "タイトルを入力してください",
} as const;

const schema = zod.object({
	sharedRoomTitle: zod.string().min(FORM_VALIDATION.MIN_LENGTH, {
		message: FORM_VALIDATION.ERROR_MESSAGE,
	}),
});

type FormFields = zod.infer<typeof schema>;

export default function CreateShareRoomForm() {
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const router = useRouter();

	if (!userId) {
		return <div>ログインが必要です</div>;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
	});

	const handleCreateShareRoom: SubmitHandler<FormFields> = async (data) => {
		if (!data || !userId) return;

		try {
			const response = await dispatch(
				createShareRoom({
					userId,
					sharedRoomTitle: data.sharedRoomTitle,
				}),
			).unwrap();

			const shareRoomId = response.shareId;
			router.push(
				`/albumShareRoom/${shareRoomId}?sharedRoomTitle=${data.sharedRoomTitle}`,
			);
		} catch (error) {
			console.error("共有ルームの作成に失敗しました:", error);
			throw new Error(
				"共有ルームの作成に失敗しました。もう一度お試しください。",
			);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(handleCreateShareRoom)}>
				<h1>シェアルーム作成</h1>
				<div>
					<label htmlFor="sharedRoomTitle">シェアルーム名</label>
					<input
						id="sharedRoomTitle"
						{...register("sharedRoomTitle")}
						type="text"
						aria-describedby="sharedRoomTitle-error"
					/>
					{errors.sharedRoomTitle && (
						<span id="sharedRoomTitle-error">
							{errors.sharedRoomTitle.message}
						</span>
					)}
				</div>
				<Button type="submit" color="primary">
					作成する
				</Button>
			</form>
		</div>
	);
}
