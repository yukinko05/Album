"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setData } from "@/features/user/userSlice";
import { FirebaseError } from "firebase/app";

const userSchema = z.object({
	email: z
		.string()
		.min(1, { message: "メールアドレスは必須です" })
		.email({ message: "メールアドレスの形式で入力してください" }),
	password: z.string().min(8, { message: "8文字以上で入力してください" }),
});

export type UserData = z.infer<typeof userSchema>;

export default function SignupPage() {
	const router = useRouter();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			);
			const user = userCredential.user;
			dispatch(setData({ email: user.email, password: data.password }));
			router.push("/albums");
		} catch (error) {
			if (
				error instanceof FirebaseError &&
				error.code === "auth/email-already-in-use"
			) {
				alert("このメールアドレスはすでに使用されています。");
			} else if (error instanceof Error) {
				alert(error.message);
			} else {
				console.error("予期しないエラー:", error);
			}
		}
	};

	return (
		<div>
			<NavigationBar />

			<div className={styles.wrap}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
					<h1 className={styles.title}>ALBUM</h1>
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
					</div>

					<button className={styles.button}>新規登録する</button>
				</form>
			</div>
		</div>
	);
}
