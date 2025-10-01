import { type NBTIResult } from './utils';
import nbtiData from '@/data/nbti-data.json';
import personasData from '@/data/nbti-personas.json';

// ===== 입력 타입 =====
export interface BasicAnswers {
  dogName: string;
  birthDate: string; // ISO string
  bcs: 'skinny' | 'just-right' | 'husky' | 'chubby';
  activityLevel: 'low' | 'medium' | 'high';
}

export interface PersonalAnswers {
  mealEnjoyment: 'excited' | 'normal' | 'indifferent';
  eatingSpeed: 'fast' | 'normal' | 'slow';
  walkReaction: 'excited' | 'normal' | 'reluctant';
  playPattern: 'social' | 'independent' | 'observer';
}

// ===== Letter 매핑 =====
function mapBcsLetter(bcs: BasicAnswers['bcs']): 'U' | 'I' | 'O' {
  if (bcs === 'skinny') return 'U';
  if (bcs === 'just-right') return 'I';
  // husky/chubby -> Overweight/Obese: 둘 다 O
  return 'O';
}

function mapActivityLevelLetter(level: BasicAnswers['activityLevel']): 'L' | 'M' | 'H' {
  if (level === 'low') return 'L';
  if (level === 'high') return 'H';
  return 'M';
}

function mapLifeStageLetter(birthDateIso: string): 'P' | 'A' | 'S' {
  const birth = new Date(birthDateIso);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear() - ((now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) ? 1 : 0);
  if (years <= 1) return 'P';
  if (years >= 7) return 'S';
  return 'A';
}

function mapEatingPattern(personal: PersonalAnswers): 'E' | 'C' {
  const isEnthusiastic = personal.mealEnjoyment === 'excited' || personal.eatingSpeed === 'fast';
  return isEnthusiastic ? 'E' : 'C';
}

function mapActivityPattern(personal: PersonalAnswers): 'A' | 'I' {
  let scoreA = 0;
  let scoreI = 0;
  if (personal.walkReaction === 'excited') scoreA += 1; else scoreI += 1;
  if (personal.playPattern === 'social') scoreA += 1; else scoreI += 1; // independent/observer -> I
  // 동점 시 사교형 우선 (커뮤니티 추천)
  return scoreA >= scoreI ? 'A' : 'I';
}

// ===== 페르소나 데이터 기반 콘텐츠 생성 =====
function getPersonaByTypeCode(typeCode: string) {
  for (const persona of personasData.personas) {
    const matchingType = persona.types.find(type => type.type_code === typeCode);
    if (matchingType) {
      return {
        persona,
        type: matchingType
      };
    }
  }
  return null;
}

// ===== JSON 데이터 기반 콘텐츠 생성 (기존 호환성 유지) =====
function contentForPair(pair: 'EA' | 'EI' | 'CA' | 'CI') {
  const data = nbtiData.behaviorTypes[pair];
  return {
    name: data.name,
    type: '',
    characteristics: data.characteristics,
    description: data.characteristics,
    detailStart: data.baseDetail,
    detailSecondSentence: data.detailSecondSentence,
    tips: data.tips,
    koreanLabel: data.koreanLabel,
  };
}

// ===== 아키타입 정보 가져오기 (JSON 데이터 기반) =====
function getArchetypeInfo(displayPrefix: string, pair: string) {
  const archetypeData = (nbtiData.archetypes as Record<string, {
    name: string;
    emoji?: string;
    oneLine?: string;
    healthTips: string[];
    typeDescriptions?: Record<string, string>;
    typeTips?: Record<string, string[]>;
  }>)[displayPrefix];

  if (!archetypeData) {
    return {
      name: displayPrefix,
      emoji: '',
      oneLine: '',
      description: '',
      healthTips: [],
    };
  }

  // 유형별 상세 설명과 팁 가져오기
  const typeDescription = archetypeData.typeDescriptions?.[pair] || '';
  const typeTips = archetypeData.typeTips?.[pair] || [];

  return {
    name: archetypeData.name,
    emoji: archetypeData.emoji || '',
    oneLine: archetypeData.oneLine || '',
    description: typeDescription,
    healthTips: [...typeTips, ...archetypeData.healthTips], // 유형별 팁 + 기본 건강 팁
  };
}

