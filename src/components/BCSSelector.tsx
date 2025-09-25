'use client';

import React from 'react';

interface BCSSelectorProps {
  selectedBCS: string | null;
  onSelectBCS: (bcs: string) => void;
}

export function BCSSelector({ selectedBCS, onSelectBCS }: BCSSelectorProps) {
  const bcsOptions = [
    {
      id: 'skinny',
      label: 'Skinny',
      description: 'Ribcage is Visible',
      color: '#FEF3C7'
    },
    {
      id: 'just-right',
      label: 'Just Right',
      description: 'Clear Waistline',
      color: '#D1FAE5'
    },
    {
      id: 'husky',
      label: 'Husky',
      description: "Can't Feel Ribcage",
      color: '#FED7AA'
    },
    {
      id: 'chubby',
      label: 'Chubby',
      description: 'Visible Love Handles',
      color: '#FECACA'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {bcsOptions.map((option) => (
        <div
          key={option.id}
          className={`
            bg-white rounded-xl p-4 border-2 cursor-pointer transition-all
            ${selectedBCS === option.id
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
          onClick={() => onSelectBCS(option.id)}
        >
          {/* 강아지 일러스트레이션 */}
          <div className="h-16 mb-3 bg-gray-50 rounded-lg flex items-center justify-center">
            <div
              className="w-12 h-8 rounded-full relative"
              style={{ backgroundColor: option.color }}
            >
              {/* 강아지 모양 */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-black rounded-full"></div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-medium text-teal-600 mb-1">{option.label}</h4>
            <p className="text-xs text-gray-500">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
