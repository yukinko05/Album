export default function LoginPage () {
    return(
        <div>
            <div>
                <label htmlFor="email">メールアドレス</label>
                <input type="text" name="email" id="email"/>
            </div>

            <div>
                <label htmlFor="password">パスワード</label>
                <input type="password" name="password" id="password"/>
            </div>

            <button>新規登録する</button>
        </div>
    )
}