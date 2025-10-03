'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/Calendar';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';

interface BasicQuestionsData {
  dogName: string;
  birthDate: Date | null;
  bcs: string | null;
  activityLevel: string | null;
}

export default function BasicQuestionsPage() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState<BasicQuestionsData>({
    dogName: '',
    birthDate: null,
    bcs: null,
    activityLevel: null
  });

  const activityLevels = [
    {
      id: 'low',
      label: '저활동 (Low activity)',
      description: '일일 활동 시간: 30분 미만',
      detail: '하루 대부분 실내에서 보내고 운동량이 적음'
    },
    {
      id: 'medium',
      label: '보통 활동 (Moderate activity)',
      description: '일일 활동 시간: 30분 ~ 1시간',
      detail: '규칙적인 산책과 적당한 활동을 함'
    },
    {
      id: 'high',
      label: '고활동 (High activity)',
      description: '일일 활동 시간: 1시간 이상',
      detail: '달리기 등 활발하고 장시간 신체활동이 많음'
    }
  ];

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({ ...prev, birthDate: date }));
    setShowCalendar(false);
  };

  const handleNext = () => {
    // 데이터 검증
    if (!formData.dogName.trim()) {
      alert('강아지 이름을 입력해주세요.');
      return;
    }
    if (!formData.birthDate) {
      alert('생년월일을 선택해주세요.');
      return;
    }
    if (!formData.bcs) {
      alert('BCS를 선택해주세요.');
      return;
    }
    if (!formData.activityLevel) {
      alert('활동 수준을 선택해주세요.');
      return;
    }

    // 데이터를 세션 스토리지에 저장 (날짜 객체를 문자열로 변환)
    const dataToStore = {
      ...formData,
      birthDate: formData.birthDate?.toISOString()
    };
    sessionStorage.setItem('basicQuestions', JSON.stringify(dataToStore));

    // 다음 페이지로 이동
    router.push('/personal-questions');
  };

  const isFormValid = formData.dogName.trim() && formData.birthDate && formData.bcs && formData.activityLevel;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 max-w-md mx-auto">
        <Header />

        {/* 질문 폼 */}
        <div className="bg-[#EEEEEE] rounded-[30px] pt-[33px] pb-[35px] px-[38px] space-y-8">
          {/* 01. 강아지 이름 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[15px] font-semibold">01</span>
              <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">반려견의 이름을 알려주세요!</h3>
            </div>
            <input
              type="text"
              placeholder="강아지 이름을 입력해주세요"
              value={formData.dogName}
              onChange={(e) => setFormData(prev => ({ ...prev, dogName: e.target.value }))}
              className="w-full h-[48px] px-4 bg-white rounded-xl border border-gray-200 focus:border-[#003DA5] focus:ring-[#003DA5] focus:outline-none text-[#343434] text-[clamp(0.875rem,3.5vw,1rem)] placeholder:text-gray-400 placeholder:text-[clamp(0.875rem,3.5vw,1rem)]"
            />
          </div>

          {/* 02. 생년월일 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[15px] font-semibold">02</span>
              <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">(추정) 생년월일을 알려주세요!</h3>
            </div>
            <Button
              variant="input"
              size="md"
              onClick={() => setShowCalendar(true)}
              className={`text-left !h-[48px] w-full px-4 border border-gray-200 rounded-xl flex items-center ${formData.birthDate ? '!text-[#343434]' : '!text-gray-400'}`}
            >
              {formData.birthDate
                ? format(formData.birthDate, 'yyyy년 M월 d일', { locale: ko })
                : '생년월일을 선택해주세요'
              }
            </Button>
          </div>

          {/* 03. BCS 선택 */}
          <div>
            <div className="text-center mb-2">
              <span className="text-[#003DA5] text-[15px] font-semibold">03</span>
              <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">BCS를 선택해주세요!</h3>
            </div>
            <p className="text-[#343434] text-[11px] font-normal text-center mb-4">
              옆에서 아이를 관찰하고 아래 이미지 중<br />
              가장 유사한 체형을 골라 선택해주세요.
            </p>

            {/* BCS 이미지 버튼들 */}
            <div className="flex justify-center">
              <div
                className="grid gap-[12px]"
                style={{
                  gridTemplateColumns: '127px 127px',
                  gridTemplateRows: '127px 127px'
                }}
              >
                <button
                  onClick={() => setFormData(prev => ({ ...prev, bcs: 'skinny' }))}
                  className={`relative rounded-xl overflow-hidden transition-all bg-white ${formData.bcs === 'skinny'
                    ? 'ring-3 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                    }`}
                >
                  <Image
                    src="/img/basic-questions/skinny.png"
                    alt="저체중 (Skinny)"
                    width={127}
                    height={127}
                    className="w-[127px] h-[127px] object-contain mx-auto"
                  />
                  {formData.bcs === 'skinny' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, bcs: 'just-right' }))}
                  className={`relative rounded-xl overflow-hidden transition-all bg-white ${formData.bcs === 'just-right'
                    ? 'ring-3 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                    }`}
                >
                  <Image
                    src="/img/basic-questions/just-right.png"
                    alt="적정 체중 (Just Right)"
                    width={127}
                    height={127}
                    className="w-[127px] h-[127px] object-contain mx-auto"
                  />
                  {formData.bcs === 'just-right' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, bcs: 'husky' }))}
                  className={`relative rounded-xl overflow-hidden transition-all bg-white ${formData.bcs === 'husky'
                    ? 'ring-3 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                    }`}
                >
                  <Image
                    src="/img/basic-questions/husky.png"
                    alt="과체중 (Husky)"
                    width={127}
                    height={127}
                    className="w-[127px] h-[127px] object-contain mx-auto"
                  />
                  {formData.bcs === 'husky' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, bcs: 'chubby' }))}
                  className={`relative rounded-xl overflow-hidden transition-all bg-white ${formData.bcs === 'chubby'
                    ? 'ring-3 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                    }`}
                >
                  <Image
                    src="/img/basic-questions/chubby.png"
                    alt="비만 (Chubby)"
                    width={127}
                    height={127}
                    className="w-[127px] h-[127px] object-contain mx-auto"
                  />
                  {formData.bcs === 'chubby' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 04. 활동 수준 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[15px] font-semibold">04</span>
              <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">활동 수준을 알려주세요!</h3>
            </div>
            <div className="space-y-3">
              {activityLevels.map((level) => (
                <div
                  key={level.id}
                  className={`
                    relative bg-white rounded-xl p-4 cursor-pointer transition-all
                    ${formData.activityLevel === level.id
                      ? 'ring-3 ring-blue-500 shadow-lg'
                      : 'hover:shadow-md'
                    }
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, activityLevel: level.id }))}
                >
                  <h4 className="text-[#000000] text-[13px] font-semibold text-center">{level.label}</h4>
                  <p className="text-[#000000] text-[13px] font-normal text-center">{level.description}</p>
                  <p className="text-[#000000] text-[13px] font-normal text-center">{level.detail}</p>
                  {formData.activityLevel === level.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            fullWidth={false}
            roundedClass="rounded-[50px]"
            size="none"
            className={`inline-flex items-center justify-center px-[80px] py-[10px] text-[15px] font-semibold min-w-[255px] ${!isFormValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
          >
            다음 질문
          </Button>
        </div>

        {/* 캘린더 모달 */}
        <Calendar
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          onSelectDate={handleDateSelect}
          selectedDate={formData.birthDate || undefined}
        />
      </div>
    </div>
  );
}