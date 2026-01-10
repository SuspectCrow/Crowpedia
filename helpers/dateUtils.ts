export const getDaysRemaining = (targetDate: Date): number => {
  const today = new Date();
  // Reset time parts to compare only dates
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffTime = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

export const formatDate = (date: Date, showDayName: boolean = false): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  let formattedDate = `${day} ${month} ${year}`;

  if (showDayName) {
    const dayName = date.toLocaleString("en-GB", { weekday: "long" });
    formattedDate += ` ${dayName}`;
  }

  return formattedDate;
};
