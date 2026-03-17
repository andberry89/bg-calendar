export const getCurrentDate = () => {
  const today = new Date();

  return {
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  };
};
