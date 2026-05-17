import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userContact: string;
}

export const ProModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade, userContact }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUpgrade();
      }, 3500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 print:hidden"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-emerald-100/20"
          >
            {success ? (
              <div className="p-10 text-center flex flex-col items-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 size={40} />
                </motion.div>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight">পেমেন্ট সফল হয়েছে!</h2>
                <p className="text-emerald-700 font-medium mb-8 leading-relaxed">
                  আপনার ইনভয়েস সফলভাবে <strong className="text-emerald-950">{userContact}</strong> এ পাঠিয়ে দেয়া হয়েছে।
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg">
                  <Loader2 size={16} className="animate-spin" /> প্রো ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-center text-white relative">
                  <button onClick={onClose} className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full"><X size={24} /></button>
                  <div className="mx-auto bg-amber-400 text-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-emerald-800/50">
                    <ShieldCheck size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black mb-1 tracking-tight">আনলক করুন প্রো ফিচার্স</h2>
                  <p className="text-emerald-200/90 text-sm font-medium">মাত্র ২৯ টাকায় আনলিমিটেড অ্যাক্সেস</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-4 mb-8 text-emerald-900 font-semibold text-sm">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> হিসাবের পিডিএফ রিপোর্ট ডাউনলোড</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> ভেরিফাইড শরিক রিকোয়েস্ট</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> হোয়াটসঅ্যাপ গ্রুপ সাপোর্ট</li>
                  </ul>

                  <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100/60 flex flex-col gap-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Payment Methods</span>
                    <div className="flex justify-center flex-wrap gap-2 text-emerald-700">
                      <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-bold shadow-sm">bKash</span>
                      <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-bold shadow-sm">Nagad</span>
                      <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-bold shadow-sm">Tap</span>
                      <span className="px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-bold shadow-sm">Cards</span>
                    </div>
                    <div className="flex justify-center mt-2 pt-2 border-t border-emerald-200/50">
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5"><Lock size={12} /> Secured by SSL Commerz</span>
                    </div>
                  </div>

                  <button onClick={handlePayment} disabled={processing}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-amber-400/20 hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                    {processing ? <Loader2 size={24} className="animate-spin" /> : <CreditCard size={24} />}
                    {processing ? 'Processing Payment...' : '২৯ টাকায় আনলক করুন'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
