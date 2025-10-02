import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // 정적 이미지 파일로 리다이렉트
  const url = new URL(request.url);
  const baseUrl = url.origin;

  // 2:1 비율 이미지로 리다이렉트 (Open Graph 표준)
  return Response.redirect(`${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`);
}