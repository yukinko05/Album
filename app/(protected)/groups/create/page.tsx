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

const sharegroupSchema = z.object({
	sharedgroupTitle: z
		.string()
		.min(1, { message: "グループ名は必須です" })
		.max(50, { message: "グループ名は50文字以内で入力してください" }),
});

type SharegroupData = z.infer<typeof sharegroupSchema>;

export default function CreategroupPage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const router = useRouter();
	const createSharegroup = useShareStore((state) => state.createSharegroup);
	const status = useShareStore((state) => state.status);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SharegroupData>({
		resolver: zodResolver(sharegroupSchema),
	});

	const onSubmit: SubmitHandler<SharegroupData> = async (data) => {
		if (!userId) {
			setError("ログインが必要です");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const sharegroupData = {
				sharedgroupTitle: data.sharedgroupTitle,
				userId,
			};

			const response = await createSharegroup(sharegroupData);
			const groupId = response.shareId;
			router.push(
				`/groups/${groupId}?sharedgroupTitle=${data.sharedgroupTitle}`,
			);
		} catch (error) {
			console.error("グループ作成に失敗しました:", error);
			setError("グループの作成に失敗しました。もう一度お試しください。");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				<h1 className="text-2xl font-medium text-orange-800 flex items-center">
					<UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
					新しいグループを作成
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
							htmlFor="sharedgroupTitle"
							className="block text-orange-800 font-medium mb-2"
						>
							グループ名
						</label>
						<input
							type="text"
							id="sharedgroupTitle"
							{...register("sharedgroupTitle")}
							className={`w-full px-4 py-2 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${errors.sharedgroupTitle
									? "border-red-500 focus:ring-red-200"
									: "border-amber-200 focus:ring-orange-200"
								}`}
							placeholder="家族"
						/>
						{errors.sharedgroupTitle && (
							<p className="mt-2 text-red-500 text-sm">
								{errors.sharedgroupTitle.message}
							</p>
						)}
					</div>

					<div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-orange-700 mb-6">
						<p>
							グループ名を入力してください。
							<br />
							作成後はグループからIDを確認して他のユーザーに共有してください。
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
							グループを作成
						</SubmitButton>
					</div>
				</form>
			</div>
		</div>
	);
}
