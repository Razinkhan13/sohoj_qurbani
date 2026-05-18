import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Users, Home, ShieldCheck, MapPin } from 'lucide-react';

import { Card } from './components/Card';
import { AnimatedFooter } from './components/AnimatedFooter';
import { HalalDeclarationModal } from './features/halal/HalalDeclarationModal';
import { CountdownTimer } from './features/home/CountdownTimer';
import { ShorikCalculator } from './features/calculator/ShorikCalculator';
import { PartnerMatch } from './features/partners/PartnerMatch';
import { HaatFinder } from './features/haat/HaatFinder';
import { AuthModal } from './features/auth/AuthModal';
import { ProModal } from './features/pro/ProModal';

type TabId = 'home' | 'calculator' | 'partners' | 'haat';

const TABS: { id: TabId; label: string; shortLabel: string; icon: typeof Home }[] = [
  { id: 'home',       label: 'মূল পাতা',    shortLabel: 'হোম',  icon: Home       },
  { id: 'calculator', label: 'হিসাব-নিকাশ', shortLabel: 'হিসাব', icon: Calculator },
  { id: 'partners',   label: 'শরিক খুঁজুন', shortLabel: 'শরিক', icon: Users       },
  { id: 'haat',       label: 'পশুর হাট',    shortLabel: 'হাট',  icon: MapPin      },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [hasAcceptedHalal, setHasAcceptedHalal] = useState(false);
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

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <nav
        className="bg-emerald-950 text-white shadow-2xl sticky top-0 z-50 print:hidden"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
              aria-label="সহজ কুরবানি — হোম পেজে যান"
            >
              <div className="bg-gradient-to-br from-amber-300 to-amber-500 p-2 rounded-[0.875rem] text-emerald-950 shadow-lg shadow-amber-400/20">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter">
                সহজ
                <span className="text-amber-400 text-[10px] md:text-xs align-top ml-1 uppercase tracking-widest">
                  কুরবানি
                </span>
              </span>
            </motion.button>

            {/* Arabic Basmala — large screens only */}
            <p
              className="hidden xl:block text-emerald-400/70 font-bold text-base tracking-wider select-none"
              aria-hidden="true"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>

            {/* Desktop pill tab nav */}
            <div
              className="hidden md:flex items-center bg-emerald-900/60 rounded-2xl p-1 gap-0.5"
              role="tablist"
              aria-label="Tab navigation"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    activeTab === tab.id ? 'text-emerald-950' : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="navActiveTab"
                      className="absolute inset-0 bg-amber-400 rounded-xl"
                      style={{ zIndex: 0 }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    />
                  )}
                  <tab.icon size={14} className="relative z-10" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-[55vh]"
          >
            {/* ── HOME ── */}
            {activeTab === 'home' && (
              <div className="space-y-12 print:hidden">
                <div className="text-center mb-16 mt-4 md:mt-8">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05, type: 'spring', bounce: 0.3 }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest border border-emerald-200"
                  >
                    বাংলাদেশের প্রথম শরীয়াহসম্মত সহজ কুরবানি প্ল্যাটফর্ম
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-emerald-950 mb-6 leading-[1.1] tracking-tight">
                    নিরাপদ ও হালাল{' '}
                    <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                      কুরবানি ব্যবস্থাপনা
                    </span>
                  </h1>
                  <p className="text-emerald-700/90 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                    শহুরে জীবনে হালাল উপার্জনের বিশ্বস্ত শরিক খুঁজে পাওয়া এবং কুরবানির সকল হিসাব
                    ডিজিটালভাবে সংরক্ষণ করুন নিরাপদে।
                  </p>
                </div>

                <CountdownTimer />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pb-12">
                  <Card className="p-8 text-center group" onClick={() => setActiveTab('calculator')}>
                    <div className="bg-amber-50 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-all duration-500 w-20 h-20 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                      <Calculator size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-black text-2xl mb-3 text-emerald-950">স্বচ্ছ হিসাব-নিকাশ</h3>
                    <p className="text-emerald-700/80 text-base leading-relaxed font-medium">
                      সকল খরচের ডিজিটাল হিসাব ও প্রিমিয়াম PDF রিপোর্ট।
                    </p>
                  </Card>
                  <Card className="p-8 text-center group" onClick={() => setActiveTab('partners')}>
                    <div className="bg-emerald-50 group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 w-20 h-20 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                      <Users size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-black text-2xl mb-3 text-emerald-950">বিশ্বস্ত শরিক খুঁজুন</h3>
                    <p className="text-emerald-700/80 text-base leading-relaxed font-medium">
                      NID ভেরিফাইড হালাল উপার্জনের শরিকদের সাথে যুক্ত হোন।
                    </p>
                  </Card>
                  <Card className="p-8 text-center group" onClick={() => setActiveTab('haat')}>
                    <div className="bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 w-20 h-20 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner group-hover:shadow-xl group-hover:-translate-y-2">
                      <MapPin size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-black text-2xl mb-3 text-emerald-950">কাছের পশুর হাট</h3>
                    <p className="text-emerald-700/80 text-base leading-relaxed font-medium">
                      লোকেশন চালু করে আশেপাশের হাট খুঁজুন রিয়েল-টাইমে।
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'calculator' && (
              <ShorikCalculator isPro={isPro} onRequiresPro={handleRequiresPro} />
            )}
            {activeTab === 'partners' && (
              <PartnerMatch isPro={isPro} onRequiresPro={handleRequiresPro} />
            )}
            {activeTab === 'haat' && <HaatFinder />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatedFooter />

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] print:hidden"
        role="tablist"
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch h-16">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.label}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors focus:outline-none ${
                  isActive ? 'text-emerald-950' : 'text-gray-400 active:text-emerald-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-x-3 top-0 h-0.5 bg-amber-400 rounded-full"
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  />
                )}
                <tab.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="relative z-10"
                />
                <span className="text-[9px] font-bold leading-none relative z-10">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MODALS ──────────────────────────────────────────── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      <ProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onUpgrade={() => {
          setIsPro(true);
          setProModalOpen(false);
        }}
        userContact={userContact}
      />
    </div>
  );
}
