'use client';

import React from 'react';

interface ShareButtonProps {
  icon: string;
  bgColor: string;
  hoverColor?: string;
  title: string;
  onClick: () => void;
  className?: string;
}

export function ShareButton({
  icon,
  bgColor,
  hoverColor,
  title,
  onClick,
  className = ''
}: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 ${bgColor} ${hoverColor || ''} rounded-full flex items-center justify-center transition-colors shadow-md ${className}`}
      title={title}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
}
