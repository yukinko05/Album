import styles from "./styles.module.css";

export default function LoginPage() {
    return (
        <div className={styles.wrap}>
            <div className={styles.loginForm}>
                <h1 className={styles.title}>ALBUM</h1>
                <div className={styles.inputWrap}>
                    <label className={styles.label} htmlFor="email">メールアドレス</label>
                    <input className={styles.input} type="text" name="email" id="email"/>
                </div>

                <div className={styles.inputWrap}>
                    <label className={styles.label} htmlFor="password">パスワード</label>
                    <input className={styles.input} type="password" name="password" id="password"/>
                </div>

                <button className={styles.button}>新規登録する</button>
            </div>
        </div>
    )
}