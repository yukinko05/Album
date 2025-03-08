"use client";

import { useContext, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { shareRoomJoin } from "@/services/shareService";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const joinRoomSchema = z.object({
	shareRoomId: z
		.string()
		.min(1, { message: "ルームIDは必須です" })
		.regex(/^[a-zA-Z0-9-]+$/, {
			message: "有効なルームIDを入力してください",
		}),
});

type JoinRoomData = z.infer<typeof joinRoomSchema>;

export default function JoinRoomPage() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<JoinRoomData>({
		resolver: zodResolver(joinRoomSchema),
	});

	const onSubmit: SubmitHandler<JoinRoomData> = async (data) => {
		if (!userId) {
			setError("ログインが必要です");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const joinData = {
				sharedRoomId: data.shareRoomId,
				userId,
			};

			const response = await dispatch(shareRoomJoin(joinData)).unwrap();
			router.push(
				`/rooms/${data.shareRoomId}?sharedRoomTitle=${response.sharedRoomTitle}`,
			);
		} catch (error) {
			console.error("ルーム参加に失敗しました:", error);
			setError(
				"ルームへの参加に失敗しました。IDを確認して再度お試しください。",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-8 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">共有ルームに参加</h1>

			<div className="bg-white rounded-lg shadow-md p-6">
				{error && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label
							htmlFor="shareRoomId"
							className="block text-gray-700 font-medium mb-2"
						>
							ルームID
						</label>
						<input
							type="text"
							id="shareRoomId"
							{...register("shareRoomId")}
							className={`w-full px-3 py-2 border rounded-md ${
								errors.shareRoomId ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="ルームIDを入力"
						/>
						{errors.shareRoomId && (
							<p className="mt-1 text-red-500 text-sm">
								{errors.shareRoomId.message}
							</p>
						)}
					</div>

					<div className="mt-4 text-sm text-gray-600">
						<p>
							参加したいルームのIDを入力してください。ルームIDはルームの作成者から共有されます。
						</p>
					</div>

					<div className="flex justify-end mt-6">
						<button
							type="button"
							onClick={() => router.back()}
							className="px-4 py-2 text-gray-600 mr-2"
							disabled={isSubmitting}
						>
							キャンセル
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
							disabled={isSubmitting}
						>
							{isSubmitting ? "参加中..." : "ルームに参加"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
