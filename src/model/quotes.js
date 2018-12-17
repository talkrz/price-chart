let quotes = null;

const initialData = {
  data: null,
  min: 1000000.0,
  max: 0.0,
  range: 0.0,
  minVolume: 1000000.0,
  maxVolume: 0.0,
  rangeVolume: 0.0,
  lastChange: 0.0,
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

  return quotes;
}
