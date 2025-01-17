"use client";

import NavigationBar from "@/components/NavigationBar";
import type { AlbumCreateInputs } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import styles from "./styles.module.css";

type AlbumFormProps = {
	onSubmit: SubmitHandler<AlbumCreateInputs>;
	initialTitle?: string;
	initialCoverImg?: string | null;
	formTitle: string;
	submitButtonText: string;
};

const schema = zod.object({
	title: zod.string().min(1, { message: "タイトルを入力してください" }),
});

export default function AlbumForm({
	initialTitle = "",
	initialCoverImg = null,
	onSubmit,
	formTitle,
	submitButtonText,
}: AlbumFormProps) {
	const [coverImg, setCoverImg] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<AlbumCreateInputs>({
		resolver: zodResolver(schema),
		defaultValues: { title: initialTitle },
	});

	const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files === null) {
			return;
		}

		const reader = new FileReader();

		reader.onloadend = (evt) => {
			if (evt.target !== null) {
				setCoverImg(evt.target.result as string);
			}
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	return (
		<div>
			<NavigationBar />
			<div className={styles.wrap}>
				<form
					onSubmit={handleSubmit((data) => onSubmit({ ...data, coverImg }))}
					className={styles.createForm}
				>
					<h1 className={styles.title}>{formTitle}</h1>
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
						{coverImg && (
							<img
								className={styles.viewImg}
								src={coverImg}
								alt="選択中のカバー写真"
							/>
						)}
					</div>

					<Button
						type="submit"
						isDisabled={!getValues("title") && !coverImg}
						className={styles.button}
					>
						{submitButtonText}
					</Button>
				</form>
			</div>
		</div>
	);
}
