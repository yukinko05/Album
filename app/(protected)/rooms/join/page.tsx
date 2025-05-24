"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useShareStore } from "@/stores/shareStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	PlusCircleIcon,
	UsersIcon,
	ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { SubmitButton } from "@/components/common/Button/SubmitButton";

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
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const router = useRouter();
	const shareRoomJoin = useShareStore((state) => state.shareRoomJoin);
	const status = useShareStore((state) => state.status);
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

			const response = await shareRoomJoin(joinData);
			router.push(
				`/rooms/${data.shareRoomId}?sharedRoomTitle=${response.sharedRoomTitle}`,
			);
		} catch (error) {
			console.error("ルーム参加に失敗しました:", error);
			setError(
				"ルームの参加に失敗しました。IDを確認してもう一度お試しください。",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				<h1 className="text-2xl font-medium text-orange-800 flex items-center">
					<UsersIcon className="mr-2 size-6" />
					共有ルームに参加
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
							htmlFor="shareRoomId"
							className="block text-orange-800 font-medium mb-2"
						>
							ルームID
						</label>
						<input
							type="text"
							id="shareRoomId"
							{...register("shareRoomId")}
							className={`w-full px-4 py-2 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${
								errors.shareRoomId
									? "border-red-500 focus:ring-red-200"
									: "border-amber-200 focus:ring-orange-200"
							}`}
							placeholder="ルームIDを入力"
						/>
						{errors.shareRoomId && (
							<p className="mt-2 text-red-500 text-sm">
								{errors.shareRoomId.message}
							</p>
						)}
					</div>
					<div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-orange-700 mb-6">
						<p>
							参加したいルームのIDを入力してください。
							<br />
							ルームIDはルームの作成者から共有されます。
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
								<ArrowRightStartOnRectangleIcon className="text-white size-5" />
							}
						>
							ルームに参加
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
}
