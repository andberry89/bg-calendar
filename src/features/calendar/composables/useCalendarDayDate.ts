import { computed, type Ref } from 'vue';
import type { CurrentDate } from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

type UseCalendarDayDateParams = {
  currentDate: Ref<CurrentDate>;
  date: Ref<number>;
  month: Ref<CalendarMonthOffset | undefined>;
};

export function useCalendarDayDate({ currentDate, date, month }: UseCalendarDayDateParams) {
  const displayDate = computed((): CurrentDate => {
    const { year, month: currentMonth } = currentDate.value;

    if (month.value === 'prev') {
      return currentMonth === 0
        ? { ...currentDate.value, year: year - 1, month: 11 }
        : { ...currentDate.value, month: currentMonth - 1 };
    }

    if (month.value === 'next') {
      return currentMonth === 11
        ? { ...currentDate.value, year: year + 1, month: 0 }
        : { ...currentDate.value, month: currentMonth + 1 };
    }

    return currentDate.value;
  });

  const getDay = computed((): number => {
    return new Date(displayDate.value.year, displayDate.value.month, date.value).getDay();
  });

  const isWeekend = computed((): boolean => {
    return getDay.value === 0 || getDay.value === 6;
  });

  return {
    displayDate,
    getDay,
    isWeekend
  };
}
