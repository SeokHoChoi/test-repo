import React from 'react';

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
  customPadding?: string;
}

export function InfoCard({ children, className = '', customPadding }: InfoCardProps) {
  const paddingClass = customPadding || 'p-6';

  return (
    <div className={`bg-[#FFC466] ${paddingClass} mb-6 border border-gray-200 shadow-md rounded-[30px] ${className}`}>
      {children}
    </div>
  );
}
