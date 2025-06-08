"use client";

import React, { useEffect, useState } from "react";
import type { Sharegroups } from "@/types/shareTypes";
import Link from "next/link";
import { useShareStore } from "@/stores/shareStore";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useSearchParams } from "next/navigation";

export default function SharegroupSidebarList() {
	const { currentUser, isAuthenticated } = useAuth();
	const [sharegroups, setSharegroups] = useState<Sharegroups[]>([]);
	const getSharegroups = useShareStore((state) => state.getSharegroups);
	const pathname = usePathname();
	const currentgroupId = pathname.includes("/groups/")
		? pathname.split("/groups/")[1]
		: null;

	useEffect(() => {
		const fetchSharegroupData = async () => {
			try {
				if (!currentUser) {
					return;
				}
				const groups = await getSharegroups(currentUser.uid);
				setSharegroups(groups);
			} catch (error) {
				console.error("シェアルームデータの取得に失敗しました:", error);
			}
		};

		fetchSharegroupData();
	}, [currentUser, getSharegroups]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="mt-4">
			<h2 className="text-lg text-stone-800/80 font-semibold mb-2 px-4">
				共有ルーム
			</h2>
			<ul className="space-y-1">
				{sharegroups.length === 0 ? (
					<li className="px-4 py-2 text-stone-800/70">
						共有ルームがありません
					</li>
				) : (
					sharegroups.map((group) => {
						const isActive = group.sharegroupId === currentgroupId;
						return (
							<li key={group.sharegroupId}>
								<Link
									href={`/groups/${group.sharegroupId}?sharedgroupTitle=${group.sharedgroupTitle}`}
									className={`block px-4 py-2 rounded-md transition-colors
										${isActive
											? "bg-white/40 text-orange-900 font-medium border-l-4 border-orange-500"
											: "text-stone-800/70 hover:bg-white/40 hover:text-orange-600"
										}`}
								>
									{group.sharedgroupTitle}
								</Link>
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
}
