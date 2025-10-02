import { Button } from '@/components/Button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003DA5] to-[#002A7A] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 귀여운 강아지 이미지 */}
        <div className="mb-8">
          <Image
            src="/img/results/dog-1.png"
            alt="잃어버린 강아지"
            width={200}
            height={200}
            className="mx-auto animate-bounce"
          />
        </div>
        
        {/* 404 메시지 */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">
            🐾 페이지를 찾을 수 없어요!
          </h2>
          <p className="text-white/80 text-lg">
            우리 갱얼쥐가 길을 잃었나 봐요...<br />
            메인 페이지로 돌아가서 다시 시작해보세요!
          </p>
        </div>
        
        {/* 홈으로 가기 버튼 */}
        <Button 
          href="/"
          variant="primary"
          size="lg"
          className="bg-white text-[#003DA5] hover:bg-gray-100"
        >
          🏠 홈으로 돌아가기
        </Button>
        
        {/* 추가 안내 */}
        <p className="text-white/60 text-sm mt-6">
          혹시 테스트를 하려면 아래 버튼을 눌러주세요!
        </p>
        
        <Button 
          href="/basic-questions"
          variant="outline"
          size="md"
          className="mt-4 border-white text-white hover:bg-white hover:text-[#003DA5]"
        >
          🐶 NBTI 테스트 시작하기
        </Button>
      </div>
    </div>
  );
}
