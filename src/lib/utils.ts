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
  const encodedResult = encodeResultToUrl(result);
  return `${origin}/results/share?result=${encodedResult}`;
}

/**
 * URL에서 결과 데이터 읽기 (useEffect용)
 * URL 파라미터 우선, 없으면 세션 스토리지에서 읽기
 */
export function getResultFromUrlOrStorage(): NBTIResult | null {
  if (typeof window === 'undefined') return null;

  // URL 파라미터에서 결과 데이터 읽기
  const urlParams = new URLSearchParams(window.location.search);
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
      alert('링크가 복사되었습니다!');
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
      alert('링크가 복사되었습니다!');
      return true;
    } else {
      throw new Error('복사 명령 실행 실패');
    }
  } catch (err) {
    console.error('폴백 복사 실패:', err);
    alert('링크 복사에 실패했습니다. 수동으로 복사해주세요.');
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
  // TODO: X 공유 기능 구현
  alert('X 공유 기능은 추후 구현 예정입니다.');
}

/**
 * 인스타그램 공유 (나중에 구현 예정)
 */
export function shareToInstagram(): void {
  // TODO: 인스타그램 공유 기능 구현
  alert('인스타그램 공유 기능은 추후 구현 예정입니다.');
}