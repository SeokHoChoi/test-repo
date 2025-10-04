import React from 'react';
import Image from 'next/image';

interface MatchingCardProps {
  type: 'good' | 'bad';
  badgeText: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  emoji?: string;
  description: string;
}

export function MatchingCard({
  type,
  badgeText,
  imageSrc,
  imageAlt,
  title,
  emoji,
  description
}: MatchingCardProps) {
  const badgeColor = type === 'good' ? '#003DA5' : '#F7623E';

  return (
    <div
      className="bg-white px-3 py-[15px] rounded-[20px] flex-1"
      style={{
        boxShadow: '10px 5px 10px 0px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="text-center">
        <div
          className="bg-white border font-semibold text-[13px] px-3 py-1 rounded-full inline-block mb-[7px] min-w-[96px] min-h-[28px] flex items-center justify-center"
          style={{
            borderColor: badgeColor,
            color: badgeColor
          }}
        >
          {badgeText}
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={130}
            height={130}
            className="object-contain"
          />
        </div>
        <h3 className="text-[#212121] font-gumi text-[13px] mb-[2px] flex items-center justify-center gap-[4px]">
          <span className="text-[12px] flex items-center justify-center">{emoji}</span>
          {title}
        </h3>
        <p className="text-[#8B8B8B] font-normal text-[10px]">{description}</p>
      </div>
    </div>
  );
}
