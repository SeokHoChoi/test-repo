'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';

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
    const result = calculateNBTI({ basic, personal: formData });

    // 결과를 세션 스토리지에 저장
    sessionStorage.setItem('nbtiResult', JSON.stringify(result));

    // 결과 페이지로 이동
    router.push('/results');
  };

  const calculateNBTI = (data: any) => {
    // 간단한 NBTI 계산 로직 (실제로는 더 복잡한 알고리즘이 필요)
    const { basic, personal } = data;

    // 생애주기 분류 - 날짜 객체로 변환
    const birthDate = new Date(basic.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    let lifeStage = 'adult';
    if (age <= 1) lifeStage = 'puppy';
    else if (age >= 7) lifeStage = 'senior';

    // BCS 분류
    let bcsCategory = 'normal';
    if (basic.bcs === 'skinny') bcsCategory = 'underweight';
    else if (basic.bcs === 'husky' || basic.bcs === 'chubby') bcsCategory = 'overweight';

    // 활동 패턴 분류
    let activityPattern = 'moderate';
    if (personal.walkReaction === 'excited' && personal.playPattern === 'social') {
      activityPattern = 'social';
    } else if (personal.walkReaction === 'reluctant' && personal.playPattern === 'independent') {
      activityPattern = 'independent';
    }

    // 식사 패턴 분류
    let eatingPattern = 'normal';
    if (personal.eatingSpeed === 'fast') eatingPattern = 'fast';
    else if (personal.eatingSpeed === 'slow') eatingPattern = 'slow';

    // NBTI 타입 결정 (간단한 예시)
    const nbtiTypes = [
      { id: 'energetic-puppy', name: '에너지 퍼피', type: '활발한 어린이', description: '끊임없이 뛰어다니는 에너지 뭉치', detail: '항상 활발하고 놀기를 좋아하는 강아지예요! 충분한 운동과 다양한 놀이가 필요해요.', tips: ['매일 충분한 산책', '다양한 장난감 제공', '정기적인 건강 체크'] },
      { id: 'calm-senior', name: '차분한 시니어', type: '지혜로운 어른', description: '차분하고 안정적인 성격의 강아지', detail: '조용하고 안정적인 성격으로 가족과 함께 있는 시간을 소중히 여겨요.', tips: ['편안한 환경 조성', '적당한 운동', '영양 관리'] },
      { id: 'food-lover', name: '푸드 러버', type: '식탐쟁이', description: '음식에 대한 사랑이 넘치는 강아지', detail: '음식을 매우 좋아하고 식사 시간을 기다리는 강아지예요. 적절한 식사량 관리가 중요해요.', tips: ['정해진 시간에 식사', '적절한 사료량', '간식 조절'] }
    ];

    // 간단한 매칭 로직
    let selectedType = nbtiTypes[0]; // 기본값
    if (lifeStage === 'senior' && personal.playPattern === 'calm') {
      selectedType = nbtiTypes[1];
    } else if (personal.mealEnjoyment === 'excited' && personal.eatingSpeed === 'fast') {
      selectedType = nbtiTypes[2];
    }

    return {
      dogName: basic.dogName,
      nbti: selectedType,
      basicInfo: {
        lifeStage,
        bcsCategory,
        activityLevel: basic.activityLevel,
        activityPattern,
        eatingPattern
      }
    };
  };

  const isFormValid = questions.every(q => formData[q.id as keyof PersonalQuestionsData]);

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 max-w-md mx-auto">
        <Header />

        {/* 질문 폼 */}
        <div className="bg-[#EEEEEE] rounded-[30px] pt-[33px] pb-[35px] px-[38px] space-y-8">
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="text-center mb-2">
                <span className="text-[#003DA5] text-[15px] font-semibold">{String(index + 5).padStart(2, '0')}</span>
                <h3 className="text-[#003DA5] text-[15px] font-semibold -mt-1">{question.title}</h3>
              </div>

              {/* 동그란 배지 형태의 옵션들 */}
              <div className={`flex ${question.id === 'playPattern' ? 'flex-col space-y-3' : 'flex-wrap gap-3 justify-center'}`}>
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFormData(prev => ({ ...prev, [question.id]: option.id }))}
                    className={`
                      px-[22px] py-[10px] rounded-full text-[13px] font-medium transition-all text-center
                      ${formData[question.id as keyof PersonalQuestionsData] === option.id
                        ? 'bg-[#003DA5] text-white shadow-lg'
                        : 'bg-white text-[#000000] font-medium hover:text-[#003DA5]'
                      }
                      ${question.id === 'playPattern' ? 'w-full text-left' : 'whitespace-nowrap'}
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
            결과 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
}