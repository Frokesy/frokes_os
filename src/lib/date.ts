export const dateKey = (date = new Date(), timeZone = "Africa/Lagos") => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
};

export const friendlyDate = (date = new Date(), timeZone = "Africa/Lagos") =>
  new Intl.DateTimeFormat("en-NG", { timeZone, weekday: "long", day: "numeric", month: "long" }).format(date);

export const hourInTimeZone = (date = new Date(), timeZone = "Africa/Lagos") =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" }).format(date));

export const greetingForHour = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
