"use client";

import { useCallback, useState } from "react";

export default function ImageUploader() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	//画像ファイルを読み込む処理
	const handleFile = useCallback((file: File) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			setImageUrl(reader.result as string);
		};
		reader.readAsDataURL(file);
	}, []);

	return <div></div>;
}