export function calculateNBTIFromAnswers(basic: BasicAnswers, personal: PersonalAnswers): NBTIResult {
  const bcsLetter = mapBcsLetter(basic.bcs);
  const actLevelLetter = mapActivityLevelLetter(basic.activityLevel);
  const lifeStageLetter = mapLifeStageLetter(basic.birthDate);
  const eatLetter = mapEatingPattern(personal);
  const actPatternLetter = mapActivityPattern(personal);

  // 화면 표시는 문서 표 기준(Adult/ Seniors). 퍼피(P)는 Adult 코드로 매핑해 표기
  const displayLifeStageLetter = lifeStageLetter === 'P' ? 'A' : lifeStageLetter;
  const displayPrefix = `${bcsLetter}${actLevelLetter}${displayLifeStageLetter}`; // 예: IHA
  const pair = `${eatLetter}${actPatternLetter}` as 'EA' | 'EI' | 'CA' | 'CI';
  const typeCode = `${displayPrefix}-${pair}`;

  // 페르소나 데이터에서 먼저 찾기
  const personaData = getPersonaByTypeCode(typeCode);

  if (personaData) {
    const { persona, type } = personaData;

    const result: NBTIResult = {
      dogName: basic.dogName,
      nbti: {
        id: typeCode,
        name: `${persona.name} ${type.type_label}`,
        type: `${typeCode} (${type.type_label})`,
        description: Array.isArray(type.description) ? type.description.join(' ') : type.description,
        detail: Array.isArray(type.description) ? type.description.join(' ') : type.description,
        dogImage: '/img/results/dog-1.png',
        tips: type.management_tips,
      },
      basicInfo: {
        lifeStage: lifeStageLetter === 'P' ? 'puppy' : lifeStageLetter === 'S' ? 'senior' : 'adult',
        bcsCategory: bcsLetter === 'U' ? 'underweight' : bcsLetter === 'I' ? 'ideal' : 'overweight',
        activityLevel: basic.activityLevel,
        activityPattern: actPatternLetter === 'A' ? 'social' : 'independent',
        eatingPattern: eatLetter === 'E' ? 'enthusiastic' : 'cautious',
      },
    };

    return result;
  }

  // 페르소나 데이터가 없으면 기존 방식 사용
  const behaviorData = contentForPair(pair);
  const archetypeInfo = getArchetypeInfo(displayPrefix, pair);

  // 유형별 상세 설명이 있으면 사용, 없으면 기본 패턴 사용
  const detail = archetypeInfo.description || `${behaviorData.detailStart}! ${behaviorData.detailSecondSentence}`;

  // 모든 팁: 유형별 팁이 우선, 없으면 행동 패턴 팁 + 아키타입 건강 팁
  const allTips = archetypeInfo.healthTips.length > 0
    ? archetypeInfo.healthTips
    : [...behaviorData.tips, ...archetypeInfo.healthTips];

  const finalTitle = archetypeInfo.emoji
    ? `${archetypeInfo.emoji} ${archetypeInfo.name}`
    : archetypeInfo.name;

  const result: NBTIResult = {
    dogName: basic.dogName,
    nbti: {
      id: `${displayPrefix}-${pair}`,
      name: finalTitle,
      type: `${displayPrefix}-${pair} (${behaviorData.koreanLabel} ${archetypeInfo.name})`,
      description: behaviorData.description,
      detail,
      dogImage: '/img/results/dog-1.png',
      tips: allTips,
    },
    basicInfo: {
      lifeStage: lifeStageLetter === 'P' ? 'puppy' : lifeStageLetter === 'S' ? 'senior' : 'adult',
      bcsCategory: bcsLetter === 'U' ? 'underweight' : bcsLetter === 'I' ? 'ideal' : 'overweight',
      activityLevel: basic.activityLevel,
      activityPattern: actPatternLetter === 'A' ? 'social' : 'independent',
      eatingPattern: eatLetter === 'E' ? 'enthusiastic' : 'cautious',
    },
  };

  return result;
}

// ===== 신규 퍼피 궁합 매핑 (JSON 데이터 기반) =====
export interface CompatibilityPair {
  best: { title: string; reason: string };
  worst: { title: string; reason: string };
}

export function getCompatibilityByPrefix(prefix: string): CompatibilityPair {
  const lifeStage = prefix.endsWith('A') ? 'adult' : prefix.endsWith('S') ? 'senior' : 'adult';
  const compatByLifeStage = nbtiData.compatibility[lifeStage];
  const compatData = (compatByLifeStage as Record<string, CompatibilityPair>)[prefix];

  if (!compatData) {
    return {
      best: { title: '데이터 준비 중', reason: '' },
      worst: { title: '데이터 준비 중', reason: '' }
    };
  }

  return compatData;
}

