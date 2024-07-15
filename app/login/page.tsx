"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

type Inputs = {
	email: string;
	password: string;
};

const schema = zod.object({
	email: zod
		.string()
		.min(1, { message: "メールアドレスは必須です" })
		.email({ message: "メールアドレスの形式で入力してください" }),
	password: zod.string().min(8, { message: "8文字以上で入力してください" }),
});

export default function LoginPage() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({ resolver: zodResolver(schema) });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await createUserWithEmailAndPassword(auth, data.email, data.password)
			.then((userCrendential) => {
				const user = userCrendential.user;
				router.push("/albums");
			})
			.catch((error) => {
				if (error.code === "auth/email-already-in-use") {
					alert("このメールアドレスはすでに使用されています。");
				} else {
					alert(error.message);
				}
			});
	};

	return (
		<div>
			<NavigationBar />

			<div className={styles.wrap}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
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
