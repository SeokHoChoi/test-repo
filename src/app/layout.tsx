import type { Metadata } from "next";
import { Geist, Geist_Mono, ABeeZee } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "우리 아이의 NBTI는? | Jelly Univ",
  description: "반려견의 건강 상태를 32가지 유형으로 나누고 어떻게 하면 영양학적으로 더 건강하게 지낼 수 있을지 알려주는 지표",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sbAggro.variable} ${pretendard.variable} ${aBeeZee.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
