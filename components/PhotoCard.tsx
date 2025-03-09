import React from 'react';
import type { Photo } from '@/types/photoTypes';
import Image from 'next/image';

interface PhotoCardProps {
  photo: Photo;
  albumTitle: string;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  albumTitle,
  className = ''
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        className="rounded-2xl w-[300px] h-[300px] object-cover transition-transform hover:scale-105 duration-300"
        src={photo.photoUrl}
        alt={`${albumTitle}のアルバム内の写真`}
        width={300}
        height={300}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
          console.error(
            `画像の読み込みに失敗しました: ${photo.photoUrl}`,
          );
        }}
      />
    </div>
  );
};

export default PhotoCard; 