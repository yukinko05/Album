"use client";

import Link from "next/link";
import SignOut from "@/app/signout/signout";
import Image from "next/image";
import type { User } from "@/types/userTypes";
import type { User as FirebaseUser } from "firebase/auth";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";
import type { Sharegroups } from "@/types/shareTypes";
import { useShareStore } from "@/stores/shareStore";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

interface SideBarProps {
	userData: User | null;
}

interface SidebarContentProps {
	sharegroups: Sharegroups[];
	currentgroupId: string | null;
	userData: User | null;
	currentUser: FirebaseUser | null;
	loading: boolean;
}

export default function SideBar({ userData }: SideBarProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { currentUser } = useAuth();
	const [sharegroups, setSharegroups] = useState<Sharegroups[]>([]);
	const getSharegroups = useShareStore((state) => state.getSharegroups);
	const pathname = usePathname();
	const [loading, setLoading] = useState(true);

	const currentgroupId = pathname.includes("/groups/")
		? pathname.split("/groups/")[1].split("?")[0]
		: null;

	useEffect(() => {
		const fetchSharegroupData = async () => {
			try {
				setLoading(true);
				if (!currentUser) {
					setSharegroups([]);
					return;
				}
				const groups = await getSharegroups(currentUser.uid);
				setSharegroups(groups);
			} catch (error) {
				console.error("シェアグループデータの取得に失敗しました:", error);
				alert("シェアグループデータの取得に失敗しました");
			} finally {
				setLoading(false);
			}
		};

		fetchSharegroupData();
	}, [currentUser, getSharegroups]);

	return (
		<>
			{/* モバイル */}
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
									<XMarkIcon
										aria-hidden="true"
										className="h-6 w-6 text-white"
									/>
								</button>
							</div>
						</TransitionChild>
						<SidebarNavigation
							sharegroups={sharegroups}
							currentgroupId={currentgroupId}
							userData={userData}
							currentUser={currentUser}
							loading={loading}
						/>
					</DialogPanel>
				</div>
			</Dialog>

			{/* デスクトップ */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
				<SidebarNavigation
					sharegroups={sharegroups}
					currentgroupId={currentgroupId}
					userData={userData}
					currentUser={currentUser}
					loading={loading}
				/>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gradient-to-b from-amber-100 to-orange-200 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
				>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon aria-hidden="true" className="h-6 w-6 text-orange-800" />
				</button>
				<div className="flex-1">
					<Link
						href="/groups"
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
						<UserCircleIcon className="text-orange-800 h-6 w-6" />
					)}
					<p className="text-orange-900">{userData?.userName || "ユーザー"}</p>
				</Link>
			</div>
		</>
	);
}

const SidebarNavigation = ({
	sharegroups,
	currentgroupId,
	userData,
	currentUser,
	loading,
}: SidebarContentProps) => {
	return (
		<>
			<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-amber-100 to-orange-200 px-6">
				<div className="flex h-16 shrink-0 items-center">
					<Link
						href="/groups"
						className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry"
					>
						ALBUM
					</Link>
				</div>
				<nav className="flex flex-1 flex-col">
					<ul className="flex flex-1 flex-col gap-y-7">
						<li>
							<div
								className={` ${sharegroups.length > 0 ? "text-xs/6 font-bold text-orange-800/80" : "hidden"}`}
							>
								グループ
							</div>
							<ul className="-mx-2 space-y-1">
								{loading ? (
									<div className="flex justify-center items-center py-12">
										<LoadingSpinner size="md" />
									</div>
								) : (
									sharegroups.map((group) => (
										<li key={group.sharegroupId}>
											<Link
												href={`/groups/${group.sharegroupId}?sharedgroupTitle=${group.sharedgroupTitle}`}
												className={classNames(
													group.sharegroupId === currentgroupId
														? "bg-orange-400 text-white"
														: "text-orange-800 hover:bg-white/40",
													"group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
												)}
											>
												{group.sharedgroupTitle}
											</Link>
										</li>
									))
								)}
							</ul>
						</li>
						<li>
							<div className="text-xs/6 font-bold text-orange-800/80">
								グループ操作
							</div>
							<ul className="-mx-2 mt-2 space-y-1">
								<li>
									<Link
										href="/groups/create"
										aria-label="新しい共有グループを作成"
										className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
									>
										グループ作成
									</Link>
								</li>
								<li>
									<Link
										href="/groups/join"
										className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
										aria-label="既存の共有グループに参加"
									>
										グループ参加
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
									<UserCircleIcon className="text-orange-800 h-6 w-6" />
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
		</>
	);
};
