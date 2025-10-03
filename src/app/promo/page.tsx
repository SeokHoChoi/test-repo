'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
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
      <div className="px-4 py-8 max-w-md mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <Header />

        {/* 메인 콘텐츠 */}
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6">
            <Image
              src="/img/jellyu-logo.png"
              alt="Jelly Univ Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#003DA5] mb-4 font-gumi">
            젤리유니브와 함께하세요!
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            반려견 건강 관리의 새로운 기준을 제시하는<br />
            젤리유니브의 최신 소식을 만나보세요.
          </p>

          <div className="space-y-4">
            <div className="bg-[#F8F9FA] rounded-lg p-6">
              <h3 className="font-semibold text-[#003DA5] mb-2">🐾 전문 수의사가 설계한 NBTI</h3>
              <p className="text-sm text-gray-600">
                서울대∙한국수의영양학회 임원 수의사가 설계한<br />
                AI가 30초 만에 분석해드려요!
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-6">
              <h3 className="font-semibold text-[#003DA5] mb-2">📱 실시간 건강 관리</h3>
              <p className="text-sm text-gray-600">
                우리 아이의 맞춤형 영양 관리와<br />
                건강 상태를 실시간으로 확인하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 인스타그램 버튼 */}
        <div className="pt-[30px] pb-[15px] text-center">
          <Button
            onClick={handleInstagramClick}
            variant="primary"
            size="md"
            fullWidth={false}
            className="mx-auto bg-gradient-to-r from-[#E4405F] to-[#C13584] hover:from-[#D63384] hover:to-[#B02A5B] text-white font-semibold shadow-lg whitespace-nowrap flex items-center justify-center w-[45%]"
            customPadding="px-6 py-4"
          >
            <Instagram className="w-4 h-4 mr-2" />
            <span className="text-sm">젤리유니브 인스타그램</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
