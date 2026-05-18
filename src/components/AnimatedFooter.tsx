import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export const AnimatedFooter: React.FC = () => (
  <footer className="relative bg-emerald-950 py-12 md:py-16 overflow-hidden mt-auto print:hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c2280_1px,transparent_1px),linear-gradient(to_bottom,#022c2280_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

    <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-emerald-900 p-4 rounded-3xl mb-6 shadow-inner"
      >
        <ShieldCheck size={44} className="text-amber-400" strokeWidth={1.5} />
      </motion.div>

      <p className="text-emerald-300 font-medium text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
        বাংলাদেশের প্রথম শরীয়াহসম্মত কুরবানি ব্যবস্থাপনা প্ল্যাটফর্ম — হালাল উপার্জনের নিরাপদ অংশীদারিত্ব।
      </p>

      <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-emerald-800/80 to-transparent mb-10" />

      <motion.div
        animate={{
          boxShadow: [
            '0px 0px 0px rgba(251,191,36,0)',
            '0px 0px 20px rgba(251,191,36,0.25)',
            '0px 0px 0px rgba(251,191,36,0)',
          ],
          borderColor: ['rgba(4,120,87,1)', 'rgba(251,191,36,0.4)', 'rgba(4,120,87,1)'],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="border-2 border-emerald-800 px-8 py-5 rounded-[2rem] bg-emerald-900/50 backdrop-blur-sm w-full max-w-lg"
      >
        <motion.p
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="text-base md:text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-[length:200%_auto] text-center mb-3"
        >
          © ২০২৬ সহজ কুরবানি — সর্বস্বত্ব সংরক্ষিত
        </motion.p>
        <div className="text-emerald-400 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2">
          ডেভেলপমেন্ট পার্টনার
          <a
            href="https://Rizum-khan-org.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-950 text-white px-3 py-1.5 rounded-lg border border-emerald-700 shadow-sm hover:shadow-md hover:bg-emerald-800 transition-all outline outline-1 outline-amber-400/20"
          >
            <span className="font-black text-sm tracking-widest flex items-center">
              <span className="text-amber-400 font-extrabold text-base mr-0.5">A</span>IS
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  </footer>
);
