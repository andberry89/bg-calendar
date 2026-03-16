export const getCurrentDate = () => {
  const today = new Date();

  return {
    month: today.getMonth(),
    year: today.getFullYear()
  };
};
