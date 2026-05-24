import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.2s_ease-out]">
      <div className="flex items-center gap-3 bg-green-600 text-white shadow-lg rounded-lg px-4 py-3 min-w-[260px]">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
          ✓
        </div>
        <div className="font-medium text-sm">{message}</div>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white text-lg leading-none"
          aria-label="Zatvori"
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
