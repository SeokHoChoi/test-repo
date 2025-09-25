import React from 'react';

interface GrayInfoCardProps {
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  maxWidth?: number; // px 단위, 기본 303
}

export function GrayInfoCard({ title, subtitle, className = '', maxWidth = 303 }: GrayInfoCardProps) {
  return (
    <div
      className={`bg-[#EFEFEF] rounded-[20px] py-5 px-[31px] mx-auto ${className}`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <h4 className="text-[#003DA5] font-semibold text-[20px] text-center" style={{ marginBottom: subtitle ? 19 : 0 }}>{title}</h4>
      {subtitle && (
        <p className="text-black font-normal text-[18px] text-center">{subtitle}</p>
      )}
    </div>
  );
}


