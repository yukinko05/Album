"use client";

import type { AlbumCreateInputs } from "@/types/albumTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import ImageUploader from "@/components/ImageUploader";
import { FiBook } from "react-icons/fi";

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
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			file: undefined,
		},
	});

	const handleFileSelect = (files: File[]) => {
		setSelectedFiles(files);

		// ファイルをFileListに変換するための処理
		if (files.length > 0 && fileInputRef.current) {
			setValue(
				"file",
				{
					item: (index: number) => files[index],
					length: files.length,
					[Symbol.iterator]: function* () {
						for (let i = 0; i < files.length; i++) {
							yield files[i];
						}
					},
				} as unknown as FileList,
				{ shouldValidate: true },
			);
		}
	};

	const handleFormSubmit = (data: FormFields) => {
		setStatus("loading");
		onSubmit(data);
	};

	return (
		<div className="h-[calc(100vh-65px)] flex items-center justify-center">
			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className="w-[560px] rounded-2xl p-12 bg-white flex flex-col gap-4 shadow-md"
			>
				<div className="flex items-center justify-center mb-4 pb-4 border-b border-amber-200">
					<h1 className="text-2xl font-medium text-orange-800 flex items-center">
						<FiBook className="mr-2" size={24} />
						{formTitle}
					</h1>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<label
							className="text-sm font-medium text-orange-800"
							htmlFor="title"
						>
							アルバム名
						</label>
						<input
							{...register("title")}
							className={`w-full px-4 py-2 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${
								errors.title
									? "border-red-500 focus:ring-red-200"
									: "border-amber-200 focus:ring-orange-200"
							}`}
							type="text"
							placeholder="アルバム名を入力してください"
						/>
						{errors.title && (
							<span className="text-red-500 text-xs">
								{errors.title.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-orange-800">
							アルバム画像
						</label>

						{/* 非表示のinput要素（React Hook Formのために必要） */}
						<input
							type="file"
							id="photo"
							ref={(e) => {
								fileInputRef.current = e;
								const { ref } = register("file");
								if (typeof ref === "function") {
									ref(e);
								}
							}}
							className="hidden"
							accept="image/*"
							multiple
						/>

						{/* ImageUploaderコンポーネントの使用 */}
						<ImageUploader
							onFileSelect={handleFileSelect}
							isLoading={status === "loading"}
							status={status}
							showPreview={true}
							multiple={true}
						/>

						{errors.file && (
							<span className="text-red-500 text-xs">
								{errors.file.message}
							</span>
						)}
					</div>
				</div>

				<div className="mt-8 pt-4 border-t border-amber-200">
					<button
						type="submit"
						disabled={status === "loading"}
						className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{status === "loading" ? "処理中..." : submitButtonText}
					</button>
				</div>
			</form>
		</div>
	);
}
