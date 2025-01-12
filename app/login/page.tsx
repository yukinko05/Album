"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { setData } from "@/features/user/userSlice";
import { userRepository } from "@/repositories/userRepository";

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
		try {
			const user = await userRepository.loginUser(data);
			dispatch(setData({ email: user.email, uid: user.uid }));
			router.push("/albums");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "ログインに失敗しました。",
			);
		}
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
