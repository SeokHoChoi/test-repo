'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { NBTIResultCard } from '@/components/NBTIResultCard';
import { InfoCard } from '@/components/InfoCard';
import { ShareCard } from '@/components/ShareCard';
import { MatchingCard } from '@/components/MatchingCard';
import { InfoDisplayCard } from '@/components/InfoDisplayCard';
import { generateShareUrl, type NBTIResult } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<NBTIResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultData = sessionStorage.getItem('nbtiResult');
    if (resultData) {
      setResult(JSON.parse(resultData));
    } else {
      // 결과 데이터가 없으면 랜딩 페이지로 리다이렉트
      router.push('/landing');
    }
    setLoading(false);
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
          dogImage="/img/results/dog-1.png"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-[4px] leading-none m-0">
              <span className="text-[18px] w-[18px] h-[18px] flex items-center justify-center leading-none">🏆</span>
              <h3 className="font-medium text-[20px] leading-none m-0 font-gumi text-[#212121]">{result.nbti.name}</h3>
            </div>
            <p className="font-normal text-[13px] leading-none my-[5px] text-[#8B8B8B]">{result.nbti.type}</p>
            <div className="h-px bg-[#E3E3E3] mt-[5px] mx-auto" style={{ width: 'calc(100% - 82px)' }}></div>
          </div>

          <div className="text-center mt-[13px] mb-[10px]">
            <p className="text-[#003DA5] font-semibold text-[13px]">
              "{result.nbti.description}"
            </p>
          </div>

          {/* 요약 텍스트 */}
          <div className="text-center text-[#000000] font-normal text-[13px] leading-relaxed px-[50px] mb-[15px]">
            <p className="break-keep">{result.nbti.detail.split('!')[0]}!</p>
          </div>

          {/* 상세 설명 텍스트 */}
          <div className="text-center text-[#000000] font-normal text-[13px] leading-relaxed">
            <p className="break-keep">{result.nbti.detail.split('!')[1]}</p>
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
            <div className="flex items-start gap-[20px]">
              <span className="text-[13px] w-[13px] h-[13px] flex items-center justify-center flex-shrink-0 mt-[4px]">☑️</span>
              <p className="text-[#343434] font-normal text-[13px] leading-[18px]">
                성장 중이면서 매우 활발한 활동을 하는 건강한 아이로, 하루 종일 뛰어놀아도 적정 체중을 유지하고 있어 현재 급여량과 사료가 잘 맞는 상태예요.
              </p>
            </div>

            <div className="flex items-start gap-[20px]">
              <span className="text-[13px] w-[13px] h-[13px] flex items-center justify-center flex-shrink-0 mt-[4px]">☑️</span>
              <p className="text-[#343434] font-normal text-[13px] leading-[18px]">
                성장 속도에 맞춰 단백질과 칼슘 함량이 높은 퍼피 사료의 지속적인 급여가 필요하지만, 빠른 식사 속도로 인한 소화불량을 방지하기 위해 슬로우 피더나 퍼즐 피더 사용을 권장해요.
              </p>
            </div>

            <div className="flex items-start gap-[20px]">
              <span className="text-[13px] w-[13px] h-[13px] flex items-center justify-center flex-shrink-0 mt-[4px]">☑️</span>
              <p className="text-[#343434] font-normal text-[13px] leading-[18px]">
                사교적 성향에 맞게 퍼피 소셜라이징 클래스나 강아지 놀이터에서 다양한 친구들과 뛰어놀며 건강한 사회성을 기를 수 있도록 도와주세요!
              </p>
            </div>
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
            <MatchingCard
              type="good"
              badgeText="잘 맞는 유형"
              imageSrc="/img/results/dog-1.png"
              imageAlt="강아지"
              title="꿈 많은 탐험가"
              emoji="🔭"
              description="IHP-EA 적극적 사교형 탐험가"
            />

            <MatchingCard
              type="bad"
              badgeText="안 맞는 유형"
              imageSrc="/img/results/dog-1.png"
              imageAlt="강아지"
              title="꿈 많은 탐험가"
              emoji="🔭"
              description="IHP-EA 적극적 사고가"
            />
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
              반려견의 건강 상태를 32가지 유형으로 나누고<br />
              어떻게 하면 영양학적으로 더 건강하게 지낼 수<br />
              있을지 알려주는 지표에요.
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