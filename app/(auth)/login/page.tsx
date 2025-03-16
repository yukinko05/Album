"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";

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
		<div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-b from-amber-100 to-orange-200">
			<form
				className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md border border-amber-200"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-2xl font-bold mb-6 text-center text-orange-800">
					ログイン
				</h1>
				{errorMessage && (
					<p className="text-red-600 text-sm mt-2">{errorMessage}</p>
				)}
				<div className="mb-6">
					<label
						htmlFor="email"
						className="block mb-2 font-medium text-orange-800"
					>
						メールアドレス
					</label>
					<input
						type="text"
						id="email"
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.email ? "border-red-500" : "border-amber-200"
						}`}
						{...register("email")}
					/>
					{errors.email && (
						<span className="text-red-600 text-sm mt-2">
							{errors.email.message}
						</span>
					)}
				</div>

				<div className="mb-6">
					<label
						htmlFor="password"
						className="block mb-2 font-medium text-orange-800"
					>
						パスワード
					</label>
					<input
						type="password"
						className={`w-full p-3 border rounded-md bg-orange-50 text-orange-900 placeholder-orange-300 ${
							errors.password ? "border-red-500" : "border-amber-200"
						}`}
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
					className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:opacity-50"
					disabled={status === "loading"}
				>
					{status === "loading" ? "ログイン中..." : "ログインする"}
				</button>
				<Link
					href="/signup"
					className="text-sm text-orange-900 block text-end mt-4 hover:text-orange-600 hover:underline"
				>
					新規登録はこちら
				</Link>
			</form>
		</div>
	);
}
