import React, { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'motion/react';
import { Calculator, ShieldCheck, FileDown, Loader2 } from 'lucide-react';
import { InputField } from '../../components/InputField';
import { formatMoney } from '../../lib/format';

interface Props {
  isPro: boolean;
  onRequiresPro: () => void;
}

type CostKey = 'animalPrice' | 'hasil' | 'transport' | 'butcher' | 'foodAndOther';
type Costs = Record<CostKey, string>;

const EMPTY_COSTS: Costs = { animalPrice: '', hasil: '', transport: '', butcher: '', foodAndOther: '' };

export const ShorikCalculator: React.FC<Props> = ({ isPro, onRequiresPro }) => {
  const [costs, setCosts] = useState<Costs>(EMPTY_COSTS);
  const [shares, setShares] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCostChange = (field: CostKey, value: string) =>
    setCosts((prev) => ({ ...prev, [field]: value }));

  const { total, perShare } = useMemo(() => {
    const total = Object.values(costs).reduce((sum, v) => sum + (Number(v) || 0), 0);
    return { total, perShare: shares > 0 ? total / shares : 0 };
  }, [costs, shares]);

  const handlePrint = async () => {
    if (!isPro) {
      onRequiresPro();
      return;
    }
    const element = document.getElementById('invoice-print-area');
    if (!element) return;
    setIsGenerating(true);
    element.classList.remove('hidden');
    element.classList.add('block');
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Qurbani_Invoice_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      element.classList.add('hidden');
      element.classList.remove('block');
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
              <p className="text-emerald-600/90 font-medium mt-1">কুরবানির সকল খরচের ডিজিটাল ও শরীয়াহ সম্মত হিসাব</p>
            </div>
          </div>
          <div className="bg-amber-50 text-amber-800 px-5 py-2.5 rounded-2xl text-sm font-bold border border-amber-200/60 flex items-center gap-2.5 shadow-sm">
            <ShieldCheck size={18} className="text-amber-600" /> শরীয়াহ বোর্ড অনুমোদিত
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
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
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
              <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">{formatMoney(total)}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-amber-400 font-bold text-xl md:text-2xl tracking-wide">প্রতি শরিকের প্রদেয় অংশ</span>
              <span className="text-5xl md:text-6xl font-black text-amber-400 drop-shadow-2xl tabular-nums">{formatMoney(perShare)}</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={total > 0 ? { scale: 1.01 } : {}}
          whileTap={total > 0 ? { scale: 0.98 } : {}}
          onClick={handlePrint}
          disabled={isGenerating || total === 0}
          className={`mt-10 w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-xl ${
            total === 0
              ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed border-2 border-emerald-100/50'
              : 'bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-xl shadow-amber-400/20'
          }`}
        >
          {isGenerating ? <Loader2 className="animate-spin" size={28} /> : <FileDown size={28} />}
          {isGenerating ? 'পিডিএফ রিপোর্ট প্রস্তুত হচ্ছে...' : 'চূড়ান্ত হিসাবের পিডিএফ রিপোর্ট ডাউনলোড করুন'}
        </motion.button>
      </div>

      <div id="invoice-print-area" className="hidden print:block bg-white text-black p-0 w-full">
        <div className="border-[3px] border-emerald-950 p-12">
          <div className="text-center mb-16 border-b-4 border-emerald-950 pb-10 flex flex-col items-center">
            <ShieldCheck size={64} className="mb-6 text-emerald-950" />
            <h1 className="text-6xl font-black tracking-tighter mb-4 text-emerald-950 uppercase">সহজ কুরবানি</h1>
            <p className="text-2xl font-bold tracking-widest text-gray-700">কুরবানি খরচের স্বচ্ছ রিপোর্ট | ১৪৪৭ হিজরি</p>
            <p className="text-sm font-semibold mt-4 text-gray-500">জেনারেট সংরক্ষণের তারিখ: {new Date().toLocaleDateString('bn-BD')} | সিস্টেম আইডি: SP-{Math.floor(Math.random() * 10000)}</p>
          </div>

          <table className="w-full mb-16 text-left border-collapse text-2xl">
            <tbody>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold w-2/3">পশুর মূল্য:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.animalPrice)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">হাসিল / ফি:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.hasil)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">যাতায়াত:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.transport)}</td></tr>
              <tr className="border-b border-gray-300"><th className="py-6 text-gray-600 font-semibold">কসাই ফি:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.butcher)}</td></tr>
              <tr className="border-b-4 border-emerald-950"><th className="py-6 text-gray-600 font-semibold">খাবার ও অন্যান্য:</th><td className="py-6 text-right font-bold tabular-nums">{formatMoney(costs.foodAndOther)}</td></tr>
              <tr className="bg-emerald-50"><th className="py-8 px-6 text-emerald-950 text-3xl font-black uppercase tracking-wider">সর্বমোট হিসাব:</th><td className="py-8 px-6 text-right font-black text-4xl text-emerald-950 tabular-nums">{formatMoney(total)}</td></tr>
            </tbody>
          </table>

          <div className="bg-emerald-950 text-white p-12 mb-20 border-4 border-emerald-950 rounded-[2rem]">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-emerald-200 text-xl mb-3 font-semibold uppercase tracking-widest">নির্ধারিত শরিক সংখ্যা</span>
                <span className="text-5xl font-black">{shares} জন</span>
              </div>
              <div className="text-right">
                <span className="block text-emerald-200 text-xl mb-3 font-semibold uppercase tracking-widest">প্রতি শরিকের প্রদেয়</span>
                <span className="text-7xl font-black text-amber-400 tabular-nums">{formatMoney(perShare)}</span>
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
