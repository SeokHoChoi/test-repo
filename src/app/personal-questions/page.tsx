'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { calculateNBTIFromAnswers } from '@/lib/nbti';

interface PersonalQuestionsData {
  mealEnjoyment: string | null;
  eatingSpeed: string | null;
  walkReaction: string | null;
  playPattern: string | null;
}

export default function PersonalQuestionsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PersonalQuestionsData>({
    mealEnjoyment: null,
    eatingSpeed: null,
    walkReaction: null,
    playPattern: null
  });

  const questions = [
    {
      id: 'mealEnjoyment',
      title: '식사를 얼마나 즐기나요?',
      options: [
        { id: 'excited', label: '좋아함' },
        { id: 'normal', label: '보통' },
        { id: 'indifferent', label: '별로 즐기지 않음' }
      ]
    },
    {
      id: 'eatingSpeed',
      title: '밥그릇을 비우는 속도를 알려주세요!',
      options: [
        { id: 'fast', label: '빠름' },
        { id: 'normal', label: '보통' },
        { id: 'slow', label: '느림' }
      ]
    },
    {
      id: 'walkReaction',
      title: '산책할 때 반응은 어떤가요?',
      options: [
        { id: 'excited', label: '신남' },
        { id: 'normal', label: '보통' },
        { id: 'reluctant', label: '귀찮아함' }
      ]
    },
    {
      id: 'playPattern',
      title: '놀이 패턴과 선호는 어떻게 되나요?',
      options: [
        { id: 'independent', label: '혼자서도 잘 놀고 낯을 가려요' },
        { id: 'social', label: '친구들과 함께 노는걸 좋아해요' },
        { id: 'observer', label: '노는 것보다 관찰하고 구경하는걸 좋아해요' }
      ]
    }
  ];

  const handleSubmit = () => {
    // 모든 질문에 답했는지 확인
    const allAnswered = questions.every(q => formData[q.id as keyof PersonalQuestionsData]);

    if (!allAnswered) {
      alert('모든 질문에 답해주세요.');
      return;
    }

    // 기본 질문 데이터 가져오기
    const basicData = sessionStorage.getItem('basicQuestions');
    if (!basicData) {
      alert('기본 정보가 없습니다. 처음부터 다시 시작해주세요.');
      router.push('/basic-questions');
      return;
    }

    const basic = JSON.parse(basicData);

    // NBTI 계산
    const result = calculateNBTIFromAnswers(
      {
        dogName: basic.dogName,
        birthDate: basic.birthDate,
        bcs: basic.bcs,
        activityLevel: basic.activityLevel,
      },
      {
        mealEnjoyment: formData.mealEnjoyment as any,
        eatingSpeed: formData.eatingSpeed as any,
        walkReaction: formData.walkReaction as any,
        playPattern: (formData.playPattern === 'observer' ? 'independent' : formData.playPattern) as any,
      }
    );

    // 결과를 세션 스토리지에 저장
    sessionStorage.setItem('nbtiResult', JSON.stringify(result));

    // 결과 페이지로 이동
    router.push('/results');
  };

  // 기존 임시 계산 함수는 유틸로 대체됨

  const isFormValid = questions.every(q => formData[q.id as keyof PersonalQuestionsData]);

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 max-w-md mx-auto">
        <Header />

        {/* 질문 폼 */}
        <div className="bg-[#EEEEEE] rounded-[30px] pt-[33px] pb-[35px] px-[38px] space-y-8">
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="text-center mb-[20px]">
                <span className="text-[#003DA5] text-[15px] font-semibold">{String(index + 5).padStart(2, '0')}</span>
                <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">{question.title}</h3>
              </div>

              {/* 동그란 배지 형태의 옵션들 */}
              <div className={`flex ${question.id === 'playPattern' ? 'flex-col space-y-[10px] items-center' : 'flex-wrap gap-2 justify-center'}`}>
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFormData(prev => ({ ...prev, [question.id]: option.id }))}
                    className={`
                      px-[18px] py-[10px] rounded-full text-[13px] font-medium transition-all text-center
                      ${formData[question.id as keyof PersonalQuestionsData] === option.id
                        ? 'bg-[#003DA5] text-white shadow-lg'
                        : 'bg-white text-[#000000] hover:text-[#003DA5]'
                      }
                      ${question.id === 'playPattern' ? '' : 'whitespace-nowrap'}
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 결과 보기 버튼 */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            fullWidth={false}
            roundedClass="rounded-[50px]"
            size="none"
            className={`inline-flex items-center justify-center px-[80px] py-[10px] text-[15px] font-semibold min-w-[255px] ${!isFormValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
          >
            결과 보기
          </Button>
        </div>
      </div>
    </div>
  );
}