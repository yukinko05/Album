"use client";

import Link from "next/link";
import SignOut from "@/app/signout/signout";
import Image from "next/image";
import type { User } from "@/types/userTypes";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import {
	Bars3Icon,
	XMarkIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import type { ShareRooms } from "@/types/shareTypes";
import { useShareStore } from "@/stores/shareStore";
import { usePathname } from "next/navigation";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

interface SideBarProps {
	userData?: User | null;
}

export default function SideBar({ userData }: SideBarProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { currentUser } = useAuth();
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const getShareRooms = useShareStore((state) => state.getShareRooms);
	const pathname = usePathname();

	const currentRoomId = pathname.includes("/rooms/")
		? pathname.split("/rooms/")[1].split("?")[0]
		: null;

	useEffect(() => {
		const fetchShareRoomData = async () => {
			try {
				if (!currentUser) {
					return;
				}
				const rooms = await getShareRooms(currentUser.uid);
				setShareRooms(rooms);
			} catch (error) {
				console.error("シェアルームデータの取得に失敗しました:", error);
			}
		};

		fetchShareRoomData();
	}, [currentUser, getShareRooms]);

	return (
		<>
			<Dialog
				open={sidebarOpen}
				onClose={setSidebarOpen}
				className="relative z-50 lg:hidden"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
				/>

				<div className="fixed inset-0 flex">
					<DialogPanel
						transition
						className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
					>
						<TransitionChild>
							<div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
								<button
									type="button"
									onClick={() => setSidebarOpen(false)}
									className="-m-2.5 p-2.5"
								>
									<span className="sr-only">Close sidebar</span>
									<XMarkIcon aria-hidden="true" className="size-6 text-white" />
								</button>
							</div>
						</TransitionChild>
						{/* Sidebar component, swap this element with another sidebar if you like */}
						<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-amber-100 to-orange-200 px-6 pb-2">
							<div className="flex h-16 shrink-0 items-center justify-center">
								<Link
									href="/rooms"
									className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
								>
									ALBUM
								</Link>
							</div>
							<nav className="flex flex-1 flex-col">
								<ul className="flex flex-1 flex-col gap-y-7">
									<li>
										<div className="text-xs/6 font-bold text-orange-800/80">
											ルーム
										</div>
										<ul className="-mx-2 space-y-1">
											{shareRooms.map((room) => (
												<li key={room.shareRoomId}>
													<Link
														href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
														className={classNames(
															room.shareRoomId === currentRoomId
																? "bg-orange-400 text-white"
																: "text-orange-800 hover:bg-white/40",
															"group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
														)}
													>
														{room.sharedRoomTitle}
													</Link>
												</li>
											))}
										</ul>
									</li>
									<li>
										<div className="text-xs/6 font-bold text-orange-800/80">
											ルーム操作
										</div>
										<ul className="-mx-2 mt-2 space-y-1">
											<li>
												<Link
													href="/rooms/create"
													aria-label="新しい共有ルームを作成"
													className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
												>
													ルーム作成
												</Link>
											</li>
											<li>
												<Link
													href="/rooms/join"
													className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
													aria-label="既存の共有ルームに参加"
												>
													ルーム参加
												</Link>
											</li>
										</ul>
									</li>
									<li className="-mx-6 mt-auto">
										<Link
											href="/profile"
											className="flex items-center gap-2 hover:bg-white/60 rounded-md px-4 py-2 mx-2"
										>
											{userData?.iconImg ? (
												<div className="relative w-[30px] h-[30px]">
													<Image
														src={userData.iconImg}
														alt={`${userData.userName}のプロフィールアイコン`}
														fill
														sizes="30px"
														className="object-cover rounded-full"
													/>
												</div>
											) : (
												<UserCircleIcon className="text-orange-800 size-6" />
											)}
											<p className="text-orange-900">
												{userData?.userName || "ユーザー"}
											</p>
										</Link>
									</li>
									<li className="border-t border-orange-300 py-4">
										{currentUser && (
											<div className="flex justify-center">
												<SignOut />
											</div>
										)}
									</li>
								</ul>
							</nav>
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-amber-100 to-orange-200 px-6">
					<div className="flex h-16 shrink-0 items-center">
						<Link
							href="/rooms"
							className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
						>
							ALBUM
						</Link>
					</div>
					<nav className="flex flex-1 flex-col">
						<ul className="flex flex-1 flex-col gap-y-7">
							<li>
								<div className="text-xs/6 font-bold text-orange-800/80">
									ルーム
								</div>
								<ul className="-mx-2 space-y-1">
									{shareRooms.map((room) => (
										<li key={room.shareRoomId}>
											<Link
												href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
												className={classNames(
													room.shareRoomId === currentRoomId
														? "bg-orange-400 text-white"
														: "text-orange-800 hover:bg-white/40",
													"group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
												)}
											>
												{room.sharedRoomTitle}
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<div className="text-xs/6 font-bold text-orange-800/80">
									ルーム操作
								</div>
								<ul className="-mx-2 mt-2 space-y-1">
									<li>
										<Link
											href="/rooms/create"
											aria-label="新しい共有ルームを作成"
											className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
										>
											ルーム作成
										</Link>
									</li>
									<li>
										<Link
											href="/rooms/join"
											className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
											aria-label="既存の共有ルームに参加"
										>
											ルーム参加
										</Link>
									</li>
								</ul>
							</li>
							<li className="-mx-6 mt-auto">
								<Link
									href="/profile"
									className="flex items-center gap-2 hover:bg-white/60 rounded-md px-4 py-2 mx-2"
								>
									{userData?.iconImg ? (
										<div className="relative w-[30px] h-[30px]">
											<Image
												src={userData.iconImg}
												alt={`${userData.userName}のプロフィールアイコン`}
												fill
												sizes="30px"
												className="object-cover rounded-full"
											/>
										</div>
									) : (
										<UserCircleIcon className="text-orange-800 size-6" />
									)}
									<p className="text-orange-900">
										{userData?.userName || "ユーザー"}
									</p>
								</Link>
							</li>
							<li className="border-t border-orange-300 py-4">
								{currentUser && (
									<div className="flex justify-center">
										<SignOut />
									</div>
								)}
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gradient-to-b from-amber-100 to-orange-200 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
				>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon aria-hidden="true" className="size-6 text-orange-800" />
				</button>
				<div className="flex-1">
					<Link
						href="/rooms"
						className="text-3xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
					>
						ALBUM
					</Link>
				</div>
				<Link
					href="/profile"
					className="flex items-center gap-2 p-2 bg-white/40 hover:bg-white/60 rounded-full mt-2"
				>
					{userData?.iconImg ? (
						<div className="relative w-[30px] h-[30px]">
							<Image
								src={userData.iconImg}
								alt={`${userData.userName}のプロフィールアイコン`}
								fill
								sizes="30px"
								className="object-cover rounded-full"
							/>
						</div>
					) : (
						<UserCircleIcon className="text-orange-800 size-6" />
					)}
					<p className="text-orange-900">{userData?.userName || "ユーザー"}</p>
				</Link>
			</div>
		</>
	);
}
