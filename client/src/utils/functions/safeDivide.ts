// Returns null instead of NaN/Infinity when the divisor is 0 or either value isn't a finite number.
export const safeDivide = (numerator?: number | null, denominator?: number | null) =>
  numerator == null ||
  denominator == null ||
  denominator === 0 ||
  !Number.isFinite(numerator) ||
  !Number.isFinite(denominator)
    ? null
    : numerator / denominator;
