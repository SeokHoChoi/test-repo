import { Metadata } from 'next';
import { buildResultFromCode } from '@/lib/nbti';

export async function generateMetadata({
  searchParams
}: {
  searchParams: { code?: string }
}): Promise<Metadata> {
  const code = searchParams?.code;

  if (code) {
    try {
      const [nbtiCode, dogName] = decodeURIComponent(code).split('|');
      const result = buildResultFromCode(nbtiCode, dogName);

      if (result) {
        const title = `🐶 ${dogName}의 NBTI는 ${result.nbti.name}!`;
        const description = `${result.nbti.id} (${result.nbti.type})\n"${result.nbti.definition}"`;
        const imageUrl = `https://test-repo-qux1.vercel.app/img/kakao-share/kakao-test-share-800x400.png`;

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            images: [
              {
                url: imageUrl,
                width: 800,
                height: 400,
                alt: `${dogName}의 NBTI 결과`,
              },
            ],
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
          },
        };
      }
    } catch (error) {
      console.error('메타데이터 생성 실패:', error);
    }
  }

  // 기본 메타데이터
  return {
    title: '우리 아이의 NBTI는?',
    description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
    openGraph: {
      title: '우리 아이의 NBTI는?',
      description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
      images: [
        {
          url: 'https://test-repo-qux1.vercel.app/img/kakao-share/kakao-test-share-800x400.png',
          width: 800,
          height: 400,
          alt: 'NBTI 테스트 이미지',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '우리 아이의 NBTI는?',
      description: '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.',
      images: ['https://test-repo-qux1.vercel.app/img/kakao-share/kakao-test-share-800x400.png'],
    },
  };
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
