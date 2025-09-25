import React from 'react';

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ children, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-[#EEEEEE] p-6 mb-6 border border-gray-200 shadow-md ${className}`} style={{ borderRadius: '30px' }}>
      {children}
    </div>
  );
}
