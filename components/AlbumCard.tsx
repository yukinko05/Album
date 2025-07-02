import Image from "next/image";
import Link from "next/link";
import { AlbumCardProps } from "@/types/albumTypes";

export default function AlbumCard({
	album,
	sharegroupId,
	className = "",
	sharedgroupTitle,
}: AlbumCardProps) {
	return (
		<Link
			href={{
				pathname: `/albums/${album.albumId}`,
				query: {
					albumTitle: album.title,
					sharegroupId: sharegroupId,
					sharedgroupTitle: sharedgroupTitle,
				},
			}}
			className={`block hover:opacity-60 transition-opacity ${className}`}
		>
			<article className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="relative aspect-[1]">
					<Image
						src={album.coverPhotoUrl}
						alt={`${album.title} のアルバムカバー画像`}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
						className="object-cover"
						priority={true}
					/>
				</div>
				<div className="p-4">
					<h2 className="font-medium text-orange-800 text-sm md:text-base mb-1 truncate">
						{album.title}
					</h2>
					<time className="text-xs md:text-sm text-orange-800">
						{album.createdAt}
					</time>
				</div>
			</article>
		</Link>
	);
}
