import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Navigation, Clock, Loader2, AlertCircle,
  Map, RefreshCw, ChevronDown, ExternalLink, Star,
} from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { HAATS, DAYS_BN, isHaatOpenNow, nextOpenLabel, isEidPeriod } from '../../lib/haatData';
import { haversineKm, formatDistance, osmEmbedUrl } from '../../lib/geo';
import type { Haat } from '../../types';

const ANIMAL_FILTERS = ['সব', 'গরু', 'ছাগল', 'উট', 'মহিষ', 'দুম্বা'];

interface HaatRow extends Haat {
  distance?: number;
  isOpen: boolean;
}

const AnimalEmoji: Record<string, string> = {
  গরু: '🐄',
  ছাগল: '🐐',
  উট: '🐪',
  মহিষ: '🦬',
  দুম্বা: '🐑',
};

function formatDays(days: number[]): string {
  if (days.length === 7) return 'প্রতিদিন';
  return days.map((d) => DAYS_BN[d].slice(0, 3)).join(', ');
}

export const HaatFinder: React.FC = () => {
  const { location, loading, error, requestLocation, stopTracking } = useGeolocation();
  const [filter, setFilter] = useState('সব');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Refresh open/closed status every 60 s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const eidActive = isEidPeriod();

  const rows = useMemo((): HaatRow[] => {
    let list = HAATS.map((h) => ({
      ...h,
      distance: location
        ? haversineKm(location.lat, location.lng, h.lat, h.lng)
        : undefined,
      isOpen: isHaatOpenNow(h),
    }));

    if (filter !== 'সব') {
      list = list.filter((h) => h.animalTypes.includes(filter));
    }

    // Sort: nearest first when location available, otherwise open-first
    if (location) {
      list.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    } else {
      list.sort((a, b) => Number(b.isOpen) - Number(a.isOpen));
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, filter, tick]);

  const openCount = rows.filter((h) => h.isOpen).length;

  return (
    <div className="space-y-6 print:hidden">

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-400/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl shadow-lg shrink-0">
              <Map size={28} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                আশেপাশের পশুর হাট
              </h2>
              <p className="text-emerald-300 text-sm font-medium mt-1">
                রিয়েল-টাইম দূরত্ব, খোলা/বন্ধ তথ্য এবং মানচিত্র
              </p>
            </div>
          </div>

          {eidActive && (
            <div className="bg-amber-400/15 border border-amber-400/30 rounded-2xl px-5 py-3 flex items-center gap-3 mb-5">
              <Star size={18} className="text-amber-400 shrink-0" />
              <p className="text-amber-200 text-sm font-bold">
                ঈদ স্পেশাল — সকল হাট এখন প্রতিদিন খোলা!
              </p>
            </div>
          )}

          {/* Location CTA */}
          {!location && !loading && !error && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={requestLocation}
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-base shadow-xl shadow-amber-400/20 transition-colors"
            >
              <Navigation size={20} strokeWidth={2.5} />
              লোকেশন চালু করুন — কাছের হাট খুঁজুন
            </motion.button>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-emerald-300 font-semibold text-sm py-2">
              <Loader2 size={18} className="animate-spin" />
              আপনার অবস্থান খোঁজা হচ্ছে...
            </div>
          )}

          {error && (
            <div className="bg-red-950/60 border border-red-700/50 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-200 font-semibold text-sm">{error}</p>
                <button
                  onClick={requestLocation}
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs mt-2 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> পুনরায় চেষ্টা করুন
                </button>
              </div>
            </div>
          )}

          {location && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 text-emerald-200 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  লোকেশন সক্রিয়
                </span>
                <span className="text-emerald-400">•</span>
                <span className="text-amber-300 font-bold">{openCount} টি হাট এখন খোলা</span>
                {location.accuracy < 500 && (
                  <>
                    <span className="text-emerald-400">•</span>
                    <span className="text-emerald-400 text-xs">±{location.accuracy} মি নির্ভুলতা</span>
                  </>
                )}
              </div>
              <button
                onClick={stopTracking}
                className="text-emerald-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={13} /> বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Animal filter pills ──────────────────────────────────────── */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
        role="group"
        aria-label="পশুর ধরন ফিল্টার"
      >
        {ANIMAL_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              filter === f
                ? 'bg-emerald-950 text-white shadow-sm'
                : 'bg-white text-emerald-700 border border-emerald-100 hover:border-emerald-300'
            }`}
            aria-pressed={filter === f}
          >
            {AnimalEmoji[f] ?? ''} {f}
          </button>
        ))}
      </div>

      {/* ── Haat cards ──────────────────────────────────────────────── */}
      <div className="space-y-4" role="list" aria-label="হাটের তালিকা">
        {rows.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-emerald-200">
            <p className="text-lg font-bold text-emerald-800 mb-2">কোনো হাট পাওয়া যায়নি</p>
            <p className="text-emerald-500 text-sm">ফিল্টার পরিবর্তন করুন</p>
          </div>
        ) : (
          rows.map((haat, i) => {
            const isExpanded = expanded === haat.id;
            return (
              <motion.article
                key={haat.id}
                role="listitem"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
                className={`bg-white rounded-[2rem] border transition-all duration-200 ${
                  isExpanded
                    ? 'border-emerald-300 shadow-xl shadow-emerald-100/60'
                    : 'border-emerald-100 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                {/* Card header */}
                <button
                  className="w-full p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-[2rem]"
                  onClick={() => setExpanded(isExpanded ? null : haat.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${haat.name} বিস্তারিত দেখুন`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Name row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-black text-emerald-950 leading-tight">
                          {haat.name}
                        </h3>
                        {haat.isEidSpecial && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-black border border-amber-200/60 uppercase tracking-wider">
                            ঈদ স্পেশাল
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <p className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-400 shrink-0" />
                        {haat.area}, {haat.district}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border ${
                            haat.isOpen
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${haat.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}
                          />
                          {haat.isOpen
                            ? 'এখন খোলা'
                            : `পরবর্তী: ${nextOpenLabel(haat)}`}
                        </span>

                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Clock size={12} className="text-emerald-400" />
                          {haat.openTime} – {haat.closeTime}
                        </span>

                        <span className="text-emerald-500 font-medium">
                          {formatDays(eidActive ? [0, 1, 2, 3, 4, 5, 6] : haat.days)}
                        </span>
                      </div>

                      {/* Animal type badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {haat.animalTypes.map((a) => (
                          <span
                            key={a}
                            className="bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-lg text-xs font-bold"
                          >
                            {AnimalEmoji[a] ?? ''} {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: distance + chevron */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {haat.distance !== undefined && (
                        <div className="text-center">
                          <span className="text-2xl font-black text-emerald-950 tabular-nums leading-none">
                            {formatDistance(haat.distance)}
                          </span>
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">
                            দূরত্ব
                          </p>
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-emerald-400"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </div>
                </button>

                {/* Expanded section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 space-y-4 border-t border-emerald-50 pt-4">
                        {/* Description */}
                        {haat.description && (
                          <p className="text-sm text-emerald-700 font-medium leading-relaxed">
                            {haat.description}
                          </p>
                        )}

                        {haat.capacity && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                            <span className="text-emerald-400">🐄</span>
                            ধারণক্ষমতা: <span className="font-black">{haat.capacity}</span>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <a
                            href={`https://www.google.com/maps?q=${haat.lat},${haat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm py-3 rounded-2xl transition-all border border-emerald-100"
                          >
                            <Map size={16} /> Google Maps
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${haat.lat},${haat.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm py-3 rounded-2xl transition-all border border-amber-200/60"
                          >
                            <Navigation size={16} /> রুট দেখুন
                          </a>
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${haat.lat}&mlon=${haat.lng}&zoom=15`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm py-3 rounded-2xl transition-all border border-blue-100"
                          >
                            <ExternalLink size={15} /> OpenStreetMap-এ দেখুন
                          </a>
                        </div>

                        {/* Embedded OSM map */}
                        <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-sm">
                          <iframe
                            src={osmEmbedUrl(haat.lat, haat.lng)}
                            width="100%"
                            height="280"
                            style={{ border: 'none', display: 'block' }}
                            loading="lazy"
                            title={`${haat.name}-এর মানচিত্র`}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                        <p className="text-[11px] text-emerald-400 text-center font-medium">
                          মানচিত্র: © OpenStreetMap contributors
                          {import.meta.env.VITE_GOOGLE_MAPS_KEY
                            ? ''
                            : ' · Google Maps-এর জন্য VITE_GOOGLE_MAPS_KEY সেট করুন'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })
        )}
      </div>

      {/* ── Info footer ─────────────────────────────────────────────── */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 text-center">
        <p className="text-sm text-emerald-700 font-semibold leading-relaxed">
          হাটের তথ্য সাধারণত সঠিক তবে যাওয়ার আগে নিশ্চিত করুন। <br />
          নতুন হাটের তথ্য যোগ করতে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>
    </div>
  );
};
