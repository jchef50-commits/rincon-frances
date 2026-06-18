'use client';

import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toastStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

const toastIcons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

export function Toast({ messages, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {messages.map((msg) => (
        <ToastItem
          key={msg.id}
          message={msg}
          onDismiss={() => onDismiss(msg.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`
        ${toastStyles[message.type]}
        px-4 py-3 rounded-lg shadow-lg
        animate-slideInDown
        flex items-center gap-2
        max-w-sm
      `}
    >
      <span className="text-xl">{toastIcons[message.type]}</span>
      <span className="flex-1">{message.message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 hover:opacity-80 text-lg"
      >
        ✕
      </button>
    </div>
  );
}
