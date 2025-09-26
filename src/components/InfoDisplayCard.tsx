import React from 'react';
import { Button } from './Button';

interface InfoDisplayCardProps {
  emoji: string;
  title: string;
  subtitle?: string;
  description: string | React.ReactNode;
  buttons?: Array<{
    text: string;
    variant?: 'primary' | 'secondary' | 'outline';
    onClick: () => void;
  }>;
  noMargin?: boolean;
}

export function InfoDisplayCard({
  emoji,
  title,
  subtitle,
  description,
  buttons = [],
  noMargin = false
}: InfoDisplayCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-[20px] ${noMargin ? '' : 'mb-6'}`}
      style={{
        boxShadow: '10px 5px 10px 0px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="text-center">
        <span className="text-2xl mb-2 block">{emoji}</span>
        <h3 className="text-gray-900 font-semibold text-lg mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-500 text-sm mb-2">{subtitle}</p>
        )}
        <div className="text-gray-700 text-sm leading-relaxed mb-4">
          {description}
        </div>
        {buttons.length > 0 && (
          <div className="space-y-3">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'primary'}
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
