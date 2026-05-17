-- Create the partners table in your Supabase project (SQL Editor)

CREATE TABLE public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    "presentAddress" TEXT NOT NULL,
    profession TEXT NOT NULL,
    "incomeSource" TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    "budgetStr" TEXT NOT NULL,
    animal TEXT DEFAULT 'গরু' NOT NULL,
    "isHalalCertified" BOOLEAN DEFAULT true NOT NULL,
    "trustScore" INTEGER NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to partners
CREATE POLICY "Allow public read access" ON public.partners
    FOR SELECT USING (true);

-- Optionally add an insert policy if users are going to add themselves 
-- CREATE POLICY "Allow authenticated users to insert" ON public.partners FOR INSERT TO authenticated WITH CHECK (true);

-- Insert dummy data
INSERT INTO public.partners (name, area, "presentAddress", profession, "incomeSource", budget, "budgetStr", animal, "isHalalCertified", "trustScore")
VALUES 
    ('মাহমুদ হাসান', 'ধানমন্ডি, ঢাকা', 'ধানমন্ডি, ঢাকা', 'সফটওয়্যার ইঞ্জিনিয়ার', 'বেতনভুক্ত (হালাল যাচাইকৃত)', 35000, '৩০,০০০ - ৩৫,০০০ ৳', 'গরু', true, 98),
    ('শরীফ আহমেদ', 'জৈন্তাপুর, সিলেট', 'উত্তরা, ঢাকা', 'সরকারি কর্মকর্তা', 'বেতনভুক্ত (হালাল যাচাইকৃত)', 28000, '২৫,০০০ - ২৮,০০০ ৳', 'গরু', true, 95),
    ('তারেক রহমান', 'সদর, নোয়াখালী', 'মিরপুর, ঢাকা', 'মাদ্রাসা শিক্ষক', 'বেতনভুক্ত (হালাল যাচাইকৃত)', 20000, '১৫,০০০ - ২০,০০০ ৳', 'গরু', true, 99),
    ('ডাঃ জুবায়ের', 'সাহেব বাজার, রাজশাহী', 'ধানমন্ডি, ঢাকা', 'চিকিৎসক', 'প্রাইভেট প্র্যাকটিস (হালাল যাচাইকৃত)', 45000, '৪০,০০০ - ৪৫,০০০ ৳', 'গরু', true, 96),
    ('কামরুল ইসলাম', 'বরিশাল সদর', 'উত্তরা, ঢাকা', 'ব্যবসায়ী', 'হালাল ব্যবসা', 30000, '২৫,০০০ - ৩০,০০০ ৳', 'গরু', true, 92);
