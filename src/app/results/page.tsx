'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { NBTIResultCard } from '@/components/NBTIResultCard';
import { InfoCard } from '@/components/InfoCard';
import { MatchingCard } from '@/components/MatchingCard';
import { InfoDisplayCard } from '@/components/InfoDisplayCard';
import { generateShareUrl, type NBTIResult, type SurveyAnswers, generateNBTIResultFromSurvey } from '@/lib/utils';
import { getPuppyImagePathByTitle } from '@/lib/nbti';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<NBTIResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        // 1. 기존 결과 데이터가 있는지 확인
        const resultData = sessionStorage.getItem('nbtiResult');
        if (resultData) {
          setResult(JSON.parse(resultData));
          setLoading(false);
          return;
        }

        // 2. 설문조사 답변 데이터가 있는지 확인
        const surveyData = sessionStorage.getItem('surveyAnswers');
        if (surveyData) {
          const answers: SurveyAnswers = JSON.parse(surveyData);
          const newResult = await generateNBTIResultFromSurvey(answers);
          if (newResult) {
            setResult(newResult);
            // 새로운 결과를 sessionStorage에 저장
            sessionStorage.setItem('nbtiResult', JSON.stringify(newResult));
          } else {
            console.error('NBTI 결과 생성 실패');
            router.push('/landing');
          }
        } else {
          // 설문조사 데이터도 없으면 랜딩 페이지로 리다이렉트
          router.push('/landing');
        }
      } catch (error) {
        console.error('결과 로드 실패:', error);
        router.push('/landing');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [router]);

  const handleShare = () => {
    // URL에 결과 데이터를 담아서 공유 페이지로 이동
    if (result) {
      const shareUrl = generateShareUrl(result);
      router.push(shareUrl);
    }
  };

  const handleCheckFood = () => {
    window.open('https://www.jellyu-univ.com', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 max-w-md mx-auto">
          <Header />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">결과를 불러오고 있어요...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 max-w-md mx-auto">
          <Header />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">결과를 찾을 수 없습니다.</p>
              <Button href="/landing" size="sm" className="!w-auto inline-flex">
                메인으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 max-w-md mx-auto">
        <Header />

        {/* 결과 카드 */}
        <NBTIResultCard
          dogName={result.dogName}
          dogImage={result.nbti.dogImage}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-[4px] leading-none m-0">
              <h3 className="font-medium text-[20px] leading-none m-0 font-gumi text-[#212121]">{result.nbti.name}</h3>
            </div>
            <p className="font-normal text-[13px] leading-none my-[5px] text-[#8B8B8B]">{result.nbti.id} ({result.nbti.type})</p>
            <div className="h-px bg-[#E3E3E3] mt-[5px] mx-auto" style={{ width: 'calc(100% - 82px)' }}></div>
          </div>

          <div className="text-center mt-[13px] mb-[10px]">
            <p className="text-[#003DA5] font-semibold text-[13px]">
              &ldquo;{result.nbti.definition}&rdquo;
            </p>
          </div>

          {/* 설명 텍스트들 */}
          <div className="text-center text-[#000000] font-normal text-[13px] leading-relaxed px-[50px] mb-[15px]">
            {Array.isArray(result.nbti.description)
              ? result.nbti.description.map((desc, index) => (
                <p key={index} className="break-keep mb-2 last:mb-0">{desc}</p>
              ))
              : <p className="break-keep">{result.nbti.description}</p>
            }
          </div>
        </NBTIResultCard>

        {/* 결과 공유하기 텍스트 */}
        <div className="text-center mt-[15px] mb-[30px]">
          <Button
            onClick={handleShare}
            variant="secondary"
            size="sm"
            fullWidth={false}
            customPadding="py-1 px-2"
            className="inline-flex items-center gap-1 !text-[#000000] !text-[15px] font-medium"
          >
            결과 공유하기 <Upload size={19} strokeWidth={1.5} />
          </Button>
        </div>

        {/* 영양관리 팁 카드 */}
        <InfoCard className="mb-6" customPadding="pt-[24px] px-[30px] pb-[32.69px]">
          <div className="text-center mb-[21px]">
            <span className="text-2xl mb-2 block">💡</span>
            <h3 className="text-[#003DA5] font-semibold text-[22px]">우리 아이 영양관리 팁</h3>
          </div>

          <div className="space-y-[22px]">
            {result.nbti.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-[20px]">
                <span className="text-[13px] w-[13px] h-[13px] flex items-center justify-center flex-shrink-0 mt-[4px]">☑️</span>
                <p className="text-[#343434] font-normal text-[13px] leading-[18px]">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-[41px] text-center">
            <span className="text-[20px] w-[20px] h-[20px] mb-[11px] block flex items-center justify-center mx-auto">🤔</span>
            <h4 className="text-[#003DA5] font-semibold text-[20px] mb-2 text-center">
              잠깐, 내가 먹이고 있는 사료<br />
              얼마나 안전할까요?
            </h4>
            <p className="text-[#000000] font-normal text-[13px] mb-[20px]" style={{ marginTop: '15px' }}>
              서울대∙한국수의영양학회 임원 수의사가 설계한<br />
              AI가 30초 만에 분석해드려요!
            </p>
            <Button
              onClick={handleCheckFood}
              variant="primary"
              size="md"
              fullWidth={false}
              roundedClass="rounded-[50px]"
              customPadding="px-[46px] py-[12px]"
              className="mx-auto min-w-[161px] bg-[#003DA5] text-[#FFFFFF] font-semibold text-[15px]"
            >
              더 알아보기
            </Button>
          </div>
        </InfoCard>

        {/* 궁합 섹션 */}
        <div className="mb-[28.77px]" style={{ marginTop: '41px' }}>
          <h3 className="text-[#343434] font-aggro font-semibold text-[22px] text-center mb-[30.23px]">
            만약 한 아이를<br />
            더 식구로 맞이한다면..!
          </h3>

          <div className="flex justify-center gap-[13px]">
            {(() => {
              // nbti-personas.json에서 compatibility 정보 가져오기
              const compatibility = result.compatibility;

              if (!compatibility) {
                return <div>Compatibility 정보를 찾을 수 없습니다.</div>;
              }

              return (
                <>
                  <MatchingCard
                    type="good"
                    badgeText="잘 맞는 유형"
                    imageSrc={getPuppyImagePathByTitle(compatibility.best.title)}
                    imageAlt="강아지"
                    title={compatibility.best.title}
                    emoji="🔭"
                    description={`${compatibility.best.type_code} (${compatibility.best.type_label})`}
                  />
                  <MatchingCard
                    type="bad"
                    badgeText="안 맞는 유형"
                    imageSrc={getPuppyImagePathByTitle(compatibility.worst.title)}
                    imageAlt="강아지"
                    title={compatibility.worst.title}
                    emoji="🔭"
                    description={`${compatibility.worst.type_code} (${compatibility.worst.type_label})`}
                  />
                </>
              );
            })()}
          </div>
        </div>

        {/* 친구 궁합 카드 */}
        <InfoDisplayCard
          emoji="🐶"
          title={
            <>
              {result.dogName}와 친구의 궁합이<br />
              궁금하다면?
            </>
          }
          description={
            <>
              지금 테스트를 공유해 우리아이와<br />
              찰떡 궁합인 친구를 찾아보세요!
            </>
          }
          buttons={[
            { text: "테스트 공유하기", variant: 'primary', onClick: handleShare },
            { text: "결과 공유하기", variant: 'outline', onClick: handleShare }
          ]}
          customPadding="px-[30px] pt-[23.5px] pb-[28.5px]"
          noMargin
        />

        <div className="mb-[29px]"></div>

        {/* NBTI 설명 카드 */}
        <InfoDisplayCard
          emoji="🐕"
          title="NBTI란?"
          subtitle="(Nutritional Body & Type Index)"
          description={
            <>
              반려견의 가장 기본적인 정보를 <br />
              32가지 유형으로 분류하는 시스템입니다.<br />
              캐릭터는 각 유형을 이해하기 쉽게 일반화하여<br />
              표현한 것이고, 건강 관리 팁은 우리 아이에게<br />
              실제로 도움이 되는 맞춤 정보를 제공합니다.
            </>
          }
          buttons={[
            { text: "다시 테스트하기", variant: "primary", onClick: () => router.push('/basic-questions') }
          ]}
          customPadding="px-[36.5px] py-[26.85px]"
        />

        {/* 푸터 로고 */}
        <footer className="pt-[30px] pb-[15px] text-center">
          <div className="w-16 h-16 mx-auto mb-2">
            <Image
              src="/img/jellyu-logo.png"
              alt="Jelly Univ Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}