'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { NBTIResultCard } from '@/components/NBTIResultCard';
import { ShareCard } from '@/components/ShareCard';
import { InfoDisplayCard } from '@/components/InfoDisplayCard';
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
import { getArchetypeImagePath } from '@/lib/nbti';


export default function SharePage() {
  const router = useRouter();
  const [result, setResult] = useState<NBTIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    const resultData = getResultFromUrlOrStorage();
    if (resultData) {
      setResult(resultData);

      // 동적 메타데이터 설정
      const title = `🐶 ${resultData.dogName}의 NBTI는 ${resultData.nbti.name}!`;
      const description = `${resultData.nbti.id} (${resultData.nbti.type})\n"${resultData.nbti.definition}"`;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://test-repo-qux1.vercel.app');
      const imageUrl = `${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`;

      // 메타태그 설정
      document.title = title;

      // Open Graph 메타태그 - 인스타그램 호환성 강화
      const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

      const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', description);
      if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDescription);

      const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', imageUrl);
      if (!document.querySelector('meta[property="og:image"]')) document.head.appendChild(ogImage);

      // 인스타그램을 위한 추가 메타태그
      const ogImageWidth = document.querySelector('meta[property="og:image:width"]') || document.createElement('meta');
      ogImageWidth.setAttribute('property', 'og:image:width');
      ogImageWidth.setAttribute('content', '800');
      if (!document.querySelector('meta[property="og:image:width"]')) document.head.appendChild(ogImageWidth);

      const ogImageHeight = document.querySelector('meta[property="og:image:height"]') || document.createElement('meta');
      ogImageHeight.setAttribute('property', 'og:image:height');
      ogImageHeight.setAttribute('content', '400');
      if (!document.querySelector('meta[property="og:image:height"]')) document.head.appendChild(ogImageHeight);

      const ogImageType = document.querySelector('meta[property="og:image:type"]') || document.createElement('meta');
      ogImageType.setAttribute('property', 'og:image:type');
      ogImageType.setAttribute('content', 'image/png');
      if (!document.querySelector('meta[property="og:image:type"]')) document.head.appendChild(ogImageType);

      const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', window.location.href);
      if (!document.querySelector('meta[property="og:url"]')) document.head.appendChild(ogUrl);

      const ogType = document.querySelector('meta[property="og:type"]') || document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      ogType.setAttribute('content', 'website');
      if (!document.querySelector('meta[property="og:type"]')) document.head.appendChild(ogType);

      // Twitter 메타태그
      const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      twitterTitle.setAttribute('content', title);
      if (!document.querySelector('meta[name="twitter:title"]')) document.head.appendChild(twitterTitle);

      const twitterDescription = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      twitterDescription.setAttribute('content', description);
      if (!document.querySelector('meta[name="twitter:description"]')) document.head.appendChild(twitterDescription);

      const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      twitterImage.setAttribute('content', imageUrl);
      if (!document.querySelector('meta[name="twitter:image"]')) document.head.appendChild(twitterImage);
    } else {
      // 결과 데이터가 없으면 랜딩 페이지로 리다이렉트
      router.push('/landing');
    }
    setLoading(false);
  }, [router]);

  // 전체 결과 카드를 Canvas로 캡쳐
  useEffect(() => {
    if (!result) return;

    const captureResultCard = async () => {
      try {
        // DOM에서 NBTIResultCard 컴포넌트 찾기
        const cardElement = document.querySelector('[data-testid="nbti-result-card"]') as HTMLElement;
        if (!cardElement) {
          console.error('결과 카드 요소를 찾을 수 없습니다.');
          return;
        }


        // 모든 이미지가 완전히 로드될 때까지 대기
        const images = cardElement.querySelectorAll('img');

        for (const img of images) {
          if (!img.complete) {
            await new Promise((resolve) => {
              img.onload = () => {
                resolve(img);
              };
              img.onerror = () => {
                console.error('이미지 로드 실패:', img.src);
                resolve(img);
              };
            });
          }
        }

        // 폰트가 완전히 로드될 때까지 대기
        await document.fonts.ready;

        // 추가 대기 시간 (모든 렌더링 완료)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // html2canvas를 사용한 캡쳐 - 뷰포트 문제만 해결
        const html2canvas = await import('html2canvas');
        const canvas = await html2canvas.default(cardElement, {
          backgroundColor: '#003DA5',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: false, // false로 다시 변경
          imageTimeout: 30000,
          logging: true, // 디버깅을 위해 활성화
          width: cardElement.offsetWidth,
          height: cardElement.offsetHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          removeContainer: false,
          // 큰 화면에서만 뷰포트 제한 적용
          ...(window.innerWidth > 1200 && {
            windowWidth: 500,
            windowHeight: 600
          }),
          onclone: (clonedDoc) => {

            // 클론된 문서에서 이미지가 보이도록 설정
            const clonedElement = clonedDoc.querySelector('[data-testid="nbti-result-card"]') as HTMLElement;
            if (clonedElement) {

              // 모든 이미지가 보이도록 설정
              const allImages = clonedElement.querySelectorAll('img');

              allImages.forEach((img, index) => {
                (img as HTMLElement).style.visibility = 'visible';
                (img as HTMLElement).style.opacity = '1';
                (img as HTMLElement).style.display = 'block';
              });

              // 대제목을 위로 땡기기
              const titleSection = clonedElement.querySelector('div.text-center.mb-4');
              if (titleSection) {
                (titleSection as HTMLElement).style.marginTop = '-14px';
                (titleSection as HTMLElement).style.paddingTop = '0px';
              }

              // @젤리대학교 텍스트에 margin-top 추가
              const jellyText = clonedElement.querySelector('p.text-\\[\\#FFFFFF\\]');
              if (jellyText) {
                (jellyText as HTMLElement).style.marginTop = '14.8px';
                (jellyText as HTMLElement).style.marginBottom = '24px';
              }

              // 하얀 카드 내부 요소들 조정
              // 메인 타이틀을 위로 당기기
              const mainTitle = clonedElement.querySelector('h3.font-medium.text-\\[20px\\]');
              if (mainTitle) {
                (mainTitle as HTMLElement).style.marginTop = '-11px';
              }

              // 서브타이틀을 아래로 당기기
              const subtitleText = clonedElement.querySelector('p.font-normal.text-\\[13px\\]');
              if (subtitleText) {
                (subtitleText as HTMLElement).style.marginTop = '8px';
                (subtitleText as HTMLElement).style.marginBottom = '8px';
              }

              // 보더를 아래로 당기기
              const borderElement = clonedElement.querySelector('.h-px');
              if (borderElement) {
                (borderElement as HTMLElement).style.marginTop = '12px';
              }

              // 따옴표 텍스트와 보더 간격 좁히기
              const quoteText = clonedElement.querySelector('p.text-\\[\\#003DA5\\]');
              if (quoteText) {
                (quoteText as HTMLElement).style.marginTop = '-4.5px';
              }

              // 폰트 스타일 명시적 설정 (두꺼워지는 문제 방지)
              const allTextElements = clonedElement.querySelectorAll('h1, h2, h3, p, span');
              allTextElements.forEach(el => {
                const element = el as HTMLElement;

                // 폰트 렌더링 최적화
                element.style.textRendering = 'optimizeLegibility';
                element.style.setProperty('-webkit-font-smoothing', 'antialiased');
                element.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
                element.style.setProperty('font-smooth', 'always');

                // 폰트 두께 명시적 설정
                if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
                  element.style.fontWeight = '500';
                } else if (element.tagName === 'P') {
                  element.style.fontWeight = '400';
                }
              });
            }
          }
        });

        // Canvas에 둥글기 적용
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'destination-in';
          ctx.beginPath();
          ctx.roundRect(0, 0, canvas.width, canvas.height, 30);
          ctx.fill();
        }

        // Canvas를 Data URL로 변환
        const dataUrl = canvas.toDataURL('image/png');

        setRenderedImageUrl(dataUrl);
        setToast('이미지 준비완료!');
        setTimeout(() => setToast(''), 2000);

      } catch (error) {
        console.error('이미지 캡쳐 오류:', error);
        setToast('이미지 생성에 실패했습니다.');
        setTimeout(() => setToast(''), 3000);
      }
    };

    // DOM이 완전히 렌더링된 후 캡쳐 실행
    setTimeout(captureResultCard, 3000);
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
          {/* 공유 안내 또는 로딩 - 고정 높이로 레이아웃 시프트 방지 */}
          <div className="text-center mb-6" style={{ minHeight: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderedImageUrl ? (
              <p className="text-[#343434] text-[15px] font-medium">
                아래 이미지를 길게 눌러 저장 후,<br />
                채널을 선택해 공유할 수 있어요.
              </p>
            ) : (
              <p className="text-[#343434] text-[15px] font-medium">
                <span className="inline-flex items-center">
                  <Image
                    src="/img/jellyu-logo.png"
                    alt="젤리대학교"
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain animate-bounce mr-2"
                  />
                  <span className="font-sb-aggro font-medium">이미지 준비중...</span>
                </span>
              </p>
            )}
          </div>


          {/* 공유용 결과 카드 (캡처 대상) - 캡쳐용으로만 사용 */}
          <div className="mb-5 select-none" style={{ WebkitTouchCallout: 'default', display: renderedImageUrl ? 'none' : 'block' }}>
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

          {/* 캡쳐된 이미지 (메인 표시) */}
          {renderedImageUrl && (
            <div className="mb-5 select-none" style={{ WebkitTouchCallout: 'default' }}>
              <Image
                src={renderedImageUrl}
                alt="NBTI 결과 이미지"
                width={400}
                height={400}
                className="w-full h-auto shadow"
                style={{ borderRadius: '30px' }}
              />
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