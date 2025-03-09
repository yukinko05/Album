import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Album {
  albumId: string;
  title: string;
  coverPhotoUrl: string | null;
  createdAt: string;
}

interface AlbumCardProps {
  album: Album;
  shareRoomId: string;
  className?: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  shareRoomId,
  className = ''
}) => {
  return (
    <Link
      href={{
        pathname: `/albums/${album.albumId}`,
        query: { albumTitle: album.title, shareRoomId: shareRoomId },
      }}
      className={`block hover:opacity-60 transition-opacity ${className}`}
    >
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-[1]">
          <Image
            src={album.coverPhotoUrl ?? "/default-album.jpg"}
            alt={`${album.title} のアルバムカバー画像`}
            fill
            className="object-cover"
            priority={true}
          />
        </div>
        <div className="p-4">
          <h2 className="font-medium text-gray-900 text-sm md:text-base mb-1 truncate">
            {album.title}
          </h2>
          <time className="text-xs md:text-sm text-gray-500">
            {album.createdAt}
          </time>
        </div>
      </article>
    </Link>
  );
};

export default AlbumCard; 