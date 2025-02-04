"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loginUser } from "@/services/userService";
import type { RootState } from "@/store/store";

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
	const dispatch = useDispatch<AppDispatch>();
	const error = useSelector((state: RootState) => state.user.error);
	const errorMessage = typeof error === "string" ? error : null;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		try {
			await dispatch(loginUser(data)).unwrap();
			router.push("/albums");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div>
			<NavigationBar />
			<div className={styles.wrap}>
				<form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
					<h1 className={styles.title}>ログイン</h1>
					{errorMessage && (
						<p className={styles.errorMessage}>{errorMessage}</p>
					)}
					<div className={styles.inputWrap}>
						<label htmlFor="email" className={styles.label}>
							メールアドレス
						</label>
						<input
							type="text"
							id="email"
							className={styles.input}
							{...register("email")}
						/>
						{errors.email && (
							<span className={styles.errorMessage}>
								{errors.email.message}
							</span>
						)}
					</div>

					<div className={styles.inputWrap}>
						<label htmlFor="password" className={styles.label}>
							パスワード
						</label>
						<input
							type="password"
							className={styles.input}
							{...register("password")}
						/>
						{errors.password && (
							<span className={styles.errorMessage}>
								{errors.password.message}
							</span>
						)}
					</div>

					<button className={styles.button}>ログインする</button>
				</form>
			</div>
		</div>
	);
}
