import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom --text-* sizes from style.css; without this twMerge treats them as colors and drops text-text-* classes.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["body", "body-large", "body-small", "h1", "h2", "h4", "h5", "h6"],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
