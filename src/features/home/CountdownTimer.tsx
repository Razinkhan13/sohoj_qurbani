import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { QuranVerse } from '../../components/QuranVerse';

const TARGET_DATE = new Date('2026-05-27T00:00:00+06:00').getTime();

const computeTimeLeft = () => {
  const diff = TARGET_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
};

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: 'দিন', value: timeLeft.days },
    { label: 'ঘণ্টা', value: timeLeft.hours },
    { label: 'মিনিট', value: timeLeft.minutes },
    { label: 'সেকেন্ড', value: timeLeft.seconds },
  ];

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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-300 px-5 py-2 rounded-full text-sm font-bold mb-4 backdrop-blur-md uppercase tracking-wider"
        >
          আসন্ন পবিত্র ঈদ-উল-আযহা ২০২৬
        </motion.div>
        <p className="text-emerald-100/90 text-lg md:text-xl xl:text-2xl mb-6 font-semibold">২৭ মে, ২০২৬ (১০ জিলহজ্জ ১৪৪৭ হিজরি)</p>
        <div className="mb-10">
          <QuranVerse
            arabic="قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ"
            translation="বলুন, নিশ্চয়ই আমার নামাজ, আমার কুরবানি, আমার জীবন ও মৃত্যু সবই আল্লাহর জন্য।"
            reference="সূরা আল-আনআম ৬:১৬২"
            variant="dark"
          />
        </div>
        <div className="flex justify-center gap-4 md:gap-8 max-w-2xl mx-auto">
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
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
