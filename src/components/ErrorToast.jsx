import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ErrorToast({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-red-900/90 border border-red-700 rounded-lg shadow-xl p-4 flex items-start gap-3 min-w-[300px] max-w-[500px] backdrop-blur-sm">
        <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <div className="font-semibold text-red-200 mb-1">错误</div>
          <div className="text-sm text-red-300">{error}</div>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

