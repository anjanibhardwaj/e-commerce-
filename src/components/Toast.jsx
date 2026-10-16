import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 bg-gray-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs sm:text-sm font-semibold max-w-md">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
