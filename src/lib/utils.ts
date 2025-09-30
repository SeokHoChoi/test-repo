import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ===== CSS 클래스 유틸리티 =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== NBTI 결과 타입 정의 =====
export interface NBTIResult {
  dogName: string;
  nbti: {
    id: string;
    name: string;
    type: string;
    description: string;
    detail: string;
    dogImage: string;
    tips: string[];
  };
  basicInfo: {
    lifeStage: string;
    bcsCategory: string;
    activityLevel: string;
    activityPattern: string;
    eatingPattern: string;
  };
}

// ===== URL 관련 유틸리티 =====
/**
 * 결과 데이터를 URL 파라미터로 인코딩
 */
export function encodeResultToUrl(result: NBTIResult): string {
  return encodeURIComponent(JSON.stringify(result));
}

/**
 * URL 파라미터에서 결과 데이터 디코딩
 */
export function decodeResultFromUrl(encodedResult: string): NBTIResult | null {
  try {
    return JSON.parse(decodeURIComponent(encodedResult));
  } catch (error) {
    console.error('결과 데이터 파싱 실패:', error);
    return null;
  }
}

/**
 * 공유 URL 생성 (결과 데이터 포함)
 */
export function generateShareUrl(result: NBTIResult, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  // Compact code로 단축: IHA-EA 형태 + 개 명만 포함
  const compact = `${result.nbti.id}|${result.dogName}`;
  const encoded = encodeURIComponent(compact);
  return `${origin}/results/share?code=${encoded}`;
}

/**
 * URL에서 결과 데이터 읽기 (useEffect용)
 * URL 파라미터 우선, 없으면 세션 스토리지에서 읽기
 */
export function getResultFromUrlOrStorage(): NBTIResult | null {
  if (typeof window === 'undefined') return null;

  // URL 파라미터에서 결과 데이터 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const encodedCode = urlParams.get('code');
  if (encodedCode) {
    try {
      const [code, dogName] = decodeURIComponent(encodedCode).split('|');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { buildResultFromCode } = require('@/lib/nbti');
      const built = buildResultFromCode(code, dogName);
      if (built) return built;
    } catch { }
  }

  const encodedResult = urlParams.get('result');
  if (encodedResult) {
    const decodedResult = decodeResultFromUrl(encodedResult);
    if (decodedResult) return decodedResult;
  }

  // URL에 결과 데이터가 없으면 세션 스토리지에서 확인
  const resultData = sessionStorage.getItem('nbtiResult');
  if (resultData) {
    try {
      return JSON.parse(resultData);
    } catch (error) {
      console.error('세션 스토리지 데이터 파싱 실패:', error);
    }
  }

  return null;
}

// ===== 공유 기능 유틸리티 =====
/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 최신 API 사용
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('클립보드 API 실패:', err);
    }
  }

  // 폴백: 구형 브라우저를 위한 textarea 방식
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return true;
    } else {
      throw new Error('복사 명령 실행 실패');
    }
  } catch (err) {
    console.error('폴백 복사 실패:', err);
    return false;
  }
}

/**
 * 카카오톡 공유 (나중에 구현 예정)
 */
export function shareToKakao(result: NBTIResult, shareUrl: string): void {
  // TODO: 카카오톡 공유 기능 구현
  alert('카카오톡 공유 기능은 추후 구현 예정입니다.');
}

/**
 * X (트위터) 공유 (나중에 구현 예정)
 */
export function shareToX(result: NBTIResult, shareUrl: string): void {
  if (typeof window === 'undefined') return;
  const text = encodeURIComponent(`${result.dogName}의 NBTI는 ${result.nbti.name}!`);
  const url = encodeURIComponent(shareUrl);
  const intent = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(intent, '_blank');
}

/**
 * 인스타그램 공유 (나중에 구현 예정)
 */
export function shareToInstagram(): void {
  // 모바일에서 인스타그램 앱 열기
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.indexOf('android') > -1;
    const isIOS = userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1;

    if (isIOS) {
      // iOS에서 인스타그램 앱 열기
      window.location.href = 'instagram://';
      // 앱이 설치되어 있지 않은 경우 App Store로 이동
      setTimeout(() => {
        window.open('https://apps.apple.com/app/instagram/id389801252', '_blank');
      }, 1000);
    } else if (isAndroid) {
      // Android에서 인스타그램 앱 열기
      window.location.href = 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end';
    } else {
      // 데스크톱에서는 웹 인스타그램으로 이동
      window.open('https://www.instagram.com/', '_blank');
    }
  }
}

// ===== 이미지 다운로드 유틸리티 =====
/**
 * 이미지 URL에서 이미지를 다운로드합니다
 * @param url - 다운로드할 이미지 URL
 * @param filename - 저장될 파일명 (확장자 포함)
 * @returns Promise<boolean> - 성공 여부
 */
export async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = imageUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    // 정리
    window.URL.revokeObjectURL(imageUrl);
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    return false;
  }
}

/**
 * HTML 요소를 Canvas로 변환하여 이미지로 다운로드합니다
 * @param element - 캡처할 HTML 요소
 * @param filename - 저장될 파일명
 * @returns Promise<boolean> - 성공 여부
 */
