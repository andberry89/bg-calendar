export const getPrevMonthDays = (currentDate) => {
  const year = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year;
  const month = currentDate.month === 0 ? 12 : currentDate.month;

  return new Date(year, month, 0).getDate();
};

export const getCurrentMonthDays = (currentDate) => {
  return new Date(currentDate.year, currentDate.month + 1, 0).getDate();
};
