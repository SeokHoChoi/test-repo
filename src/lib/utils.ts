import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buildResultFromCode, getArchetypeImagePath } from '@/lib/nbti';
import {
  BCS_MAPPING,
  ACTIVITY_LEVEL_MAPPING,
  LIFE_STAGE_MAPPING,
  MEAL_ENJOYMENT_MAPPING,
  EATING_SPEED_MAPPING,
  ACTIVITY_QUESTION_MAPPING,
  CODE_TO_LABEL_MAPPING,
  LIFE_STAGE_IMAGE_PATHS
} from '@/data/survey-mapping';
// html-to-image는 타입 내보내기가 일정치 않아 any로 안전 처리
type HtmlToImageOptions = {
  cacheBust?: boolean;
  pixelRatio?: number;
};

// ===== Kakao SDK 최소 타입 =====
type KakaoLinkObjectType = 'feed';
interface KakaoLinkContentLink {
  mobileWebUrl: string;
  webUrl: string;
}
interface KakaoLinkContent {
  title: string;
  description?: string;
  imageUrl?: string;
  link: KakaoLinkContentLink;
}
interface KakaoLinkButton {
  title: string;
  link: KakaoLinkContentLink;
}
interface KakaoShareAPI {
  sendDefault: (params: {
    objectType: KakaoLinkObjectType;
    content: KakaoLinkContent;
    buttons?: KakaoLinkButton[];
  }) => void;
}
interface KakaoSDK {
  init: (key: string) => void;
  isInitialized?: () => boolean;
  Share?: KakaoShareAPI;
}
declare global {
  interface Window { Kakao?: KakaoSDK }
}

// ===== CSS 클래스 유틸리티 =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== 설문조사 답변 타입 정의 =====
export interface SurveyAnswers {
  // 1-8번 질문 답변
  q1: string; // BCS (체형 점수)
  q2: string; // 활동수준
  q3: string; // 생애주기
  q4: string; // 식사를 얼마나 즐기나요?
  q5: string; // 밥그릇을 비우는 속도
  q6: string; // 산책할 때 반응
  q7: string; // 놀이 패턴과 선호
  q8: string; // 강아지 이름
}

// ===== 캐릭터 코드 타입 정의 =====
export interface CharacterCode {
  bcs: string;        // U, I, W, O
  activityLevel: string; // L, M, H
  lifeStage: string;   // P, A, S
  eatingPattern: string; // E, C
  activityPattern: string; // A, I
  fullCode: string;    // 예: "ULS-EA"
}

