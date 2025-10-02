import { Metadata } from 'next';
import { ReactNode } from 'react';
import { buildResultFromCode } from '@/lib/nbti';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Record<string, string>;
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://test-repo-qux1.vercel.app';
  const code = searchParams.code;

  if (code) {
    try {
      const [nbtiCode, dogName] = decodeURIComponent(code).split('|');
      const result = buildResultFromCode(nbtiCode, dogName);

      if (result) {
        const title = `🐶 ${dogName}의 NBTI는 ${result.nbti.name}!`;
        const description = `${result.nbti.id} (${result.nbti.type})\n"${result.nbti.definition}"`;
        const imageUrl = `${origin}/img/kakao-share/kakao-test-share-800x400.png`;

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            type: 'website',
            images: [
              {
                url: imageUrl,
                width: 800,
                height: 400,
                alt: `${dogName}의 NBTI 결과`,
              },
            ],
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

  const defaultTitle = '우리 아이의 NBTI는?';
  const defaultDesc = '반려견의 가장 기본적인 정보를 32가지 유형으로 분류하는 시스템입니다.';
  const defaultImage = `${origin}/img/kakao-share/kakao-test-share-800x400.png`;

  return {
    title: defaultTitle,
    description: defaultDesc,
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      type: 'website',
      images: [
        {
          url: defaultImage,
          width: 800,
          height: 400,
          alt: 'NBTI 테스트 이미지',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [defaultImage],
    },
  };
}

export default function ShareLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
