import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '우리 아이의 NBTI는?',
  description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
  openGraph: {
    title: '우리 아이의 NBTI는?',
    description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
    type: 'website',
    images: [
      {
        url: 'https://test-repo-qux1.vercel.app/img/kakao-share/kakao-test-share-800x400.png',
        width: 800,
        height: 400,
        alt: 'NBTI 테스트 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '우리 아이의 NBTI는?',
    description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
    images: ['/img/kakao-share/kakao-test-share-800x400.png'],
  },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
