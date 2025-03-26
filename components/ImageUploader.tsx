"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ImageUploader() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const dropRef = useRef<HTMLDivElement>(null);

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
