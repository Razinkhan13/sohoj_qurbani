export interface Partner {
  id: string;
  name: string;
  area: string;
  presentAddress: string;
  profession: string;
  incomeSource: string;
  budget: number;
  budgetStr: string;
  animal: string;
  isHalalCertified: boolean;
  trustScore: number;
}

export type AuthMethod = 'email' | 'whatsapp';
