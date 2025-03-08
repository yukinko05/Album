"use client";

import { useContext, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { createShareRoom } from "@/services/shareService";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const shareRoomSchema = z.object({
	sharedRoomTitle: z
		.string()
		.min(1, { message: "ルーム名は必須です" })
		.max(50, { message: "ルーム名は50文字以内で入力してください" }),
});

type ShareRoomData = z.infer<typeof shareRoomSchema>;

export default function CreateRoomPage() {
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
	} = useForm<ShareRoomData>({
		resolver: zodResolver(shareRoomSchema),
	});

	const onSubmit: SubmitHandler<ShareRoomData> = async (data) => {
		if (!userId) {
			setError("ログインが必要です");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const shareRoomData = {
				sharedRoomTitle: data.sharedRoomTitle,
				userId,
			};

			const response = await dispatch(createShareRoom(shareRoomData)).unwrap();
			const roomId = response.shareId;
			router.push(`/rooms/${roomId}?sharedRoomTitle=${data.sharedRoomTitle}`);
		} catch (error) {
			console.error("ルーム作成に失敗しました:", error);
			setError("ルームの作成に失敗しました。もう一度お試しください。");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-8 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">新しい共有ルームを作成</h1>

			<div className="bg-white rounded-lg shadow-md p-6">
				{error && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label
							htmlFor="sharedRoomTitle"
							className="block text-gray-700 font-medium mb-2"
						>
							ルーム名
						</label>
						<input
							type="text"
							id="sharedRoomTitle"
							{...register("sharedRoomTitle")}
							className={`w-full px-3 py-2 border rounded-md ${errors.sharedRoomTitle ? "border-red-500" : "border-gray-300"
								}`}
							placeholder="家族アルバム"
						/>
						{errors.sharedRoomTitle && (
							<p className="mt-1 text-red-500 text-sm">
								{errors.sharedRoomTitle.message}
							</p>
						)}
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
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
							disabled={isSubmitting}
						>
							{isSubmitting ? "作成中..." : "ルームを作成"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
