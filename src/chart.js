import { initViewModel, getViewModel } from './viewModel';
import { initGeometry } from './geometry';
import crosshair from './elements/crosshair';
import scale from './elements/scale';
import price from './elements/price';
import volume from './elements/volume';

let quotes = [];
const chartView = {};
const cursor = [];

export function getChartViewModel() {
  return getViewModel();
}

export function setCursorPosition(x, y) {
  cursor[0] = x * chartView.devicePixelRatio;
  cursor[1] = y * chartView.devicePixelRatio;
}

export function initChart(ctx, allQuotes, width, height, devicePixelRatio = 1.0, style, locale) {
  quotes = allQuotes;

  chartView.ctx = ctx;
  chartView.width = width;
  chartView.height = height;
  chartView.devicePixelRatio = devicePixelRatio;
  chartView.style = style;
  chartView.geometry = initGeometry(chartView.style, width, height, devicePixelRatio);
  chartView.stickLength = chartView.style.stickLength * devicePixelRatio;
  chartView.stickMargin = chartView.style.stickMargin * devicePixelRatio;
  chartView.fontSize = chartView.style.fontSize * devicePixelRatio;
  chartView.locale = locale;
}

export function drawChart() {
  if (!chartView.ctx) return;

  // clear drawing
  chartView.ctx.clearRect(
    0,
    0,
    chartView.width * chartView.devicePixelRatio,
    chartView.height * chartView.devicePixelRatio
  );

  // init current view model
  const width = chartView.geometry.boxPrice.content[2];
  const capacity = Math.floor(width / chartView.stickLength);
  initViewModel(capacity, quotes);

  // draw all the elements
  scale(chartView, getViewModel());
  price(chartView, getViewModel());
  volume(chartView, getViewModel());
  crosshair(chartView, getViewModel(), cursor);
}
