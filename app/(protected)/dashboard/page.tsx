"use client";

import { useContext, useEffect, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { currentUser } = useContext(authContext);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName || "ユーザー");
    }
  }, [currentUser]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Link
            href="/rooms/create"
            className="bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            新しい共有ルームを作成
          </Link>
          <Link
            href="/rooms/join"
            className="bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
          >
            共有ルームに参加
          </Link>
        </div>
      </div>
    </div>
  );
}
