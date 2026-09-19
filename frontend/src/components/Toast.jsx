import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 icon-emerald-600',
    error: 'bg-rose-50 text-rose-800 border-rose-200 icon-rose-600',
    info: 'bg-brand-50 text-brand-800 border-brand-200 icon-brand-600',
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 max-w-md ${typeStyles[type]}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 ml-auto">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
