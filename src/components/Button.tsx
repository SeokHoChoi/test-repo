'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'input';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  children: React.ReactNode;
  href?: string;
  shareAction?: boolean;
  fullWidth?: boolean; // default true: w-full, false: w-auto
  roundedClass?: string; // default 'rounded-xl'
  customPadding?: string; // custom padding override (e.g., "py-1 px-2")
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  href,
  shareAction = false,
  fullWidth = true,
  roundedClass = 'rounded-xl',
  customPadding,
  onClick,
  ...props
}) => {
  const router = useRouter();

  const widthClasses = fullWidth ? 'w-full' : 'w-auto';
  const baseClasses = `${widthClasses} ${roundedClass} font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const variantClasses = {
    primary: 'bg-[#003DA5] text-white hover:bg-[#002A7A] focus:ring-[#003DA5]',
    secondary: 'text-gray-600 text-sm flex items-center justify-center gap-2 hover:text-gray-800',
    outline: 'border-2 border-[#003DA5] text-[#003DA5] hover:bg-blue-50 focus:ring-[#003DA5]',
    ghost: 'bg-white text-[#003DA5] hover:bg-gray-100 focus:ring-[#003DA5]',
    input: 'bg-white border border-gray-200 text-left hover:border-[#003DA5] focus:border-[#003DA5]'
  };

  const sizeClasses = {
    sm: 'px-[clamp(8px,2vw,12px)] py-[clamp(8px,2vw,12px)] text-[clamp(0.75rem,3vw,0.875rem)] landscape:py-1.5 landscape:text-xs',
    md: 'px-[clamp(12px,3vw,16px)] py-[clamp(12px,3vw,16px)] text-[clamp(0.875rem,3.5vw,1rem)] landscape:py-2 landscape:text-sm',
    lg: 'px-[clamp(16px,4vw,20px)] py-[clamp(16px,4vw,20px)] text-[clamp(1rem,4vw,1.125rem)] landscape:py-3 landscape:text-base',
    xl: 'px-[clamp(16px,4vw,20px)] py-[clamp(16px,4vw,20px)] text-[clamp(1rem,4vw,1.125rem)] landscape:py-3 landscape:text-base',
    none: ''
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else if (shareAction) {
      // 공유하기 기능
      if (navigator.share) {
        navigator.share({
          title: '우리 아이의 NBTI는?',
          text: '반려견의 건강 상태를 32가지 유형으로 나누고 어떻게 하면 영양학적으로 더 건강하게 지낼 수 있을지 알려주는 지표',
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
      }
    } else if (href) {
      router.push(href);
    }
  };

  const finalSizeClasses = customPadding ? '' : sizeClasses[size];
  const paddingClasses = customPadding || '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${finalSizeClasses} ${paddingClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};