"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { useUserStore } from "@/stores/userStore";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
	const { currentUser, isAuthenticated, isLoading } = useAuth();
	const [userName, setUserName] = useState<string | null>(null);
	const [iconImg, setIconImg] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const getUser = useUserStore((state) => state.getUser);

	useEffect(() => {
		if (!currentUser) return;

		const fetchUserData = async () => {
			try {
				const userData = await getUser(currentUser.uid);
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
	}, [currentUser, getUser]);

	if (isLoading || loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 py-8 mt-16">
			<h1 className="text-2xl font-bold mb-6">プロフィール</h1>
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="w-32 h-32 relative">
						{iconImg ? (
							<Image
								src={iconImg}
								alt="プロフィール画像"
								fill
								className="rounded-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
								<span className="text-4xl text-gray-500">U</span>
							</div>
						)}
					</div>
					<div className="flex-1">
						<div className="mb-4">
							<h2 className="text-sm text-gray-500">ユーザー名</h2>
							<p className="text-xl font-medium">{userName}</p>
						</div>
						<div>
							<h2 className="text-sm text-gray-500">メールアドレス</h2>
							<p className="text-xl font-medium">{email}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
