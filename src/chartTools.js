/**
 * Calculate human-readable price scale matching prace range
 */
export function humanScalePrice(priceRange) {
  const ranges = [];
  for(let i = 1; i < 10; i++) {
    const powerOfTen = Math.pow(10, i);
    ranges.push(powerOfTen / 4 / 1000);
    ranges.push(powerOfTen / 2 / 1000);
    ranges.push(powerOfTen / 1000);
  }

  const scaleValue = priceRange / 8;
  let humanScaleDiff = 100000000;
  let humanScale = 0;
  for(let range of ranges) {
    const diff = Math.abs(scaleValue - range);
    if (humanScaleDiff > diff) {
      humanScaleDiff = diff;
      humanScale = range;
    }
  }
  return humanScale;
}

export function dateToTimeScale(date, rangeMilliseconds, locale) {
  const month = 2678400000;
  const year = 31536000000;

  let result;
  if (rangeMilliseconds > year) {
    result = date.getFullYear();
  } else if (rangeMilliseconds > month) {
    result = date.toLocaleString(locale, {
      month: "short"
    });
  } else {
    result = date.getDay() + ' ' + date.toLocaleString(locale, {
      month: "short"
    });
  }

  return result;
}

/**
 * Point inside box check
 */
export function inside(point, box) {
  return (
    point[1] > box[1] && point[1] < (box[1] + box[3]) &&
    point[0] > box[0] && point[0] < (box[0] + box[2])
  );
}

/**
 * Translate price to screen coordinate
 */
export function priceToScreen(value, height, min, range) {
  const ratio = height / range;
  return Math.round(height - (value - min) * ratio);
}

/**
 * Translate screen coordinate to price
 */
export function screenToPrice(value, height, min, range) {
  const ratio = height / range;
  return height / ratio + min - value / ratio;
}

export function relativeFontSize(width, height, maxSize) {
  const size = width / 30;
  return Math.min(maxSize, size);
}
