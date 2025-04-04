"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { useAuth } from "@/hooks/useAuth";
import { FaCircleUser } from "react-icons/fa6";

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

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="px-16 py-8 bg-amber-50 min-h-screen">
			<h1 className="text-2xl font-bold mb-6 text-orange-800">プロフィール</h1>
			<div className="bg-white rounded-lg shadow-md p-8 border border-amber-200 w-5/6">
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="w-32 h-32 relative">
						{iconImg ? (
							<Image
								src={iconImg}
								alt="プロフィール画像"
								fill
								sizes="128px"
								className="object-cover rounded-full"
							/>
						) : (
							<div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center">
								<FaCircleUser className="text-orange-800" size={128} />
							</div>
						)}
					</div>
					<div className="flex-1">
						<div className="mb-4">
							<h2 className="text-sm text-orange-600">ユーザー名</h2>
							<p className="text-xl font-medium text-orange-900">{userName}</p>
						</div>
						<div>
							<h2 className="text-sm text-orange-600">メールアドレス</h2>
							<p className="text-xl font-medium text-orange-900">{email}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
