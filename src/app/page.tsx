import { redirect } from 'next/navigation';

export default function Home() {
  // 루트 경로에서 랜딩 페이지로 리다이렉트
  redirect('/landing');
}
