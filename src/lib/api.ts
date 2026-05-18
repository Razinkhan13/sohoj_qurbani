import { supabase } from './supabase';
import { MOCK_PARTNERS } from './mockData';
import { HAATS } from './haatData';
import type { Haat, Partner } from '../types';

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
        console.error('Supabase fetchPartners error — using mock data', err);
      }
    }
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_PARTNERS.filter(
      (p) =>
        !filter ||
        p.area.includes(filter) ||
        p.presentAddress.includes(filter),
    );
  },

  async fetchHaats(): Promise<Haat[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('haats')
          .select('*')
          .eq('is_active', true);
        if (!error && data && data.length > 0) {
          // Map snake_case DB columns → camelCase TypeScript interface
          return data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            name: row.name as string,
            area: row.area as string,
            district: row.district as string,
            lat: row.lat as number,
            lng: row.lng as number,
            days: row.days as number[],
            openTime: row.open_time as string,
            closeTime: row.close_time as string,
            animalTypes: row.animal_types as string[],
            description: (row.description as string) ?? '',
            isEidSpecial: (row.is_eid_special as boolean) ?? false,
            capacity: row.capacity as string | undefined,
            phone: row.phone as string | undefined,
          }));
        }
      } catch (err) {
        console.error('Supabase fetchHaats error — using local data', err);
      }
    }
    return HAATS;
  },

  async sendRequest(_id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 900));
    return { success: true };
  },
};
