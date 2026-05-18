import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ShieldCheck, FileDown, Loader2 } from 'lucide-react';
import { InputField } from '../../components/InputField';
import { formatMoney } from '../../lib/format';
import { useToast } from '../../context/ToastContext';

interface Props {
  isPro: boolean;
  onRequiresPro: () => void;
}

type CostKey = 'animalPrice' | 'hasil' | 'transport' | 'butcher' | 'foodAndOther';
type Costs = Record<CostKey, string>;

const EMPTY_COSTS: Costs = {
  animalPrice: '',
  hasil: '',
  transport: '',
  butcher: '',
  foodAndOther: '',
};

const COST_LABELS: Record<CostKey, string> = {
  animalPrice: 'পশুর মূল্য',
  hasil: 'হাসিল / মার্কেট ফি',
  transport: 'যাতায়াত / পরিবহন',
  butcher: 'কসাই খরচ',
  foodAndOther: 'খাবার ও অন্যান্য',
};

export const ShorikCalculator: React.FC<Props> = ({ isPro, onRequiresPro }) => {
  const [costs, setCosts] = useState<Costs>(EMPTY_COSTS);
  const [shares, setShares] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const systemId = useMemo(
    () => `SP-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    [],
  );

  const todayBn = useMemo(
    () => new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    [],
  );

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
    const element = invoiceRef.current;
    if (!element || total === 0) return;

    setIsGenerating(true);

    // Bring off-screen element into render for capture
    const prev = { display: element.style.display, position: element.style.position, left: element.style.left, top: element.style.top };
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.top = '0';

    try {
      await new Promise((r) => setTimeout(r, 80));
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`SohojQurbani_Hisab_${systemId}.pdf`);
      showToast('পিডিএফ রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!', 'success');
    } catch (err) {
      console.error('PDF generation failed', err);
      showToast('পিডিএফ তৈরি করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।', 'error');
    } finally {
      element.style.display = prev.display;
      element.style.position = prev.position;
      element.style.left = prev.left;
      element.style.top = prev.top;
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl -mt-64 -mr-64 opacity-60 pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-emerald-100 relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-3xl shadow-sm">
              <Calculator size={30} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
                সহজ কুরবানি ক্যালকুলেটর
              </h2>
              <p className="text-emerald-600/90 font-medium mt-1 text-sm">
                কুরবানির সকল খরচের ডিজিটাল ও শরীয়াহ সম্মত হিসাব
              </p>
            </div>
          </div>
          <div className="bg-amber-50 text-amber-800 px-5 py-2.5 rounded-2xl text-sm font-bold border border-amber-200/60 flex items-center gap-2.5 shadow-sm shrink-0">
            <ShieldCheck size={17} className="text-amber-600" /> শরীয়াহ বোর্ড অনুমোদিত
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 relative z-10 mb-8">
          <InputField
            label="পশুর দাম (৳)"
            value={costs.animalPrice}
            onChange={(e) => handleCostChange('animalPrice', e.target.value)}
            placeholder="উদাহরণ: ১২০০০০"
          />
          <InputField
            label="হাসিল / মার্কেট ফি (৳)"
            value={costs.hasil}
            onChange={(e) => handleCostChange('hasil', e.target.value)}
            placeholder="০"
          />
          <InputField
            label="যাতায়াত / পরিবহন (৳)"
            value={costs.transport}
            onChange={(e) => handleCostChange('transport', e.target.value)}
            placeholder="০"
          />
          <InputField
            label="কসাই খরচ (৳)"
            value={costs.butcher}
            onChange={(e) => handleCostChange('butcher', e.target.value)}
            placeholder="০"
          />
          <InputField
            label="খাবার ও অন্যান্য আনুষঙ্গিক (৳)"
            value={costs.foodAndOther}
            onChange={(e) => handleCostChange('foodAndOther', e.target.value)}
            placeholder="০"
          />

          <div className="mb-4">
            <label className="block text-sm font-bold text-emerald-900 mb-2">
              মোট শরিক (১–৭ জন)
            </label>
            <div className="relative">
              <select
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="appearance-none w-full bg-emerald-50/40 border-2 border-emerald-100 rounded-2xl py-3.5 px-5 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all font-bold text-emerald-950 text-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {n} জন শরিক অংশ নিচ্ছেন
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 font-bold text-sm">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <motion.div
          layout
          className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-[0.03] scale-150 transform translate-x-10 -translate-y-10 pointer-events-none">
            <Calculator size={300} />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-emerald-700/50 gap-4">
              <span className="text-emerald-100/80 text-xl font-medium tracking-wide">
                সর্বমোট অনুমোদিত খরচ
              </span>
              <span className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">
                {formatMoney(total)}
              </span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-amber-400 font-bold text-xl md:text-2xl tracking-wide">
                প্রতি শরিকের প্রদেয় অংশ
              </span>
              <span className="text-5xl md:text-6xl font-black text-amber-400 drop-shadow-2xl tabular-nums">
                {formatMoney(perShare)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.button
          whileHover={total > 0 ? { scale: 1.01 } : {}}
          whileTap={total > 0 ? { scale: 0.98 } : {}}
          onClick={handlePrint}
          disabled={isGenerating || total === 0}
          className={`mt-10 w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-xl ${
            total === 0
              ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed border-2 border-emerald-100/50'
              : isGenerating
              ? 'bg-amber-300 text-emerald-950 cursor-wait'
              : 'bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-xl shadow-amber-400/20'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" size={26} />
          ) : (
            <FileDown size={26} />
          )}
          {isGenerating
            ? 'প্রিমিয়াম পিডিএফ রিপোর্ট তৈরি হচ্ছে...'
            : 'প্রিমিয়াম পিডিএফ রিপোর্ট ডাউনলোড করুন'}
        </motion.button>
      </div>

      {/* ── PREMIUM INVOICE (off-screen, captured by html2canvas) ── */}
      <div
        ref={invoiceRef}
        style={{
          display: 'none',
          width: '794px',
          backgroundColor: '#ffffff',
          fontFamily: "'Hind Siliguri', 'Inter', Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#022c22',
            padding: '48px 56px 40px',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#022c22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
                সহজ কুরবানি
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#fbbf24', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                SOHOJ QURBANI
              </p>
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#a7f3d0', letterSpacing: '1px' }}>
              কুরবানি ব্যয়ের স্বচ্ছ হিসাব — ১৪৪৭ হিজরি / ২০২৬ ইং
            </p>
          </div>
        </div>

        {/* Meta bar */}
        <div style={{ background: '#f0fdf4', padding: '14px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d1fae5' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>তারিখ: {todayBn}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46', letterSpacing: '1px' }}>সিস্টেম আইডি: {systemId}</span>
        </div>

        {/* Table */}
        <div style={{ padding: '40px 56px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
            <thead>
              <tr style={{ background: '#022c22' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: '#ffffff', fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  ব্যয়ের বিবরণ
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'right', color: '#fbbf24', fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  পরিমাণ
                </th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(costs) as [CostKey, string][]).map(([key, val], i) => (
                <tr key={key} style={{ background: i % 2 === 0 ? '#f8fffe' : '#ffffff' }}>
                  <td style={{ padding: '16px 20px', color: '#374151', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>
                    {COST_LABELS[key]}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', fontVariantNumeric: 'tabular-nums' }}>
                    {formatMoney(val)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total + Per-share */}
          <div style={{ background: '#022c22', borderRadius: '16px', padding: '28px 32px', marginTop: '24px', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '20px' }}>
              <span style={{ color: '#a7f3d0', fontSize: '16px', fontWeight: 600 }}>সর্বমোট হিসাব</span>
              <span style={{ fontSize: '34px', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', color: '#a7f3d0', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>মোট শরিক</span>
                <span style={{ fontSize: '30px', fontWeight: 900 }}>{shares} জন</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', color: '#fcd34d', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>প্রতি শরিকের প্রদেয়</span>
                <span style={{ fontSize: '42px', fontWeight: 900, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>{formatMoney(perShare)}</span>
              </div>
            </div>
          </div>

          {/* Halal declaration */}
          <div style={{ border: '2px solid #d1fae5', borderRadius: '12px', padding: '20px 24px', marginTop: '24px', background: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#064e3b', fontSize: '14px' }}>হালাল উপার্জনের ঘোষণা:</p>
            <p style={{ margin: 0, color: '#065f46', fontSize: '13px', lineHeight: 1.7, fontWeight: 500 }}>
              এই কুরবানিতে অংশগ্রহণকারী সকল শরিক "হালাল উপার্জন হলফনামা" গ্রহণ করেছেন এবং তাদের কুরবানির সম্পূর্ণ অর্থ শরীয়াহসম্মত উৎস থেকে সংগৃহীত। ইসলামী শরীয়াহ মতে এই কুরবানি সম্পাদিত।
            </p>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '56px', paddingTop: '32px', borderTop: '2px solid #e5e7eb' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ borderBottom: '2px dashed #6b7280', height: '52px', marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: 800, fontSize: '12px', color: '#374151', letterSpacing: '1.5px', textTransform: 'uppercase' }}>ম্যানেজার / হিসাব রক্ষক</p>
            </div>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ borderBottom: '2px dashed #6b7280', height: '52px', marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: 800, fontSize: '12px', color: '#374151', letterSpacing: '1.5px', textTransform: 'uppercase' }}>শরিকের স্বাক্ষর ও তারিখ</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#022c22', marginTop: '40px', padding: '20px 56px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#6ee7b7', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            সহজ কুরবানি | বাংলাদেশের শরীয়াহসম্মত কুরবানি ব্যবস্থাপনা প্ল্যাটফর্ম
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#a7f3d0', fontWeight: 500 }}>
            Development Partner: AIS &nbsp;|&nbsp; {systemId}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
