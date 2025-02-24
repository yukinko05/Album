"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { shareRoomJoin } from "@/services/shareService";
import { useRouter } from "next/navigation";

const FORM_VALIDATION = {
	MIN_LENGTH: 1,
	ERROR_MESSAGE: "IDを入力してください",
} as const;

const schema = zod.object({
	sharedRoomId: zod.string().min(FORM_VALIDATION.MIN_LENGTH, {
		message: FORM_VALIDATION.ERROR_MESSAGE,
	}),
});

type FormFields = zod.infer<typeof schema>;

export default function ShareRoomJoinForm() {
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

	const handleShareRoomJoin: SubmitHandler<FormFields> = async (data) => {
		if (!data || !userId) return;

		try {
			const response = await dispatch(
				shareRoomJoin({
					userId,
					sharedRoomId: data.sharedRoomId,
				}),
			).unwrap();

			router.push(
				`/albumShareRoom/${response.shareId}?sharedRoomTitle=${response.sharedRoomTitle}`,
			);
		} catch (error) {
			console.error("ルームの参加に失敗しました:", error);
			throw new Error(
				"共有ルームの参加に失敗しました。もう一度お試しください。",
			);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(handleShareRoomJoin)}>
				<h1>シェアルームに参加</h1>
				<div>
					<label htmlFor="sharedRoomId">シェアルームID</label>
					<input id="sharedRoomId" {...register("sharedRoomId")} type="text" />
					{errors.sharedRoomId && <span>{errors.sharedRoomId.message}</span>}
				</div>
				<Button type="submit" color="primary">
					参加する
				</Button>
			</form>
		</div>
	);
}
