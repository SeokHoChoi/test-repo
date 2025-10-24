import type { Metadata } from "next";
import { Geist, Geist_Mono, ABeeZee } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import ClientOnly from "../components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ABeeZee font (for specific button text)
const aBeeZee = ABeeZee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abeezee",
  display: "swap",
});

const sbAggro = localFont({
  src: [
    {
      path: "../../public/fonts/sb-aggro/SB-AggroOTF-L.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sb-aggro/SB-AggroOTF-M.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/sb-aggro/SB-AggroOTF-B.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-aggro",
  display: "swap",
});

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/pretendard/Pretendard-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://test-repo-qux1.vercel.app';

export const metadata: Metadata = {
  title: "우리 아이의 NBTI는? | Jelly Univ",
  description: "🐶 우리 아이 건강 MBTI 테스트 | 반려견의 건강 상태를 32가지 유형으로 나누고 어떻게 하면 영양학적으로 더 건강하게 지낼 수 있을지 알려주는 지표",
  openGraph: {
    title: "우리 아이의 NBTI는? | Jelly Univ",
    description: "🐶 우리 아이 건강 MBTI 테스트\n너의 갱얼쥐 NBTI가 뭐야? 🐾",
    type: 'website',
    images: [`${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`],
    siteName: '젤리대학교',
  },
  twitter: {
    card: 'summary_large_image',
    title: "우리 아이의 NBTI는? | Jelly Univ",
    description: "🐶 우리 아이 건강 MBTI 테스트\n너의 갱얼쥐 NBTI가 뭐야? 🐾",
    images: [`${baseUrl}/img/kakao-share/kakao-test-share-800x400.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sbAggro.variable} ${pretendard.variable} ${aBeeZee.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Channel Talk */}
        <Script
          id="channel-talk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();

              ChannelIO('boot', {
                "pluginKey": "35e9c103-78c8-4c3e-98fe-28d1c2fe43c6"
              });
            `,
          }}
        />

        <ClientOnly>
          {children}
        </ClientOnly>
      </body>
    </html>
  );
}
