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
      detail: '하루 대부분을 실내에서 보내며, 운동량이 적은 경우. 주로 앉아있거나 누워있는 시간이 많음'
    },
    {
      id: 'moderate',
      label: '보통 활동 (Moderate activity)',
      description: '일일 활동 시간: 30분 ~ 1시간',
      detail: '규칙적인 산책과 적당한 활동을 하는 경우. 실내외 활동이 골고루 있음'
    },
    {
      id: 'high',
      label: '고활동 (High activity)',
      description: '일일 활동 시간: 1시간 이상',
      detail: '활발한 운동과 장시간 야외 활동을 하는 경우. 달리기/점프/놀이 등 활발한 신체 활동이 많음'
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
        <div className="bg-gray-50 rounded-2xl p-6 space-y-8">
          {/* 01. 강아지 이름 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[17px] font-bold font-aggro">01</span>
              <h3 className="text-[#003DA5] text-[17px] font-bold font-aggro">반려견의 이름을 알려주세요!</h3>
            </div>
            <input
              type="text"
              placeholder="강아지 이름을 입력해주세요"
              value={formData.dogName}
              onChange={(e) => setFormData(prev => ({ ...prev, dogName: e.target.value }))}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 02. 생년월일 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[17px] font-bold font-aggro">02</span>
              <h3 className="text-[#003DA5] text-[17px] font-bold font-aggro">(추정) 생년월일을 알려주세요!</h3>
            </div>
            <Button
              variant="input"
              size="md"
              onClick={() => setShowCalendar(true)}
              className="text-left"
            >
              {formData.birthDate
                ? format(formData.birthDate, 'yyyy년 M월 d일', { locale: ko })
                : '생년월일을 선택해주세요'
              }
            </Button>
          </div>

          {/* 03. BCS 선택 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[17px] font-bold font-aggro">03</span>
              <h3 className="text-[#003DA5] text-[17px] font-bold font-aggro">BCS를 선택해주세요!</h3>
            </div>
            <p className="text-[#343434] text-[11px] font-normal text-center mb-4">
              옆에서 아이를 관찰하고 아래 이미지 중<br />
              가장 유사한 체형을 골라 선택해주세요.
            </p>

            {/* BCS 이미지 버튼들 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, bcs: 'skinny' }))}
                className={`relative rounded-xl overflow-hidden transition-all ${formData.bcs === 'skinny'
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
                  }`}
              >
                <Image
                  src="/img/basic-questions/skinny.png"
                  alt="저체중 (Skinny)"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                {formData.bcs === 'skinny' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, bcs: 'just-right' }))}
                className={`relative rounded-xl overflow-hidden transition-all ${formData.bcs === 'just-right'
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
                  }`}
              >
                <Image
                  src="/img/basic-questions/just-right.png"
                  alt="적정 체중 (Just Right)"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                {formData.bcs === 'just-right' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, bcs: 'husky' }))}
                className={`relative rounded-xl overflow-hidden transition-all ${formData.bcs === 'husky'
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
                  }`}
              >
                <Image
                  src="/img/basic-questions/husky.png"
                  alt="과체중 (Husky)"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                {formData.bcs === 'husky' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, bcs: 'chubby' }))}
                className={`relative rounded-xl overflow-hidden transition-all ${formData.bcs === 'chubby'
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
                  }`}
              >
                <Image
                  src="/img/basic-questions/chubby.png"
                  alt="비만 (Chubby)"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                {formData.bcs === 'chubby' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 04. 활동 수준 */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[#003DA5] text-[17px] font-bold font-aggro">04</span>
              <h3 className="text-[#003DA5] text-[17px] font-bold font-aggro">활동 수준을 알려주세요!</h3>
            </div>
            <div className="space-y-3">
              {activityLevels.map((level) => (
                <div
                  key={level.id}
                  className={`
                    bg-white rounded-xl p-4 border-2 cursor-pointer transition-all
                    ${formData.activityLevel === level.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, activityLevel: level.id }))}
                >
                  <h4 className="text-[#000000] text-[13px] font-semibold text-center mb-1">{level.label}</h4>
                  <p className="text-[#000000] text-[13px] font-normal text-center mb-2">{level.description}</p>
                  <p className="text-[#000000] text-[13px] font-normal text-center">{level.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className={!isFormValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
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