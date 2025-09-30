import React from 'react';
import { Button } from './Button';

interface InfoDisplayCardProps {
  emoji: string;
  title: string | React.ReactNode;
  subtitle?: string;
  description: string | React.ReactNode;
  buttons?: Array<{
    text: string;
    variant?: 'primary' | 'secondary' | 'outline';
    onClick: () => void;
  }>;
  noMargin?: boolean;
  customPadding?: string;
}

export function InfoDisplayCard({
  emoji,
  title,
  subtitle,
  description,
  buttons = [],
  noMargin = false,
  customPadding
}: InfoDisplayCardProps) {
  const paddingClass = customPadding || 'p-6';

  return (
    <div
      className={`bg-white ${paddingClass} rounded-[20px] ${noMargin ? '' : 'mb-6'}`}
      style={{
        boxShadow: '10px 5px 10px 0px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="text-center">
        <span className="text-2xl mb-2 block">{emoji}</span>
        <h3 className="text-[#003DA5] font-semibold text-[20px] text-center leading-[21px]" style={{ marginBottom: subtitle ? '4px' : '15px' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-[#003DA5] font-normal text-[15px] mb-[15px]">{subtitle}</p>
        )}
        <div className="text-[#343434] font-normal text-[13px] mb-[24px]" style={{ lineHeight: '18.5px' }}>
          {description}
        </div>
        {buttons.length > 0 && (
          <div className={buttons.length === 2 ? "flex gap-[10px] justify-center" : "space-y-3"}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'primary'}
                onClick={button.onClick}
                fullWidth={false}
                roundedClass="rounded-[50px]"
                className={`font-semibold text-[15px] px-[17.5px] ${buttons.length === 2
                  ? index === 0 ? "flex-1 min-w-0" : "flex-1 min-w-0"
                  : "min-w-[161px] max-w-[161px] min-h-[41.31px]"
                  }`}
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
