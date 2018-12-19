let quotes = null;

/**
 * Price data model
 */
const initialData = {
  /**
   * An array of price data series in following format:
   * {symbol, o, h, l, c, date, volume}
   */
  data: null,
  /**
   * Minimum and maximum values
   */
  min: 1000000.0,
  max: 0.0,
  range: 0.0,
  minVolume: 1000000.0,
  maxVolume: 0.0,
  rangeVolume: 0.0,
  /**
   * Last change (open price - close price)
   */
  lastChange: 0.0,
  /**
   * Some extra data calculated from 'data' field
   */
  plugins: {
  }
}

export function quotesInit(quotesData) {
  quotes = { ...initialData };
  quotes.data = quotesData;

  for(let quote of quotesData) {
    if (quote.h > quotes.max) quotes.max = quote.h;
    if (quote.l < quotes.min) quotes.min = quote.l;
    if (quote.volume > quotes.maxVolume) quotes.maxVolume = quote.volume;
    if (quote.volume < quotes.minVolume) quotes.minVolume = quote.volume;
  }

  quotes.range = quotes.max - quotes.min;
  quotes.rangeVolume = quotes.maxVolume - quotes.minVolume;

  quotes.lastChange =
    (quotesData[quotesData.length - 1].c - quotesData[quotesData.length - 2].c)
    / quotesData[quotesData.length - 2].c;

  quotes.lastChange = Math.round(quotes.lastChange * 10000) / 100;

  quotes.plugins.dailyChange = pluginInitDailyChange(quotes.data);
  quotes.plugins.variance = pluginInitVariance(quotes.data);

  return quotes;
}

function pluginInitDailyChange(quotes) {
  const data = {
    min: 1000000.0,
    max: 0,
    avg: 0,
    minDate: null,
    maxDate: null,
    histogram: [],
  }

  let prevQuote = null;
  for(let quote of quotes) {
    const prevClose = prevQuote ? prevQuote.c : quote.o;
    const change = (quote.c - prevClose)/prevClose;
    data.avg += Math.abs(change);
    if (data.min > change) {
      data.min = change;
      data.minDate = quote.date;
    }
    if (data.max < change) {
      data.max = change;
      data.maxDate = quote.date;
    }
    data.histogram.push(change);

    prevQuote = quote;
  }

  data.avg = Math.round(data.avg / quotes.length * 10000) / 100;
  data.min = Math.round(data.min * 10000) / 100;
  data.max = Math.round(data.max * 10000) / 100;

  data.histogram.sort(function (a, b) { return a-b; });

  return data;
}

function pluginInitVariance(quotes) {
  function calculateVariance(quote, prevQuote) {
    const prevClose = prevQuote ? prevQuote.c : quote.o;

    const diff1 = Math.abs(prevClose - quote.h);
    const diff2 = Math.abs(prevClose - quote.l);
    return Math.max(diff1, diff2);
  }

  const data = {
    min: 1000000.0,
    max: 0,
    avg: 0,
    minDate: null,
    maxDate: null,
  }

  let prevQuote = null;
  for(let quote of quotes) {
    let variance = calculateVariance(quote, prevQuote);
    data.avg += variance;
    if (data.min > variance) {
      data.min = variance;
      data.minDate = quote.date;
    }
    if (data.max < variance) {
      data.max = variance;
      data.maxDate = quote.date;
    }

    prevQuote = quote;
  }

  data.avg = Math.round(data.avg / quotes.length * 100) / 100;
  data.min = Math.round(data.min * 100) / 100;
  data.max = Math.round(data.max * 100) / 100;

  return data;
}
