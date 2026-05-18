import type { Haat } from '../types';

// Days: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export const HAATS: Haat[] = [
  /* ── Dhaka Division ─────────────────────────────────────────────── */
  {
    id: 'h01',
    name: 'গাবতলী পশুর হাট',
    area: 'গাবতলী, মিরপুর',
    district: 'ঢাকা',
    lat: 23.7784,
    lng: 90.3451,
    days: EVERY_DAY,
    openTime: '06:00',
    closeTime: '22:00',
    animalTypes: ['গরু', 'ছাগল', 'উট', 'দুম্বা'],
    description: 'ঢাকার সবচেয়ে বড় এবং ঐতিহাসিক পশুর হাট। প্রতি বছর লক্ষাধিক পশু কেনাবেচা হয়।',
    isEidSpecial: true,
    capacity: '৫০,০০০+ পশু',
  },
  {
    id: 'h02',
    name: 'আমিনবাজার পশু হাট',
    area: 'আমিনবাজার',
    district: 'ঢাকা',
    lat: 23.7952,
    lng: 90.3212,
    days: EVERY_DAY,
    openTime: '06:00',
    closeTime: '21:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'ঢাকা-আরিচা মহাসড়কের পাশে অবস্থিত বৃহৎ পশুর হাট।',
    isEidSpecial: true,
    capacity: '৩০,০০০+ পশু',
  },
  {
    id: 'h03',
    name: 'উত্তরা পশু হাট (আব্দুল্লাহপুর)',
    area: 'আব্দুল্লাহপুর, উত্তরা',
    district: 'ঢাকা',
    lat: 23.8749,
    lng: 90.3521,
    days: EVERY_DAY,
    openTime: '07:00',
    closeTime: '20:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'উত্তরা ও মিরপুরবাসীর জন্য সুবিধাজনক পশুর হাট।',
    isEidSpecial: true,
  },
  {
    id: 'h04',
    name: 'কদমতলী পশু হাট',
    area: 'কদমতলী',
    district: 'ঢাকা',
    lat: 23.7127,
    lng: 90.4387,
    days: EVERY_DAY,
    openTime: '06:00',
    closeTime: '21:00',
    animalTypes: ['গরু', 'ছাগল', 'দুম্বা'],
    description: 'পুরান ঢাকা ও আশেপাশের বাসিন্দাদের জন্য কেন্দ্রীয় পশুর হাট।',
    isEidSpecial: true,
  },
  {
    id: 'h05',
    name: 'সাভার পশু হাট',
    area: 'সাভার বাজার',
    district: 'সাভার, ঢাকা',
    lat: 23.8566,
    lng: 90.2582,
    days: [0, 3, 6],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'সাভার শিল্পাঞ্চলের কাছের প্রধান পশুর হাট। রবি, বুধ ও শনিবার বসে।',
    isEidSpecial: true,
  },
  {
    id: 'h06',
    name: 'টোঙ্গী পশু হাট',
    area: 'টোঙ্গী',
    district: 'গাজীপুর',
    lat: 23.9056,
    lng: 90.4006,
    days: [1, 4],
    openTime: '06:00',
    closeTime: '19:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'গাজীপুর জেলার অন্যতম বড় পশুর হাট। সোম ও বৃহস্পতিবার বসে।',
    isEidSpecial: true,
  },
  {
    id: 'h07',
    name: 'কাঁচপুর পশু হাট',
    area: 'কাঁচপুর',
    district: 'নারায়ণগঞ্জ',
    lat: 23.6962,
    lng: 90.5061,
    days: [2, 5],
    openTime: '06:00',
    closeTime: '20:00',
    animalTypes: ['গরু', 'ছাগল', 'উট'],
    description: 'নারায়ণগঞ্জ জেলার বৃহত্তম পশুর হাট। মঙ্গল ও শুক্রবার বসে।',
    isEidSpecial: true,
  },
  {
    id: 'h08',
    name: 'নারায়ণগঞ্জ সিটি পশু হাট',
    area: 'নারায়ণগঞ্জ শহর',
    district: 'নারায়ণগঞ্জ',
    lat: 23.6238,
    lng: 90.4999,
    days: [0, 3],
    openTime: '07:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'নারায়ণগঞ্জ শহরের নিকটস্থ পশুর হাট।',
    isEidSpecial: false,
  },
  {
    id: 'h09',
    name: 'মুন্সীগঞ্জ পশু হাট',
    area: 'মুন্সীগঞ্জ সদর',
    district: 'মুন্সীগঞ্জ',
    lat: 23.5422,
    lng: 90.5303,
    days: [1, 5],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'মুন্সীগঞ্জ জেলার কেন্দ্রীয় পশুর হাট।',
    isEidSpecial: false,
  },

  /* ── Chittagong Division ─────────────────────────────────────────── */
  {
    id: 'h10',
    name: 'বহদ্দারহাট পশু বাজার',
    area: 'বহদ্দারহাট',
    district: 'চট্টগ্রাম',
    lat: 22.3439,
    lng: 91.8036,
    days: EVERY_DAY,
    openTime: '06:00',
    closeTime: '21:00',
    animalTypes: ['গরু', 'ছাগল', 'উট', 'দুম্বা'],
    description: 'চট্টগ্রামের সবচেয়ে বড় পশুর হাট। ঈদের সময় দেশের বিভিন্ন প্রান্ত থেকে পশু আসে।',
    isEidSpecial: true,
    capacity: '২০,০০০+ পশু',
  },
  {
    id: 'h11',
    name: 'কুমিল্লা পশু হাট',
    area: 'কুমিল্লা শহর',
    district: 'কুমিল্লা',
    lat: 23.4607,
    lng: 91.1809,
    days: [2, 6],
    openTime: '06:00',
    closeTime: '19:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'কুমিল্লা জেলার প্রধান পশুর হাট। বুধ ও শনিবার বসে।',
    isEidSpecial: true,
  },

  /* ── Sylhet Division ─────────────────────────────────────────────── */
  {
    id: 'h12',
    name: 'শুলকবহর পশু হাট',
    area: 'শুলকবহর',
    district: 'সিলেট',
    lat: 24.8961,
    lng: 91.8679,
    days: [0, 4],
    openTime: '06:00',
    closeTime: '20:00',
    animalTypes: ['গরু', 'ছাগল', 'দুম্বা'],
    description: 'সিলেট শহরের কেন্দ্রীয় পশুর হাট। রবি ও বৃহস্পতিবার বসে।',
    isEidSpecial: true,
  },

  /* ── Rajshahi Division ───────────────────────────────────────────── */
  {
    id: 'h13',
    name: 'উপশহর পশু হাট',
    area: 'উপশহর',
    district: 'রাজশাহী',
    lat: 24.3733,
    lng: 88.6247,
    days: [1, 5],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'রাজশাহী শহরের বৃহত্তম পশুর হাট। সোম ও শুক্রবার বসে।',
    isEidSpecial: true,
  },
  {
    id: 'h14',
    name: 'রংপুর পশু হাট',
    area: 'মাহিগঞ্জ',
    district: 'রংপুর',
    lat: 25.7439,
    lng: 89.2752,
    days: [0, 3],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'উত্তরবঙ্গের সবচেয়ে বড় পশুর হাটগুলোর মধ্যে একটি।',
    isEidSpecial: true,
  },
  {
    id: 'h15',
    name: 'দিনাজপুর পশু হাট',
    area: 'দিনাজপুর সদর',
    district: 'দিনাজপুর',
    lat: 25.6279,
    lng: 88.6338,
    days: [2, 6],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'দিনাজপুর জেলার কেন্দ্রীয় পশুর হাট।',
    isEidSpecial: false,
  },

  /* ── Khulna Division ─────────────────────────────────────────────── */
  {
    id: 'h16',
    name: 'সোনাডাঙ্গা পশু হাট',
    area: 'সোনাডাঙ্গা',
    district: 'খুলনা',
    lat: 22.8456,
    lng: 89.5403,
    days: [1, 4],
    openTime: '06:00',
    closeTime: '19:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'খুলনা বিভাগের বৃহত্তম পশুর হাট।',
    isEidSpecial: true,
  },

  /* ── Barisal Division ────────────────────────────────────────────── */
  {
    id: 'h17',
    name: 'বরিশাল পশু হাট',
    area: 'বন্দর রোড',
    district: 'বরিশাল',
    lat: 22.7010,
    lng: 90.3535,
    days: [0, 3, 6],
    openTime: '06:00',
    closeTime: '18:00',
    animalTypes: ['গরু', 'ছাগল'],
    description: 'বরিশাল জেলার কেন্দ্রীয় পশুর হাট। রবি, বুধ ও শনিবার বসে।',
    isEidSpecial: false,
  },

  /* ── Mymensingh Division ─────────────────────────────────────────── */
  {
    id: 'h18',
    name: 'ব্রহ্মপুত্র পশু হাট',
    area: 'ময়মনসিংহ সদর',
    district: 'ময়মনসিংহ',
    lat: 24.7471,
    lng: 90.4203,
    days: [2, 5],
    openTime: '06:00',
    closeTime: '19:00',
    animalTypes: ['গরু', 'ছাগল', 'মহিষ'],
    description: 'ব্রহ্মপুত্র নদীর পাড়ে ময়মনসিংহের ঐতিহ্যবাহী পশুর হাট।',
    isEidSpecial: true,
  },
];

// Bengali weekday names
export const DAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

/** True during the 5-day Eid Qurbani window (24–28 May 2026) */
export function isEidPeriod(): boolean {
  const now = new Date();
  const start = new Date('2026-05-24T00:00:00+06:00');
  const end = new Date('2026-05-29T00:00:00+06:00');
  return now >= start && now < end;
}

/** Returns true if a haat is currently operating */
export function isHaatOpenNow(haat: Haat): boolean {
  const now = new Date();
  const today = now.getDay();
  // During Eid, all haats operate every day
  const days = isEidPeriod() ? [0, 1, 2, 3, 4, 5, 6] : haat.days;
  if (!days.includes(today)) return false;

  const [openH, openM] = haat.openTime.split(':').map(Number);
  const [closeH, closeM] = haat.closeTime.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= openH * 60 + openM && nowMin <= closeH * 60 + closeM;
}

/** Next opening day label (e.g. "আগামীকাল", "বৃহস্পতিবার") */
export function nextOpenLabel(haat: Haat): string {
  if (isEidPeriod()) return 'ঈদ স্পেশাল';
  const today = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    if (haat.days.includes(d)) return i === 1 ? 'আগামীকাল' : DAYS_BN[d];
  }
  return 'অনির্ধারিত';
}
