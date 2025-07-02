"use client";

import { useEffect, useRef, useState } from "react";
import {
	ArrowUpTrayIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "@/components/common/Button/Button";
import { CircleCancelButton } from "@/components/common/Button/CircleCancelButton";

type ImageUploaderProps = {
	onFileSelect: (files: File[]) => void;
	isLoading?: boolean;
	status?: "idle" | "loading" | "error";
	showPreview?: boolean;
	multiple?: boolean;
	className?: string;
};

export default function ImageUploader({
	onFileSelect,
	isLoading = false,
	status = "idle",
	showPreview = true,
	multiple = true,
	className = "",
}: ImageUploaderProps) {
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropRef = useRef<HTMLDivElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const filesArray = Array.from(e.target.files);
			onFileSelect(filesArray);

			if (showPreview) {
				// プレビュー用のURL生成
				const urls = filesArray.map((file) => URL.createObjectURL(file));
				setPreviewUrls((prev) => [...prev, ...urls]);
			}
		}
	};

	// プレビューからファイルを削除
	const removePreview = (index: number) => {
		URL.revokeObjectURL(previewUrls[index]);
		const newUrls = [...previewUrls];
		newUrls.splice(index, 1);
		setPreviewUrls(newUrls);
	};

	//プレビュー用のURLを破棄する
	useEffect(() => {
		return () => {
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [previewUrls]);

	//ドラッグアンドドロップの処理
	useEffect(() => {
		const dropArea = dropRef.current;
		if (!dropArea) return;

		const handleDragEnter = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(true);
		};

		const handleDragLeave = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer?.files.length) {
				const filesArray = Array.from(e.dataTransfer.files);
				const validFiles = multiple ? filesArray : [filesArray[0]];
				onFileSelect(validFiles);

				if (showPreview) {
					const urls = validFiles.map((file) => URL.createObjectURL(file));
					setPreviewUrls((prev) => [...prev, ...urls]);
				}
			}
		};

		const preventDefaults = (e: Event) => {
			e.preventDefault();
		};

		["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
			dropArea.addEventListener(event, preventDefaults, false),
		);
		dropArea.addEventListener("dragenter", handleDragEnter, false);
		dropArea.addEventListener("dragleave", handleDragLeave, false);
		dropArea.addEventListener("drop", handleDrop, false);

		return () => {
			["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
				dropArea.removeEventListener(event, preventDefaults, false),
			);
			dropArea.removeEventListener("dragenter", handleDragEnter);
			dropArea.removeEventListener("dragleave", handleDragLeave);
			dropArea.removeEventListener("drop", handleDrop);
		};
	}, [multiple, onFileSelect, showPreview]);

	//ペースト処理
	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			const imageFiles: File[] = [];

			Array.from(items).forEach((item) => {
				if (item.type.startsWith("image")) {
					const file = item.getAsFile();
					if (file) imageFiles.push(file);
				}
			});

			if (imageFiles.length > 0) {
				const validFiles = multiple ? imageFiles : [imageFiles[0]];
				onFileSelect(validFiles);

				if (showPreview) {
					const urls = validFiles.map((file) => URL.createObjectURL(file));
					setPreviewUrls((prev) => [...prev, ...urls]);
				}
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [multiple, onFileSelect, showPreview]);

	return (
		<div className={`w-full ${className}`}>
			{previewUrls.length === 0 ? (
				<div
					ref={dropRef}
					className={`relative border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center ${
						isDragging
							? "border-orange-400 bg-orange-100"
							: "border-amber-200 bg-amber-50"
					}`}
				>
					<PhotoIcon
						className="h-5 w-5 text-orange-300 mb-4"
						aria-hidden="true"
					/>
					<p className="text-orange-800 mb-4 text-center">
						写真をドラッグ&ドロップするか、ファイルを選択してください
					</p>
					<p className="text-orange-600 text-sm mb-6 text-center">
						写真をここにペーストすることもできます
					</p>
					<Button onClick={() => fileInputRef.current?.click()}>
						<ArrowUpTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
						写真を選択する
					</Button>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						multiple={multiple}
						className="hidden"
						disabled={isLoading || status === "loading"}
					/>
				</div>
			) : (
				<div className="p-5 bg-white rounded-lg border border-amber-200 shadow-sm">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center">
							<span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-3">
								<PhotoIcon className="h-5 w-5" aria-hidden="true" />
							</span>
							<span className="text-orange-800 font-medium">
								{previewUrls.length}枚の写真が選択されています
							</span>
						</div>
						<Button size={"sm"} onClick={() => fileInputRef.current?.click()}>
							<ArrowUpTrayIcon className="h-5 w-5 mr-1" aria-hidden="true" />
							追加
						</Button>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{previewUrls.map((url, index) => (
							<div
								key={index}
								className="relative aspect-square rounded-lg overflow-hidden border border-amber-100 group hover:shadow-md transition-all"
							>
								<div className="relative w-full h-full">
									<Image
										src={url}
										alt={`選択した写真 ${index + 1}`}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
										className="object-cover"
									/>
									<CircleCancelButton
										onClick={() => removePreview(index)}
										aria-label="削除"
										size="sm"
										className="absolute top-2 right-2 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<XMarkIcon className="h-5 w-5" aria-hidden="true" />
									</CircleCancelButton>
								</div>
							</div>
						))}
					</div>

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						multiple={multiple}
						className="hidden"
						disabled={isLoading || status === "loading"}
					/>
				</div>
			)}
		</div>
	);
}
