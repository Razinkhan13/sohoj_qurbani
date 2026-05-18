import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ShieldCheck, CheckCircle2, Copy, Check,
  Loader2, ArrowLeft, Smartphone,
} from 'lucide-react';

type PaymentStep = 'method' | 'instructions' | 'verifying' | 'success';
type PaymentMethod = 'bkash' | 'nagad';

const MERCHANT = '01708761298';
const AMOUNT_TK = 29;

const METHODS: Record<PaymentMethod, { label: string; color: string; bg: string; lightColor: string }> = {
  bkash: { label: 'bKash', color: '#E2136E', bg: '#FDE8F2', lightColor: '#fce7f3' },
  nagad: { label: 'Nagad', color: '#F7941D', bg: '#FEF3E8', lightColor: '#fff7ed' },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userContact: string;
}

export const ProModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade, userContact }) => {
  const [step, setStep] = useState<PaymentStep>('method');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [trxError, setTrxError] = useState('');

  const reset = () => {
    setStep('method');
    setMethod(null);
    setTrxId('');
    setCopied(false);
    setTrxError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    setMethod(m);
    setStep('instructions');
  };

  const handleVerify = () => {
    const trimmed = trxId.trim();
    if (trimmed.length < 8) {
      setTrxError('সঠিক ট্রানজেকশন আইডি লিখুন (কমপক্ষে ৮ অক্ষর)');
      return;
    }
    setTrxError('');
    setStep('verifying');
    // MVP: client-side optimistic activation after UI delay.
    // Production TODO: POST trxId to a server-side webhook that calls the
    // bKash/Nagad Verify API, confirms amount === 29 BDT and marks the
    // user's account active in Supabase before calling onUpgrade().
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        reset();
        onUpgrade();
      }, 3500);
    }, 2800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MERCHANT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard not available — graceful no-op
    }
  };

  const m = method ? METHODS[method] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 print:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
          >
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Method selection ────────────────────────── */}
              {step === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-emerald-900 to-transparent pointer-events-none" />
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1.5 rounded-full hover:bg-emerald-800/50 transition-all"
                      aria-label="বন্ধ করুন"
                    >
                      <X size={20} />
                    </button>
                    <div className="relative">
                      <div className="mx-auto bg-amber-400 text-emerald-950 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-xl">
                        <ShieldCheck size={30} strokeWidth={2.5} />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight mb-1">প্রো আনলক করুন</h2>
                      <p className="text-emerald-200/80 text-sm">
                        মাত্র{' '}
                        <span className="text-amber-400 font-black text-xl">২৯ টাকায়</span>{' '}
                        আজীবন প্রো অ্যাক্সেস
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <ul className="space-y-3 mb-6 text-emerald-900 font-semibold text-sm">
                      {[
                        'হিসাবের প্রিমিয়াম PDF রিপোর্ট ডাউনলোড',
                        'ভেরিফাইড শরিকদের কাছে সরাসরি রিকোয়েস্ট',
                        'হোয়াটসঅ্যাপ সাপোর্ট ও গ্রুপ অ্যাক্সেস',
                      ].map((feat) => (
                        <li key={feat} className="flex items-center gap-3">
                          <CheckCircle2 className="text-amber-500 shrink-0" size={17} />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <p className="text-xs font-black uppercase tracking-wider text-emerald-500 mb-3 text-center">
                      পেমেন্ট পদ্ধতি বেছে নিন
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(METHODS) as [PaymentMethod, typeof METHODS.bkash][]).map(
                        ([key, info]) => (
                          <button
                            key={key}
                            onClick={() => handleMethodSelect(key)}
                            className="flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border-2 font-black text-xl transition-all hover:scale-[1.04] active:scale-[0.97] focus:outline-none"
                            style={{
                              borderColor: info.color,
                              backgroundColor: info.bg,
                              color: info.color,
                            }}
                          >
                            <Smartphone size={30} style={{ color: info.color }} />
                            {info.label}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Instructions + TrxID ───────────────────── */}
              {step === 'instructions' && m && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* Colored header */}
                  <div
                    className="p-6 text-white text-center relative"
                    style={{ background: m.color }}
                  >
                    <button
                      onClick={() => setStep('method')}
                      className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all"
                      aria-label="পেছনে যান"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all"
                      aria-label="বন্ধ করুন"
                    >
                      <X size={18} />
                    </button>
                    <div className="mt-2">
                      <p className="text-white/80 font-bold text-xs uppercase tracking-[3px] mb-2">
                        {m.label} পেমেন্ট
                      </p>
                      <div className="text-5xl font-black tracking-tight">
                        ৳&thinsp;{AMOUNT_TK}
                      </div>
                      <p className="text-white/70 text-xs mt-2 font-medium">
                        একবারের পেমেন্ট • আজীবন প্রো অ্যাক্সেস
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Step guide */}
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-500">
                        এই ধাপগুলো অনুসরণ করুন:
                      </p>
                      {[
                        `আপনার ${m.label} অ্যাপ খুলুন`,
                        '"Send Money" বা "পাঠান" অপশনে যান',
                        'নিচের নম্বরে ২৯ টাকা পাঠান',
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm font-semibold text-emerald-900">
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5"
                            style={{ background: m.color }}
                          >
                            {i + 1}
                          </span>
                          {text}
                        </div>
                      ))}
                    </div>

                    {/* Merchant number */}
                    <div
                      className="rounded-2xl border-2 p-4 flex items-center justify-between"
                      style={{ borderColor: m.color, background: m.bg }}
                    >
                      <div>
                        <p
                          className="text-xs font-bold uppercase tracking-wider mb-1"
                          style={{ color: m.color }}
                        >
                          {m.label} নম্বর (Personal)
                        </p>
                        <p className="text-2xl font-black tracking-widest text-emerald-950">
                          {MERCHANT}
                        </p>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90"
                        style={{ background: m.color }}
                        aria-label={copied ? 'কপি হয়েছে' : 'নম্বর কপি করুন'}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                      </button>
                    </div>

                    {/* TrxID */}
                    <div>
                      <label className="block text-sm font-bold text-emerald-900 mb-2">
                        ট্রানজেকশন আইডি (TrxID) লিখুন
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => {
                          setTrxId(e.target.value.toUpperCase());
                          setTrxError('');
                        }}
                        placeholder="উদাহরণ: 8AB9C1D2E3"
                        maxLength={20}
                        aria-describedby="trxid-hint"
                        className={`w-full bg-emerald-50 border-2 rounded-2xl py-3.5 px-5 text-emerald-950 font-bold text-lg focus:outline-none focus:ring-4 transition-all tracking-wider ${
                          trxError
                            ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400'
                            : 'border-emerald-100 focus:border-amber-400 focus:ring-amber-400/20'
                        }`}
                      />
                      {trxError ? (
                        <p className="text-red-500 text-xs font-semibold mt-1.5">{trxError}</p>
                      ) : (
                        <p id="trxid-hint" className="text-emerald-500 text-xs font-medium mt-1.5">
                          পেমেন্টের পরে {m.label} SMS-এ TrxID পাবেন
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleVerify}
                      className="w-full text-white font-black text-lg py-4 rounded-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        background: m.color,
                        opacity: trxId.trim().length >= 8 ? 1 : 0.45,
                        cursor: trxId.trim().length >= 8 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      পেমেন্ট যাচাই করুন
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Verifying ───────────────────────────────── */}
              {step === 'verifying' && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-14 flex flex-col items-center gap-6 text-center"
                >
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-700 animate-spin" />
                    <div className="absolute inset-4 flex items-center justify-center">
                      <Loader2 size={28} className="text-emerald-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-950 mb-2">
                      পেমেন্ট যাচাই হচ্ছে...
                    </h3>
                    <p className="text-emerald-600 font-medium text-sm">
                      ট্রানজেকশন আইডি নিরীক্ষণ করা হচ্ছে
                    </p>
                  </div>
                  <div className="flex gap-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-emerald-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Success ─────────────────────────────────── */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.55, delay: 0.1 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  >
                    <CheckCircle2 size={48} className="text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-emerald-950 mb-3 tracking-tight">
                    পেমেন্ট সফল হয়েছে! 🎉
                  </h2>
                  <p className="text-emerald-700 font-medium mb-8 leading-relaxed text-sm">
                    আপনার অ্যাকাউন্ট{' '}
                    {userContact && (
                      <strong className="text-emerald-950">{userContact}</strong>
                    )}{' '}
                    সফলভাবে প্রো-তে আপগ্রেড হয়েছে।
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
                    <Loader2 size={16} className="animate-spin" />
                    প্রো ড্যাশবোর্ডে যাচ্ছে...
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
