'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { NBTIResultCard } from '@/components/NBTIResultCard';
import { InfoDisplayCard } from '@/components/InfoDisplayCard';
import {
  getResultFromUrlOrStorage,
  generateShareUrl,
  shareToKakao,
  shareToX,
  shareToInstagram,
  copyToClipboard,
  renderNBTIImageDataUrl,
  type NBTIResult
} from '@/lib/utils';
import Image from 'next/image';
import { getArchetypeImagePath } from '@/lib/nbti';


export default function SharePage() {
  const router = useRouter();
  const [result, setResult] = useState<NBTIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');

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

  // 결과 카드 이미지를 PNG로 렌더링하여 <img>로 표시 (모바일 길게 눌러 저장 가능)
  useEffect(() => {
    // 캡쳐용 @font-face 직접 주입 (Next.js 폰트 최적화 우회)
    const injectCaptureStyles = () => {
      const style = document.createElement('style');
      style.setAttribute('data-capture-fonts', 'true');
      style.textContent = `
@font-face {
  font-family: 'SB-Aggro-Capture';
  src: url('/fonts/sb-aggro/SB-AggroOTF-M.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: 'Gumi-Capture';
  src: url('/fonts/gumi-romance/Gumi-Romance.woff2') format('woff2');
  font-weight: normal;
  font-display: swap;
}
.share-card .font-aggro,
.share-card h3.font-aggro {
  font-family: 'SB-Aggro-Capture', var(--font-aggro), system-ui !important;
}
.share-card .font-gumi,
.share-card h2.font-gumi {
  font-family: 'Gumi-Capture', 'Gumi-Romance', system-ui !important;
}
`;
      document.head.appendChild(style);
      return style;
    };

    const preloadImg = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = document.createElement('img');
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    };

    const renderImage = async () => {
      if (!result) return;
      setRendering(true);

      // 1. 폰트 스타일 주입
      const fontStyle = injectCaptureStyles();

      // 2. 강아지 이미지 프리로드
      await preloadImg('/img/results/dog-1.png');

      // 3. 폰트 로드 대기
      await new Promise((r) => setTimeout(r, 2000));

      // 4. 캡쳐 실행
      const url = await renderNBTIImageDataUrl();
      setRenderedImageUrl(url);
      if (!url) {
        setSaveMessage('❌ 이미지 생성에 실패했습니다. 새로고침 후 다시 시도해주세요.');
        setTimeout(() => setSaveMessage(''), 5000);
      }
      setRendering(false);

      // 5. 정리
      try { document.head.removeChild(fontStyle); } catch { }
    };
    renderImage();
  }, [result]);


  // TODO: 이동 경로 검토
  const handleOtherTests = () => {
    window.open('https://www.jellyu-univ.com', '_blank');
  };

  // 공유 기능들
  const handleInstagramShare = () => {
    shareToInstagram();
  };

  const handleKakaoShare = () => {
    if (result) shareToKakao(result, shareUrl);
  };

  const handleXShare = () => {
    if (result) shareToX(result, shareUrl);
  };

  const handleCopyLink = () => {
    copyToClipboard(shareUrl).then((ok) => {
      if (ok) {
        setToast('링크가 복사되었어요!');
        setTimeout(() => setToast(''), 2200);
      }
    });
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
  const shareUrl = result ? generateShareUrl(result) : (typeof window !== 'undefined' ? `${window.location.origin}/results/share` : '/results/share');

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-8 pb-0 max-w-md mx-auto">
        <Header />

        <ShareCard
          customStyle={{
            boxShadow: '5px 2.5px 5px 0px rgba(0, 0, 0, 0.1)'
          }}
          customPadding="px-[18.5px] py-[17px]"
          noMargin
          className="mb-[37px]"
        >
          {/* 공유 안내 */}
          <p className="text-[#343434] text-[15px] font-medium text-center mb-6">
            아래 이미지를 길게 눌러 저장 후,<br />
            채널을 선택해 공유할 수 있어요.
          </p>

          {/* 이미지 렌더링 상태 */}
          {rendering && (
            <div className="mb-6 text-center text-sm text-gray-500">이미지를 준비하고 있어요...</div>
          )}

          {/* 저장 메시지 (오류 노출) */}
          {saveMessage && (
            <div className={`
              p-4 rounded-lg text-sm font-medium text-center mb-6 whitespace-pre-line
              ${saveMessage.includes('❌')
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-green-100 text-green-800 border border-green-200'
              }
            `}>
              {saveMessage}
            </div>
          )}

          {/* 공유용 결과 카드 (캡처 대상) 또는 렌더된 이미지 */}
          {renderedImageUrl ? (
            <div className="mb-5 select-none" style={{ WebkitTouchCallout: 'default' }}>
              <Image
                src={renderedImageUrl || ''}
                alt="NBTI 결과 이미지"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow"
              />
            </div>
          ) : (
            <div
              className="share-card mb-5 select-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'default'
              }}
            >
              <NBTIResultCard
                dogName={result.dogName}
                dogImage={(() => {
                  const id = result.nbti.id || '';
                  const displayPrefix = id.split('-')[0] || '';
                  return getArchetypeImagePath(displayPrefix);
                })()}
                preferPlainImg
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-[4px] leading-none m-0">
                    <h3 className="font-medium text-[20px] leading-tight m-0 font-gumi text-[#212121] w-full">{result.nbti.name}</h3>
                  </div>
                  <p className="font-normal text-[13px] leading-none my-[5px] text-[#8B8B8B]">{result.nbti.id} ({result.nbti.type})</p>
                  <div className="h-px bg-[#E3E3E3] mt-[5px] mx-auto" style={{ width: 'calc(100% - 82px)' }}></div>
                </div>

                <div className="text-center mt-[13px] mb-[10px]">
                  <p className="text-[#003DA5] font-semibold text-[13px]">
                    &ldquo;{result.nbti.definition}&rdquo;
                  </p>
                </div>

                <div className="text-center text-[#000000] font-normal text-[13px] leading-relaxed px-[50px] mb-[15px]">
                  {Array.isArray(result.nbti.description)
                    ? result.nbti.description.map((desc, index) => (
                      <p key={index} className="break-keep mb-2 last:mb-0">{desc}</p>
                    ))
                    : <p className="break-keep">{result.nbti.description}</p>
                  }
                </div>
              </NBTIResultCard>
            </div>
          )}

          {/* 공유 버튼들 */}
          <div className="flex justify-center gap-[10px]">
            <button onClick={handleInstagramShare} title="인스타그램 공유" className="w-[30px] h-[30px]">
              <Image src="/img/results/share/insta.png" alt="인스타그램" width={30} height={30} className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleKakaoShare} title="카카오톡 공유" className="w-[30px] h-[30px]">
              <Image src="/img/results/share/kakao.png" alt="카카오톡" width={30} height={30} className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleXShare} title="트위터 공유" className="w-[30px] h-[30px]">
              <Image src="/img/results/share/twitter.png" alt="트위터" width={30} height={30} className="w-[30px] h-[30px] object-contain" />
            </button>
            <button onClick={handleCopyLink} title="링크 복사" className="w-[30px] h-[30px]">
              <Image src="/img/results/share/link.png" alt="링크 복사" width={30} height={30} className="w-[30px] h-[30px] object-contain" />
            </button>
          </div>
        </ShareCard>


        {/* 사료 안전성 체크 */}
        <div
          className="bg-[#003DA5] rounded-[20px] px-[30px] py-[21.85px] mb-[37px] w-full mx-auto"
          style={{ boxShadow: '10px 5px 10px 0 rgba(0, 0, 0, 0.15)' }}
        >
          <div className="text-center">
            <span className="text-[20px] mb-[6px] block mx-auto">🤔</span>
            <h3 className="text-[#FFFFFF] font-semibold text-[20px] leading-[26px] mb-[15px]">
              지금 먹이는 사료<br />
              계속 먹여도 안전할까요?
            </h3>
            <p className="text-[#FFFFFF] font-normal text-[13px] mb-[19.5px]">
              서울대∙한국수의영양학회 임원 수의사가 설계한<br />
              AI가 30초 만에 분석해드려요!
            </p>
            <Button
              variant="ghost"
              size="md"
              onClick={handleOtherTests}
              fullWidth={false}
              customPadding="px-[39.5px] py-[10px]"
              roundedClass="rounded-[50px]"
              className="mx-auto min-w-[161px] min-h-[41.31px] font-semibold text-[15px] !text-[#003DA5]"
            >
              바로 알아보기
            </Button>
          </div>
        </div>

        {/* 친구 궁합 카드 (결과페이지와 동일) */}
        <div className="mb-[37px]">
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
              { text: "테스트 공유하기", variant: 'primary', onClick: () => router.push(generateShareUrl(result)) }
            ]}
            customPadding="px-[30px] pt-[23.5px] pb-[28.5px]"
            noMargin
          />
        </div>

        {/* NBTI 설명 카드 (결과페이지와 동일) */}
        <div className="mb-[37px]">
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
            noMargin
          />
        </div>
      </div>

      <footer className="pt-0 pb-[15px] text-center">
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
      {/* Toast */}
      {toast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="text-white text-[14px] font-semibold rounded-full px-4 py-2"
            style={{
              background: 'linear-gradient(180deg, #0A5BD7 0%, #003DA5 100%)',
              border: '1px solid rgba(255,255,255,0.75)',
              boxShadow: '0 10px 24px rgba(0,61,165,0.35)',
              animation: 'toastIn 200ms ease-out, toastOut 350ms ease-in 1600ms forwards'
            }}
          >
            {toast}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes toastIn {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes toastOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}