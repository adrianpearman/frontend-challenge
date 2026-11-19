// Local-time YYYY-MM-DD; toISOString() is UTC and shifts the day/month near midnight.
export const toLocalDate = (date: Date = new Date()) =>
  date.toLocaleDateString("en-CA");

export const toLocalMonth = (date: Date = new Date()) =>
  toLocalDate(date).slice(0, 7);

export const addDays = (days: number, from: Date = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
};
