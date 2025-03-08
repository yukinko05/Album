"use client";

import Header from "@/components/Header";
import type { AlbumCreateInputs } from "@/types/albumTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";

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
		<div className="h-[calc(100vh-65px)] flex items-center justify-center bg-black bg-opacity-70">
			<form
				onSubmit={handleSubmit((data) => onSubmit(data))}
				className="w-[560px] rounded-2xl p-16 bg-white flex flex-col gap-4"
			>
				<h1 className="text-4xl font-bold text-center">{formTitle}</h1>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-700 mt-2" htmlFor="title">
						アルバム名
					</label>
					<input
						{...register("title")}
						className={`bg-gray-200 bg-opacity-20 rounded-2xl h-[42px] px-3 ${
							errors.title ? "outline-red-500" : "outline-gray-900"
						}`}
						type="text"
					/>
					{errors.title && (
						<span className="text-red-500 text-xs">{errors.title.message}</span>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-700 mt-2" htmlFor="photo">
						アルバム画像
					</label>
					<input
						type="file"
						id="photo"
						{...register("file")}
						accept="image/*"
						className="text-xs"
						multiple
					/>
					{coverPhotoUrl && (
						<img
							className="h-[100px] w-[100px]"
							src={coverPhotoUrl}
							alt="選択中のカバー写真"
						/>
					)}
				</div>

				<button
					type="submit"
					className="bg-gray-900 text-white rounded-2xl py-2 mt-1 h-12"
				>
					{submitButtonText}
				</button>
			</form>
		</div>
	);
}
