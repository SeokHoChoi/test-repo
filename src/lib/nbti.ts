import { type NBTIResult } from './utils';

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

// 콘텐츠 생성: EA/EI/CA/CI 별 문구
function contentForPair(pair: 'EA' | 'EI' | 'CA' | 'CI') {
  const characteristics: Record<'EA' | 'EI' | 'CA' | 'CI', string> = {
    EA: '빠른 식사 + 사교적 활동',
    EI: '빠른 식사 + 개별 활동',
    CA: '신중한 식사 + 사교적 활동',
    CI: '신중한 식사 + 개별 활동',
  };
  const name = `${pair}형`;
  const baseDetail: Record<'EA' | 'EI' | 'CA' | 'CI', string> = {
    EA: '식사에 적극적이고 교류를 즐기는 경향이 있어요',
    EI: '식사에 적극적이면서도 혼자 탐색/놀이를 선호해요',
    CA: '식사는 차분하지만 사람/친구들과의 활동을 즐겨요',
    CI: '식사와 활동 모두 차분하고 독립적인 성향이에요',
  };
  const tips: string[] = [];
  if (pair[0] === 'E') tips.push('슬로우 피더 등으로 급한 식사 조절');
  if (pair[0] === 'C') tips.push('키블 크기/질감 조정과 기호성 개선');
  if (pair[1] === 'A') tips.push('독스포츠/커뮤니티 활동 등 사교적 활동 추천');
  if (pair[1] === 'I') tips.push('노즈워크 등 개별 활동을 충분히 제공');
  return {
    name,
    type: '',
    characteristics: characteristics[pair],
    description: characteristics[pair],
    detailStart: baseDetail[pair],
    tips,
  };
}

