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
    <div className="bg-[#003DA5] px-[31px] py-[28px] mb-6 relative overflow-hidden rounded-[30px]">
      <div className="text-center mb-4">
        <h2 className="text-white text-xl font-medium mb-1" style={{ fontFamily: 'Gumi-Romance' }}>
          {dogName}의 NBTI는
        </h2>
        <p className="text-blue-100 text-sm">by. Jelly Univ</p>
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
