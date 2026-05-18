-- ============================================================
-- Sohoj Qurbani — Supabase Schema
-- Run in your Supabase project's SQL Editor
-- ============================================================

-- ── partners ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.partners (
    id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name             TEXT        NOT NULL,
    area             TEXT        NOT NULL,
    "presentAddress" TEXT        NOT NULL,
    profession       TEXT        NOT NULL,
    "incomeSource"   TEXT        NOT NULL,
    budget           NUMERIC     NOT NULL,
    "budgetStr"      TEXT        NOT NULL,
    animal           TEXT        DEFAULT 'গরু' NOT NULL,
    "isHalalCertified" BOOLEAN   DEFAULT true NOT NULL,
    "trustScore"     INTEGER     NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "partners_public_read" ON public.partners
    FOR SELECT USING (true);

-- Authenticated users can insert their own partner listing
-- CREATE POLICY "partners_auth_insert" ON public.partners
--     FOR INSERT TO authenticated WITH CHECK (true);

-- Seed data
INSERT INTO public.partners (name, area, "presentAddress", profession, "incomeSource", budget, "budgetStr", animal, "isHalalCertified", "trustScore")
VALUES
    ('মাহমুদ হাসান',  'ধানমন্ডি, ঢাকা',     'ধানমন্ডি, ঢাকা',  'সফটওয়্যার ইঞ্জিনিয়ার', 'বেতনভুক্ত (হালাল যাচাইকৃত)',           35000, '৩০,০০০ - ৩৫,০০০ ৳', 'গরু', true, 98),
    ('শরীফ আহমেদ',   'জৈন্তাপুর, সিলেট',    'উত্তরা, ঢাকা',    'সরকারি কর্মকর্তা',       'বেতনভুক্ত (হালাল যাচাইকৃত)',           28000, '২৫,০০০ - ২৮,০০০ ৳', 'গরু', true, 95),
    ('তারেক রহমান',  'সদর, নোয়াখালী',       'মিরপুর, ঢাকা',    'মাদ্রাসা শিক্ষক',         'বেতনভুক্ত (হালাল যাচাইকৃত)',           20000, '১৫,০০০ - ২০,০০০ ৳', 'গরু', true, 99),
    ('ডাঃ জুবায়ের',  'সাহেব বাজার, রাজশাহী', 'ধানমন্ডি, ঢাকা', 'চিকিৎসক',                'প্রাইভেট প্র্যাকটিস (হালাল যাচাইকৃত)', 45000, '৪০,০০০ - ৪৫,০০০ ৳', 'গরু', true, 96),
    ('কামরুল ইসলাম', 'বরিশাল সদর',           'উত্তরা, ঢাকা',    'ব্যবসায়ী',                'হালাল ব্যবসা',                           30000, '২৫,০০০ - ৩০,০০০ ৳', 'গরু', true, 92);


-- ── haats ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.haats (
    id           UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
    name         TEXT          NOT NULL,
    area         TEXT          NOT NULL,
    district     TEXT          NOT NULL,
    lat          DOUBLE PRECISION NOT NULL,
    lng          DOUBLE PRECISION NOT NULL,
    days         INTEGER[]     NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
    open_time    TEXT          DEFAULT '06:00',
    close_time   TEXT          DEFAULT '21:00',
    animal_types TEXT[]        DEFAULT '{গরু}',
    description  TEXT,
    is_eid_special BOOLEAN     DEFAULT false,
    capacity     TEXT,
    phone        TEXT,
    is_active    BOOLEAN       DEFAULT true,
    created_at   TIMESTAMPTZ   DEFAULT now()
);

ALTER TABLE public.haats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "haats_public_read" ON public.haats
    FOR SELECT USING (is_active = true);

-- Seed data — major Bangladesh cattle markets
INSERT INTO public.haats (name, area, district, lat, lng, days, open_time, close_time, animal_types, description, is_eid_special, capacity)
VALUES
  ('গাবতলী পশুর হাট',         'গাবতলী, মিরপুর',       'ঢাকা',        23.7784, 90.3451, '{0,1,2,3,4,5,6}', '06:00', '22:00', '{গরু,ছাগল,উট,দুম্বা}',       'ঢাকার সবচেয়ে বড় এবং ঐতিহাসিক পশুর হাট।', true,  '৫০,০০০+ পশু'),
  ('আমিনবাজার পশু হাট',        'আমিনবাজার',             'ঢাকা',        23.7952, 90.3212, '{0,1,2,3,4,5,6}', '06:00', '21:00', '{গরু,ছাগল}',                  'ঢাকা-আরিচা মহাসড়কের পাশে বৃহৎ পশুর হাট।',  true,  '৩০,০০০+ পশু'),
  ('উত্তরা পশু হাট',            'আব্দুল্লাহপুর, উত্তরা', 'ঢাকা',        23.8749, 90.3521, '{0,1,2,3,4,5,6}', '07:00', '20:00', '{গরু,ছাগল}',                  'উত্তরা ও মিরপুরবাসীর জন্য সুবিধাজনক হাট।', true,  NULL),
  ('কদমতলী পশু হাট',           'কদমতলী',                'ঢাকা',        23.7127, 90.4387, '{0,1,2,3,4,5,6}', '06:00', '21:00', '{গরু,ছাগল,দুম্বা}',           'পুরান ঢাকার বাসিন্দাদের জন্য কেন্দ্রীয় হাট।', true,  NULL),
  ('সাভার পশু হাট',             'সাভার বাজার',           'সাভার, ঢাকা', 23.8566, 90.2582, '{0,3,6}',          '06:00', '18:00', '{গরু,ছাগল,মহিষ}',             'সাভার শিল্পাঞ্চলের কাছের প্রধান পশুর হাট।',  true,  NULL),
  ('টোঙ্গী পশু হাট',            'টোঙ্গী',                'গাজীপুর',     23.9056, 90.4006, '{1,4}',            '06:00', '19:00', '{গরু,ছাগল}',                  'গাজীপুর জেলার অন্যতম বড় পশুর হাট।',        true,  NULL),
  ('কাঁচপুর পশু হাট',           'কাঁচপুর',               'নারায়ণগঞ্জ', 23.6962, 90.5061, '{2,5}',            '06:00', '20:00', '{গরু,ছাগল,উট}',               'নারায়ণগঞ্জ জেলার বৃহত্তম পশুর হাট।',        true,  NULL),
  ('বহদ্দারহাট পশু বাজার',     'বহদ্দারহাট',            'চট্টগ্রাম',   22.3439, 91.8036, '{0,1,2,3,4,5,6}', '06:00', '21:00', '{গরু,ছাগল,উট,দুম্বা}',       'চট্টগ্রামের সবচেয়ে বড় পশুর হাট।',         true,  '২০,০০০+ পশু'),
  ('কুমিল্লা পশু হাট',          'কুমিল্লা শহর',          'কুমিল্লা',    23.4607, 91.1809, '{2,6}',            '06:00', '19:00', '{গরু,ছাগল}',                  'কুমিল্লা জেলার প্রধান পশুর হাট।',           true,  NULL),
  ('শুলকবহর পশু হাট',          'শুলকবহর',               'সিলেট',       24.8961, 91.8679, '{0,4}',            '06:00', '20:00', '{গরু,ছাগল,দুম্বা}',           'সিলেট শহরের কেন্দ্রীয় পশুর হাট।',           true,  NULL),
  ('উপশহর পশু হাট',            'উপশহর',                 'রাজশাহী',     24.3733, 88.6247, '{1,5}',            '06:00', '18:00', '{গরু,ছাগল,মহিষ}',             'রাজশাহী শহরের বৃহত্তম পশুর হাট।',           true,  NULL),
  ('মাহিগঞ্জ পশু হাট',         'মাহিগঞ্জ',              'রংপুর',       25.7439, 89.2752, '{0,3}',            '06:00', '18:00', '{গরু,ছাগল,মহিষ}',             'উত্তরবঙ্গের অন্যতম বড় পশুর হাট।',          true,  NULL),
  ('সোনাডাঙ্গা পশু হাট',       'সোনাডাঙ্গা',            'খুলনা',       22.8456, 89.5403, '{1,4}',            '06:00', '19:00', '{গরু,ছাগল}',                  'খুলনা বিভাগের বৃহত্তম পশুর হাট।',           true,  NULL),
  ('ব্রহ্মপুত্র পশু হাট',       'ময়মনসিংহ সদর',          'ময়মনসিংহ',   24.7471, 90.4203, '{2,5}',            '06:00', '19:00', '{গরু,ছাগল,মহিষ}',             'ব্রহ্মপুত্র নদীর পাড়ে ঐতিহ্যবাহী পশুর হাট।', true,  NULL),
  ('বরিশাল পশু হাট',           'বন্দর রোড',             'বরিশাল',      22.7010, 90.3535, '{0,3,6}',          '06:00', '18:00', '{গরু,ছাগল}',                  'বরিশাল জেলার কেন্দ্রীয় পশুর হাট।',         false, NULL);
