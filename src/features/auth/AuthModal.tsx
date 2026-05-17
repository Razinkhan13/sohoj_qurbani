import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, MessageSquare, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AuthMethod } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (contact: string) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [method, setMethod] = useState<AuthMethod>('email');

  useEffect(() => {
    if (!supabase || !isOpen) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        onLogin(session.user.email);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [isOpen, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setLoading(true);

    if (method === 'email' && supabase && contact.includes('@')) {
      try {
        const { error } = await supabase.auth.signInWithOtp({ email: contact });
        if (error) throw error;
        setOtpSent(true);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Supabase auth error', err);
      }
    }

    // WhatsApp / fallback path — demo only (no real OTP backend yet)
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimeout(() => onLogin(contact), 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-emerald-950/90 backdrop-blur-xl z-[300] flex items-center justify-center p-4 print:hidden"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] outline outline-1 outline-emerald-100/20"
          >
            <div className="bg-emerald-950 p-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-emerald-900 to-transparent pointer-events-none"></div>
              <button onClick={onClose} className="absolute top-5 right-5 text-emerald-400 hover:text-white hover:bg-emerald-800/50 p-2 rounded-full transition-all"><X size={20} strokeWidth={3} /></button>
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-[1.5rem] shadow-2xl border border-emerald-700/50 ring-4 ring-emerald-900/50">
                <Lock size={36} className="text-amber-400" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">সুরক্ষিত লগইন</h2>
              <p className="text-emerald-300 font-medium">কন্টিনিউ করতে আপনার পরিচয় যাচাই করুন</p>
            </div>

            <div className="p-8">
              {!otpSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2 p-1.5 bg-emerald-50 rounded-2xl mb-8 border border-emerald-100">
                    <button type="button" onClick={() => setMethod('email')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${method === 'email' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-600 hover:text-emerald-900'}`}>
                      Email (Free)
                    </button>
                    <button type="button" onClick={() => setMethod('whatsapp')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${method === 'whatsapp' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-600 hover:text-emerald-900'}`}>
                      WhatsApp API
                    </button>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-emerald-900 mb-2">
                      {method === 'email' ? 'আপনার ইমেইল অ্যাড্রেস' : 'আপনার হোয়াটস্যাপ নাম্বার'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                        {method === 'email' ? <MessageSquare size={20} /> : <span className="font-bold">+880</span>}
                      </div>
                      <input
                        type={method === 'email' ? 'email' : 'tel'}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={method === 'email' ? 'name@example.com' : '17XXXXXXXX'}
                        required
                        className={`w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl py-4 pr-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 text-emerald-950 font-bold transition-all ${method === 'email' ? 'pl-12' : 'pl-16'}`}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-950/20 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group">
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                    {loading ? 'লগইন প্রসেস হচ্ছে...' : 'লগইন লিঙ্ক পাঠান'}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-3">সফলভাবে প্রেরিত!</h3>
                  <p className="text-emerald-700 font-medium leading-relaxed mb-6">
                    আমরা <strong className="text-emerald-950 px-1">{contact}</strong> নম্বরে/ইমেইলে একটি সুরক্ষিত ইনভয়েস এবং লগইন সেশন পাঠিয়েছি।
                  </p>
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-3 px-4 rounded-xl border border-emerald-100">
                    <Loader2 size={18} className="animate-spin" />
                    {method === 'email' && supabase ? 'লিঙ্কে ক্লিক করার অপেক্ষায়...' : 'অটো রিডাইরেক্ট করা হচ্ছে...'}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
