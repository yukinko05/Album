"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useShareStore } from "@/stores/shareStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	UsersIcon,
	ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { SubmitButton } from "@/components/common/Button/SubmitButton";

const joingroupSchema = z.object({
	sharegroupId: z
		.string()
		.min(1, { message: "グループIDは必須です" })
		.regex(/^[a-zA-Z0-9-]+$/, {
			message: "有効なグループIDを入力してください",
		}),
});

type JoingroupData = z.infer<typeof joingroupSchema>;

export default function JoingroupPage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const router = useRouter();
	const sharegroupJoin = useShareStore((state) => state.sharegroupJoin);
	const status = useShareStore((state) => state.status);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<JoingroupData>({
		resolver: zodResolver(joingroupSchema),
	});

	const onSubmit: SubmitHandler<JoingroupData> = async (data) => {
		if (!userId) {
			setError("ログインが必要です");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const joinData = {
				sharedgroupId: data.sharegroupId,
				userId,
			};

			const response = await sharegroupJoin(joinData);
			router.push(
				`/groups/${data.sharegroupId}?sharedgroupTitle=${response.sharedgroupTitle}`,
			);
		} catch (error) {
			console.error("グループ参加に失敗しました:", error);
			setError(
				"グループの参加に失敗しました。IDを確認してもう一度お試しください。",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				<h1 className="text-2xl font-medium text-orange-800 flex items-center">
					<UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
					共有グループに参加
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
							htmlFor="sharegroupId"
							className="block text-orange-800 font-medium mb-2"
						>
							グループID
						</label>
						<input
							type="text"
							id="sharegroupId"
							{...register("sharegroupId")}
							className={`w-full px-4 py-2 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${errors.sharegroupId
									? "border-red-500 focus:ring-red-200"
									: "border-amber-200 focus:ring-orange-200"
								}`}
							placeholder="グループIDを入力"
						/>
						{errors.sharegroupId && (
							<p className="mt-2 text-red-500 text-sm">
								{errors.sharegroupId.message}
							</p>
						)}
					</div>
					<div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-orange-700 mb-6">
						<p>
							参加したいグループのIDを入力してください。
							<br />
							グループIDはグループの作成者から共有されます。
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
								<ArrowRightStartOnRectangleIcon
									className="text-white h-5 w-5"
									aria-hidden="true"
								/>
							}
						>
							グループに参加
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
}
