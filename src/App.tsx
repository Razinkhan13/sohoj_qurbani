import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Users, Home, ShieldCheck, Menu, X } from 'lucide-react';

import { Card } from './components/Card';
import { AnimatedFooter } from './components/AnimatedFooter';
import { HalalDeclarationModal } from './features/halal/HalalDeclarationModal';
import { CountdownTimer } from './features/home/CountdownTimer';
import { ShorikCalculator } from './features/calculator/ShorikCalculator';
import { PartnerMatch } from './features/partners/PartnerMatch';
import { AuthModal } from './features/auth/AuthModal';
import { ProModal } from './features/pro/ProModal';

type TabId = 'home' | 'calculator' | 'partners';

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'মূল পাতা', icon: Home },
  { id: 'calculator', label: 'হিসাব-নিকাশ', icon: Calculator },
  { id: 'partners', label: 'শরিক খুঁজুন', icon: Users },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [hasAcceptedHalal, setHasAcceptedHalal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userContact, setUserContact] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

  const handleRequiresPro = () => {
    if (!userContact) setAuthModalOpen(true);
    else setProModalOpen(true);
  };

  const handleLogin = (contactInfo: string) => {
    setUserContact(contactInfo);
    setAuthModalOpen(false);
    setProModalOpen(true);
  };

  if (!hasAcceptedHalal) {
    return <HalalDeclarationModal onAccept={() => setHasAcceptedHalal(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-emerald-950 flex flex-col selection:bg-amber-200 selection:text-emerald-900">
      <nav className="bg-emerald-950 text-white shadow-2xl sticky top-0 z-50 print:hidden border-b-[3px] border-amber-400/20 backdrop-blur-xl bg-emerald-950/90">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
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

            <div className="hidden md:flex items-center text-emerald-400/80 font-bold text-xl tracking-wider select-none relative group">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <button className="md:hidden text-emerald-100 p-2 bg-emerald-900 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className={`print:hidden flex justify-center mb-12 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-100/80 p-2 flex flex-col md:flex-row w-full max-w-2xl gap-2 backdrop-blur-sm relative z-20">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-base font-bold transition-all relative overflow-hidden ${
                  activeTab === tab.id ? 'text-emerald-950 shadow-md bg-amber-50' : 'text-gray-400 hover:text-emerald-800 hover:bg-emerald-50/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabIndicator" className="absolute inset-0 bg-amber-100/50 border-2 border-amber-200/50 rounded-[1.5rem]" />
                )}
                <tab.icon size={20} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300 min-h-[55vh]">
          {activeTab === 'home' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 print:hidden">
              <div className="text-center mb-16 mt-8 md:mt-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-6 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest border border-emerald-200">
                  বাংলাদেশের প্রথম শরীয়াহসম্মত সহজ কুরবানি প্ল্যাটফর্ম
                </motion.div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-emerald-950 mb-6 leading-[1.1] tracking-tight">
                  নিরাপদ ও হালাল <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">কুরবানি ব্যবস্থাপনা</span>
                </h1>
                <p className="text-emerald-700/90 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                  শহুরে জীবনে হালাল উপার্জনের বিশ্বস্ত শরিক খুঁজে পাওয়া এবং কুরবানির সকল হিসাব ডিজিটালভাবে সংরক্ষণ করুন নিরাপদে।
                </p>
              </div>

              <CountdownTimer />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-12">
                <Card className="p-10 text-center group" onClick={() => setActiveTab('calculator')}>
                  <div className="bg-amber-50 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-all duration-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-amber-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                    <Calculator size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-3xl mb-4 text-emerald-950">স্বচ্ছ হিসাব-নিকাশ</h3>
                  <p className="text-emerald-700/80 text-lg leading-relaxed font-medium">কুরবানির সকল খরচের ডিজিটাল হিসাব রাখুন এবং সবার সাথে শেয়ার করার জন্য প্রফেশনাল পিডিএফ রিপোর্ট জেনারেট করুন।</p>
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
