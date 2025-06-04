"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useShareStore } from "@/stores/shareStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { SubmitButton } from "@/components/common/Button/SubmitButton";

const shareRoomSchema = z.object({
	sharedRoomTitle: z
		.string()
		.min(1, { message: "ルーム名は必須です" })
		.max(50, { message: "ルーム名は50文字以内で入力してください" }),
});

type ShareRoomData = z.infer<typeof shareRoomSchema>;

export default function CreateRoomPage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const router = useRouter();
	const createShareRoom = useShareStore((state) => state.createShareRoom);
	const status = useShareStore((state) => state.status);
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

			const response = await createShareRoom(shareRoomData);
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
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				<h1 className="text-2xl font-medium text-orange-800 flex items-center">
					<UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
					新しい共有ルームを作成
				</h1>
			</div>

			<div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
				{error && (
					<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-6">
						<label
							htmlFor="sharedRoomTitle"
							className="block text-orange-800 font-medium mb-2"
						>
							ルーム名
						</label>
						<input
							type="text"
							id="sharedRoomTitle"
							{...register("sharedRoomTitle")}
							className={`w-full px-4 py-2 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${
								errors.sharedRoomTitle
									? "border-red-500 focus:ring-red-200"
									: "border-amber-200 focus:ring-orange-200"
							}`}
							placeholder="家族アルバム"
						/>
						{errors.sharedRoomTitle && (
							<p className="mt-2 text-red-500 text-sm">
								{errors.sharedRoomTitle.message}
							</p>
						)}
					</div>

					<div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-orange-700 mb-6">
						<p>
							ルーム名を入力して共有ルームを作成してください。
							<br />
							作成後はルームからIDを確認して他のユーザーに共有してください。
						</p>
					</div>

					<div className="flex justify-between mt-8 pt-4 border-t border-amber-200">
						<CancelButton
							onClick={() => router.back()}
							disabled={isSubmitting || status === "loading"}
						/>
						<SubmitButton
							type="submit"
							disabled={isSubmitting || status === "loading"}
							isLoading={isSubmitting || status === "loading"}
							icon={
								<PlusCircleIcon
									className="text-white h-5 w-5"
									aria-hidden="true"
								/>
							}
						>
							ルームを作成
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
}
