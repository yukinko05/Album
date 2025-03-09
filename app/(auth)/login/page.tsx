"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";

const userSchema = z.object({
	email: z
		.string()
		.min(1, { message: "メールアドレスは必須です" })
		.email({ message: "メールアドレスの形式で入力してください" }),
	password: z.string().min(8, { message: "8文字以上で入力してください" }),
});

export type UserData = z.infer<typeof userSchema>;

export default function LoginPage() {
	const router = useRouter();
	const login = useUserStore((state) => state.login);
	const status = useUserStore((state) => state.status);
	const error = useUserStore((state) => state.error);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		try {
			await login(data);
			router.push("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
			setErrorMessage(
				"ログインに失敗しました。メールアドレスかパスワードが間違っています。",
			);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
			<form
				className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
				{errorMessage && (
					<p className="text-red-600 text-sm mt-2">{errorMessage}</p>
				)}
				<div className="mb-6">
					<label htmlFor="email" className="block mb-2 font-medium">
						メールアドレス
					</label>
					<input
						type="text"
						id="email"
						className="w-full p-3 border border-gray-200 rounded-md"
						{...register("email")}
					/>
					{errors.email && (
						<span className="text-red-600 text-sm mt-2">
							{errors.email.message}
						</span>
					)}
				</div>

				<div className="mb-6">
					<label htmlFor="password" className="block mb-2 font-medium">
						パスワード
					</label>
					<input
						type="password"
						className="w-full p-3 border border-gray-200 rounded-md"
						{...register("password")}
					/>
					{errors.password && (
						<span className="text-red-600 text-sm mt-2">
							{errors.password.message}
						</span>
					)}
				</div>

				<button
					type="submit"
					className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
					disabled={status === "loading"}
				>
					{status === "loading" ? "ログイン中..." : "ログインする"}
				</button>
			</form>
		</div>
	);
}
