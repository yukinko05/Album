"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import SignOut from "@/app/signout/signout";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getUser } from "@/services/userService";
import Image from "next/image";

export default function SideBar() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [userName, setUserName] = useState<string>("");
	const [iconImg, setIconImg] = useState<string | null>(null);

	if (!userId) {
		router.push("/login");
	}

	useEffect(() => {
		if (!userId) return;

		const fetchUserData = async () => {
			try {
				const response = await dispatch(getUser(userId)).unwrap();

				setUserName(response.userName);
				setIconImg(response.iconImg);
			} catch (error) {
				console.log("ユーザーデータの取得に失敗しました: ", error);
			}
		};

		fetchUserData();
	}, [userId, dispatch]);

	return (
		<>
			<ShareRoomSidebarList />
			<Link
				href={{
					pathname: "/createShareForm",
				}}
				aria-label="新しい共有ルームを作成"
			>
				ルーム作成
			</Link>
			<Link
				href={{
					pathname: "/shareRoomJoinForm",
				}}
			>
				ルーム参加
			</Link>
			<div>
				{iconImg && (
					<Image
						src={iconImg}
						alt={`${userName}のプロフィールアイコン`}
						width={30}
						height={30}
					/>
				)}
				<p>{userName}</p>
				{userId && <SignOut />}
			</div>
		</>
	);
}
