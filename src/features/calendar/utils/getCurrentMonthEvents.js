export const getCurrentMonthEvents = (sortedEvents, currentDate) => {
  const currentYearEvents = sortedEvents[currentDate.year];

  if (!currentYearEvents) {
    return [];
  }

  return currentYearEvents
    .filter((eventItem) => {
      const startMonth = Number(eventItem.start.split('-')[1]) - 1;
      const endMonth = Number(eventItem.end.split('-')[1]) - 1;

      return currentDate.month === startMonth || currentDate.month === endMonth;
    })
    .sort((a, b) => {
      return (
        new Date(a.start.replace(/-/g, '/').replace(/T.+/, '')) -
        new Date(b.start.replace(/-/g, '/').replace(/T.+/, ''))
      );
    });
};
