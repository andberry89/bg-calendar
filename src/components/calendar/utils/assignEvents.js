const assignEvents = (arr, currentMonth, currentMonthDays) => {
  let updatedEvents = Array.from({ length: currentMonthDays }, () => []);
  arr.forEach((e) => {
    const start = e.start.split("-");
    const end = e.end.split("-");
    const startMonth = parseInt(start[1]);
    const endMonth = parseInt(end[1]);
    let startIdx = parseInt(start[2]) - 1;
    let endIdx = parseInt(end[2]) - 1;
    // Need to check if the event is contained in the current month, or if it's
    // overlapping with another month
    const sameMonth = start[1] === end[1];
    /*
          Need to account for two scenarios:
          1. The event started in the month prior
          2. The event extends into the next month
        */

    if (!sameMonth) {
      const eventStartedBeforeThisMonth = startMonth < currentMonth + 1;
      const eventExtendsBeyondThisMonth = currentMonth + 1 < endMonth;

      if (eventStartedBeforeThisMonth) startIdx = 0;
      if (eventExtendsBeyondThisMonth) endIdx = currentMonthDays - 1;
    }

    for (let i = startIdx; i < endIdx + 1; i++) {
      updatedEvents[i].push(e);
    }
  });

  return updatedEvents;
};

export default assignEvents;
