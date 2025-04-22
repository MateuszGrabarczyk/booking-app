import { useState, useMemo } from "react";

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 0);
  return end;
};

export const useWeekDateRange = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateRange = useMemo(
    () => ({
      startDate: getStartOfWeek(currentDate).toISOString(),
      endDate: getEndOfWeek(currentDate).toISOString(),
    }),
    [currentDate]
  );

  return { currentDate, setCurrentDate, dateRange };
};
