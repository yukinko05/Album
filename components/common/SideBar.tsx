"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import SignOut from "@/app/signout/signout";
import Image from "next/image";
import type { User } from "@/types/userTypes";
import { FaCircleUser } from "react-icons/fa6";
import { FiX, FiMenu } from "react-icons/fi";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
} from "@headlessui/react";
import { useState, ReactNode, useEffect } from "react";
import {
	Bars3Icon,
	CalendarIcon,
	ChartPieIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
	UsersIcon,
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

const teams = [
	{ id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
	{ id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
	{ id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

interface SideBarProps {
	currentUser?: string | null;
	isAuthenticated?: boolean;
	userData?: User | null;
	children?: ReactNode;
	title?: string;
}

export default function SideBar() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { currentUser, isAuthenticated } = useAuth();
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const getShareRooms = useShareStore((state) => state.getShareRooms);
	const pathname = usePathname();

	const currentRoomId = pathname.includes("/rooms/")
		? pathname.split("/rooms/")[1]
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
								<ul role="list" className="flex flex-1 flex-col gap-y-7">
									<li>
										<ul role="list" className="-mx-2 space-y-1">
											{shareRooms.map((room) => (
												<li key={room.shareRoomId}>
													<Link
														href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
														className={classNames(
															room.shareRoomId === currentRoomId
																? "bg-indigo-700 text-white"
																: "text-indigo-200 hover:bg-indigo-700 hover:text-white",
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
										<div className="text-xs/6 font-semibold text-indigo-200">
											Your teams
										</div>
										<ul role="list" className="-mx-2 mt-2 space-y-1">
											{teams.map((team) => (
												<li key={team.name}>
													<a
														href={team.href}
														className={classNames(
															team.current
																? "bg-indigo-700 text-white"
																: "text-indigo-200 hover:bg-indigo-700 hover:text-white",
															"group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
														)}
													>
														<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
															{team.initial}
														</span>
														<span className="truncate">{team.name}</span>
													</a>
												</li>
											))}
										</ul>
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
						<ul role="list" className="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" className="-mx-2 space-y-1">
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
								<div className="text-xs/6 font-semibold text-orange-800">
									ルーム操作
								</div>
								<ul role="list" className="-mx-2 mt-2 space-y-1">
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
								<a
									href="#"
									className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-indigo-700"
								>
									<img
										alt=""
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										className="size-8 rounded-full bg-indigo-700"
									/>
									<span className="sr-only">Your profile</span>
									<span aria-hidden="true">Tom Cook</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
				>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon aria-hidden="true" className="size-6" />
				</button>
				<div className="flex-1 text-sm/6 font-semibold text-white">
					Dashboard
				</div>
				<a href="#">
					<span className="sr-only">Your profile</span>
					<img
						alt=""
						src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						className="size-8 rounded-full bg-indigo-700"
					/>
				</a>
			</div>
		</>
	);
}

function SideBarOld({
	currentUser,
	isAuthenticated = false,
	userData = null,
	title = "ALBUM",
}: SideBarProps) {
	// ユーザーデータがない場合は何も表示しない
	if (!isAuthenticated || !currentUser) {
		return null;
	}

	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen">
			{/* モバイル用サイドバー */}
			<Dialog
				open={sidebarOpen}
				onClose={setSidebarOpen}
				className="relative z-50 lg:hidden"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
				/>

				<div className="fixed inset-0 flex flex-col">
					<DialogPanel
						transition
						className="relative w-full transform transition duration-300 ease-in-out data-[closed]:-translate-y-full"
					>
						<TransitionChild>
							<div className="absolute right-0 top-0 flex justify-end p-4 duration-300 ease-in-out data-[closed]:opacity-0">
								<button
									type="button"
									onClick={() => setSidebarOpen(false)}
									className="-m-2.5 p-2.5 text-gray-700"
								>
									<span className="sr-only">サイドバーを閉じる</span>
									<FiX aria-hidden="true" className="h-6 w-6" />
								</button>
							</div>
						</TransitionChild>

						{/* モバイルサイドバーの内容 */}
						<div className="flex flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-amber-100 to-orange-200 px-6 pb-4 pt-16">
							<div className="flex h-16 shrink-0 items-center justify-center">
								<Link
									href="/rooms"
									className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
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
									<FaCircleUser className="text-orange-800" size={30} />
								)}
								<p className="text-orange-900">
									{userData?.userName || "ユーザー"}
								</p>
							</Link>

							<div className="flex-1 overflow-y-auto scrollbar-hide mt-4">
								<ShareRoomSidebarList />
							</div>

							<div className="border-t border-orange-300 mt-4 pt-4 bg-white/30 rounded-lg">
								<p className="text-sm font-medium text-orange-900 mb-2 pl-4">
									ルーム操作
								</p>
								<div className="pt-2">
									<Link
										href="/rooms/create"
										aria-label="新しい共有ルームを作成"
										className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
									>
										ルーム作成
									</Link>
								</div>
								<div className="pt-2">
									<Link
										href="/rooms/join"
										className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
										aria-label="既存の共有ルームに参加"
									>
										ルーム参加
									</Link>
								</div>
							</div>

							<div className="border-t border-orange-300 py-4">
								{currentUser && (
									<div className="flex justify-center">
										<SignOut />
									</div>
								)}
							</div>
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			{/* デスクトップ用サイドバー */}
			<div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
				<div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-amber-100 to-orange-200 px-6 pb-4">
					<div className="flex h-16 shrink-0 items-center justify-center">
						<Link
							href="/rooms"
							className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
						>
							ALBUM
						</Link>
					</div>

					<Link
						href="/profile"
						className="flex items-center gap-2 p-2 bg-white/40 hover:bg-white/60 rounded-full mt-6"
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
							<FaCircleUser className="text-orange-800" size={30} />
						)}
						<p className="text-orange-900">
							{userData?.userName || "ユーザー"}
						</p>
					</Link>

					<div className="flex-1 overflow-y-auto scrollbar-hide mt-4">
						<ShareRoomSidebarList />
					</div>

					<div className="border-t border-orange-300 mt-4 pt-4 bg-white/30 rounded-lg">
						<p className="text-sm font-medium text-orange-900 mb-2 pl-4">
							ルーム操作
						</p>
						<div className="pt-2">
							<Link
								href="/rooms/create"
								aria-label="新しい共有ルームを作成"
								className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
							>
								ルーム作成
							</Link>
						</div>
						<div className="pt-2">
							<Link
								href="/rooms/join"
								className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
								aria-label="既存の共有ルームに参加"
							>
								ルーム参加
							</Link>
						</div>
					</div>

					<div className="border-t border-orange-300 py-4">
						{currentUser && (
							<div className="flex justify-center">
								<SignOut />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* メインコンテンツエリア */}
			<div className="flex-1">
				{/* モバイル用ヘッダー */}
				<div className="lg:hidden">
					<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
						<button
							type="button"
							onClick={() => setSidebarOpen(true)}
							className="-m-2.5 p-2.5 text-gray-700"
						>
							<span className="sr-only">サイドバーを開く</span>
							<FiMenu aria-hidden="true" className="h-6 w-6" />
						</button>

						<div className="flex flex-1 items-center justify-between">
							<div className="text-xl font-semibold text-gray-900">{title}</div>

							<div className="flex items-center">
								{/* プロフィールドロップダウン */}
								<Menu as="div" className="relative">
									<MenuButton className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
										<span className="sr-only">ユーザーメニューを開く</span>
										<div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
											{userData?.iconImg ? (
												<Image
													src={userData.iconImg}
													alt={`${userData.userName}のプロフィールアイコン`}
													width={32}
													height={32}
													className="h-8 w-8 object-cover"
												/>
											) : (
												<UserCircleIcon className="text-orange-800 size-20" />
											)}
										</div>
									</MenuButton>

									<MenuItems
										transition
										className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
									>
										<MenuItem>
											{({ active }) => (
												<Link
													href="/profile"
													className={`${active ? "bg-orange-50" : ""} block px-4 py-2 text-sm text-gray-700`}
												>
													プロフィール
												</Link>
											)}
										</MenuItem>
										<MenuItem>
											{({ active }) => (
												<button
													onClick={() => {
														if (typeof window !== "undefined") {
															const signOutElement = document.querySelector(
																'button[type="button"]',
															);
															if (signOutElement) {
																(signOutElement as HTMLElement).click();
															}
														}
													}}
													className={`${active ? "bg-orange-50" : ""} block w-full text-left px-4 py-2 text-sm text-gray-700`}
												>
													ログアウト
												</button>
											)}
										</MenuItem>
									</MenuItems>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
