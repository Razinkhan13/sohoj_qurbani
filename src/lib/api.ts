import { supabase } from './supabase';
import { MOCK_PARTNERS } from './mockData';
import type { Partner } from '../types';

const escapeForOr = (s: string) => s.replace(/[,()*]/g, ' ').trim();

export const api = {
  async fetchPartners(filter = ''): Promise<Partner[]> {
    if (supabase) {
      try {
        let query = supabase.from('partners').select('*');
        const safe = escapeForOr(filter);
        if (safe) {
          query = query.or(`area.ilike.%${safe}%,presentAddress.ilike.%${safe}%`);
        }
        const { data, error } = await query;
        if (!error && data) return data as Partner[];
      } catch (err) {
        console.error('Supabase fetch error, falling back to mock data', err);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_PARTNERS.filter(
      (p) =>
        !filter ||
        p.area.includes(filter) ||
        p.presentAddress.includes(filter),
    );
  },

  async sendRequest(_id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true };
  },
};
