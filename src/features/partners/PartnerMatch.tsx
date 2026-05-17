import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShieldCheck, Users, MapPin, BookOpenCheck, Wallet,
  Loader2, CheckCircle2, MessageSquare,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { Partner } from '../../types';

interface Props {
  isPro: boolean;
  onRequiresPro: () => void;
}

type RequestStatus = 'loading' | 'success';

export const PartnerMatch: React.FC<Props> = ({ isPro, onRequiresPro }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestState, setRequestState] = useState<Record<string, RequestStatus>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  const loadPartners = useCallback(async (query: string) => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    const data = await api.fetchPartners(query);
    if (myReq === reqIdRef.current) {
      setPartners(data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPartners('');
  }, [loadPartners]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadPartners(value), 400);
  };

  const handleRequest = async (id: string) => {
    if (!isPro) { onRequiresPro(); return; }
    setRequestState((prev) => ({ ...prev, [id]: 'loading' }));
    await api.sendRequest(id);
    setRequestState((prev) => ({ ...prev, [id]: 'success' }));
  };

  const handleWhatsapp = () => {
    if (!isPro) { onRequiresPro(); return; }
    alert('Pro Feature: Redirecting to WhatsApp Group...');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-emerald-100 flex items-center gap-4 transition-all focus-within:shadow-md focus-within:border-emerald-300">
        <Search className="text-emerald-500 ml-2" size={28} />
        <input
          type="text"
          placeholder="বর্তমান এলাকা দিয়ে শরিক খুঁজুন (যেমন: মিরপুর, ধানমন্ডি)..."
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
          <h3 className="font-black text-emerald-950 text-xl mb-2">শরীয়াহ বোর্ড দ্বারা ভেরিফাইড প্রোফাইল</h3>
          <p className="text-base text-emerald-800 font-medium leading-relaxed">
            নিচের তালিকাভুক্ত সকল ব্যবহারকারী NID ভেরিফাইড এবং "হালাল উপার্জন হলফনামা" গ্রহণ করেছেন। তাদের ইনকাম সোর্স এবং ট্রাস্ট স্কোর ১০০% নিরাপদ।
          </p>
        </div>
      </motion.div>

      <div className="space-y-5">
        <AnimatePresence>
          {loading ? (
            [1, 2, 3].map((i) => (
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-[2rem] border border-emerald-100 border-dashed">
              <Users size={64} className="mx-auto mb-6 text-emerald-200" strokeWidth={1.5} />
              <p className="text-2xl font-bold text-emerald-800 mb-2">কোনো শরিক পাওয়া যায়নি</p>
              <p className="text-emerald-500 font-medium">আপনার এলাকার নাম ভিন্নভাবে লিখে চেষ্টা করুন।</p>
            </motion.div>
          ) : (
            partners.map((partner, index) => {
              const status = requestState[partner.id];
              return (
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
                        whileHover={!status ? { scale: 1.02 } : {}}
                        whileTap={!status ? { scale: 0.98 } : {}}
                        onClick={() => handleRequest(partner.id)}
                        disabled={!!status}
                        className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                          status === 'success'
                            ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 cursor-not-allowed'
                            : status === 'loading'
                            ? 'bg-emerald-800 text-white cursor-wait opacity-80'
                            : 'bg-emerald-950 text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-900'
                        }`}
                      >
                        {status === 'loading' && <Loader2 size={20} className="animate-spin" />}
                        {status === 'success' && <CheckCircle2 size={20} />}
                        {status === 'success'
                          ? 'রিকোয়েস্ট পাঠানো হয়েছে'
                          : status === 'loading'
                          ? 'যাচাই হচ্ছে...'
                          : 'কল রিকোয়েস্ট পাঠান'}
                      </motion.button>
                      {status === 'success' && (
                        <motion.button
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleWhatsapp}
                          className="w-full px-4 py-3 rounded-xl font-bold text-sm bg-green-500 hover:bg-green-600 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <MessageSquare size={18} /> হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
