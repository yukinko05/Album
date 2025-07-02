"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import { compressImageToBase64 } from "@/utils/imageCompressor";
import Link from "next/link";

const userSchema = z
	.object({
		userName: z.string().min(1, "ニックネームは必須です"),
		email: z
			.string()
			.min(1, { message: "メールアドレスは必須です" })
			.email({ message: "メールアドレスの形式で入力してください" }),
		password: z
			.string()
			.min(8, { message: "8文字以上で入力してください" })
			.regex(/^[a-zA-Z0-9]+$/, {
				message: "英大文字、英小文字、数字で入力してください",
			}),
		passwordConfirmation: z
			.string()
			.min(1, { message: "確認用パスワードを入力してください" }),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "パスワードが一致しません。入力し直してください。",
		path: ["passwordConfirmation"],
	});

export type UserData = z.infer<typeof userSchema>;

export default function SignupPage() {
	const router = useRouter();
	const signUp = useUserStore((state) => state.signUp);
	const status = useUserStore((state) => state.status);
	const error = useUserStore((state) => state.error);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [iconImg, setIconImg] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		compressImageToBase64(file)
			.then((base64Image) => {
				setIconImg(base64Image);
			})
			.catch((error) => {
				console.error("画像の圧縮に失敗しました:", error);
			});
	};

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		const userInputData = {
			...data,
			iconImg,
		};
		try {
			await signUp(userInputData);
			router.push("/groups");
		} catch (error) {
			console.error("SignUp failed:", error);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-b from-amber-100 to-orange-200">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md border border-amber-200"
			>
				<h1 className="text-2xl font-bold mb-6 text-center text-orange-800">
					新規登録
				</h1>
				{errorMessage && (
					<p className="text-red-500 text-sm mt-2">{errorMessage}</p>
				)}
				<div className="mb-6">
					<label
						className="block mb-2 font-medium text-orange-900"
						htmlFor="name"
					>
						ニックネーム
					</label>
					<input
						{...register("userName")}
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.userName ? "border-red-500" : "border-amber-200"
						}`}
						type="text"
					/>
					{errors.userName && (
						<span className="text-red-500 text-sm mt-2">
							{errors.userName.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label
						className="block mb-2 font-medium text-orange-900"
						htmlFor="email"
					>
						メールアドレス
					</label>
					<input
						{...register("email")}
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.email ? "border-red-500" : "border-amber-200"
						}`}
						type="text"
					/>
					{errors.email && (
						<span className="text-red-500 text-sm mt-2">
							{errors.email.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label
						className="block mb-2 font-medium text-orange-900"
						htmlFor="password"
					>
						パスワード
					</label>
					<input
						{...register("password")}
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.password ? "border-red-500" : "border-amber-200"
						}`}
						type="password"
					/>
					{errors.password && (
						<span className="text-red-500 text-sm mt-2">
							{errors.password.message}
						</span>
					)}

					<label
						className="block mb-2 font-medium mt-4 text-orange-900"
						htmlFor="passwordConfirmation"
					>
						パスワード確認
					</label>
					<input
						{...register("passwordConfirmation")}
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.passwordConfirmation
								? "border-red-500"
								: "border-amber-200"
						}`}
						type="password"
					/>
					{errors.passwordConfirmation && (
						<span className="text-red-500 text-sm mt-2">
							{errors.passwordConfirmation.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label
						htmlFor="iconImg"
						className="block mb-2 font-medium text-orange-900"
					>
						プロフィール写真をアップロード
					</label>
					<input
						type="file"
						id="iconImg"
						name="iconImg"
						accept=".jpg, .jpeg, .png"
						onChange={handleChangeFile}
						className="opacity-0 w-0 h-0"
					/>
					<label
						htmlFor="iconImg"
						className="cursor-pointer bg-orange-100 text-orange-800 px-4 py-2 rounded-lg shadow hover:bg-orange-200 inline-block text-center"
					>
						ファイルを選択
					</label>
					{iconImg && (
						<div className="relative w-24 h-24 mt-2 rounded-lg overflow-hidden border border-amber-200">
							<Image
								src={iconImg}
								alt="選択中のカバー写真"
								fill
								sizes="96px"
								className="object-cover"
							/>
						</div>
					)}
				</div>
				<button
					type="submit"
					className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:opacity-50"
					disabled={status === "loading"}
				>
					{status === "loading" ? "登録中..." : "登録する"}
				</button>
				<Link
					href="/login"
					className="text-sm text-orange-900 block text-end mt-4 hover:text-orange-600 hover:underline"
				>
					ログインはこちら
				</Link>
			</form>
		</div>
	);
}
