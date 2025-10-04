'use client';

import React from 'react';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { Instagram, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PromoPage() {
  const router = useRouter();

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/jelly_university?igsh=MW5ldXRjaTlqZzY2dA==', '_blank');
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-[430px] h-screen mx-auto relative">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* 메인 프로모션 이미지 */}
        <div className="w-full">
          <Image
            src="/img/promo/promo-mobile.png"
            alt="젤리유니브 프로모션"
            width={430}
            height={2000}
            className="w-full h-auto object-contain"
            priority
            quality={100}
            unoptimized={true}
          />
        </div>

        {/* 인스타그램 버튼 - 하단 100px 위에 중앙정렬 (fixed) */}
        <div className="fixed bottom-[80px] left-1/2 transform -translate-x-1/2 z-20">
          <Button
            onClick={handleInstagramClick}
            variant="ghost"
            size="lg"
            fullWidth={false}
            customPadding="px-[25px] py-[15px]"
            roundedClass="rounded-lg"
            className="font-semibold text-[18px] !text-[#003DA5] border border-[#003DA5] flex items-center justify-center"
          >
            젤리유니브 인스타그램
          </Button>
        </div>
      </div>
    </div>
  );
}
