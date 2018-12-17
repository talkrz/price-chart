import {
  humanScalePrice,
  dateToTimeScale,
} from './chartTools';

const viewModel = {};

function round(v, scale = 1) {
  return Math.round(v * 100 * scale) / 100;
}

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
  let priceMin = Number.MAX_SAFE_INTEGER;
  let priceMax = 0;
  let volumeMin = Number.MAX_SAFE_INTEGER;
  let volumeMax = 0;


  function calculateVariance(quote, prevQuote) {
    const prevClose = prevQuote ? prevQuote.c : quote.o;

    const diff1 = Math.abs(prevClose - quote.h);
    const diff2 = Math.abs(prevClose - quote.l);
    return Math.max(diff1, diff2);
  }

  let varianceMin = Number.MAX_SAFE_INTEGER;
  let varianceMax = 0;
  let varianceAvg = 0;
  let varianceMinDate = null;
  let varianceMaxDate = null;

  let changeMin = Number.MAX_SAFE_INTEGER;
  let changeMax = 0;
  let changeAvg = 0;
  let changeMinDate = null;
  let changeMaxDate = null;

  const histogram = [];

  let prevQuote = null;
  for(let quote of q) {
    if (quote.h > priceMax) priceMax = quote.h;
    if (quote.l < priceMin) priceMin = quote.l;
    if (quote.volume > volumeMax) volumeMax = quote.volume;
    if (quote.volume < volumeMin) volumeMin = quote.volume;

    let variance = calculateVariance(quote, prevQuote);
    varianceAvg += variance;
    if (varianceMin > variance) {
      varianceMin = variance;
      varianceMinDate = quote.date;
    }
    if (varianceMax < variance) {
      varianceMax = variance;
      varianceMaxDate = quote.date;
    }

    const prevClose = prevQuote ? prevQuote.c : quote.o;
    const change = (quote.c - prevClose)/prevClose;
    changeAvg += Math.abs(change);
    if (changeMin > change) {
      changeMin = change;
      changeMinDate = quote.date;
    }
    if (changeMax < change) {
      changeMax = change;
      changeMaxDate = quote.date;
    }
    histogram.push(change);

    prevQuote = quote;
  }

  histogram.sort(function (a, b) { return a-b; });

  viewModel.histogram = histogram.reverse();
  viewModel.varianceAvg = round(varianceAvg / q.length);
  viewModel.varianceMin = round(varianceMin);
  viewModel.varianceMax = round(varianceMax);
  viewModel.varianceMinDate = varianceMinDate;
  viewModel.varianceMaxDate = varianceMaxDate;
  viewModel.changeAvg = round(changeAvg / q.length, 100);
  viewModel.changeMin = round(changeMin, 100);
  viewModel.changeMax = round(changeMax, 100);
  viewModel.changeMinDate = changeMinDate;
  viewModel.changeMaxDate = changeMaxDate;
  viewModel.change = (q[q.length - 1].c - q[q.length - 2].c) / q[q.length - 2].c;
  viewModel.change = Math.round(viewModel.change * 10000) / 100;
  viewModel.data = q;
  viewModel.priceMin = priceMin;
  viewModel.priceMax = priceMax;
  viewModel.priceRange = priceMax - priceMin;
  viewModel.volumeMin = volumeMin;
  viewModel.volumeMax = volumeMax;

  // scale grid lines
  const localeData = {
    monthNames: []
  };
  for(let month = 0; month < 12; ++month) {
    const date = new Date();
    date.setMonth(month);
    const monthName = date.toLocaleString(locale, {
      month: "short"
    });
    localeData.monthNames.push(monthName);
  }
  viewModel.priceLines = preparePriceScale(viewModel.priceMin, viewModel.priceMax);
  viewModel.timeLines = prepareTimeScale(viewModel.data, localeData);
}

export function getViewModel() {
  return viewModel;
}
