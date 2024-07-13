"use client"

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import {SubmitHandler, useForm} from "react-hook-form";


type Inputs = {
    email: string;
    password: string;
}
export default function LoginPage() {
    const {register, handleSubmit, formState: {errors},} = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
    };

    return (
        <div>
            <NavigationBar/>

            <div className={styles.wrap}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.loginForm}
                >
                    <h1 className={styles.title}>ALBUM</h1>
                    <div className={styles.inputWrap}>
                        <label className={styles.label} htmlFor="email">メールアドレス</label>
                        <input
                            {...register("email", {
                                required: "メールアドレスは必須です。",
                                pattern: {
                                    value:
                                        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                                    message: "不適切なメールアドレスです。",
                                },
                            })}
                            className={styles.input}
                            type="text"
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.inputWrap}>
                        <label className={styles.label} htmlFor="password">パスワード</label>
                        <input
                            {...register("password", {
                                required: "パスワードを入力してください。",
                                minLength: {
                                    value: 6,
                                    message: "6文字以上入力してください。"
                                }
                            })}
                            className={styles.input}
                            type="password"
                        />
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <button className={styles.button}>新規登録する</button>
                </form>
            </div>
        </div>
    )
}