'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { NBTIResultCard } from '@/components/NBTIResultCard';
import { ShareCard } from '@/components/ShareCard';
import {
  getResultFromUrlOrStorage,
  generateShareUrl,
  shareToKakao,
  shareToX,
  shareToInstagram,
  copyToClipboard,
  type NBTIResult
} from '@/lib/utils';
import Image from 'next/image';


export default function SharePage() {
  const router = useRouter();
  const [result, setResult] = useState<NBTIResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultData = getResultFromUrlOrStorage();
    if (resultData) {
      setResult(resultData);
    } else {
      // 결과 데이터가 없으면 랜딩 페이지로 리다이렉트
      router.push('/landing');
    }
    setLoading(false);
  }, [router]);

  const handleRetakeTest = () => {
    // 세션 스토리지 클리어
    sessionStorage.removeItem('basicQuestions');
    sessionStorage.removeItem('nbtiResult');
    router.push('/basic-questions');
  };

  const handleOtherTests = () => {
    window.open('https://www.jellyu-univ.com', '_blank');
  };

  // 공유 기능들
  const handleKakaoShare = () => {
    if (result) shareToKakao(result, shareUrl);
  };

  const handleInstagramShare = () => {
    shareToInstagram();
  };

  const handleXShare = () => {
    if (result) shareToX(result, shareUrl);
  };

  const handleCopyLink = () => {
    copyToClipboard(shareUrl);
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
              <Button href="/landing" size="sm">
                메인으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // URL에 결과 데이터를 담은 공유 URL 생성
  const shareUrl = result ? generateShareUrl(result) : `${window.location.origin}/results/share`;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 max-w-md mx-auto">
        <Header />

        <ShareCard
          customStyle={{
            boxShadow: '5px 2.5px 5px 0px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* 공유 안내 */}
          <p className="text-gray-700 text-sm text-center mb-8">
            아래 이미지를 길게 눌러 저장 후, 채널을 선택해 공유할 수 있어요.
          </p>

          {/* 공유용 결과 카드 */}
          <div className="share-card mb-8">
            <NBTIResultCard
              dogName={result.dogName}
              dogImage="/img/results/dog-1.png"
            >
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏆</span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg font-aggro">{result.nbti.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{result.nbti.type}</p>
              </div>

              <div className="text-center mb-4">
                <p className="text-blue-600 font-medium text-sm">
                  "{result.nbti.description}"
                </p>
              </div>

              <div className="text-gray-700 text-sm leading-relaxed">
                <p className="mb-2">{result.nbti.detail.split('!')[0]}!</p>
                <p>{result.nbti.detail.split('!')[1]}</p>
              </div>
            </NBTIResultCard>
          </div>

          {/* 공유 버튼들 */}
          <div className="flex justify-center gap-[10px]">
            <button onClick={handleInstagramShare} title="인스타그램 공유" className="w-[30px] h-[30px]">
              <img src="/img/results/share/insta.png" alt="인스타그램" className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleKakaoShare} title="카카오톡 공유" className="w-[30px] h-[30px]">
              <img src="/img/results/share/kakao.png" alt="카카오톡" className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleXShare} title="트위터 공유" className="w-[30px] h-[30px]">
              <img src="/img/results/share/twitter.png" alt="트위터" className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleCopyLink} title="링크 복사" className="w-[30px] h-[30px]">
              <img src="/img/results/share/link.png" alt="링크 복사" className="w-[30px] h-[30px] object-contain" />
            </button>
          </div>
        </ShareCard>

        {/* 사료 안전성 체크 */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <span className="text-4xl mb-2 block">😟</span>
            <h3 className="text-white font-semibold text-lg mb-2">
              지금 먹이는 사료 계속 먹여도 안전할까요?
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              서울대·한국수의영양학회 임원 수의사가 설계한 AI가 30초 만에 분석해드려요!
            </p>
            <Button
              variant="ghost"
              size="md"
              onClick={handleOtherTests}
            >
              바로 알아보기
            </Button>
          </div>
        </div>

        {/* 궁합 체크 */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="text-center">
            <span className="text-2xl mb-2 block">🐕</span>
            <h3 className="text-blue-600 font-semibold text-lg mb-2">
              {result.dogName}와 친구의 궁합이 궁금하다면?
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              지금 테스트를 공유해 우리아이와 찰떡 궁합인 친구를 찾아보세요!
            </p>
            <Button
              size="md"
              onClick={() => window.open('https://www.jellyu-univ.com', '_blank')}
            >
              테스트 공유하기
            </Button>
          </div>
        </div>

        {/* NBTI 설명 */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <div className="text-center">
            <span className="text-2xl mb-2 block">🐕</span>
            <h3 className="text-blue-600 font-semibold text-lg mb-2">NBTI란?</h3>
            <p className="text-gray-500 text-sm mb-2">(Nutritional Body & Type Index)</p>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              반려견의 건강 상태를 32가지 유형으로 나누고 어떻게 하면 영양학적으로 더 건강하게 지낼 수 있을지 알려주는 지표에요.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={handleRetakeTest}
            >
              다시 테스트하기
            </Button>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center">
        <div className="w-16 h-16 mx-auto">
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
  );
}