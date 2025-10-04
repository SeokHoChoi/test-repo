# 강아지 NBTI 테스트

반려견의 건강 상태를 32가지 유형으로 분류하는 테스트 서비스

## 페이지 구조

```
src/app/
├── page.tsx                    # 루트 (리다이렉트)
├── layout.tsx                  # 공통 레이아웃
├── landing/page.tsx            # 메인 페이지
├── basic-questions/page.tsx    # 기본 질문
├── personal-questions/page.tsx # 개인화 질문
├── results/page.tsx            # 결과 화면
└── results/share/page.tsx      # 결과 공유
```

## 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인