export async function captureElementAsImage(element: HTMLElement, filename: string): Promise<boolean> {
  let removeTempStyle: (() => void) | undefined;
  try {
    // 자산 로드 대기 (폰트/이미지)
    await waitForAssets(element);

    // lab/oklch 등 파싱 문제 회피를 위해 임시 스타일 주입
    removeTempStyle = injectCaptureSafeStyles();
    // html2canvas를 동적으로 import (CDN 사용)
    const html2canvas = await import('html2canvas');

    const canvas = await html2canvas.default(element, {
      backgroundColor: '#ffffff',
      scale: 2, // 고해상도
      useCORS: true,
      allowTaint: true,
      // CSS Color 4/5 함수(lab, lch 등) 파싱 문제 방지: 브라우저 렌더링 사용
      foreignObjectRendering: true,
      imageTimeout: 2000,
      logging: false,
    });

    // Canvas를 Blob으로 변환 (await로 동기화하여 정리 보장)
    const success = await new Promise<boolean>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }

        const imageUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = imageUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        // 정리
        window.URL.revokeObjectURL(imageUrl);
        document.body.removeChild(link);

        resolve(true);
      }, 'image/png');
    });
    return success;
  } catch (error) {
    console.error('이미지 캡처 실패:', error);
    return false;
  } finally {
    try { removeTempStyle && removeTempStyle(); } catch { }
  }
}

/**
 * HTML 요소를 Canvas로 렌더링하여 PNG Data URL을 반환합니다 (길게 눌러 저장용)
 */
export async function renderElementToDataUrl(element: HTMLElement): Promise<string | null> {
  let removeTempStyle: (() => void) | undefined;
  try {
    // 자산 로드 대기 (폰트/이미지)
    await waitForAssets(element);

    // lab/oklch 등 파싱 문제 회피를 위해 임시 스타일 주입
    removeTempStyle = injectCaptureSafeStyles();

    // 1) 시도: html-to-image
    try {
      const h2i = await import('html-to-image');
      const url = await h2i.toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        // foreignObjectRendering은 내부적으로 사용되며, 스타일은 이미 주입됨
      } as any);
      if (url) return url as string;
    } catch (err) {
      // html-to-image 실패 시 html2canvas로 폴백
    }

    // 2) 폴백: html2canvas
    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 2000,
      logging: false,
    });
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    return dataUrl || null;
  } catch (error) {
    console.error('이미지 렌더링 실패:', error);
    return null;
  } finally {
    try { removeTempStyle && removeTempStyle(); } catch { }
  }
}

/**
 * NBTI 결과 카드를 이미지로 다운로드합니다
 * @param result - NBTI 결과 데이터
 * @returns Promise<boolean> - 성공 여부
 */
export async function downloadNBTIImage(result: NBTIResult): Promise<boolean> {
  const cardElement = document.querySelector('.share-card') as HTMLElement;
  if (!cardElement) {
    console.error('공유 카드 요소를 찾을 수 없습니다.');
    return false;
  }

  const filename = `${result.dogName}_NBTI_결과.png`;
  return await captureElementAsImage(cardElement, filename);
}

/**
 * 공유 카드(.share-card)를 PNG Data URL로 렌더링합니다 (길게 눌러 저장)
 */
export async function renderNBTIImageDataUrl(): Promise<string | null> {
  const cardElement = document.querySelector('.share-card') as HTMLElement;
  if (!cardElement) {
    console.error('공유 카드 요소를 찾을 수 없습니다.');
    return null;
  }
  return await renderElementToDataUrl(cardElement);
}

// ===== 내부 유틸: 캡처 안정화 도우미 =====
async function waitForAssets(root: HTMLElement, timeoutMs: number = 4000): Promise<void> {
  const promises: Promise<void>[] = [];

  // 폰트 로드
  if (document && (document as any).fonts && typeof (document as any).fonts.ready?.then === 'function') {
    promises.push((document as any).fonts.ready.catch(() => { }));
  }

  // 이미지 로드
  const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) return;
    promises.push(new Promise<void>((resolve) => {
      const onDone = () => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        resolve();
      };
      img.addEventListener('load', onDone);
      img.addEventListener('error', onDone);
    }));
  });

  // 타임아웃 보장
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  await Promise.race([Promise.all(promises), timeout]);
}

function injectCaptureSafeStyles(): () => void {
  const style = document.createElement('style');
  style.setAttribute('data-capture-safe', 'true');
  style.innerHTML = `
/* Tailwind 일부 색상에서 발생하는 lab/oklch 파싱 이슈 우회 */
.share-card .text-blue-600 { color: #2563EB !important; }
.share-card .text-gray-600 { color: #4B5563 !important; }
.share-card .text-gray-700 { color: #374151 !important; }
.share-card .text-white { color: #FFFFFF !important; }
.share-card .bg-white { background-color: #FFFFFF !important; }
`;
  document.head.appendChild(style);
  return () => {
    try { document.head.removeChild(style); } catch { }
  };
}