"use client";

import { useContext, useEffect, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getUser } from "@/services/userService";

export default function ProfilePage() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const [userName, setUserName] = useState<string | null>(null);
	const [iconImg, setIconImg] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!userId) return;

		const fetchUserData = async () => {
			try {
				const userData = await dispatch(getUser(userId)).unwrap();
				setUserName(userData.userName);
				setIconImg(userData.iconImg);
				setEmail(userData.email);
			} catch (error) {
				console.error("ユーザーデータの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [userId, dispatch]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="py-8">
			<h1 className="text-2xl font-bold mb-6">プロフィール</h1>

			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
					<div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-gray-200">
						{iconImg ? (
							<Image
								src={iconImg}
								alt={`${userName}のプロフィール画像`}
								fill
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
								No Image
							</div>
						)}
					</div>

					<div className="flex-1">
						<div className="mb-4">
							<h2 className="text-xl font-semibold">{userName}</h2>
							<p className="text-gray-600">{email}</p>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-medium mb-2">アカウント情報</h3>
								<div className="bg-gray-50 p-4 rounded-md">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-500">ユーザーID</p>
											<p className="text-gray-700">{userId}</p>
										</div>
										<div>
											<p className="text-sm text-gray-500">メールアドレス</p>
											<p className="text-gray-700">{email}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