export function calculateNBTIFromAnswers(basic: BasicAnswers, personal: PersonalAnswers): NBTIResult {
  const bcsLetter = mapBcsLetter(basic.bcs);
  const actLevelLetter = mapActivityLevelLetter(basic.activityLevel);
  const lifeStageLetter = mapLifeStageLetter(basic.birthDate);
  const eatLetter = mapEatingPattern(personal);
  const actPatternLetter = mapActivityPattern(personal);

  const prefix = `${bcsLetter}${actLevelLetter}${lifeStageLetter}`; // 계산용 코드
  // 화면 표시는 문서 표 기준(Adult/ Seniors). 퍼피(P)는 Adult 코드로 매핑해 표기
  const displayLifeStageLetter = lifeStageLetter === 'P' ? 'A' : lifeStageLetter;
  const displayPrefix = `${bcsLetter}${actLevelLetter}${displayLifeStageLetter}`; // 예: IHA
  const pair = `${eatLetter}${actPatternLetter}` as 'EA' | 'EI' | 'CA' | 'CI';

  const base = contentForPair(pair);

  // 접두 코드(I/M/U/O + L/M/H + A/S/P) → 아키타입 명칭 매핑 (문서 기준)
  const prefixNameMap: Record<string, string> = {
    // Adult (A)
    ILA: '완벽한 룸메이트',
    IMA: '활력충전 파트너',
    IHA: '철인삼종 챔피언',
    ULA: '도그모델',
    UMA: '날렵한 치타',
    UHA: '울트라 러너',
    OLA: '여유로운 휘게족',
    OMA: '행복한 미식가',
    OHA: '중량급 보디빌더',
    // Senior (S)
    ULS: '온화한 수호자',
    UMS: '의지의 파이터',
    UHS: '전설의 러너',
    OLS: '펫페어 큰손',
    OMS: '노련한 놀이꾼',
    OHS: '황혼의 개그맨',
  };
  const mappedName = prefixNameMap[displayPrefix];
  const archetype = mappedName ? mappedName : `${displayPrefix}`;

  const secondSentenceMap: Record<'EA' | 'EI' | 'CA' | 'CI', string> = {
    EA: '사교적 활동과 규칙적인 식사 루틴을 함께 유지해요.',
    EI: '퍼즐/탐색 놀이로 성취감을 높이고, 휴식 시간도 보장해요.',
    CA: '무리 활동을 즐기되 식사 환경은 안정적으로 유지해요.',
    CI: '조용한 환경에서 천천히 교감하고 스스로 탐색할 시간을 주세요.',
  };
  const secondSentence = secondSentenceMap[pair];
  const detail = `${base.detailStart}! ${secondSentence}`;

  // pair의 한글 라벨 (문서 기준)
  const pairKorean: Record<'EA' | 'EI' | 'CA' | 'CI', string> = {
    EA: '적극적 사교형',
    EI: '적극적 독립형',
    CA: '신중한 사교형',
    CI: '신중한 독립형',
  };

  // 타이틀은 아키타입명만 노출 (예: "완벽한 룸메이트").
  // 매핑이 없으면 코드 자체(prefix)를 표기.
  const finalTitle = mappedName ? `${archetype}` : `${displayPrefix}`;

  const result: NBTIResult = {
    dogName: basic.dogName,
    nbti: {
      id: `${displayPrefix}-${pair}`,
      name: finalTitle,
      type: `${displayPrefix}-${pair} (${pairKorean[pair]} ${archetype})`,
      description: base.description,
      detail,
      dogImage: '/img/results/dog-1.png',
      tips: base.tips,
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

// ===== 신규 퍼피 궁합 매핑 =====
export interface CompatibilityPair {
  best: { title: string; reason: string };
  worst: { title: string; reason: string };
}

const adultCompatibility: Record<string, CompatibilityPair> = {
  ILA: { best: { title: '꿈꾸는 작은 요정', reason: '저활동+안정적 성격 일치' }, worst: { title: '꼬마 로켓', reason: '극단적 활동 수준 차이' } },
  IMA: { best: { title: '엄친견', reason: '이상적 체형+보통활동 완벽 매치' }, worst: { title: '꼬마 대식가', reason: '활동 의욕 vs 식탐 충돌' } },
  IHA: { best: { title: '꿈 많은 탐험가', reason: '고활동 에너지 수준 일치' }, worst: { title: '성견의 탈을 쓴 쪼꼬미', reason: '활동량 극단적 차이' } },
  ULA: { best: { title: '성견의 탈을 쓴 쪼꼬미', reason: '저체중+저활동+우아함 공통점' }, worst: { title: '식도락 모험가', reason: '절제 vs 극도 식탐 충돌' } },
  UMA: { best: { title: '꼬마 엔터테이너', reason: '저체중+활동적 성향 유사' }, worst: { title: '눕방 꿈나무', reason: '활동 vs 휴식 성향 정반대' } },
  UHA: { best: { title: '꼬마 로켓', reason: '고활동+지구력 성향 일치' }, worst: { title: '꼬마 대식가', reason: '운동 vs 식탐 우선순위 충돌' } },
  OLA: { best: { title: '눕방 꿈나무', reason: '과체중+저활동+여유로운 성향' }, worst: { title: '꼬마 로켓', reason: '여유 vs 폭발적 에너지 상극' } },
  OMA: { best: { title: '꼬마 먹방러', reason: '과체중+먹는 즐거움 공유' }, worst: { title: '성견의 탈을 쓴 쪼꼬미', reason: '식탐 vs 절제된 식사 충돌' } },
  OHA: { best: { title: '꼬마 먹방러', reason: '과체중+고활동 체질 유사' }, worst: { title: '꿈꾸는 작은 요정', reason: '활동량 극단적 차이' } },
  // 테이블 추가 행 반영(동일 코드 중복 케이스): 필요 시 교체 가능
};

const seniorCompatibility: Record<string, CompatibilityPair> = {
  ULS: { best: { title: '성견의 탈을 쓴 쪼꼬미', reason: '저체중+차분함+철학적 성향' }, worst: { title: '꼬마 로켓', reason: '온화함 vs 폭발적 에너지' } },
  UMS: { best: { title: '꼬마 엔터테이너', reason: '의지력+적당한 활동 성향 일치' }, worst: { title: '눕방 꿈나무', reason: '의지 vs 안일함 상극' } },
  UHS: { best: { title: '꿈 많은 탐험가', reason: '고활동+도전 정신 공통점' }, worst: { title: '꼬마 대식가', reason: '운동 정신 vs 식탐 우선순위' } },
  OLS: { best: { title: '눕방 꿈나무', reason: '과체중+저활동+안락함 추구' }, worst: { title: '꼬마 로켓', reason: '여유 vs 에너지 폭발 상극' } },
  OMS: { best: { title: '꼬마 먹방러', reason: '과체중+활동적+놀이 정신' }, worst: { title: '성견의 탈을 쓴 쪼꼬미', reason: '동심 vs 조숙함 차이' } },
  OHS: { best: { title: '꼬마 먹방러', reason: '과체중+활동적+놀이 정신' }, worst: { title: '성견의 탈을 쓴 쪼꼬미', reason: '동심 vs 조숙함 차이' } },
  // 추가 행들
};

export function getCompatibilityByPrefix(prefix: string): CompatibilityPair {
  if (prefix.endsWith('A')) {
    return adultCompatibility[prefix] || { best: { title: '데이터 준비 중', reason: '' }, worst: { title: '데이터 준비 중', reason: '' } };
  }
  if (prefix.endsWith('S')) {
    return seniorCompatibility[prefix] || { best: { title: '데이터 준비 중', reason: '' }, worst: { title: '데이터 준비 중', reason: '' } };
  }
  // 기본값
  return { best: { title: '데이터 준비 중', reason: '' }, worst: { title: '데이터 준비 중', reason: '' } };
}

// ===== 이미지 매핑 =====
export function getArchetypeImagePath(displayPrefix: string): string {
  const adultBase = '/img/nbti-dog/adult';
  const seniorBase = '/img/nbti-dog/senior';

  const adultMap: Record<string, string> = {
    ILA: `${adultBase}/perfect-roommate.png`,
    IMA: `${adultBase}/energy-partner.png`,
    IHA: `${adultBase}/triathlon-champion.png`,
    ULA: `${adultBase}/dog-model.png`,
    UMA: `${adultBase}/swift-cheetah.png`,
    UHA: `${adultBase}/ultra-runner.png`,
    OLA: `${adultBase}/treat-king.png`,
    OMA: `${adultBase}/happy-gourmet.png`,
    OHA: `${adultBase}/heavyweight-bodybuilder.png`,
  };

  const seniorMap: Record<string, string> = {
    ULS: `${seniorBase}/gentle-guardian.png`,
    UMS: `${seniorBase}/willful-fighter.png`,
    UHS: `${seniorBase}/legendary-runner.png`,
    OLS: `${seniorBase}/petfair-vip.png`,
    OMS: `${seniorBase}/seasoned-player.png`,
    OHS: `${seniorBase}/dusk-comedian.png`,
  };

  if (displayPrefix.endsWith('A')) return adultMap[displayPrefix] || `${adultBase}/perfect-roommate.png`;
  if (displayPrefix.endsWith('S')) return seniorMap[displayPrefix] || `${seniorBase}/gentle-guardian.png`;
  // 퍼피(P)는 UI 주 이미지가 성견/시니어 스타일과 동일하므로 어덜트 이미지로 폴백
  return adultMap[displayPrefix.replace(/P$/, 'A')] || `${adultBase}/perfect-roommate.png`;
}

export function getPuppyImagePathByTitle(title: string): string {
  const base = '/img/nbti-dog/puppy';
  const map: Record<string, string> = {
    '꿈꾸는 작은 요정': `${base}/little-dreamer.png`,
    '엄친견': `${base}/top-dog.png`,
    '꿈 많은 탐험가': `${base}/dream-explorer.png`,
    '꼬마 로켓': `${base}/little-rocket.png`,
    '꼬마 대식가': `${base}/little-big-eater.png`,
    '꼬마 먹방러': `${base}/little-foodie.png`,
    '꼬마 엔터테이너': `${base}/little-entertainer.png`,
    '눕방 꿈나무': `${base}/couch-kid.png`,
    '성견의 탈을 쓴 쪼꼬미': `${base}/mini-adult.png`,
    '식도락 모험가': `${base}/foodie-adventurer.png`,
  };
  return map[title] || `${base}/little-dreamer.png`;
}


