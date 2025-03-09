import Compressor from "compressorjs";

export const FILE_SIZE = {
	TINY: 500 * 1024, // 500KB
	SMALL: 1024 * 1024, // 1MB
	MEDIUM: 2 * 1024 * 1024, // 2MB
};

export const compressImage = (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		let quality;
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
			success: (result) => {
				resolve(result as File);
			},
			error: (err) => {
				reject(err);
			},
		});
	});
};

export const compressImageToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		let quality;

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
						reject(new Error("Failed to convert file to base64"));
					}
				};

				reader.onerror = () => {
					reject(new Error("Failed to read compressed file"));
				};
			},
			error: (err) => {
				reject(err);
			},
		});
	});
};

export const compressMultipleImagesToBase64 = async (
	files: File[],
): Promise<string[]> => {
	const compressPromises = files.map((file) => compressImageToBase64(file));
	return Promise.all(compressPromises);
};
