"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createShareRoom } from "@/services/shareService";

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
			await dispatch(
				createShareRoom({
					userId,
					sharedRoomTitle: data.sharedRoomTitle,
				}),
			);
		} catch (error) {
			console.error("共有ルームの作成に失敗しました:", error);
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
					/>
					{errors.sharedRoomTitle && (
						<span>{errors.sharedRoomTitle.message}</span>
					)}
				</div>
				<Button type="submit" color="primary">
					作成する
				</Button>
			</form>
		</div>
	);
}
