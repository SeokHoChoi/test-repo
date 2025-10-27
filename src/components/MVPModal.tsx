'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { X } from 'lucide-react';

interface MVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const MVPModal: React.FC<MVPModalProps> = ({ isOpen, onClose, onStart }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-[20px] mx-4 max-w-sm w-full relative overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* 모달 내용 */}
        <div className="p-6 pt-8">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/img/jellyu-logo.png"
                alt="젤리대학교"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-[#003DA5] font-semibold text-[20px] leading-[26px] mb-2">
              우리 아이 사료 안전 테스트
            </h2>
            <p className="text-[#666666] text-[14px] leading-[20px]">
              사료부터 영양제까지!<br />
              서울대∙한국수의영양학회 임원 수의사가<br />
              함께 설계한 AI가 30초만에 분석해드려요!
            </p>
          </div>

          {/* 버튼들 */}
          <div className="space-y-2 mt-10">
            <Button
              onClick={onStart}
              variant="primary"
              size="lg"
              fullWidth
              className="bg-[#003DA5] text-white font-semibold text-[16px] py-4 rounded-[12px]"
            >
              무료로 시작하기
            </Button>

            {/* 통계 정보 */}
            <div className="text-center mt-2">
              <p className="text-[#666666] text-[12px]">
                이미 1,000+의 반려견의 보호자가<br />
                분석을 신청했어요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
