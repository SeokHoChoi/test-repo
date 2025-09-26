import React from 'react';
import Image from 'next/image';

interface NBTIResultCardProps {
  dogName: string;
  dogImage: string;
  children: React.ReactNode;
}

export function NBTIResultCard({
  dogName,
  dogImage,
  children
}: NBTIResultCardProps) {
  return (
    <div className="bg-[#003DA5] px-[31px] py-[28px] relative overflow-hidden rounded-[30px]">
      <div className="text-center mb-4">
        <h2 className="text-white text-[30px] font-medium mb-0 font-gumi leading-[31px]">
          {dogName}의 NBTI는
        </h2>
        <p className="text-[#FFFFFF] font-medium text-[15px] mt-2">@젤리대학교</p>
      </div>

      <div className="flex justify-center mb-9">
        <Image
          src={dogImage}
          alt={`${dogName} 강아지`}
          width={128}
          height={128}
          className="w-32 h-32 object-contain relative z-10"
          priority
        />
      </div>

      <div className="bg-white px-[20px] py-[35px] relative -mt-16 z-0 rounded-[30px]">
        {children}
      </div>
    </div>
  );
}
