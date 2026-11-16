// Shifts a YYYY-MM month by `delta` months. Local date math so rollover (Jan -> Dec) is handled by Date.
export const shiftMonth = (month: string, delta: number) => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
