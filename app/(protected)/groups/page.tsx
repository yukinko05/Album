"use client";

import Link from "next/link";
import {
	PlusCircleIcon,
	UsersIcon,
	ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function groupsPage() {
	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
					<h1 className="text-2xl font-medium text-orange-800 flex items-center">
						<UsersIcon className="mr-2 h-5 w-5" aria-hidden="true" />
						共有グループ
					</h1>
					<div className="flex space-x-3">
						<Link
							href="/groups/create"
							className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
						>
							<PlusCircleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
							グループ作成
						</Link>
						<Link
							href="/groups/join"
							className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
						>
							<ArrowRightStartOnRectangleIcon
								className="mr-2 h-5 w-5"
								aria-hidden="true"
							/>
							グループ参加
						</Link>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md p-8 text-center">
					<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<UsersIcon
							className="text-orange-500 h-10 w-10"
							aria-hidden="true"
						/>
					</div>
					<p className="text-orange-800 mb-4 text-lg font-medium">
						参加している共有グループはありません
					</p>
					<p className="text-orange-600 mb-6">
						新しいグループを作成するか、既存のグループに参加してみましょう
					</p>
					<div className="flex space-x-4 justify-center">
						<Link
							href="/groups/create"
							className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
						>
							<PlusCircleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
							グループ作成
						</Link>
						<Link
							href="/groups/join"
							className="inline-flex items-center px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
						>
							<ArrowRightStartOnRectangleIcon
								className="mr-2 h-5 w-5"
								aria-hidden="true"
							/>
							グループ参加
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
