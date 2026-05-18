import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { QuranVerse } from '../../components/QuranVerse';

interface Props { onAccept: () => void; }

export const HalalDeclarationModal: React.FC<Props> = ({ onAccept }) => (
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
        transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
        className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-100/20"
      >
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto bg-amber-400 text-emerald-950 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-emerald-800/50 relative z-10"
          >
            <ShieldCheck size={40} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-3xl font-black mb-2 relative z-10 tracking-tight">হালাল উপার্জন হলফনামা</h2>
          <p className="text-emerald-200/90 text-sm font-medium relative z-10">শরীয়াহ বোর্ডের নির্দেশিকা অনুযায়ী বাধ্যতামূলক</p>
        </div>
        <div className="p-8 space-y-6">
          <QuranVerse
            arabic="يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا"
            translation="হে মানুষ! পৃথিবীতে যা হালাল ও পবিত্র তা খাও।"
            reference="সূরা আল-বাকারা ২:১৬৮"
            variant="light"
          />
          <p className="text-emerald-900 font-semibold text-lg leading-relaxed text-center italic opacity-90">
            "আমি আল্লাহ সুবহানাহু ওয়া তা'আলাকে সাক্ষী রেখে ঘোষণা করছি যে, আমার কুরবানির জন্য বরাদ্দকৃত সম্পূর্ণ অর্থ শতভাগ হালাল এবং বৈধ উপার্জন থেকে সংগৃহীত। এতে কোনো সুদ (রিবা), ঘুষ, বা শরীয়াহ-পরিপন্থী কোনো উপার্জনের মিশ্রণ নেই।"
          </p>
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 flex gap-4 mt-6 items-start">
            <Info className="text-amber-600 shrink-0 mt-0.5" size={24} />
            <p className="text-sm font-medium text-amber-900 leading-relaxed">কুরবানির পশুতে একজন অংশীদারের অর্থও যদি হারাম হয়, তবে সকল শরিকের কুরবানি বাতিল বলে গণ্য হবে।</p>
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
