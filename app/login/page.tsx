"use client"

import styles from "./styles.module.css";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUp = async () => {
        setErrorMessage("");

        const supabase = createClient();

        const {error} = await supabase.auth.signUp({
            email,
            password
        })

        if(error){
            setErrorMessage(error.message)
        }
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.loginForm}>
                <h1 className={styles.title}>ALBUM</h1>
                <div className={styles.inputWrap}>
                    <label className={styles.label} htmlFor="email">メールアドレス</label>
                    <input className={styles.input} type="text" name="email" id="email" value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </div>

                <div className={styles.inputWrap}>
                    <label className={styles.label} htmlFor="password">パスワード</label>
                    <input className={styles.input} type="password" name="password" id="password" value={password}
                           onChange={(e) => {
                               setPassword(e.target.value)
                           }}/>
                </div>

                <button className={styles.button} onClick={handleSignUp}>新規登録する</button>

                {errorMessage? <p className={styles.errorMessage}>{errorMessage}</p> : null}
            </div>
        </div>
    )
}