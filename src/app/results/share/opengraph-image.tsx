import { ImageResponse } from 'next/og';
import { decodeResultFromUrl, type NBTIResult } from '@/lib/utils';
import { getArchetypeImagePath } from '@/lib/nbti';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function getResultFromSearch(searchParams: URLSearchParams): NBTIResult | null {
  const encoded = searchParams.get('result');
  if (!encoded) return null;
  return decodeResultFromUrl(encoded);
}

export default async function Image({
  request,
}: {
  request: Request;
}) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  const result = getResultFromSearch(url.searchParams);

  const dogImage = (() => {
    if (!result?.nbti?.id) return `${origin}/img/results/dog-1.png`;
    const prefix = result.nbti.id.split('-')[0] || '';
    const path = getArchetypeImagePath(prefix);
    return `${origin}${path}`;
  })();

  const title = result?.nbti?.name || 'Jelly Univ NBTI';
  const subtitle = result?.nbti?.type || '반려견 NBTI 결과';
  const quote = result?.nbti?.description ? `“${result.nbti.description}”` : '우리 아이의 NBTI를 확인해보세요!';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#003DA5',
        }}
      >
        <div
          style={{
            width: '1060px',
            height: '540px',
            background: '#FFFFFF',
            borderRadius: 24,
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            padding: '32px 40px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          }}
        >
          <img
            src={dogImage}
            width={360}
            height={360}
            style={{ objectFit: 'contain', borderRadius: 16 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 42 }}>🏆</div>
              <div style={{ fontSize: 46, fontWeight: 700, color: '#212121' }}>{title}</div>
            </div>
            <div style={{ fontSize: 22, color: '#8B8B8B' }}>{subtitle}</div>
            <div style={{ width: 520, height: 1, background: '#E3E3E3' }} />
            <div style={{ fontSize: 24, color: '#003DA5', fontWeight: 700 }}>{quote}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


