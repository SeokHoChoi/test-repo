'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, setYear, setMonth } from 'date-fns';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
}

export function Calendar({ isOpen, onClose, onSelectDate, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // 모달이 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // 컴포넌트 언마운트 시 스타일 정리
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (day: Date) => {
    onSelectDate(day);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(setMonth(currentMonth, month));
  };

  // 연도 옵션 생성 (현재 연도 기준 ±20년)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

  // 월 옵션 생성
  const monthOptions = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {/* 연도 셀렉트 */}
            <select
              value={format(currentMonth, 'yyyy')}
              onChange={(e) => handleYearSelect(parseInt(e.target.value))}
              size={1}
              className="px-3 py-2 text-base font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              style={{ maxHeight: '60vh' }}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>

            {/* 월 셀렉트 */}
            <select
              value={format(currentMonth, 'M')}
              onChange={(e) => handleMonthSelect(parseInt(e.target.value) - 1)}
              size={1}
              className="px-3 py-2 text-base font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              style={{ maxHeight: '60vh' }}
            >
              {monthOptions.map((month) => (
                <option key={month} value={month + 1}>
                  {month + 1}월
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>


        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                  ${isSelected
                    ? 'bg-blue-600 text-white'
                    : isCurrentMonth
                      ? 'text-gray-900 hover:bg-gray-100'
                      : 'text-gray-400'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* 닫기 버튼 */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
