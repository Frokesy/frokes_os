export const dateKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const friendlyDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-NG", { weekday: "long", day: "numeric", month: "long" }).format(date);
