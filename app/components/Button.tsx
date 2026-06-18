'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  tamaño?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-black text-white hover:bg-gray-800 active:scale-95',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
};

const tamaños = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  tamaño = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        rounded font-medium transition-all duration-200
        ${variantStyles[variant]}
        ${tamaños[tamaño]}
        ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        hover:shadow-md
        ${className}
      `}
    >
      {isLoading ? '⏳ Cargando...' : children}
    </button>
  );
}
