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

export function initChart(
  canvasLayers,
  allQuotes,
  width, height,
  devicePixelRatio = 1.0,
  zoom,
  offset,
  style,
  locale
) {
  quotes = allQuotes;

  const min = 2;
  const max = 13;
  if (zoom < min) zoom = min;
  if (zoom > max) zoom = max;

  chartView.ctx = canvasLayers.base;
  chartView.crosshairCtx = canvasLayers.crosshair;
  chartView.width = width;
  chartView.height = height;
  chartView.devicePixelRatio = devicePixelRatio;
  chartView.style = style;
  chartView.geometry = initGeometry(chartView.style, width, height, devicePixelRatio);
  chartView.stickLength = zoom * devicePixelRatio;
  chartView.stickMargin = chartView.style.stickMargin * devicePixelRatio;
  chartView.offset = offset;
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
  initViewModel(capacity, Math.round(chartView.offset), quotes);

  // draw all the elements
  scale(chartView, getViewModel());
  price(chartView, getViewModel());
  volume(chartView, getViewModel());
}

export function drawCrosshair() {
  if (!chartView.crosshairCtx) return;

  // clear drawing
  chartView.crosshairCtx.clearRect(
    0,
    0,
    chartView.width * chartView.devicePixelRatio,
    chartView.height * chartView.devicePixelRatio
  );

  crosshair(chartView, getViewModel(), cursor);
}
