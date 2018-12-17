import { inside, relativeFontSize, formatPrice } from '../chartTools';
import { fromScreen } from '../coordinates';
import { triggerEvent } from '../events';

export default function crosshair(view, viewModel, cursor) {
  const [x, y] = cursor;

  const boxPricePadding = view.geometry.boxPrice.padding;
  const boxVolumePadding = view.geometry.boxVolume.padding;

  const insidePrice = inside(cursor, boxPricePadding);
  const insideVolume = inside(cursor, boxVolumePadding)
  if (!insidePrice && !insideVolume) return;

  setCursorData(view, viewModel, cursor);

  drawCrosshair(view.crosshairCtx, x, y, boxPricePadding, boxVolumePadding, view, viewModel);
}

function setCursorData(view, viewModel, cursor) {
  const [x, y] = cursor;
  const boxPrice = view.geometry.boxPrice.content;
  const boxVolume = view.geometry.boxVolume.content;
  const boxPricePadding = view.geometry.boxPrice.padding;

  const insidePrice = inside(cursor, boxPricePadding);
  let yValue;
  if (insidePrice) {
    yValue = fromScreen(y - boxPrice[1], boxPrice[3], viewModel.quotes.min, viewModel.quotes.max);
  } else {
    yValue = fromScreen(y - boxVolume[1], boxVolume[3], 0, viewModel.quotes.maxVolume);
  }

  const stickNumber = Math.round(
    (x - boxPrice[0]) / (view.stickLength)
  );

  const xValue = viewModel.quotes.data[stickNumber] ? viewModel.quotes.data[stickNumber] : null;

  const eventData = [
    xValue,
    yValue,
  ];
  viewModel.cursorData = eventData;
  triggerEvent('moveCursor', eventData);
}

function drawCrosshair(ctx, x, y, boxPrice, boxVolume, chartView, viewModel) {
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  const style = chartView.style;
  ctx.strokeStyle = style.colorCrosshair;
  ctx.beginPath();
  ctx.moveTo(x, boxPrice[1]);
  ctx.lineTo(x, boxVolume[1] + boxVolume[3]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(boxPrice[0], y);
  ctx.lineTo(boxPrice[0] + boxPrice[2],y);
  ctx.stroke();

  ctx.font = `${fontSize}px "Arial"`;

  let yValue = viewModel.cursorData[1];

  const text = formatPrice(yValue);

  ctx.fillStyle = style.colorScale;
  ctx.fillText(
    text,
    boxPrice[0] + boxPrice[2] + chartView.style.padding * 2,
    y + fontSize / 3
  );
}
