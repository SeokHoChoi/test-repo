import { Button } from '@/components/Button';
import { ShareCard } from '@/components/ShareCard';
import { GrayInfoCard } from '@/components/GrayInfoCard';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://test-repo-qux1.vercel.app';

export const metadata: Metadata = {
  title: "우리 아이의 NBTI는? | Jelly Univ",
  description: "🐶 우리 아이 건강 MBTI 테스트 | 반려견의 건강 상태를 32가지 유형으로 나누고 어떻게 하면 영양학적으로 더 건강하게 지낼 수 있을지 알려주는 지표",
  openGraph: {
    title: "우리 아이의 NBTI는? | Jelly Univ",
    description: "🐶 우리 아이 건강 MBTI 테스트\n너의 갱얼쥐 NBTI가 뭐야? 🐾",
    type: 'website',
    images: [`${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`],
    siteName: '젤리대학교',
  },
  twitter: {
    card: 'summary_large_image',
    title: "우리 아이의 NBTI는? | Jelly Univ",
    description: "🐶 우리 아이 건강 MBTI 테스트\n너의 갱얼쥐 NBTI가 뭐야? 🐾",
    images: [`${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`],
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* 반응형 컨테이너 - 가로는 꽉 채우되 적절한 최대폭 제한 */}
      <div className="w-full min-w-[320px] max-w-[430px] mx-auto px-[clamp(16px,4vw,24px)] landscape:py-4">
        {/* 히어로 섹션 래퍼: 날개를 배경 뒤로 보내기 위해 래퍼 기준으로 배치 */}
        <div className="relative">
          {/* 모든 화면에서 보이는 양옆 배경 타원(날개) - 배경 뒤(z-0), 비율 기반 위치 */}
          {/* TODO: 예시 설명 드린 후 제거 */}
          <div className="pointer-events-none absolute inset-0 z-0">
            {/* 왼쪽 타원: 컨테이너 기준 퍼센트 위치/크기 */}
            {/* <div className="absolute left-[-8%] top-[12%] w-[30%] aspect-square bg-[#EFEFEF] rounded-full" /> */}
            {/* 오른쪽 타원 */}
            {/* <div className="absolute right-[-6%] top-[26%] w-[22%] aspect-square bg-[#EFEFEF] rounded-full" /> */}
          </div>

          {/* 히어로 섹션(배경 이미지 + 타이틀~참여자 문구 포함) - 비율 고정으로 기기별 일관성 유지 */}
          <div
            className="relative z-10 bg-no-repeat bg-bottom pb-[312px] mb-[42px] w-full aspect-[430/312]"
            style={{ backgroundImage: "url('/img/landing/main-bg.png')", backgroundPosition: "center calc(100% + 4px)", backgroundSize: "100% auto" }}
          >
            {/* 랜딩 페이지 전용 헤더 */}
            <div className="text-center">
              <h1 className="font-bold text-gray-900 pt-[86px] mb-[20px] text-[37px]">
                <span className="block">우리 갱얼쥐의</span>
                <span className="block -mt-[5px]"><span className="text-[#003DA5]">NBTI</span>는 뭘까?</span>
              </h1>
            </div>

            {/* 설명 텍스트 */}
            <p className="text-[#343434] text-center landscape:mb-4 text-[15px]">
              우리 반려견이
              <span
                className="inline-block px-1 rounded-full bg-[#FFECB3]"
              >
                32가지 건강 유형
              </span>
              중<br />
              어느 유형인지 알려드려요
            </p>

            {/* 메인 버튼 */}
            <div className="mt-9 mb-[12px] landscape:mb-3 flex justify-center">
              <Button
                href="/basic-questions"
                fullWidth={false}
                roundedClass="rounded-[50px]"
                size="none"
                className="inline-flex items-center justify-center px-[60px] pt-[23px] pb-[19px] text-[20px] leading-[20px] font-normal"
              >
                <span className="[font-family:var(--font-abeezee)]">테스트 시작하기</span>
              </Button>
            </div>

            {/* 참여자 수 */}
            <div className="flex items-center justify-center gap-2 mb-6 landscape:mb-4">
              <span className="text-[#343434] text-[13px] leading-[130%] font-normal align-middle font-aggro tracking-[0]">지금까지 1,790 갱얼쥐가 참여했어요🐾</span>
            </div>
          </div>
        </div>

        {/* NBTI 설명 카드  */}
        <ShareCard className="w-full max-w-[342px] mx-auto mb-10 py-9">
          <div className="text-center">
            <div className="mx-auto mb-3 flex items-center justify-center w-[20px] h-[20px]">
              <span className="text-[20px] leading-none">🐕</span>
            </div>
            <h3 className="font-aggro font-semibold text-[20px] text-[#003DA5] leading-tight">NBTI란?</h3>
            <p className="font-normal text-[15px] text-[#003DA5] mb-3">(Nutritional Body & Type Index)</p>
            <p className="text-[#343434] text-[13px] font-normal leading-relaxed mb-4">
              반려견의 건강 상태를 32가지 유형으로 나누고<br />
              어떻게 하면 영양학적으로 더 건강하게 지낼 수<br />
              있을지 알려주는 지표에요.
            </p>
            <div className="flex justify-center">
              <Button
                href="/basic-questions"
                fullWidth={false}
                size="none"
                roundedClass="rounded-[50px]"
                className="!w-auto px-[33px] py-[10px] text-[15px] font-semibold"
              >
                테스트 시작하기
              </Button>
            </div>
          </div>
        </ShareCard>

        {/* 32가지 유형 설명 */}
        <div className="mb-6 landscape:mb-4 text-center">
          <h3 className="text-gray-900 font-semibold text-[25px] mb-0 landscape:mb-2">32가지 유형에 대해</h3>

          <div className="mt-4">
            {/* 상단 카드들: 기본 20px 간격 */}
            <div className="space-y-[20px]">
              <GrayInfoCard title="생애주기에 따른 구분" subtitle="퍼피 · 어덜트 · 시니어" />

              <GrayInfoCard
                title="BCS에 따른 구분"
                subtitle={(
                  <>
                    저체중(1-3) · 이상적(4-5)
                    <br />
                    과체중(6-7) · 비만(8-9)
                  </>
                )}
              />
            </div>

            {/* BCS 설명: 바로 위 카드와 15px 간격 (블록 중앙, 내부 텍스트 좌측) */}
            <div className="mt-[15px] flex justify-center items-center">
              <div className="text-left">
                <p className="text-[#343434] text-[13px] font-medium mb-2">
                  ✔️ BCS(신체충실지수)란?
                </p>
                <p className="text-[#343434] text-[13px] font-normal leading-[1.5]">
                  반려동물의 비만도를 평가하는 대표적인 방법<br />
                  으로, 체중이나 키가 아니라 외형과 촉진(만져<br />
                  보기)으로 판단하는 것입니다.
                </p>
              </div>
            </div>

            {/* 이후 카드들: 다시 20px 간격 */}
            <div className="space-y-[20px] mt-[20px] mb-[28px]">
              <GrayInfoCard title="활동 수준에 따른 구분" subtitle="저활동 · 보통활동 · 고활동" />

              <GrayInfoCard title="식사 패턴에 따른 구분" />

              <GrayInfoCard title="활동 패턴에 따른 구분" />
            </div>
          </div>
        </div>

        {/* TODO: 공통 컴포넌트는 추후 적용 */}
        <div className="mb-5 text-center space-y-3">
          <div>
            <Button
              href="/basic-questions"
              fullWidth={false}
              roundedClass="rounded-[50px]"
              size="none"
              className="inline-flex items-center justify-center px-[80px] py-[10px] text-[15px] font-semibold min-w-[255px]"
            >
              테스트 시작하기
            </Button>
          </div>
          <div>
            <div className="inline-block">
              <Button variant="secondary" shareAction className="inline-flex items-center gap-1 text-[#343434] text-[15px] font-medium py-1 px-2">
                테스트 공유하기 <Upload size={19} strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 mx-auto">
          <Image
            src="/img/jellyu-logo.png"
            alt="Jelly Univ Logo"
            width={55}
            height={55}
            className="w-full h-full object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
