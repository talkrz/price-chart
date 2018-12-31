import { quotesInit } from './model/quotes';
import {
  humanScalePrice,
  dateToTimeScale,
} from './chartTools';

/**
 * View model data structure
 * It is the data of current chart view
 */
const viewModel = {
  /**
   * Quotes model, contains all price data that is in current view
   */
  quotes: null,
  /**
   * Data user cursor points to
   */
  cursorData: null,
  /**
   * Values of the scale lines
   */
  priceLines: null,
  timeLines: null,
};

function preparePriceScale(min, max) {
  const humanScale = humanScalePrice(max - min);

  const scaleLines = [];
  for(let i = 0; i < max; i += humanScale) {
    if (i > min) {
      scaleLines.push(Math.round(i * 100) / 100);
    }
  }

  return scaleLines;
}

function prepareTimeScale(quotes, localeData) {
  const min = new Date(quotes[0].date).getTime();
  const max = new Date(quotes[quotes.length - 1].date).getTime();
  const diff = max - min;

  const yScaleLines = [];
  let verticalUnit = null;
  for(let i = 0; i < quotes.length; ++i) {
    const newVerticalUnit = dateToTimeScale(new Date(quotes[i].date), diff, localeData);
    if (newVerticalUnit !== verticalUnit) {
      yScaleLines.push([i, newVerticalUnit]);
    }
    verticalUnit = newVerticalUnit;
  }

  return yScaleLines;
}

/**
 * Chart view data model
 */
export function initViewModel(capacity, offset, quotes, locale) {
  const q = quotes.slice(
    -capacity + offset,
    Math.min(quotes.length, quotes.length + offset)
  );
  viewModel.quotes = quotesInit(q);
  viewModel.cursorData = [null, null];

  // scale grid lines
  const localeData = {
    monthNames: []
  };
  for(let month = 0; month < 12; ++month) {
    const date = new Date();
    date.setTime(0);
    date.setMonth(month);
    const monthName = date.toLocaleString(locale, {
      month: "short"
    });
    localeData.monthNames.push(monthName);

  }

  viewModel.capacity = capacity;
  viewModel.priceLines = preparePriceScale(viewModel.quotes.min, viewModel.quotes.max);
  viewModel.timeLines = prepareTimeScale(viewModel.quotes.data, localeData);
}

export function getViewModel() {
  return viewModel;
}
