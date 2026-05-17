import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export const AnimatedFooter: React.FC = () => (
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

      <motion.div
        animate={{
          boxShadow: ['0px 0px 0px rgba(251,191,36,0)', '0px 0px 20px rgba(251,191,36,0.3)', '0px 0px 0px rgba(251,191,36,0)'],
          borderColor: ['rgba(4,120,87,1)', 'rgba(251,191,36,0.5)', 'rgba(4,120,87,1)'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="border-2 border-emerald-800 px-8 py-5 rounded-[2rem] bg-emerald-900/50 backdrop-blur-sm"
      >
        <motion.h3
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
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
