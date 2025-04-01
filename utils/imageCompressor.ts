import Compressor from "compressorjs";

export const FILE_SIZE = {
	TINY: 500 * 1024, // 500KB
	SMALL: 1024 * 1024, // 1MB
	MEDIUM: 2 * 1024 * 1024, // 2MB
};

// ファイルをBase64に変換するユーティリティ関数
export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onloadend = (evt) => {
				if (evt.target?.result) {
					resolve(evt.target.result as string);
				} else {
					reject(new Error("ファイルの変換に失敗しました"));
				}
			};
			reader.onerror = () => {
				reject(new Error("ファイルの読み込みに失敗しました"));
			};
		} catch (error) {
			reject(error);
		}
	});
};

export const compressImageToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		try {
			let quality;

			// 小さいファイルやSVGは圧縮せずに直接Base64に変換
			if (file.size < 50 * 1024 || file.type === "image/svg+xml") {
				return fileToBase64(file).then(resolve).catch(reject);
			}

			// ファイルサイズに基づいて自動的に品質を調整
			if (file.size < FILE_SIZE.TINY) {
				quality = 0.4;
			} else if (file.size < FILE_SIZE.SMALL) {
				quality = 0.6;
			} else {
				quality = 0.8;
			}

			new Compressor(file, {
				quality,
				success: (compressedFile) => {
					const reader = new FileReader();
					reader.readAsDataURL(compressedFile);

					reader.onloadend = (evt) => {
						if (evt.target?.result) {
							resolve(evt.target.result as string);
						} else {
							console.warn(`Base64変換エラー: ${file.name}`);
							// 圧縮後のBase64変換に失敗した場合、元のファイルでリトライ
							fileToBase64(file).then(resolve).catch(reject);
						}
					};

					reader.onerror = () => {
						console.warn(`圧縮ファイルの読み込みエラー: ${file.name}`);
						// 圧縮ファイルの読み込みに失敗した場合、元のファイルでリトライ
						fileToBase64(file).then(resolve).catch(reject);
					};
				},
				error: (err) => {
					console.warn(`圧縮エラー: ${file.name}`, err);
					// 圧縮に失敗した場合、元のファイルでリトライ
					fileToBase64(file).then(resolve).catch(reject);
				},
			});
		} catch (error) {
			console.error(`予期せぬエラー: ${file.name}`, error);
			// 最後の手段として元のファイルを使用
			fileToBase64(file).then(resolve).catch(reject);
		}
	});
};

export const compressMultipleImagesToBase64 = async (
	files: File[],
): Promise<string[]> => {
	try {
		if (!files || files.length === 0) {
			console.warn("ファイルが選択されていません");
			return [];
		}

		// 各ファイルを個別に処理し、エラーが発生しても続行
		const results: string[] = [];
		const errors: { fileName: string; error: any }[] = [];

		for (const file of files) {
			try {
				console.log(`処理開始: ${file.name} (${file.type})`);
				const base64 = await compressImageToBase64(file);
				results.push(base64);
			} catch (error) {
				console.error(`ファイル処理エラー: ${file.name}`, error);
				errors.push({ fileName: file.name, error });
				// エラーが発生しても他のファイルの処理は続行
			}
		}

		if (errors.length > 0) {
			console.warn("処理に失敗したファイル:", errors);
		}

		if (results.length === 0) {
			throw new Error("有効な画像ファイルの処理に失敗しました");
		}

		return results;
	} catch (error) {
		console.error("画像処理中に予期せぬエラーが発生しました:", error);
		throw error;
	}
};
