"use client";

import Header from "@/components/Header";
import type { AlbumCreateInputs } from "@/types/albumTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import styles from "./styles.module.css";

type AlbumFormProps = {
	onSubmit: SubmitHandler<FormFields>;

	formTitle: string;
	submitButtonText: string;
	defaultValues?: Partial<AlbumCreateInputs>;
};

const schema = zod.object({
	title: zod.string().min(1, { message: "タイトルを入力してください" }),
	file: zod
		.custom<FileList>()
		.refine((value) => value.length > 0, "ファイルを選択してください。"),
});

export type FormFields = zod.infer<typeof schema>;

export default function AlbumForm({
	onSubmit,
	formTitle,
	submitButtonText,
}: AlbumFormProps) {
	const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			file: undefined,
		},
	});

	return (
		<div>
			<Header />
			<div className={styles.wrap}>
				<form
					onSubmit={handleSubmit((data) => onSubmit(data))}
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
							{...register("file")}
							accept="image/*"
							className={styles.coverPhotoUrl}
							multiple
						/>
						{coverPhotoUrl && (
							<img
								className={styles.viewImg}
								src={coverPhotoUrl}
								alt="選択中のカバー写真"
							/>
						)}
					</div>

					<Button type="submit" className={styles.button}>
						{submitButtonText}
					</Button>
				</form>
			</div>
		</div>
	);
}
