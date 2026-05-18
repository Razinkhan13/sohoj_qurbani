import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scissors, CheckCircle2, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES_LIST = [
  'জবাই',
  'সম্পূর্ণ কাটাকাটি',
  'চামড়া ছাড়ানো',
  'বাড়িতে সার্ভিস',
  'গ্রুপ কন্ট্র্যাক্ট',
];

const ANIMALS_LIST = ['গরু', 'মহিষ', 'ছাগল', 'দুম্বা', 'উট'];

const WA_ADMIN = '8801410761298';

export const KashaiRegisterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const nameId = useId();
  const phoneId = useId();
  const areaId = useId();
  const typeId = useId();
  const rateId = useId();
  const expId = useId();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [type, setType] = useState<'professional' | 'day'>('day');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [rateRange, setRateRange] = useState('');
  const [experience, setExperience] = useState('');
  const [step, setStep] = useState<'form' | 'submitting' | 'done'>('form');
  const { showToast } = useToast();

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const isValid =
    name.trim().length >= 2 &&
    phone.trim().length >= 11 &&
    area.trim().length >= 2 &&
    selectedServices.length > 0 &&
    selectedAnimals.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStep('submitting');
    await new Promise((r) => setTimeout(r, 1200));
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি সহজ কুরবানি অ্যাপে কসাই হিসেবে রেজিস্ট্রেশন করতে চাই।\n\nনাম: ${name}\nফোন: ${phone}\nএলাকা: ${area}\nধরন: ${type === 'professional' ? 'প্রফেশনাল কসাই' : 'একদিনের কসাই'}\nসার্ভিস: ${selectedServices.join(', ')}\nপশু: ${selectedAnimals.join(', ')}\nরেট: ${rateRange}`,
    );
    window.open(`https://wa.me/${WA_ADMIN}?text=${message}`, '_blank', 'noopener,noreferrer');
    setStep('done');
    showToast('রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো হয়েছে!', 'success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setName('');
      setPhone('');
      setArea('');
      setType('day');
      setSelectedServices([]);
      setSelectedAnimals([]);
      setRateRange('');
      setExperience('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-emerald-950/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 print:hidden"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-8 -mt-8" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl shadow-lg">
                    <Scissors size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight">কসাই হিসেবে যোগ দিন</h2>
                    <p className="text-emerald-300 text-xs font-medium mt-0.5">বিনামূল্যে রেজিস্ট্রেশন করুন</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-emerald-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-emerald-800"
                  aria-label="বন্ধ করুন"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {step === 'form' && (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor={nameId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                      পূর্ণ নাম *
                    </label>
                    <div className="flex items-center gap-3 border border-emerald-200 rounded-xl px-4 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                      <input
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        required
                        className="w-full bg-transparent focus:outline-none text-emerald-950 font-semibold placeholder:text-emerald-300 placeholder:font-normal text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor={phoneId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                      মোবাইল নম্বর *
                    </label>
                    <div className="flex items-center gap-3 border border-emerald-200 rounded-xl px-4 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                      <Phone size={16} className="text-emerald-400 shrink-0" />
                      <input
                        id={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        required
                        maxLength={11}
                        className="w-full bg-transparent focus:outline-none text-emerald-950 font-semibold placeholder:text-emerald-300 placeholder:font-normal text-sm"
                      />
                    </div>
                  </div>

                  {/* Area */}
                  <div>
                    <label htmlFor={areaId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                      এলাকা / জেলা *
                    </label>
                    <div className="flex items-center gap-3 border border-emerald-200 rounded-xl px-4 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                      <MapPin size={16} className="text-emerald-400 shrink-0" />
                      <input
                        id={areaId}
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="যেমন: মিরপুর, ঢাকা"
                        required
                        className="w-full bg-transparent focus:outline-none text-emerald-950 font-semibold placeholder:text-emerald-300 placeholder:font-normal text-sm"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor={typeId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                      কসাইয়ের ধরন *
                    </label>
                    <div id={typeId} className="grid grid-cols-2 gap-3">
                      {(['day', 'professional'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${
                            type === t
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                              : 'border-emerald-100 text-emerald-600 hover:border-emerald-300'
                          }`}
                        >
                          {t === 'day' ? '🌙 একদিনের কসাই' : '⭐ প্রফেশনাল কসাই'}
                          <p className="text-xs font-medium mt-1 opacity-70">
                            {t === 'day' ? 'শুধু ঈদের দিন' : 'সারা বছর সার্ভিস'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <p className="text-sm font-bold text-emerald-800 mb-2">সার্ভিস *</p>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES_LIST.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleItem(s, selectedServices, setSelectedServices)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            selectedServices.includes(s)
                              ? 'bg-emerald-900 text-white border-emerald-900'
                              : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animals */}
                  <div>
                    <p className="text-sm font-bold text-emerald-800 mb-2">পশু *</p>
                    <div className="flex flex-wrap gap-2">
                      {ANIMALS_LIST.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleItem(a, selectedAnimals, setSelectedAnimals)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            selectedAnimals.includes(a)
                              ? 'bg-amber-400 text-emerald-950 border-amber-400'
                              : 'bg-white text-emerald-700 border-emerald-200 hover:border-amber-300'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rate */}
                  <div>
                    <label htmlFor={rateId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                      প্রত্যাশিত রেট (ঐচ্ছিক)
                    </label>
                    <input
                      id={rateId}
                      type="text"
                      value={rateRange}
                      onChange={(e) => setRateRange(e.target.value)}
                      placeholder="যেমন: ৳১,৫০০–৳৩,০০০/গরু"
                      className="w-full border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-emerald-950 font-semibold placeholder:text-emerald-300 placeholder:font-normal text-sm"
                    />
                  </div>

                  {/* Experience */}
                  {type === 'professional' && (
                    <div>
                      <label htmlFor={expId} className="text-sm font-bold text-emerald-800 mb-1.5 block">
                        অভিজ্ঞতা (ঐচ্ছিক)
                      </label>
                      <input
                        id={expId}
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="যেমন: ১০ বছরের অভিজ্ঞতা"
                        className="w-full border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-emerald-950 font-semibold placeholder:text-emerald-300 placeholder:font-normal text-sm"
                      />
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={!isValid}
                    whileHover={isValid ? { scale: 1.02 } : {}}
                    whileTap={isValid ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-2xl font-black text-base transition-all mt-2 ${
                      isValid
                        ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-950'
                        : 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                    }`}
                  >
                    WhatsApp-এ রেজিস্ট্রেশন সম্পন্ন করুন
                  </motion.button>
                  <p className="text-center text-xs text-emerald-400 font-medium">
                    আপনার তথ্য আমাদের WhatsApp-এ পাঠানো হবে এবং ২৪ ঘণ্টার মধ্যে যোগাযোগ করা হবে।
                  </p>
                </form>
              )}

              {step === 'submitting' && (
                <div className="p-12 flex flex-col items-center justify-center gap-5">
                  <Loader2 size={48} className="text-emerald-600 animate-spin" />
                  <p className="font-bold text-emerald-800 text-lg">রেজিস্ট্রেশন প্রক্রিয়া করা হচ্ছে...</p>
                </div>
              )}

              {step === 'done' && (
                <div className="p-12 flex flex-col items-center justify-center gap-5 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
                  </motion.div>
                  <h3 className="font-black text-2xl text-emerald-950">আলহামদুলিল্লাহ!</h3>
                  <p className="text-emerald-700 font-medium leading-relaxed">
                    আপনার রেজিস্ট্রেশন রিকোয়েস্ট WhatsApp-এ পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
                  >
                    ঠিক আছে
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
