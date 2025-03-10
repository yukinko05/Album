"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function SignOut() {
	const [isLoading, setIsLoading] = useState(false);
	const auth = getAuth();
	const router = useRouter();

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			await signOut(auth);
			router.push("/login");
		} catch (error) {
			alert("ログアウトに失敗しました。もう一度お試しください。");
			console.error("Sign out error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleSubmit}
			color="primary"
			variant="flat"
			isLoading={isLoading}
			isDisabled={isLoading}
			className={styles.button}
		>
			{isLoading ? "ログアウト中..." : "ログアウト"}
		</Button>
	);
}
