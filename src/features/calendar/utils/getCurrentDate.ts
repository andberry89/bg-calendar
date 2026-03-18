import type { CurrentDate } from '@/types/calendar';

export const getCurrentDate = (): CurrentDate => {
  const today = new Date();

  return {
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  };
};
