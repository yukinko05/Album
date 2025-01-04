"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { setData } from "@/features/user/userSlice";

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
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserData>({ resolver: zodResolver(userSchema) });

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		await signInWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				const user = userCredential.user;
				dispatch(setData({ email: user.email, uid: user.uid }));
				router.push("/albums");
			})
			.catch((error) => {
				alert(
					"入力された情報に誤りがあります。正しいメールアドレスとパスワードを入力してください。",
				);
			});
	};

	return (
		<div>
			<NavigationBar />
			<div className={styles.wrap}>
				<form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
					<h1 className={styles.title}>ログイン</h1>
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
