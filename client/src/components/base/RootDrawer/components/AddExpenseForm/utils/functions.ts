export const splitTags = (v: string) =>
  v
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
