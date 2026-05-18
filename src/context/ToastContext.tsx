import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />,
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-950 border-emerald-800 text-white',
  error: 'bg-red-950 border-red-800 text-white',
  info: 'bg-white border-emerald-100 text-emerald-950 shadow-lg',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[500] flex flex-col gap-3 pointer-events-none print:hidden max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border ${STYLES[toast.type]}`}
            >
              {ICONS[toast.type]}
              <span className="text-sm font-semibold flex-1 leading-snug">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="opacity-50 hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
