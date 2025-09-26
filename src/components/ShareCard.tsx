import React from 'react';

interface ShareCardProps {
  children: React.ReactNode;
  className?: string;
  customStyle?: React.CSSProperties;
  customPadding?: string;
}

export function ShareCard({ children, className = '', customStyle, customPadding }: ShareCardProps) {
  const defaultStyle = { boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.06)' };
  const finalStyle = customStyle ? { ...defaultStyle, ...customStyle } : defaultStyle;
  const paddingClass = customPadding || 'p-6';

  return (
    <div className={`bg-white ${paddingClass} mb-6 rounded-[20px] ${className}`} style={finalStyle}>
      {children}
    </div>
  );
}
