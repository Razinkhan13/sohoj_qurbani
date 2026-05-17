import React, { useState, useEffect, useMemo, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Calculator, Users, CalendarClock, FileDown, ShieldCheck, 
  MapPin, Wallet, BookOpenCheck, CheckCircle2, Info, 
  Search, Loader2, ArrowRight, Home, Menu, X, ArrowUpRight,
  MessageSquare, CreditCard, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

// Mock API and Database
const DB = {
  partners: [
    { id: 'p1', name: 'মাহমুদ হাসান', area: 'ধানমন্ডি, ঢাকা', presentAddress: 'ধানমন্ডি, ঢাকা', profession: 'সফটওয়্যার ইঞ্জিনিয়ার', incomeSource: 'বেতনভুক্ত (হালাল যাচাইকৃত)', budget: 35000, budgetStr: '৩০,০০০ - ৩৫,০০০ ৳', animal: 'গরু', isHalalCertified: true, trustScore: 98 },
    { id: 'p2', name: 'শরীফ আহমেদ', area: 'জৈন্তাপুর, সিলেট', presentAddress: 'উত্তরা, ঢাকা', profession: 'সরকারি কর্মকর্তা', incomeSource: 'বেতনভুক্ত (হালাল যাচাইকৃত)', budget: 28000, budgetStr: '২৫,০০০ - ২৮,০০০ ৳', animal: 'গরু', isHalalCertified: true, trustScore: 95 },
    { id: 'p3', name: 'তারেক রহমান', area: 'সদর, নোয়াখালী', presentAddress: 'মিরপুর, ঢাকা', profession: 'মাদ্রাসা শিক্ষক', incomeSource: 'বেতনভুক্ত (হালাল যাচাইকৃত)', budget: 20000, budgetStr: '১৫,০০০ - ২০,০০০ ৳', animal: 'গরু', isHalalCertified: true, trustScore: 99 },
    { id: 'p4', name: 'ডাঃ জুবায়ের', area: 'সাহেব বাজার, রাজশাহী', presentAddress: 'ধানমন্ডি, ঢাকা', profession: 'চিকিৎসক', incomeSource: 'প্রাইভেট প্র্যাকটিস (হালাল যাচাইকৃত)', budget: 45000, budgetStr: '৪০,০০০ - ৪৫,০০০ ৳', animal: 'গরু', isHalalCertified: true, trustScore: 96 },
    { id: 'p5', name: 'কামরুল ইসলাম', area: 'বরিশাল সদর', presentAddress: 'উত্তরা, ঢাকা', profession: 'ব্যবসায়ী', incomeSource: 'হালাল ব্যবসা', budget: 30000, budgetStr: '২৫,০০০ - ৩০,০০০ ৳', animal: 'গরু', isHalalCertified: true, trustScore: 92 },
  ]
};

// Simulated API Calls with latency
const api = {
  fetchPartners: async (filter = '') => {
    if (supabase) {
      try {
        let query = supabase.from('partners').select('*');
        if (filter) {
          query = query.or(`area.ilike.%${filter}%,presentAddress.ilike.%${filter}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.error('Supabase fetch error, falling back to mock data', err);
      }
    }
    // Fallback Mock implementation
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = DB.partners.filter(p => p.area.includes(filter) || p.presentAddress?.includes(filter) || filter === '');
        resolve(filtered);
      }, 800);
    });
  },
  sendRequest: async (id) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1200));
  }
};

const Card = ({ children, className = "", onClick }) => (
  <motion.div 
    whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
    onClick={onClick} 
    className={`bg-white rounded-3xl shadow-sm border border-emerald-100/60 overflow-hidden backdrop-blur-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-emerald-300' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const InputField = ({ label, value, onChange, type = "number", placeholder, icon: Icon = null }) => (
  <div className="mb-5 group">
    <label className="block text-sm font-bold text-emerald-900 mb-2 transition-colors group-focus-within:text-amber-600">{label}</label>
    <div className="relative">
      {Icon && <div className="absolute left-4 top-3.5 text-emerald-400 group-focus-within:text-amber-500 transition-colors"><Icon size={20} /></div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min="0"
        className={`w-full bg-emerald-50/40 border-2 border-emerald-100 rounded-2xl py-3.5 px-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all text-emerald-950 font-semibold text-lg ${Icon ? 'pl-12' : ''}`}
      />
    </div>
  </div>
);

const HalalDeclarationModal = ({ onAccept }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 print:hidden"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-100/20"
        >
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto bg-amber-400 text-emerald-950 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-emerald-800/50 relative z-10"
            >
              <ShieldCheck size={40} strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-3xl font-black mb-2 relative z-10 tracking-tight">হালাল উপার্জন হলফনামা</h2>
            <p className="text-emerald-200/90 text-sm font-medium relative z-10">শরীয়াহ বোর্ডের নির্দেশিকা অনুযায়ী বাধ্যতামূলক</p>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-emerald-900 font-semibold text-lg leading-relaxed text-center italic opacity-90">
              "আমি আল্লাহ সুবহানাহু ওয়া তা'আলাকে সাক্ষী রেখে ঘোষণা করছি যে, আমার কুরবানির জন্য বরাদ্দকৃত সম্পূর্ণ অর্থ শতভাগ হালাল এবং বৈধ উপার্জন থেকে সংগৃহীত। এতে কোনো সুদ (রিবা), ঘুষ, বা শরীয়াহ-পরিপন্থী কোনো উপার্জনের মিশ্রণ নেই।"
            </p>
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 flex gap-4 mt-6 items-start">
              <Info className="text-amber-600 shrink-0 mt-0.5" size={24} />
              <p className="text-sm font-medium text-amber-900 leading-relaxed">কুরবানির পশুতে একজন অংশীদারের অর্থও যদি হারাম হয়, তবে সকল শরিকের কুরবানি বাতিল বলে গণ্য হবে।</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="w-full mt-8 bg-emerald-900 justify-center hover:bg-emerald-950 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-900/20 hover:shadow-2xl transition-all flex items-center gap-3 group"
            >
              আমি একমত এবং স্বীকার করছি 
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target Date: May 27, 2026 (Eid-ul-Azha predicted)
    const targetDate = new Date('2026-05-27T00:00:00+06:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-emerald-800/50"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>
      
      <div className="text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-300 px-5 py-2 rounded-full text-sm font-bold mb-4 backdrop-blur-md uppercase tracking-wider"
        >
          আসন্ন পবিত্র ঈদ-উল-আযহা ২০২৬
        </motion.div>
        <p className="text-emerald-100/90 text-lg md:text-xl xl:text-2xl mb-10 font-semibold">২৭ মে, ২০২৬ (১০ জিলহজ্জ ১৪৪৭ হিজরি)</p>
        
        <div className="flex justify-center gap-4 md:gap-8 max-w-2xl mx-auto">
          {[
            { label: 'দিন', value: timeLeft.days },
            { label: 'ঘণ্টা', value: timeLeft.hours },
            { label: 'মিনিট', value: timeLeft.minutes },
            { label: 'সেকেন্ড', value: timeLeft.seconds }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex flex-col items-center w-20 md:w-28"
            >
              <div className="bg-white/5 border border-white/10 rounded-3xl w-full aspect-square flex flex-col items-center justify-center backdrop-blur-md mb-4 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-3xl md:text-5xl font-black text-white/90 tracking-tight tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs md:text-sm font-bold text-emerald-300/80 uppercase tracking-[0.2em]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ShorikCalculator = ({ isPro, onRequiresPro }) => {
  const [costs, setCosts] = useState({ animalPrice: '', hasil: '', transport: '', butcher: '', foodAndOther: '' });
  const [shares, setShares] = useState(7);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCostChange = (field, value) => {
    setCosts(prev => ({ ...prev, [field]: value }));
  };

  const calculations = useMemo(() => {
    let total = 0;
    Object.values(costs).forEach(curr => { total += Number(curr) || 0; });
    const perShare = shares > 0 ? total / shares : 0;
    return { total, perShare };
  }, [costs, shares]);

  const handlePrint = async () => {
    if (!isPro) {
      onRequiresPro();
      return;
    }
    setIsCalculating(true);
    
    try {
      const element = document.getElementById('invoice-print-area');
      if (!element) {
        setIsCalculating(false);
        return;
      }
      
      // We temporarily remove `hidden` from print area if needed, but since it uses `print:block`, 
      // we might need to make it visible for html2canvas
      element.classList.remove('hidden');
      element.classList.add('block');
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      element.classList.add('hidden');
      element.classList.remove('block');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Qurbani_Invoice_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    }
    
    setIsCalculating(false);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount)) + ' ৳';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="space-y-8 print:w-full print:m-0 print:p-0"
    >
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 md:p-12 print:hidden relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl -mt-64 -mr-64 opacity-60 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-emerald-100 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-3xl shadow-sm">
              <Calculator size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tight">সহজ কুরবানি ক্যালকুলেটর</h2>
              <p className="text-emerald-600/90 font-medium mt-1">কুরবানির সকল খরচের ডিজিটাল ও শরীয়াহ সম্মত হিসাব</p>
            </div>
          </div>
          <div className="bg-amber-50 text-amber-800 px-5 py-2.5 rounded-2xl text-sm font-bold border border-amber-200/60 flex items-center gap-2.5 shadow-sm">
            <ShieldCheck size={18} className="text-amber-600" /> শরীয়াহ বোর্ড অনুমোদিত
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 relative z-10 mb-8">
          <InputField label="পশুর দাম (৳)" value={costs.animalPrice} onChange={(e) => handleCostChange('animalPrice', e.target.value)} placeholder="উদাহরন: ১২০০০০" />
          <InputField label="হাসিল / মার্কেট ফি (৳)" value={costs.hasil} onChange={(e) => handleCostChange('hasil', e.target.value)} placeholder="০" />
          <InputField label="যাতায়াত / পরিবহন (৳)" value={costs.transport} onChange={(e) => handleCostChange('transport', e.target.value)} placeholder="০" />
          <InputField label="কসাই খরচ (৳)" value={costs.butcher} onChange={(e) => handleCostChange('butcher', e.target.value)} placeholder="০" />
          <InputField label="খাবার ও অন্যান্য আনুষঙ্গিক (৳)" value={costs.foodAndOther} onChange={(e) => handleCostChange('foodAndOther', e.target.value)} placeholder="০" />
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-emerald-900 mb-2">মোট শরিক (১-৭ জন)</label>
            <div className="relative">
              <select 
                value={shares} 
                onChange={(e) => setShares(Number(e.target.value))}
                className="appearance-none w-full bg-emerald-50/40 border-2 border-emerald-100 rounded-2xl py-3.5 px-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-bold text-emerald-950 text-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num} জন শরিক অংশ নিচ্ছেন</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 font-bold">▼</div>
            </div>
          </div>
        </div>

        <motion.div 
          layout
          className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 opacity-[0.03] scale-150 transform translate-x-10 -translate-y-10"><Calculator size={300} /></div>
           <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-emerald-700/50 gap-4">
              <span className="text-emerald-100/80 text-xl font-medium tracking-wide">সর্বমোট অনুমোদিত খরচ</span>
              <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">{formatMoney(calculations.total)}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-amber-400 font-bold text-xl md:text-2xl tracking-wide">প্রতি শরিকের প্রদেয় অংশ</span>
              <span className="text-5xl md:text-6xl font-black text-amber-400 drop-shadow-2xl tabular-nums">{formatMoney(calculations.perShare)}</span>
            </div>
          </div>
        </motion.div>

        <motion.button 
          whileHover={calculations.total > 0 ? { scale: 1.01 } : {}}
          whileTap={calculations.total > 0 ? { scale: 0.98 } : {}}
          onClick={handlePrint}
          disabled={isCalculating || calculations.total === 0}
          className={`mt-10 w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-xl ${
            calculations.total === 0 
            ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed border-2 border-emerald-100/50' 
            : 'bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-xl shadow-amber-400/20'
          }`}
        >
          {isCalculating ? <Loader2 className="animate-spin" size={28} /> : <FileDown size={28} />}
          {isCalculating ? 'পিডিএফ রিপোর্ট প্রস্তুত হচ্ছে...' : 'চূড়ান্ত হিসাবের পিডিএফ রিপোর্ট ডাউনলোড করুন'}
        </motion.button>
      </div>

      {/* --- PRINT INVOICE SECTION (Optimized for A4) --- */}
      <div id="invoice-print-area" className="hidden print:block bg-white text-black p-0 w-full">
        <div className="border-[3px] border-emerald-950 p-12">
          <div className="text-center mb-16 border-b-4 border-emerald-950 pb-10 flex flex-col items-center">
            <ShieldCheck size={64} className="mb-6 text-emerald-950" />
            <h1 className="text-6xl font-black tracking-tighter mb-4 text-emerald-950 uppercase">সহজ কুরবানি</h1>
            <p className="text-2xl font-bold tracking-widest text-gray-700">কুরবানি খরচের স্বচ্ছ রিপোর্ট | ১৪৪৭ হিজরি</p>
            <p className="text-sm font-semibold mt-4 text-gray-500">জেনারেট সংরক্ষণের তারিখ: {new Date().toLocaleDateString('bn-BD')} | সিস্টেম আইডি: SP-{Math.floor(Math.random()*10000)}</p>
          </div>
          
          <table className="w-full mb-16 text-left border-collapse text-2xl">
            <tbody>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold w-2/3">পশুর মূল্য:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.animalPrice)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">হাসিল / ফি:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.hasil)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">যাতায়াত:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.transport)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">কসাই ফি:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.butcher)}</td></tr>
              <tr className="border-b-4 border-emerald-950"><th className="py-6 text-gray-600 font-semibold">খাবার ও অন্যান্য:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.foodAndOther)}</td></tr>
              <tr className="bg-emerald-50"><th className="py-8 px-6 text-emerald-950 text-3xl font-black uppercase tracking-wider">সর্বমোট হিসাব:</th><td className="py-8 px-6 text-right font-black text-4xl text-emerald-950 tabular-nums">{formatMoney(calculations.total)}</td></tr>
            </tbody>
          </table>

          <div className="bg-emerald-950 text-white p-12 mb-20 border-4 border-emerald-950 rounded-[2rem]">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-emerald-200 text-xl mb-3 font-semibold uppercase tracking-widest">নির্ধারিত শরিক সংখ্যা</span>
                <span className="text-5xl font-black">{shares} জন</span>
              </div>
              <div className="text-right">
                <span className="block text-emerald-200 text-xl mb-3 font-semibold uppercase tracking-widest">প্রতি শরিকের প্রদেয়</span>
                <span className="text-7xl font-black text-amber-400 tabular-nums">{formatMoney(calculations.perShare)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-32 pt-12 border-t-2 border-gray-300">
            <div className="text-center w-72">
              <div className="border-b-2 border-dashed border-gray-800 mb-4 h-10 w-full mx-auto"></div>
              <span className="text-xl font-bold uppercase tracking-widest">ম্যানেজার / হিসাব রক্ষক</span>
            </div>
            <div className="text-center w-72">
              <div className="border-b-2 border-dashed border-gray-800 mb-4 h-10 w-full mx-auto"></div>
              <span className="text-xl font-bold uppercase tracking-widest">শরিকের স্বাক্ষর ও তারিখ</span>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-gray-200 text-center">
             <p className="text-lg font-bold text-gray-400 tracking-wider flex items-center justify-center gap-2">
               সহজ কুরবানি ডেভেলপমেন্ট পার্টনার 
               <a href="https://Rizum-khan-org.netlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-emerald-950 text-white border border-emerald-800 px-3 py-1 rounded shadow-sm hover:shadow-md hover:bg-emerald-900 transition-all">
                 <span className="font-black text-base tracking-widest flex items-center">
                   <span className="text-amber-400 font-extrabold text-lg mr-px">A</span>IS
                 </span>
               </a>
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PartnerMatch = ({ isPro, onRequiresPro }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestState, setRequestState] = useState({});

  const loadPartners = useCallback(async (query) => {
    setLoading(true);
    const data = await api.fetchPartners(query);
    setPartners(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPartners('');
  }, [loadPartners]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setTimeout(() => loadPartners(e.target.value), 500); // Simulated edge debounce
  };

  const handleRequest = async (id) => {
    if (!isPro) {
      onRequiresPro();
      return;
    }
    setRequestState(prev => ({ ...prev, [id]: 'loading' }));
    await api.sendRequest(id);
    setRequestState(prev => ({ ...prev, [id]: 'success' }));
  };

  const handleWhatsapp = () => {
    if (!isPro) {
      onRequiresPro();
      return;
    }
    alert("Pro Feature: Redirecting to WhatsApp Group...");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
      
      {/* Search Header */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-emerald-100 flex items-center gap-4 transition-all focus-within:shadow-md focus-within:border-emerald-300">
        <Search className="text-emerald-500 ml-2" size={28} />
        <input 
          type="text" 
          placeholder="বর্তমান এলাকা দিয়ে শরিক খুঁজুন (যেমন: মিরপুর, ধানমন্ডি)..." 
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-transparent border-none focus:outline-none text-emerald-950 font-bold text-lg placeholder:text-emerald-300/80 placeholder:font-medium"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-[2rem] p-6 md:p-8 flex items-start gap-6"
      >
        <div className="bg-emerald-100 p-3 rounded-2xl shrink-0 text-emerald-700 shadow-sm"><ShieldCheck size={32} /></div>
        <div>
          <h3 className="font-black text-emerald-950 text-xl mb-2">শরীয়াহ বোর্ড দ্বারা ভেরিফাইড প্রোফাইল</h3>
          <p className="text-base text-emerald-800 font-medium leading-relaxed">
            নিচের তালিকাভুক্ত সকল ব্যবহারকারী NID ভেরিফাইড এবং "হালাল উপার্জন হলফনামা" গ্রহণ করেছেন। তাদের ইনকাম সোর্স এবং ট্রাস্ট স্কোর ১০০% নিরাপদ।
          </p>
        </div>
      </motion.div>

      <div className="space-y-5">
        <AnimatePresence>
          {loading ? (
            [1, 2, 3].map(i => (
              <motion.div key={i} exit={{ opacity: 0 }} className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm animate-pulse">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6 w-full">
                    <div className="h-8 bg-emerald-100/50 rounded-xl w-1/3"></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-5 bg-emerald-50 rounded-lg w-3/4"></div>
                      <div className="h-5 bg-emerald-50 rounded-lg w-full"></div>
                    </div>
                  </div>
                  <div className="h-14 bg-emerald-100/30 rounded-2xl w-full md:w-56 shrink-0"></div>
                </div>
              </motion.div>
            ))
          ) : partners.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[2rem] border border-emerald-100 border-dashed"
            >
              <Users size={64} className="mx-auto mb-6 text-emerald-200" strokeWidth={1.5} />
              <p className="text-2xl font-bold text-emerald-800 mb-2">কোনো শরিক পাওয়া যায়নি</p>
              <p className="text-emerald-500 font-medium">আপনার এলাকার নাম ভিন্নভাবে লিখে চেষ্টা করুন।</p>
            </motion.div>
          ) : (
            partners.map((partner, index) => (
              <motion.div 
                key={partner.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  
                  <div className="w-full">
                    <div className="flex flex-wrap items-center gap-4 mb-5">
                      <h3 className="text-2xl font-black text-emerald-950">{partner.name}</h3>
                      {partner.isHalalCertified && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-amber-300/50 shadow-sm">
                          <ShieldCheck size={16} /> হালাল উপার্জনের হলফনামা প্রাপ্ত
                        </span>
                      )}
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-200">
                        ট্রাস্ট স্কোর: {partner.trustScore}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-base text-emerald-800 font-medium">
                      <div className="flex items-center gap-3"><MapPin size={20} className="text-emerald-400" /> বর্তমান এলাকা: <span className="text-emerald-950 font-bold">{partner.presentAddress}</span></div>
                      <div className="flex items-center gap-3"><BookOpenCheck size={20} className="text-emerald-400" /> পেশা: {partner.profession}</div>
                      <div className="flex items-center gap-3"><Wallet size={20} className="text-emerald-400" /> বাজেট: <span className="text-emerald-950 font-black ml-1 bg-amber-100 px-2 py-0.5 rounded">{partner.budgetStr}</span></div>
                      <div className="flex items-center gap-3"><MapPin size={20} className="text-emerald-400 opacity-60" /> NID ঠিকানা: <span className="text-emerald-700">{partner.area}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    <motion.button 
                      whileHover={!requestState[partner.id] ? { scale: 1.02 } : {}}
                      whileTap={!requestState[partner.id] ? { scale: 0.98 } : {}}
                      onClick={() => handleRequest(partner.id)}
                      disabled={requestState[partner.id]}
                      className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                        requestState[partner.id] === 'success'
                        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 cursor-not-allowed' 
                        : requestState[partner.id] === 'loading'
                        ? 'bg-emerald-800 text-white cursor-wait opacity-80'
                        : 'bg-emerald-950 text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-900'
                      }`}
                    >
                      {requestState[partner.id] === 'loading' && <Loader2 size={20} className="animate-spin" />}
                      {requestState[partner.id] === 'success' && <CheckCircle2 size={20} />}
                      {requestState[partner.id] === 'success' 
                        ? 'রিকোয়েস্ট পাঠানো হয়েছে' 
                        : requestState[partner.id] === 'loading' 
                        ? 'যাচাই হচ্ছে...' 
                        : 'কল রিকোয়েস্ট পাঠান'}
                    </motion.button>
                    {requestState[partner.id] === 'success' && (
                      <motion.button
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsapp}
                        className="w-full px-4 py-3 rounded-xl font-bold text-sm bg-green-500 hover:bg-green-600 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageSquare size={18} /> হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Animated Footer matching the design parameters
const AnimatedFooter = () => {
  return (
    <footer className="relative bg-emerald-950 py-12 md:py-16 overflow-hidden mt-auto print:hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c2280_1px,transparent_1px),linear-gradient(to_bottom,#022c2280_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-emerald-900 p-4 rounded-3xl mb-6 shadow-inner"
        >
           <ShieldCheck size={48} className="text-amber-400" strokeWidth={1.5} />
        </motion.div>
        
        <p className="text-emerald-300 font-medium text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          The ultimate verified Qurbani matchmaking and modern finance platform. Strictly compliant with Shariah guidelines.
        </p>

        <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-emerald-800/80 to-transparent mb-10"></div>

        {/* --- REQUIRED: Eye Catchy Animated Notice --- */}
        <motion.div
           animate={{
            boxShadow: ["0px 0px 0px rgba(251,191,36,0)", "0px 0px 20px rgba(251,191,36,0.3)", "0px 0px 0px rgba(251,191,36,0)"],
            borderColor: ["rgba(4,120,87,1)", "rgba(251,191,36,0.5)", "rgba(4,120,87,1)"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="border-2 border-emerald-800 px-8 py-5 rounded-[2rem] bg-emerald-900/50 backdrop-blur-sm"
        >
          <motion.h3 
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-lg md:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-[length:200%_auto] text-center flex flex-col md:flex-row items-center gap-2"
          >
            All right reserved by the company
            <span className="text-white mx-2 hidden md:inline">|</span>
            We will build a web.
          </motion.h3>
          <div className="mt-4 text-emerald-100 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            Development Partner 
            <a href="https://Rizum-khan-org.netlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-emerald-950 text-white px-3 py-1.5 rounded-lg border border-emerald-700 shadow-sm hover:shadow-md hover:bg-emerald-800 hover:scale-105 transition-all outline outline-1 outline-amber-400/30">
              <span className="font-black text-sm tracking-widest flex items-center">
                <span className="text-amber-400 font-extrabold text-lg mr-px">A</span>IS
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [method, setMethod] = useState('email'); // 'email' | 'whatsapp'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact) return;
    setLoading(true);
    
    if (contact.includes('@') || method === 'email') {
      // Email Magic Link / OTP via Supabase
      if (supabase && contact.includes('@')) {
        try {
           const { error } = await supabase.auth.signInWithOtp({ email: contact });
           if (error) throw error;
           setOtpSent(true);
           setLoading(false);
           // Simulate a timeout where they check their email, 
           // for the sake of demo without leaving the app we can also just log them in after a delay or let them close.
           // Actually typically we wait for them to click the magic link or enter OTP. 
           // If we just want a smooth UX for the demo:
           setTimeout(() => {
             onLogin(contact);
           }, 3000);
           return;
        } catch (err) {
           console.error("Supabase auth error", err);
           // Fallback to mock
        }
      }
    }

    // WhatsApp / Fallback mock
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimeout(() => {
        onLogin(contact);
      }, 2000);
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] outline outline-1 outline-emerald-100/20"
          >
            <div className="bg-emerald-950 p-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-emerald-900 to-transparent pointer-events-none"></div>
              <button onClick={onClose} className="absolute top-5 right-5 text-emerald-400 hover:text-white hover:bg-emerald-800/50 p-2 rounded-full transition-all"><X size={20} strokeWidth={3} /></button>
              
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-[1.5rem] shadow-2xl border border-emerald-700/50 ring-4 ring-emerald-900/50">
                <Lock size={36} className="text-amber-400" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">সুরক্ষিত লগইন</h2>
              <p className="text-emerald-300 font-medium">কন্টিনিউ করতে আপনার পরিচয় যাচাই করুন</p>
            </div>

            <div className="p-8">
              {!otpSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2 p-1.5 bg-emerald-50 rounded-2xl mb-8 border border-emerald-100">
                    <button 
                      type="button" 
                      onClick={() => setMethod('email')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${method === 'email' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-600 hover:text-emerald-900'}`}
                    >
                      Email (Free)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMethod('whatsapp')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${method === 'whatsapp' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-600 hover:text-emerald-900'}`}
                    >
                      WhatsApp API
                    </button>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-emerald-900 mb-2">
                      {method === 'email' ? 'আপনার ইমেইল অ্যাড্রেস' : 'আপনার হোয়াটস্যাপ নাম্বার'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                        {method === 'email' ? <MessageSquare size={20} /> : <span className="font-bold">+880</span>}
                      </div>
                      <input 
                        type={method === 'email' ? "email" : "tel"} 
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                        placeholder={method === 'email' ? "name@example.com" : "17XXXXXXXX"} 
                        required
                        className={`w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl py-4 pr-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 text-emerald-950 font-bold transition-all ${method === 'email' ? 'pl-12' : 'pl-16'}`}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-950/20 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
                  >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                    {loading ? 'লগইন প্রসেস হচ্ছে...' : `লগইন লিঙ্ক পাঠান`}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-3">সফলভাবে প্রেরিত!</h3>
                  <p className="text-emerald-700 font-medium leading-relaxed mb-6">
                    আমরা <strong className="text-emerald-950 px-1">{contact}</strong> নম্বরে/ইমেইলে একটি সুরক্ষিত ইনভয়েস এবং লগইন সেশন পাঠিয়েছি।
                  </p>
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-3 px-4 rounded-xl border border-emerald-100">
                    <Loader2 size={18} className="animate-spin" /> অটো রিডাইরেক্ট করা হচ্ছে...
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

const ProModal = ({ isOpen, onClose, onUpgrade, userContact }) => {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 print:hidden"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-emerald-100/20"
          >
            {success ? (
              <div className="p-10 text-center flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight">পেমেন্ট সফল হয়েছে!</h2>
                <p className="text-emerald-700 font-medium mb-8 leading-relaxed">
                  আপনার ইনভয়েস সফলভাবে <strong className="text-emerald-950">{userContact}</strong> এ পাঠিয়ে দেয়া হয়েছে।
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
                  <p className="text-emerald-200/90 text-sm font-medium">মাত্র ২৯ টাকায় আনলিমিটেড অ্যাক্সেস</p>
                </div>
                
                <div className="p-8">
                  <ul className="space-y-4 mb-8 text-emerald-900 font-semibold text-sm">
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> হিসাবের পিডিএফ রিপোর্ট ডাউনলোড</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> ভেরিফাইড শরিক রিকোয়েস্ট</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="text-amber-500 shrink-0" size={20} /> হোয়াটসঅ্যাপ গ্রুপ সাপোর্ট</li>
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

                  <button 
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-amber-400/20 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                  >
                    {processing ? <Loader2 size={24} className="animate-spin" /> : <CreditCard size={24} />}
                    {processing ? 'Processing Payment...' : '২৯ টাকায় আনলক করুন'}
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [hasAcceptedHalal, setHasAcceptedHalal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  
  // Auth state
  const [userContact, setUserContact] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

  const handleRequiresPro = () => {
    if (!userContact) {
      setAuthModalOpen(true);
    } else {
      setProModalOpen(true);
    }
  };

  const handleLogin = (contactInfo) => {
    setUserContact(contactInfo);
    setAuthModalOpen(false);
    setProModalOpen(true);
  };

  if (!hasAcceptedHalal) {
    return <HalalDeclarationModal onAccept={() => setHasAcceptedHalal(true)} />;
  }

  const tabs = [
    { id: 'home', label: 'মূল পাতা', icon: Home },
    { id: 'calculator', label: 'হিসাব-নিকাশ', icon: Calculator },
    { id: 'partners', label: 'শরিক খুঁজুন', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-emerald-950 flex flex-col selection:bg-amber-200 selection:text-emerald-900">
      {/* Top Navigation */}
      <nav className="bg-emerald-950 text-white shadow-2xl sticky top-0 z-50 print:hidden border-b-[3px] border-amber-400/20 backdrop-blur-xl bg-emerald-950/90">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setActiveTab('home')}
            >
              <div className="bg-gradient-to-br from-amber-300 to-amber-500 p-2 rounded-[1rem] text-emerald-950 shadow-lg shadow-amber-400/20">
                <ShieldCheck size={32} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black tracking-tighter">সহজ<span className="text-amber-400 text-sm align-top ml-1.5 uppercase tracking-widest">কুরবানি</span></span>
            </motion.div>
            
            {/* Desktop Bismillah Text */}
            <div className="hidden md:flex items-center text-emerald-400/80 font-bold text-xl tracking-wider select-none relative group">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-emerald-100 p-2 bg-emerald-900 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Tab Navigation */}
        <div className={`print:hidden flex justify-center mb-12 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-100/80 p-2 flex flex-col md:flex-row w-full max-w-2xl gap-2 backdrop-blur-sm relative z-20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-base font-bold transition-all relative overflow-hidden ${
                  activeTab === tab.id 
                  ? 'text-emerald-950 shadow-md bg-amber-50' 
                  : 'text-gray-400 hover:text-emerald-800 hover:bg-emerald-50/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute inset-0 bg-amber-100/50 border-2 border-amber-200/50 rounded-[1.5rem]" 
                  />
                )}
                <tab.icon size={20} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Rendering */}
        <div className="transition-all duration-300 min-h-[55vh]">
          {activeTab === 'home' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 print:hidden"
            >
              <div className="text-center mb-16 mt-8 md:mt-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-6 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest border border-emerald-200">
                  বাংলাদেশের প্রথম শরীয়াহসম্মত সহজ কুরবানি প্ল্যাটফর্ম
                </motion.div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-emerald-950 mb-6 leading-[1.1] tracking-tight">
                  নিরাপদ ও হালাল <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">কুরবানি ব্যবস্থাপনা</span>
                </h1>
                <p className="text-emerald-700/90 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                  শহুরে জীবনে হালাল উপার্জনের বিশ্বস্ত শরিক খুঁজে পাওয়া এবং কুরবানির সকল হিসাব ডিজিটালভাবে সংরক্ষণ করুন নিরাপদে।
                </p>
              </div>
              
              <CountdownTimer />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-12">
                <Card className="p-10 text-center group" onClick={() => setActiveTab('calculator')}>
                  <div className="bg-amber-50 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-all duration-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-amber-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                    <Calculator size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-3xl mb-4 text-emerald-950">স্বচ্ছ হিসাব-নিকাশ</h3>
                  <p className="text-emerald-700/80 text-lg leading-relaxed font-medium">কুরবানির সকল খরচের ডিজিটাল হিসাব রাখুন এবং সবার সাথে শেয়ার করার জন্য প্রফেশনাল পিডিএফ রিপোর্ট জেনারেট করুন।</p>
                </Card>
                <Card className="p-10 text-center group" onClick={() => setActiveTab('partners')}>
                  <div className="bg-emerald-50 group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                    <Users size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-3xl mb-4 text-emerald-950">বিশ্বস্ত শরিক খুঁজুন</h3>
                  <p className="text-emerald-700/80 text-lg leading-relaxed font-medium">আপনার এলাকার কাছাকাছি NID ভেরিফাইড এবং হালাল উপার্জনের শরিকদের সাথে যুক্ত হোন সম্পূর্ণ নিরাপদে।</p>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'calculator' && <ShorikCalculator isPro={isPro} onRequiresPro={handleRequiresPro} />}
          
          {activeTab === 'partners' && <PartnerMatch isPro={isPro} onRequiresPro={handleRequiresPro} />}
        </div>
      </main>

      <AnimatedFooter />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />
      <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} onUpgrade={() => { setIsPro(true); setProModalOpen(false); }} userContact={userContact} />
    </div>
  );
}
