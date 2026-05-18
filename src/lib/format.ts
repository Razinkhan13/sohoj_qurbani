export const formatMoney = (amount: number | string): string => {
  const n = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat('bn-BD').format(n) + ' ৳';
};
