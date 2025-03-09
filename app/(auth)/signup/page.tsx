"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Compressor from "compressorjs";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";

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

		if (e.target.files === null || !file) {
			return;
		}

		let quality;

		if (file.size > 5 * 1024 * 1024) {
			quality = 0.4;
		} else if (file.size < 2 * 1024 * 1024) {
			quality = 0.6;
		} else {
			quality = 0.8;
		}

		new Compressor(file, {
			quality,
			success: (compressedFile) => {
				const reader = new FileReader();
				reader.readAsDataURL(compressedFile);

				reader.onloadend = (evt) => {
					if (evt.target !== null) {
						setIconImg(evt.target.result as string);
					}
				};
			},
			error: (error) => {
				console.error(error.message);
			},
		});
	};

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		const userInputData = {
			...data,
			iconImg,
		};
		try {
			await signUp(userInputData);
			router.push("/dashboard");
		} catch (error) {
			console.error("SignUp failed:", error);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md"
			>
				<h1 className="text-2xl font-bold mb-6 text-center">ALBUM</h1>
				{errorMessage && (
					<p className="text-red-600 text-sm mt-2">{errorMessage}</p>
				)}
				<div className="mb-6">
					<label className="block mb-2 font-medium" htmlFor="name">
						ニックネーム
					</label>
					<input
						{...register("userName")}
						className={`w-full p-3 border rounded-md ${
							errors.userName ? "border-red-600" : "border-gray-200"
						}`}
						type="text"
					/>
					{errors.userName && (
						<span className="text-red-600 text-sm mt-2">
							{errors.userName.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label className="block mb-2 font-medium" htmlFor="email">
						メールアドレス
					</label>
					<input
						{...register("email")}
						className={`w-full p-3 border rounded-md ${
							errors.email ? "border-red-600" : "border-gray-200"
						}`}
						type="text"
					/>
					{errors.email && (
						<span className="text-red-600 text-sm mt-2">
							{errors.email.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label className="block mb-2 font-medium" htmlFor="password">
						パスワード
					</label>
					<input
						{...register("password")}
						className={`w-full p-3 border rounded-md ${
							errors.password ? "border-red-600" : "border-gray-200"
						}`}
						type="password"
					/>
					{errors.password && (
						<span className="text-red-600 text-sm mt-2">
							{errors.password.message}
						</span>
					)}

					<label
						className="block mb-2 font-medium mt-4"
						htmlFor="passwordConfirmation"
					>
						パスワード確認
					</label>
					<input
						{...register("passwordConfirmation")}
						className={`w-full p-3 border rounded-md ${
							errors.passwordConfirmation ? "border-red-600" : "border-gray-200"
						}`}
						type="password"
					/>
					{errors.passwordConfirmation && (
						<span className="text-red-600 text-sm mt-2">
							{errors.passwordConfirmation.message}
						</span>
					)}
				</div>
				<div className="mb-6">
					<label htmlFor="iconImg" className="block mb-2 font-medium">
						プロフィール写真をアップロード
					</label>
					<input
						type="file"
						id="iconImg"
						name="iconImg"
						accept=".jpg, .jpeg, .png"
						onChange={handleChangeFile}
					/>
					{iconImg && (
						<Image
							src={iconImg}
							alt="選択中のカバー写真"
							width={100}
							height={100}
							className="max-w-full h-auto mt-2 rounded-md"
						/>
					)}
				</div>
				<button
					type="submit"
					className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
					disabled={status === "loading"}
				>
					{status === "loading" ? "登録中..." : "新規登録する"}
				</button>
			</form>
		</div>
	);
}
