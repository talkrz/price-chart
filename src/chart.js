import { initViewModel, getViewModel } from './viewModel';
import { initGeometry } from './geometry';
import {
  initEventListeners,
  addEventListener,
  removeEventListener,
  triggerEvent,
} from './events';
import crosshair from './elements/crosshair';
import scale from './elements/scale';
import scaleGrid from './elements/scaleGrid';
import price from './elements/price';
import volume from './elements/volume';
import defaultConfig from './view/defaultConfig';
import themes from './view/themes';

let quotes = [];
const chartView = {};
const cursor = [];

export function chartDefaultConfig() {
  return {...defaultConfig};
}

export function chartThemes() {
  return themes;
}

export function chartGetViewModel() {
  return getViewModel();
}

export function chartSetCursor(x, y) {
  cursor[0] = x * chartView.devicePixelRatio;
  cursor[1] = y * chartView.devicePixelRatio;
}

export function chartInit(
  data,
  canvasLayers,
  {
    width,
    height,
    devicePixelRatio,
    zoom,
    offset,
    config,
    theme,
  }
) {
  const maxDimension = 8192;
  if (width > maxDimension || height > maxDimension) {
    throw new Error(`Maximum chart dimensions exceeded: [${width}x${height}]`);
  }
  quotes = data;

  const min = 2;
  const max = 13;
  if (zoom < min) zoom = min;
  if (zoom > max) zoom = max;

  chartView.ctx = canvasLayers.base;
  chartView.crosshairCtx = canvasLayers.scale;
  chartView.width = width;
  chartView.height = height;
  chartView.devicePixelRatio = devicePixelRatio;
  chartView.style = theme;
  chartView.config = config;
  chartView.geometry = initGeometry(config.geometry, chartView.width, chartView.height, devicePixelRatio);
  chartView.chartType = config.chartType;
  chartView.stickLength = zoom * devicePixelRatio;
  chartView.stickMargin = chartView.config.stickMargin * devicePixelRatio;
  chartView.offset = offset;
  chartView.fontSize = chartView.config.fontSize * devicePixelRatio;
  chartView.locale = config.locale;

  initEventListeners();
}

export function chartDraw() {
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

  initViewModel(capacity, Math.round(chartView.offset), quotes, chartView.locale);

  // draw all the elements
  const viewModel = getViewModel();
  scaleGrid(chartView, viewModel.quotes, viewModel.priceLines, viewModel.timeLines);
  price(chartView, viewModel.quotes);

  if (chartView.geometry.boxVolume) {
    volume(chartView, viewModel.quotes);
  }
  chartDrawCrosshair();
}

export function chartDrawCrosshair() {
  if (!chartView.crosshairCtx) return;

  // clear drawing
  chartView.crosshairCtx.clearRect(
    0,
    0,
    chartView.width * chartView.devicePixelRatio,
    chartView.height * chartView.devicePixelRatio
  );

  const viewModel = getViewModel();
  scale(chartView, viewModel.quotes, viewModel.priceLines, viewModel.timeLines, viewModel.cursorData);
  const cursorData = crosshair(chartView, viewModel.quotes, viewModel.cursorData, cursor);

  if (viewModel.cursorData[0] !== cursorData[0] || viewModel.cursorData[1] !== cursorData[1]) {
    viewModel.cursorData = cursorData;
    triggerEvent('moveCursor', cursorData);
  }
}

export function chartAddEventListener(eventName, listener) {
  addEventListener(eventName, listener);
}

export function chartRemoveEventListener(eventName, listener) {
  removeEventListener(eventName, listener);
}
