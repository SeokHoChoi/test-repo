import React from 'react';

interface ShareCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ShareCard({ children, className = '' }: ShareCardProps) {
  return (
    <div className={`bg-white p-6 mb-6 ${className}`} style={{ borderRadius: '20px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.06)' }}>
      {children}
    </div>
  );
}
