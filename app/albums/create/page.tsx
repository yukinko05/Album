"use client";

import styles from "./styles.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type Inputs = {
	title: string;
};

const schema = zod.object({
	title: zod.string().min(1, { message: "タイトルを入力してください" }),
});

export default function CreatePage() {
	const [inputCoverImg, setInputCoverImg] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<Inputs>({ resolver: zodResolver(schema) });

	const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files === null) {
			return;
		}

		const reader = new FileReader();

		reader.onloadend = (evt) => {
			if (evt.target !== null) {
				setInputCoverImg(evt.target.result as string);
			}
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const createdAt = dayjs().format("YYYY-MM-DD");

		if (!data.title || inputCoverImg === null) {
			return;
		}

		const newAlbum = {
			title: data.title,
			createdAt,
			coverImg: inputCoverImg,
			altText: "",
		};

		try {
			const response = await axiosInstance.post("/albums", newAlbum);
			router.push("/albums");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<NavigationBar />
			<div className={styles.wrap}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
					<h1 className={styles.title}>NEW ALBUM</h1>
					<div className={styles.inputWrap}>
						<label className={styles.label} htmlFor="title">
							アルバム名
						</label>
						<input
							{...register("title")}
							className={errors.title ? styles.inputError : styles.input}
							type="text"
						/>
						{errors.title && (
							<span className={styles.errorMessage}>
								{errors.title.message}
							</span>
						)}
					</div>

					<div className={styles.inputWrap}>
						<label className={styles.label} htmlFor="photo">
							アルバム画像
						</label>
						<input
							type="file"
							id="photo"
							onChange={handleChangeFile}
							accept="image/*"
							className={styles.coverImg}
						/>
						{inputCoverImg && (
							<img
								className={styles.viewImg}
								src={inputCoverImg}
								alt="選択中のカバー写真"
							/>
						)}
					</div>

					<Button
						type="submit"
						isDisabled={!getValues("title") && !inputCoverImg}
						className={styles.button}
					>
						送信
					</Button>
				</form>
			</div>
		</div>
	);
}
