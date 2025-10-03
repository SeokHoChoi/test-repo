/**
 * 설문조사 답변 매핑 상수
 * 비개발자도 쉽게 확인하고 수정할 수 있도록 구성
 */

// ===== BCS (체형 점수) 매핑 =====
export const BCS_MAPPING = {
  "저체중": "U",
  "이상적": "I",
  "과체중": "O",
  "비만": "O"
} as const;

// ===== 활동수준 매핑 =====
export const ACTIVITY_LEVEL_MAPPING = {
  "저활동": "L",
  "보통활동": "M",
  "고활동": "H"
} as const;

// ===== 생애주기 매핑 =====
// 생애주기 구분 기준:
// - 퍼피(P): 성장기 (2-12개월) - 성장판이 완전히 닫힐 때까지
//   * 체급별 성장 완료 시점:
//     - 초소형견(≤4kg): 7~12개월
//     - 소형견(5~10kg): 10~12개월  
//     - 중형견(11~25kg): 12~16개월
//     - 대형견(26~44kg): 18~24개월
//     - 초대형견(≥45kg): 24~36개월
// - 성견(A): 성견 (1-7세) - 성장 완료 후 노령 시작 전
// - 시니어(S): 시니어 (7세 이상) - 노령견 시작 이후
//   * 체급별 노령 시작 시점:
//     - 소형견(5~10kg): 8세 이후
//     - 중형견(11~25kg): 7세 이후
//     - 대형견(26~44kg): 5~6세 이후
//     - 초대형견(≥45kg): 약 5세 전후
export const LIFE_STAGE_MAPPING = {
  "퍼피": "P",
  "성견": "A",
  "시니어": "S"
} as const;

// ===== 식사 질문 매핑 =====
// 식사를 얼마나 즐기나요?
export const MEAL_ENJOYMENT_MAPPING = {
  "좋아함": "E",
  "보통": "C",
  "별로 즐기지 않음": "C"
} as const;

// 밥그릇을 비우는 속도
export const EATING_SPEED_MAPPING = {
  "빠름": "E",
  "보통": "C",
  "느림": "C"
} as const;

// ===== 활동 질문 매핑 =====
export const ACTIVITY_QUESTION_MAPPING = {
  // 산책할 때 반응
  "신남": "A",
  "보통": "I",
  "귀찮아함": "I",

  // 놀이 패턴과 선호
  "친구/사람과 함께": "A",
  "혼자 잘 놈": "I",
  "관찰/구경": "I"
} as const;

// ===== 코드를 라벨로 변환하는 매핑 =====
export const CODE_TO_LABEL_MAPPING = {
  // BCS 코드 → 라벨
  BCS: {
    "U": "저체중",
    "I": "이상적",
    "O": "과체중"
  },

  // 활동수준 코드 → 라벨
  ACTIVITY_LEVEL: {
    "L": "저활동",
    "M": "보통활동",
    "H": "고활동"
  },

  // 생애주기 코드 → 라벨
  LIFE_STAGE: {
    "P": "퍼피",
    "A": "성견",
    "S": "시니어"
  },

  // 식사패턴 코드 → 라벨
  EATING_PATTERN: {
    "E": "적극형",
    "C": "신중형"
  },

  // 활동패턴 코드 → 라벨
  ACTIVITY_PATTERN: {
    "A": "사교형",
    "I": "독립형"
  }
} as const;

// ===== 생애주기별 이미지 경로 =====
export const LIFE_STAGE_IMAGE_PATHS = {
  "P": "/img/nbti-dog/puppy/",
  "A": "/img/nbti-dog/adult/",
  "S": "/img/nbti-dog/senior/"
} as const;

// ===== 매핑 규칙 설명 =====
export const MAPPING_RULES = {
  // 식사패턴: 두 질문 중 하나라도 E이면 E, 모두 C이면 C
  EATING_PATTERN: "두 질문 중 하나라도 E이면 E, 모두 C이면 C",

  // 활동패턴: 두 질문 중 하나라도 A이면 A, 모두 I이면 I  
  ACTIVITY_PATTERN: "두 질문 중 하나라도 A이면 A, 모두 I이면 I"
} as const;

// ===== 예시 매핑 결과 =====
export const EXAMPLE_MAPPINGS = [
  {
    survey: {
      q1: "이상적", q2: "보통활동", q3: "성견",
      q4: "좋아함", q5: "빠름",
      q6: "신남", q7: "친구/사람과 함께"
    },
    result: "IMA-EA",
    description: "이상적 + 보통활동 + 성견 + 적극형 + 사교형"
  },
  {
    survey: {
      q1: "저체중", q2: "저활동", q3: "시니어",
      q4: "별로 즐기지 않음", q5: "느림",
      q6: "귀찮아함", q7: "혼자 잘 놈"
    },
    result: "ULS-CI",
    description: "저체중 + 저활동 + 시니어 + 신중형 + 독립형"
  }
] as const;