// ===== NBTI 결과 타입 정의 =====
export interface NBTIResult {
  dogName: string;
  nbti: {
    id: string;
    name: string;
    type: string;
    definition: string;
    description: string | string[];
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
  compatibility?: {
    best: {
      title: string;
      reason: string;
      type_code: string;
      type_label: string;
      image_file?: string;
    };
    worst: {
      title: string;
      reason: string;
      type_code: string;
      type_label: string;
      image_file?: string;
    };
  };
}

// ===== nbti-personas.json 최소 타입 =====
export interface PersonaTypeEntry {
  type_code: string;
  type_label: string;
  description: string[];
  management_tips: string[];
}

export interface PersonaEntry {
  id?: number;
  name: string;
  definition: string;
  image_file?: string;
  types: PersonaTypeEntry[];
  compatibility?: {
    best: { title: string; reason: string; type_code: string; type_label: string };
    worst: { title: string; reason: string; type_code: string; type_label: string };
  };
}

export interface PersonaMatch {
  persona: PersonaEntry;
  type: PersonaTypeEntry;
}

// ===== 설문조사 답변 매핑 함수들 =====
/**
 * 설문조사 답변을 캐릭터 코드로 변환
 */
export function mapSurveyToCharacterCode(answers: SurveyAnswers): CharacterCode {
  // 1. BCS (체형 점수) 매핑
  const bcs = mapBCS(answers.q1);

  // 2. 활동수준 매핑
  const activityLevel = mapActivityLevel(answers.q2);

  // 3. 생애주기 매핑
  const lifeStage = mapLifeStage(answers.q3);

  // 4. 식사패턴 매핑 (E/C)
  const eatingPattern = mapEatingPattern(answers.q4, answers.q5);

  // 5. 활동패턴 매핑 (A/I)
  const activityPattern = mapActivityPattern(answers.q6, answers.q7);

  // 6. 최종 코드 조합
  const fullCode = `${bcs}${activityLevel}${lifeStage}-${eatingPattern}${activityPattern}`;

  return {
    bcs,
    activityLevel,
    lifeStage,
    eatingPattern,
    activityPattern,
    fullCode
  };
}

/**
 * BCS (체형 점수) 매핑
 */
function mapBCS(bcsAnswer: string): string {
  return BCS_MAPPING[bcsAnswer as keyof typeof BCS_MAPPING] || "I";
}

/**
 * 활동수준 매핑
 */
function mapActivityLevel(activityAnswer: string): string {
  return ACTIVITY_LEVEL_MAPPING[activityAnswer as keyof typeof ACTIVITY_LEVEL_MAPPING] || "M";
}

/**
 * 생애주기 매핑
 */
function mapLifeStage(lifeStageAnswer: string): string {
  return LIFE_STAGE_MAPPING[lifeStageAnswer as keyof typeof LIFE_STAGE_MAPPING] || "A";
}

/**
 * 식사패턴 매핑 (E/C)
 * 두 질문 중 하나라도 E이면 E, 모두 C이면 C
 */
function mapEatingPattern(q4: string, q5: string): string {
  const q4Result = mapEatingQuestion(q4);
  const q5Result = mapEatingQuestion(q5);

  // TODO: 식사 패턴 로직 검토 필요 - 현재는 OR 로직 (하나라도 E이면 E, 모두 C이면 C)
  // 하나라도 E이면 E, 모두 C이면 C
  return (q4Result === "E" || q5Result === "E") ? "E" : "C";
}

/**
 * 개별 식사 질문 매핑
 */
function mapEatingQuestion(answer: string): string {
  // 식사 즐거움과 식사 속도를 구분해서 매핑
  if (MEAL_ENJOYMENT_MAPPING[answer as keyof typeof MEAL_ENJOYMENT_MAPPING]) {
    return MEAL_ENJOYMENT_MAPPING[answer as keyof typeof MEAL_ENJOYMENT_MAPPING];
  }
  if (EATING_SPEED_MAPPING[answer as keyof typeof EATING_SPEED_MAPPING]) {
    return EATING_SPEED_MAPPING[answer as keyof typeof EATING_SPEED_MAPPING];
  }
  return "C";
}

/**
 * 활동패턴 매핑 (A/I)
 * 두 질문 중 하나라도 A이면 A, 모두 I이면 I
 */
function mapActivityPattern(q6: string, q7: string): string {
  const q6Result = mapActivityQuestion(q6);
  const q7Result = mapActivityQuestion(q7);

  // TODO: 활동 패턴 로직 검토 필요 - 현재는 OR 로직 (하나라도 A이면 A, 모두 I이면 I)
  // 하나라도 A이면 A, 모두 I이면 I
  return (q6Result === "A" || q7Result === "A") ? "A" : "I";
}

/**
 * 개별 활동 질문 매핑
 */
function mapActivityQuestion(answer: string): string {
  return ACTIVITY_QUESTION_MAPPING[answer as keyof typeof ACTIVITY_QUESTION_MAPPING] || "I";
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
 * 캐릭터 코드로부터 NBTI 페르소나 데이터 찾기
 */
export async function findPersonaByCharacterCode(characterCode: string): Promise<PersonaMatch | null> {
  try {
    const personasData = (await import('@/data/nbti-personas.json')) as unknown as { personas: PersonaEntry[] };

    // 모든 페르소나에서 해당 type_code 찾기
    for (const persona of personasData.personas) {
      for (const type of persona.types) {
        if (type.type_code === characterCode) {
          return {
            persona: persona,
            type: type
          };
        }
      }
    }

    console.error(`캐릭터 코드 ${characterCode}에 해당하는 페르소나를 찾을 수 없습니다.`);
    return null;
  } catch (error) {
    console.error('페르소나 데이터 로드 실패:', error);
    return null;
  }
}

/**
 * 설문조사 답변으로부터 완전한 NBTI 결과 생성
 */
export async function generateNBTIResultFromSurvey(answers: SurveyAnswers): Promise<NBTIResult | null> {
  try {
    // 1. 설문조사 답변을 캐릭터 코드로 변환
    const characterCode = mapSurveyToCharacterCode(answers);

    // 2. 캐릭터 코드로 페르소나 데이터 찾기
    const personaData = await findPersonaByCharacterCode(characterCode.fullCode);

    if (!personaData) {
      console.error('페르소나 데이터를 찾을 수 없습니다.');
      return null;
    }

    // 3. NBTI 결과 객체 생성
    const result: NBTIResult = {
      dogName: answers.q8, // 강아지 이름
      nbti: {
        id: characterCode.fullCode,
        name: personaData.persona.name,
        type: personaData.type.type_label,
        definition: personaData.persona.definition, // persona의 definition 사용
        description: personaData.type.description,
        detail: personaData.type.description.join('\n\n'),
        dogImage: getArchetypeImagePath(characterCode.fullCode),
        tips: personaData.type.management_tips
      },
      basicInfo: {
        lifeStage: getLifeStageLabel(characterCode.lifeStage),
        bcsCategory: getBCSLabel(characterCode.bcs),
        activityLevel: getActivityLevelLabel(characterCode.activityLevel),
        activityPattern: getActivityPatternLabel(characterCode.activityPattern),
        eatingPattern: getEatingPatternLabel(characterCode.eatingPattern)
      },
      compatibility: personaData.persona.compatibility
    };

    return result;
  } catch (error) {
    console.error('NBTI 결과 생성 실패:', error);
    return null;
  }
}

/**
 * 생애주기 코드를 라벨로 변환
 */
function getLifeStageLabel(lifeStage: string): string {
  return CODE_TO_LABEL_MAPPING.LIFE_STAGE[lifeStage as keyof typeof CODE_TO_LABEL_MAPPING.LIFE_STAGE] || "성견";
}

/**
 * BCS 코드를 라벨로 변환
 */
function getBCSLabel(bcs: string): string {
  return CODE_TO_LABEL_MAPPING.BCS[bcs as keyof typeof CODE_TO_LABEL_MAPPING.BCS] || "이상적";
}

/**
 * 활동수준 코드를 라벨로 변환
 */
function getActivityLevelLabel(activityLevel: string): string {
  return CODE_TO_LABEL_MAPPING.ACTIVITY_LEVEL[activityLevel as keyof typeof CODE_TO_LABEL_MAPPING.ACTIVITY_LEVEL] || "보통활동";
}

/**
 * 활동패턴 코드를 라벨로 변환
 */
function getActivityPatternLabel(activityPattern: string): string {
  return CODE_TO_LABEL_MAPPING.ACTIVITY_PATTERN[activityPattern as keyof typeof CODE_TO_LABEL_MAPPING.ACTIVITY_PATTERN] || "독립형";
}

/**
 * 식사패턴 코드를 라벨로 변환
 */
function getEatingPatternLabel(eatingPattern: string): string {
  return CODE_TO_LABEL_MAPPING.EATING_PATTERN[eatingPattern as keyof typeof CODE_TO_LABEL_MAPPING.EATING_PATTERN] || "신중형";
}


// ===== 매핑 테스트 및 디버깅 유틸리티 =====
/**
 * 설문조사 답변 매핑 테스트 함수 (개발/디버깅용)
 */
export function testSurveyMapping(answers: SurveyAnswers): {
  characterCode: CharacterCode;
  mappingSteps: {
    bcs: { answer: string; code: string };
    activityLevel: { answer: string; code: string };
    lifeStage: { answer: string; code: string };
    eatingPattern: {
      q4: { answer: string; code: string };
      q5: { answer: string; code: string };
      result: string;
    };
    activityPattern: {
      q6: { answer: string; code: string };
      q7: { answer: string; code: string };
      result: string;
    };
  };
} {
  const characterCode = mapSurveyToCharacterCode(answers);

  return {
    characterCode,
    mappingSteps: {
      bcs: { answer: answers.q1, code: characterCode.bcs },
      activityLevel: { answer: answers.q2, code: characterCode.activityLevel },
      lifeStage: { answer: answers.q3, code: characterCode.lifeStage },
      eatingPattern: {
        q4: { answer: answers.q4, code: mapEatingQuestion(answers.q4) },
        q5: { answer: answers.q5, code: mapEatingQuestion(answers.q5) },
        result: characterCode.eatingPattern
      },
      activityPattern: {
        q6: { answer: answers.q6, code: mapActivityQuestion(answers.q6) },
        q7: { answer: answers.q7, code: mapActivityQuestion(answers.q7) },
        result: characterCode.activityPattern
      }
    }
  };
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
export function shareToKakao(_result: NBTIResult, _shareUrl: string): void {
  // 런타임에서만 동작
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!jsKey) {
    alert('카카오 JavaScript 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
    return;
  }

  // SDK 로드 함수
  const loadSdk = (): Promise<KakaoSDK> => {
    return new Promise((resolve, reject) => {
      const w = window as Window;
      if (w.Kakao && w.Kakao.isInitialized && w.Kakao.isInitialized()) {
        resolve(w.Kakao);
        return;
      }
      if (w.Kakao && !w.Kakao.isInitialized?.()) {
        try {
          w.Kakao.init(jsKey);
          resolve(w.Kakao);
          return;
        } catch {
          // fallthrough to reload script
        }
      }
      const existing = document.querySelector('script[data-kakao-sdk]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => {
          try {
            const w2 = window as Window;
            if (w2.Kakao && !w2.Kakao.isInitialized?.()) {
              w2.Kakao.init(jsKey);
            }
            resolve(w2.Kakao as KakaoSDK);
          } catch (err) { reject(err); }
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Kakao SDK load error')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-kakao-sdk', 'true');
      script.onload = () => {
        try {
          const w2 = window as Window;
          if (w2.Kakao && !w2.Kakao.isInitialized?.()) {
            w2.Kakao.init(jsKey);
          }
          resolve(w2.Kakao as KakaoSDK);
        } catch (err) { reject(err); }
      };
      script.onerror = () => reject(new Error('Kakao SDK load error'));
      document.head.appendChild(script);
    });
  };

  // 실제 공유 실행
  (async () => {
    try {
      const Kakao = await loadSdk();
      const origin = (process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://nbti.jellyuniversity.com')) || 'https://nbti.jellyuniversity.com';

      // 1:1 이미지 (결과 공유용) - 정적 이미지 사용
      const resultImageUrl = `${origin}/img/kakao-share/kakao-result-share-640x640.png`;

      Kakao.Share?.sendDefault?.({
        objectType: 'feed',
        content: {
          title: `🐶 우리 아이 건강 MBTI 테스트`,
          description: `너의 갱얼쥐 NBTI가 뭐야? 🐾`,
          imageUrl: resultImageUrl, // 1:1 결과 이미지
          link: {
            mobileWebUrl: _shareUrl,
            webUrl: _shareUrl,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: { mobileWebUrl: _shareUrl, webUrl: _shareUrl },
          },
          {
            title: '테스트 하기',
            link: { mobileWebUrl: `${origin}/basic-questions`, webUrl: `${origin}/basic-questions` },
          },
        ],
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  })();
}

/**
 * 카카오톡 테스트 홍보 공유 (2:1 이미지 사용)
 */
export function shareKakaoTest(): void {
  if (typeof window === 'undefined') return;

  const loadSdk = (): Promise<KakaoSDK> => {
    return new Promise((resolve, reject) => {
      const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!jsKey) {
        reject(new Error('Kakao JS Key not found'));
        return;
      }

      const w = window as Window;
      if (w.Kakao && w.Kakao.isInitialized?.()) {
        resolve(w.Kakao);
        return;
      }

      if (w.Kakao) {
        try {
          w.Kakao.init(jsKey);
          resolve(w.Kakao);
          return;
        } catch {
          // fallthrough to reload script
        }
      }
      const existing = document.querySelector('script[data-kakao-sdk]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => {
          try {
            const w2 = window as Window;
            if (w2.Kakao && !w2.Kakao.isInitialized?.()) {
              w2.Kakao.init(jsKey);
            }
            resolve(w2.Kakao as KakaoSDK);
          } catch (err) { reject(err); }
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Kakao SDK load error')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-kakao-sdk', 'true');
      script.onload = () => {
        try {
          const w2 = window as Window;
          if (w2.Kakao && !w2.Kakao.isInitialized?.()) {
            w2.Kakao.init(jsKey);
          }
          resolve(w2.Kakao as KakaoSDK);
        } catch (err) { reject(err); }
      };
      script.onerror = () => reject(new Error('Kakao SDK load error'));
      document.head.appendChild(script);
    });
  };

  // 실제 공유 실행
  (async () => {
    try {
      const Kakao = await loadSdk();
      const origin = (process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://nbti.jellyuniversity.com')) || 'https://nbti.niversity.com';

      // 2:1 이미지 (테스트 홍보용)
      const testImageUrl = `${origin}/img/kakao-share/kakao-test-share-800x400.png`;
      const testUrl = `${origin}/basic-questions`;

      Kakao.Share?.sendDefault?.({
        objectType: 'feed',
        content: {
          title: '🐶 우리 아이 건강 NBTI 테스트',
          description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다. 우리 아이의 NBTI가 뭘까? 🐾',
          imageUrl: testImageUrl, // 2:1 테스트 홍보 이미지
          link: {
            mobileWebUrl: testUrl,
            webUrl: testUrl,
          },
        },
        buttons: [
          {
            title: '테스트 시작하기',
            link: { mobileWebUrl: testUrl, webUrl: testUrl },
          },
        ],
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  })();
}

/**
 * X (트위터) 공유 (나중에 구현 예정)
 */
export function shareToX(result: NBTIResult, shareUrl: string): void {
  if (typeof window === 'undefined') return;
  const text = encodeURIComponent(`${result.dogName}의 NBTI는 ${result.nbti.name}!`);
  const url = encodeURIComponent(shareUrl);
  const hashtags = encodeURIComponent('NBTI,강아지,유형,젤리유니브');
  const intent = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
  window.open(intent, '_blank', 'noopener,noreferrer');
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
    try { removeTempStyle?.(); } catch { }
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
      const options: HtmlToImageOptions = {
        cacheBust: true,
        pixelRatio: 2,
      };
      const url = await h2i.toPng(element, options);
      if (url) return url as string;
    } catch {
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
    try { removeTempStyle?.(); } catch { }
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
async function waitForAssets(root: HTMLElement, timeoutMs: number = 6000): Promise<void> {
  const promises: Promise<void>[] = [];

  // 폰트 로드
  const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts;
  if (fonts?.ready && typeof fonts.ready.then === 'function') {
    promises.push(fonts.ready.then(() => undefined).catch(() => undefined));
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