/**
 * Translate price to screen coordinate
 */
export function toScreen(value, height, min, max) {
  const ratio = height / (max - min);
  return Math.round(height - (value - min) * ratio);
}

/**
 * Translate screen coordinate to price
 */
export function fromScreen(value, height, min, max) {
  const ratio = height / (max - min);
  return height / ratio + min - value / ratio;
}
