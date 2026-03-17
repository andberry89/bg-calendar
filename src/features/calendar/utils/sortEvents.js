export const sortEvents = (events) => {
  let yearsWithEvents = events
    .map((e) => {
      const start = e.start.split('-')[0];
      const end = e.end.split('-')[0];
      if (start === end) return start;
      else return [start, end];
    })
    .flat();

  const uniqueYears = [...new Set(yearsWithEvents)];
  let sortedEvents = {};
  uniqueYears.forEach((year) => {
    const yearEvents = events.filter((e) => {
      const start = e.start.split('-')[0];
      const end = e.end.split('-')[0];
      return start === year || end === year;
    });

    sortedEvents[year] = yearEvents;
  });

  return sortedEvents;
};
