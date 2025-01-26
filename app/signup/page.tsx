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
import Compressor from 'compressorjs';
import { useState } from 'react';

const userSchema = z.object({
	userName: z.string().min(1, "ニックネームは必須です"),
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
			}, error: (error) => {
				console.error(error.message);
			}
		})
	};

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		const userInputData = {
			...data,
			iconImg
		}
		try {
			await dispatch(signUpUser(userInputData)).unwrap();
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
							{...register("userName")}
							className={errors.userName ? styles.inputError : styles.input}
							type="text"
						/>
						{errors.userName && (
							<span className={styles.errorMessage}>
								{errors.userName.message}
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
					<div className={styles.inputWrap}>
						<label htmlFor="iconImg" className={styles.label}>
							プロフィール写真をアップロード
						</label>
						<input type="file"
							id="iconImg"
							name="iconImg"
							accept=".jpg, .jpeg, .png"
							onChange={handleChangeFile}
						/>
						{iconImg && (
							<img
								className={styles.viewImg}
								src={iconImg}
								alt="選択中のカバー写真"
							/>
						)}
					</div>
					<button className={styles.button}>新規登録する</button>
				</form>
			</div>
		</div>
	);
}
