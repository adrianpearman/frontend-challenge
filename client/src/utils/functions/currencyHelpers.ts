export const toCents = (v: string) => Math.round(Number(v) * 100);
export const toDollars = (minor: number) => (Math.abs(minor) / 100).toFixed(2);
export const toMinor = (dollars: string) => Math.round(Number(dollars) * 100);
