'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block body-small_semi-bold text-black mb-2">
          {label}
        </label>
      )}
      
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all body-small_regular text-left flex items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${!value ? 'text-gray-400' : 'text-gray-900'}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto py-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left body-small_regular transition-colors flex items-center justify-between group ${
                  value === option.value
                    ? 'bg-neutral-500/10 text-neutral-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-5 h-5 text-neutral-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}