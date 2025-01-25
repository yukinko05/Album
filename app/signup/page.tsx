"use client";

import NavigationBar from "@/components/NavigationBar";
import { signUpUser } from "@/services/userService";
import type { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import styles from "./styles.module.css";
import type { RootState } from "@/store/store";

const userSchema = z.object({
	name: z.string().min(1, "ニックネームは必須です"),
	email: z
		.string()
		.min(1, { message: "メールアドレスは必須です" })
		.email({ message: "メールアドレスの形式で入力してください" }),
	password: z.string().min(8, { message: "8文字以上で入力してください" }).regex(/^[a-zA-Z0-9]+$/, {
		message: '英大文字、英小文字、数字で入力してください',
	}), passwordConfirmation: z.string().min(1, { message: "確認用パスワードを入力してください" })
}).refine((data) => data.password === data.passwordConfirmation, {
	message: 'パスワードが一致しません。入力し直してください。',
	path: ['passwordConfirmation'],
});

export type UserData = z.infer<typeof userSchema>;

export default function SignupPage() {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const error = useSelector((state: RootState) => state.user.error);
	const errorMessage = typeof error === "string" ? error : null;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		try {
			await dispatch(signUpUser(data)).unwrap();
			router.push("/albums");
		} catch (error) {
			console.error("SignUp failed:", error);
		}
	};

	return (
		<div>
			<NavigationBar />
			<div className={styles.wrap}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
					<h1 className={styles.title}>ALBUM</h1>
					{errorMessage && (
						<p className={styles.errorMessage}>{errorMessage}</p>
					)}
					<div className={styles.inputWrap}>
						<label className={styles.label} htmlFor="name">
							ニックネーム
						</label>
						<input
							{...register("name")}
							className={errors.name ? styles.inputError : styles.input}
							type="text"
						/>
						{errors.name && (
							<span className={styles.errorMessage}>
								{errors.name.message}
							</span>
						)}
					</div>
					<div className={styles.inputWrap}>
						<label className={styles.label} htmlFor="email">
							メールアドレス
						</label>
						<input
							{...register("email")}
							className={errors.email ? styles.inputError : styles.input}
							type="text"
						/>
						{errors.email && (
							<span className={styles.errorMessage}>
								{errors.email.message}
							</span>
						)}
					</div>
					<div className={styles.inputWrap}>
						<label className={styles.label} htmlFor="password">
							パスワード
						</label>
						<input
							{...register("password")}
							className={errors.password ? styles.inputError : styles.input}
							type="password"
						/>
						{errors.password && (
							<span className={styles.errorMessage}>
								{errors.password.message}
							</span>
						)}

						<label className={styles.label} htmlFor="passwordConfirmation">
							パスワード確認
						</label>
						<input
							{...register("passwordConfirmation")}
							className={errors.passwordConfirmation ? styles.inputError : styles.input}
							type="password" />
						{errors.passwordConfirmation && (
							<span className={styles.errorMessage}>
								{errors.passwordConfirmation.message}
							</span>
						)}
					</div>
					<button className={styles.button}>新規登録する</button>
				</form>
			</div>
		</div>
	);
}
