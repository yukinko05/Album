"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

	//画像ファイルを読み込む処理
	const handleFile = useCallback((file: File) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			setImageUrl(reader.result as string);
		};
		reader.readAsDataURL(file);
	}, []);

	//ドラッグアンドドロップの処理
	useEffect(() => {
		const dropArea = dropRef.current;
		if (!dropArea) return;

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (e.dataTransfer?.files.length) {
				handleFile(e.dataTransfer.files[0]);
			}
		};

		const preventDefaults = (e: Event) => {
			e.preventDefault();
		};

		["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
			dropArea.addEventListener(event, preventDefaults, false),
		);
		dropArea.addEventListener("drop", handleDrop, false);

		return () => {
			["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
				dropArea.removeEventListener(event, preventDefaults, false),
			);
			dropArea.removeEventListener("drop", handleDrop);
		};
	}, [handleFile]);

	//ペースト処理
	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			Array.from(items).forEach((item) => {
				if (item.type.startsWith("image")) {
					const file = item.getAsFile();
					if (file) handleFile(file);
				}
			});
		};

		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [handleFile]);

	return <div></div>;
}
