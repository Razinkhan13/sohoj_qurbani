import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShieldCheck, Users, MapPin, BookOpenCheck, Wallet,
  Loader2, CheckCircle2, MessageCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { Partner } from '../../types';
import { useToast } from '../../context/ToastContext';

interface Props {
  isPro: boolean;
  onRequiresPro: () => void;
}

type RequestStatus = 'loading' | 'success';

const WA_ADMIN_NUMBER = '8801410761298';
const WA_MESSAGE = encodeURIComponent(
  'আসসালামু আলাইকুম। আমি সহজ কুরবানি অ্যাপ থেকে কুরবানির শরিক খুঁজছি। আমার রিকোয়েস্ট সম্পর্কে জানাতে চাই।',
);

export const PartnerMatch: React.FC<Props> = ({ isPro, onRequiresPro }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestState, setRequestState] = useState<Record<string, RequestStatus>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);
  const { showToast } = useToast();

  const loadPartners = useCallback(async (query: string) => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    try {
      const data = await api.fetchPartners(query);
      if (myReq === reqIdRef.current) {
        setPartners(data);
      }
    } catch {
      showToast('শরিক লোড করতে সমস্যা হয়েছে।', 'error');
    } finally {
      if (myReq === reqIdRef.current) setLoading(false);
    }
  }, [showToast]);

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
    showToast('রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!', 'success');
  };

  const handleWhatsApp = (partnerName: string) => {
    if (!isPro) { onRequiresPro(); return; }
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি সহজ কুরবানি অ্যাপে "${partnerName}"-এর প্রোফাইলে রিকোয়েস্ট পাঠিয়েছি। আরও কথা বলতে চাই।`,
    );
    window.open(
      `https://wa.me/${WA_ADMIN_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="space-y-8 print:hidden">
      {/* Search */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-emerald-100 flex items-center gap-4 transition-all focus-within:shadow-md focus-within:border-emerald-300">
        <Search className="text-emerald-500 ml-2 shrink-0" size={26} aria-hidden="true" />
        <input
          type="search"
          placeholder="বর্তমান এলাকা দিয়ে শরিক খুঁজুন (যেমন: মিরপুর, ধানমন্ডি)..."
          value={searchQuery}
          onChange={handleSearch}
          aria-label="শরিক অনুসন্ধান"
          className="w-full bg-transparent border-none focus:outline-none text-emerald-950 font-bold text-lg placeholder:text-emerald-300/80 placeholder:font-medium"
        />
      </div>

      {/* Trust badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-[2rem] p-6 md:p-8 flex items-start gap-5"
      >
        <div className="bg-emerald-100 p-3 rounded-2xl shrink-0 text-emerald-700 shadow-sm">
          <ShieldCheck size={30} />
        </div>
        <div>
          <h3 className="font-black text-emerald-950 text-lg mb-1.5">
            শরীয়াহ বোর্ড দ্বারা ভেরিফাইড প্রোফাইল
          </h3>
          <p className="text-sm text-emerald-800 font-medium leading-relaxed">
            নিচের তালিকাভুক্ত সকল ব্যবহারকারী NID ভেরিফাইড এবং "হালাল উপার্জন হলফনামা" গ্রহণ করেছেন।
            তাদের আয়ের উৎস এবং ট্রাস্ট স্কোর যাচাইকৃত।
          </p>
        </div>
      </motion.div>

      {/* Partner list */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3].map((i) => (
              <motion.div
                key={`skeleton-${i}`}
                exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm animate-pulse"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-5 w-full">
                    <div className="h-7 bg-emerald-100/60 rounded-xl w-1/3" />
                    <div className="grid grid-cols-2 gap-5">
                      <div className="h-4 bg-emerald-50 rounded-lg w-3/4" />
                      <div className="h-4 bg-emerald-50 rounded-lg w-full" />
                    </div>
                  </div>
                  <div className="h-14 bg-emerald-100/30 rounded-2xl w-full md:w-48 shrink-0" />
                </div>
              </motion.div>
            ))
          ) : partners.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-emerald-200"
            >
              <Users size={60} className="mx-auto mb-6 text-emerald-200" strokeWidth={1.5} />
              <p className="text-xl font-bold text-emerald-800 mb-2">কোনো শরিক পাওয়া যায়নি</p>
              <p className="text-emerald-500 font-medium text-sm">
                আপনার এলাকার নাম ভিন্নভাবে লিখে চেষ্টা করুন।
              </p>
            </motion.div>
          ) : (
            partners.map((partner, index) => {
              const status = requestState[partner.id];
              return (
                <motion.article
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
                  aria-label={`${partner.name}-এর প্রোফাইল`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="w-full">
                      {/* Name + Badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <h3 className="text-2xl font-black text-emerald-950">{partner.name}</h3>
                        {partner.isHalalCertified && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-amber-300/50 shadow-sm">
                            <ShieldCheck size={14} /> হালাল উপার্জন হলফনামা প্রাপ্ত
                          </span>
                        )}
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-black border ${
                            partner.trustScore >= 95
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}
                        >
                          ট্রাস্ট স্কোর: {partner.trustScore}%
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-emerald-800 font-medium">
                        <div className="flex items-center gap-2.5">
                          <MapPin size={17} className="text-emerald-400 shrink-0" aria-hidden="true" />
                          বর্তমান এলাকা:&nbsp;
                          <span className="text-emerald-950 font-bold">{partner.presentAddress}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <BookOpenCheck size={17} className="text-emerald-400 shrink-0" aria-hidden="true" />
                          পেশা:&nbsp;{partner.profession}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Wallet size={17} className="text-emerald-400 shrink-0" aria-hidden="true" />
                          বাজেট:&nbsp;
                          <span className="text-emerald-950 font-black bg-amber-100 px-2 py-0.5 rounded-lg">
                            {partner.budgetStr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin size={17} className="text-emerald-400/60 shrink-0" aria-hidden="true" />
                          NID ঠিকানা:&nbsp;
                          <span className="text-emerald-600">{partner.area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto md:min-w-[200px]">
                      <motion.button
                        whileHover={!status ? { scale: 1.02 } : {}}
                        whileTap={!status ? { scale: 0.98 } : {}}
                        onClick={() => handleRequest(partner.id)}
                        disabled={!!status}
                        aria-label={`${partner.name}-কে রিকোয়েস্ট পাঠান`}
                        className={`w-full px-6 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                          status === 'success'
                            ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 cursor-default'
                            : status === 'loading'
                            ? 'bg-emerald-800 text-white cursor-wait opacity-80'
                            : 'bg-emerald-950 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-900'
                        }`}
                      >
                        {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
                        {status === 'success' && <CheckCircle2 size={18} />}
                        {status === 'success'
                          ? 'রিকোয়েস্ট পাঠানো হয়েছে'
                          : status === 'loading'
                          ? 'পাঠানো হচ্ছে...'
                          : 'কল রিকোয়েস্ট পাঠান'}
                      </motion.button>

                      {status === 'success' && (
                        <motion.button
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleWhatsApp(partner.name)}
                          className="w-full px-4 py-3 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                          aria-label="WhatsApp-এ যোগাযোগ করুন"
                        >
                          <MessageCircle size={17} />
                          হোয়াটসঅ্যাপে যোগাযোগ করুন
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-5"
      >
        <div>
          <h4 className="font-black text-emerald-950 text-lg mb-1">সরাসরি সাহায্য দরকার?</h4>
          <p className="text-emerald-700 font-medium text-sm">
            আমাদের হোয়াটসঅ্যাপ সাপোর্টে যোগাযোগ করুন — দ্রুত শরিক খুঁজে পেতে সাহায্য করবো।
          </p>
        </div>
        <a
          href={`https://wa.me/${WA_ADMIN_NUMBER}?text=${WA_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all hover:scale-[1.03]"
        >
          <MessageCircle size={20} />
          WhatsApp সাপোর্ট
        </a>
      </motion.div>
    </div>
  );
};
