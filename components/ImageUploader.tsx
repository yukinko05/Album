"use client";

import { useEffect, useRef, useState } from "react";

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

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
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
		dropArea.addEventListener("drop", handleDrop, false);

		return () => {
			["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
				dropArea.removeEventListener(event, preventDefaults, false),
			);
			dropArea.removeEventListener("drop", handleDrop);
		};
	}, [multiple, onFileSelect, showPreview]);

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