// ===== 이미지 매핑 (JSON 데이터 기반) =====
export function getArchetypeImagePath(displayPrefix: string): string {
  const lifeStage = displayPrefix.endsWith('A') ? 'adult' : displayPrefix.endsWith('S') ? 'senior' : 'adult';
  const imageMap = nbtiData.images[lifeStage];
  const imagePath = (imageMap as Record<string, string>)[displayPrefix];

  if (imagePath) return imagePath;

  // 폴백: adult 기본 이미지
  return nbtiData.images.adult.ILA;
}

export function getPuppyImagePathByTitle(title: string): string {
  const imageMap = nbtiData.images.puppy;
  const imagePath = (imageMap as Record<string, string>)[title];

  if (imagePath) return imagePath;

  // 폴백: 기본 퍼피 이미지
  return '/img/nbti-dog/puppy/little-dreamer.png';
}

// ===== 페르소나 데이터 유틸리티 함수들 =====
export function getAllPersonas() {
  return personasData.personas;
}

export function getPersonaById(id: number) {
  return personasData.personas.find(persona => persona.id === id);
}

export function getPersonaByCategory(category: string) {
  return personasData.personas.filter(persona => persona.category === category);
}

export function getPersonaTypesByCode(typeCode: string) {
  const personaData = getPersonaByTypeCode(typeCode);
  return personaData ? personaData.type : null;
}

// ===== Compact Code → Result (for short URLs) =====
export function buildResultFromCode(code: string, dogName: string): NBTIResult | null {
  if (!code || !/^[UIO][LMH][PAS]-[EC][AI]$/.test(code)) return null;
  const [displayPrefix, pair] = code.split('-') as [string, 'EA' | 'EI' | 'CA' | 'CI'];
  const typeCode = code;

  // 페르소나 데이터에서 먼저 찾기
  const personaData = getPersonaByTypeCode(typeCode);

  if (personaData) {
    const { persona, type } = personaData;

    const lifeStage = displayPrefix.endsWith('P') ? 'puppy' : displayPrefix.endsWith('S') ? 'senior' : 'adult';
    const bcsCategory = displayPrefix[0] === 'U' ? 'underweight' : displayPrefix[0] === 'I' ? 'ideal' : 'overweight';
    const activityLevel = displayPrefix[1] === 'L' ? 'low' : displayPrefix[1] === 'H' ? 'high' : 'medium';

    return {
      dogName,
      nbti: {
        id: typeCode,
        name: `${persona.name} ${type.type_label}`,
        type: `${typeCode} (${type.type_label})`,
        description: Array.isArray(type.description) ? type.description.join(' ') : type.description,
        detail: Array.isArray(type.description) ? type.description.join(' ') : type.description,
        dogImage: '/img/results/dog-1.png',
        tips: type.management_tips,
      },
      basicInfo: {
        lifeStage,
        bcsCategory,
        activityLevel,
        activityPattern: pair[1] === 'A' ? 'social' : 'independent',
        eatingPattern: pair[0] === 'E' ? 'enthusiastic' : 'cautious',
      },
    };
  }

  // 페르소나 데이터가 없으면 기존 방식 사용
  const archetypeInfo = getArchetypeInfo(displayPrefix, pair);
  const behaviorData = contentForPair(pair);
  const detail = archetypeInfo.description || `${behaviorData.detailStart}! ${behaviorData.detailSecondSentence}`;

  const lifeStage = displayPrefix.endsWith('P') ? 'puppy' : displayPrefix.endsWith('S') ? 'senior' : 'adult';
  const bcsCategory = displayPrefix[0] === 'U' ? 'underweight' : displayPrefix[0] === 'I' ? 'ideal' : 'overweight';
  const activityLevel = displayPrefix[1] === 'L' ? 'low' : displayPrefix[1] === 'H' ? 'high' : 'medium';

  const allTips = archetypeInfo.healthTips.length > 0
    ? archetypeInfo.healthTips
    : [...behaviorData.tips, ...archetypeInfo.healthTips];

  const finalTitle = archetypeInfo.emoji
    ? `${archetypeInfo.emoji} ${archetypeInfo.name}`
    : archetypeInfo.name;

  return {
    dogName,
    nbti: {
      id: `${displayPrefix}-${pair}`,
      name: finalTitle,
      type: `${displayPrefix}-${pair} (${behaviorData.koreanLabel} ${archetypeInfo.name})`,
      description: behaviorData.description,
      detail,
      dogImage: '/img/results/dog-1.png',
      tips: allTips,
    },
    basicInfo: {
      lifeStage,
      bcsCategory,
      activityLevel,
      activityPattern: pair[1] === 'A' ? 'social' : 'independent',
      eatingPattern: pair[0] === 'E' ? 'enthusiastic' : 'cautious',
    },
  };
}
