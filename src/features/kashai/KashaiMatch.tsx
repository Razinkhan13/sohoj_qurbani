import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Scissors, ShieldCheck, MapPin, Star, CheckCircle2,
  MessageCircle, UserPlus, AlertCircle, Phone,
} from 'lucide-react';
import type { Kashai } from '../../types';
import { MOCK_KASHAI } from '../../lib/mockKashaiData';
import { KashaiRegisterModal } from './KashaiRegisterModal';
import { QuranVerse } from '../../components/QuranVerse';
import { useToast } from '../../context/ToastContext';

const WA_ADMIN = '8801410761298';

type FilterType = 'all' | 'professional' | 'day';

const FILTER_LABELS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'সব' },
  { value: 'professional', label: 'প্রফেশনাল' },
  { value: 'day', label: 'একদিনের' },
];

const ANIMAL_FILTERS = ['সব', 'গরু', 'মহিষ', 'ছাগল', 'দুম্বা', 'উট'];

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={12}
        className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
    <span className="text-xs font-bold text-emerald-700 ml-1">{rating.toFixed(1)}</span>
  </span>
);

export const KashaiMatch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [animalFilter, setAnimalFilter] = useState('সব');
  const [registerOpen, setRegisterOpen] = useState(false);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return MOCK_KASHAI.filter((k) => {
      const matchesType = typeFilter === 'all' || k.type === typeFilter;
      const matchesAnimal = animalFilter === 'সব' || k.animals.includes(animalFilter);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        k.name.includes(q) ||
        k.area.toLowerCase().includes(q) ||
        k.district.toLowerCase().includes(q);
      return matchesType && matchesAnimal && matchesSearch;
    });
  }, [search, typeFilter, animalFilter]);

  const handleContact = (kashai: Kashai) => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি সহজ কুরবানি অ্যাপে "${kashai.name}" (${kashai.area})-এর প্রোফাইল দেখেছি। কুরবানির কসাই সার্ভিস সম্পর্কে বিস্তারিত জানতে চাই।`,
    );
    window.open(`https://wa.me/${WA_ADMIN}?text=${message}`, '_blank', 'noopener,noreferrer');
    showToast(`${kashai.name}-এর সাথে WhatsApp খোলা হচ্ছে...`, 'info');
  };

  return (
    <div className="space-y-8 print:hidden">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
              <Scissors size={13} />
              নতুন ফিচার
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">কসাই খুঁজুন</h2>
            <p className="text-emerald-300/90 font-medium leading-relaxed max-w-md">
              অভিজ্ঞ ও বিশ্বস্ত কসাই খুঁজুন — প্রফেশনাল বা একদিনের কসাই, আপনার বাজেটে সেরা সার্ভিস।
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setRegisterOpen(true)}
            className="shrink-0 flex items-center gap-2.5 bg-amber-400 text-emerald-950 font-black px-6 py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition-all"
          >
            <UserPlus size={20} />
            কসাই হিসেবে যোগ দিন
          </motion.button>
        </div>
      </div>

      {/* Quran verse */}
      <QuranVerse
        arabic="وَلِكُلِّ أُمَّةٍ جَعَلْنَا مَنسَكًا لِّيَذْكُرُوا اسْمَ اللَّهِ عَلَىٰ مَا رَزَقَهُم مِّن بَهِيمَةِ الْأَنْعَامِ"
        translation="আমি প্রত্যেক উম্মতের জন্য কুরবানির নিয়ম নির্ধারণ করেছি, যাতে তারা চতুষ্পদ পশুর উপর আল্লাহর নাম স্মরণ করে।"
        reference="সূরা আল-হজ্জ ২২:৩৪"
        variant="light"
      />

      {/* Two-type explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-[2rem] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-700 text-amber-400 p-2.5 rounded-xl">
              <Scissors size={20} strokeWidth={2} />
            </div>
            <h3 className="font-black text-emerald-950 text-lg">প্রফেশনাল কসাই</h3>
          </div>
          <p className="text-emerald-700 text-sm font-medium leading-relaxed mb-3">
            বছরের পর বছর অভিজ্ঞতাসম্পন্ন, সার্টিফাইড ও ভেরিফাইড কসাই। একাধিক পশু দক্ষতার সাথে পরিচালনা করতে পারেন।
          </p>
          <div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full inline-block">
            রেট: ৳৩,০০০–৳৮,০০০/গরু
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200/60 rounded-[2rem] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-500 text-white p-2.5 rounded-xl">
              <Scissors size={20} strokeWidth={2} />
            </div>
            <h3 className="font-black text-emerald-950 text-lg">একদিনের কসাই</h3>
          </div>
          <p className="text-amber-900/80 text-sm font-medium leading-relaxed mb-3">
            ঈদুল আযহায় অতিরিক্ত আয়ের জন্য কাজ করেন — কম খরচে সেবা দিতে আগ্রহী। দারিদ্র্য কমিয়ে কুরবানিতে অংশ নেওয়ার সুযোগ।
          </p>
          <div className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full inline-block">
            রেট: ৳৫০০–৳২,০০০/গরু
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-emerald-100 flex items-center gap-3 focus-within:shadow-md focus-within:border-emerald-300 transition-all">
        <Search className="text-emerald-400 ml-2 shrink-0" size={22} />
        <input
          type="search"
          placeholder="নাম বা এলাকা দিয়ে কসাই খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="কসাই অনুসন্ধান"
          className="w-full bg-transparent border-none focus:outline-none text-emerald-950 font-bold placeholder:text-emerald-300/80 placeholder:font-medium"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                typeFilter === value
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="w-px bg-emerald-100 mx-1 hidden md:block" />
        {/* Animal filter */}
        <div className="flex gap-2 flex-wrap">
          {ANIMAL_FILTERS.map((a) => (
            <button
              key={a}
              onClick={() => setAnimalFilter(a)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                animalFilter === a
                  ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-sm'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:border-amber-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Kashai list */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-emerald-200"
            >
              <Scissors size={56} className="mx-auto mb-5 text-emerald-200" strokeWidth={1.5} />
              <p className="text-xl font-bold text-emerald-800 mb-2">কোনো কসাই পাওয়া যায়নি</p>
              <p className="text-emerald-500 font-medium text-sm">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </motion.div>
          ) : (
            filtered.map((kashai, idx) => (
              <motion.article
                key={kashai.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
                aria-label={`${kashai.name}-এর প্রোফাইল`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="w-full">
                    {/* Name + badges row */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      <h3 className="text-xl md:text-2xl font-black text-emerald-950">{kashai.name}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          kashai.type === 'professional'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {kashai.type === 'professional' ? '⭐ প্রফেশনাল' : '🌙 একদিনের'}
                      </span>
                      {kashai.isVerified && (
                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold border border-blue-200">
                          <CheckCircle2 size={12} /> ভেরিফাইড
                        </span>
                      )}
                      {kashai.isHalalCertified && (
                        <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold border border-amber-200">
                          <ShieldCheck size={12} /> হালাল সার্টিফাইড
                        </span>
                      )}
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-emerald-800 font-medium mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-emerald-400 shrink-0" />
                        <span className="text-emerald-950 font-bold">{kashai.area}, {kashai.district}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-black text-base">৳</span>
                        <span className="bg-amber-100 text-emerald-950 font-black px-2 py-0.5 rounded-lg text-xs">{kashai.rateRange}</span>
                      </div>
                      {kashai.experience && (
                        <div className="flex items-center gap-2">
                          <Scissors size={15} className="text-emerald-400 shrink-0" />
                          {kashai.experience}
                        </div>
                      )}
                      {kashai.rating !== undefined && (
                        <div className="flex items-center gap-2">
                          <Stars rating={kashai.rating} />
                          {kashai.reviewCount !== undefined && (
                            <span className="text-xs text-emerald-500">({kashai.reviewCount} রিভিউ)</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Services + Animals pills */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {kashai.services.map((s) => (
                        <span key={s} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                      {kashai.animals.map((a) => (
                        <span key={a} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Slots */}
                    {kashai.slotsAvailable !== undefined && (
                      <div className={`flex items-center gap-1.5 text-xs font-bold mt-3 ${
                        kashai.slotsAvailable <= 2 ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {kashai.slotsAvailable <= 2 ? (
                          <AlertCircle size={13} />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        {kashai.slotsAvailable <= 0
                          ? 'স্লট পূর্ণ'
                          : `${kashai.slotsAvailable}টি স্লট বাকি আছে`}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0 w-full md:w-auto md:min-w-[180px]">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleContact(kashai)}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-5 py-4 rounded-2xl shadow-md transition-all text-sm"
                    >
                      <MessageCircle size={18} />
                      WhatsApp-এ যোগাযোগ
                    </motion.button>
                    <p className="text-center text-xs text-emerald-400 font-medium mt-2">
                      ট্রাস্ট স্কোর: {kashai.trustScore}%
                    </p>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Register CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-[2rem] p-7 flex flex-col md:flex-row items-center justify-between gap-5"
      >
        <div>
          <h4 className="font-black text-xl mb-1.5">কসাই হতে চান? 🌙</h4>
          <p className="text-emerald-300 font-medium text-sm leading-relaxed">
            ঈদুল আযহায় অতিরিক্ত উপার্জনের সুযোগ নিন — বিনামূল্যে প্রোফাইল তৈরি করুন।
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setRegisterOpen(true)}
          className="shrink-0 flex items-center gap-2.5 bg-amber-400 text-emerald-950 font-black px-6 py-3.5 rounded-2xl shadow-lg hover:bg-amber-300 transition-all"
        >
          <UserPlus size={20} />
          রেজিস্ট্রেশন করুন
        </motion.button>
      </motion.div>

      {/* WhatsApp support */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-emerald-950 text-lg mb-1">সরাসরি সাহায্য দরকার?</h4>
          <p className="text-emerald-700 font-medium text-sm">
            আমাদের WhatsApp সাপোর্টে যোগাযোগ করুন — দ্রুত সেরা কসাই খুঁজে পেতে সাহায্য করবো।
          </p>
        </div>
        <a
          href={`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent('আসসালামু আলাইকুম। আমি সহজ কুরবানি অ্যাপ থেকে কসাই খুঁজছি।')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all hover:scale-[1.03]"
        >
          <MessageCircle size={20} />
          WhatsApp সাপোর্ট
        </a>
      </div>

      <KashaiRegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};
