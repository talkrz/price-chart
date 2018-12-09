import { inside, relativeFontSize } from '../chartTools';
import { fromScreen } from '../coordinates';

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
    yValue = fromScreen(y - boxPrice[1], boxPrice[3], viewModel.priceMin, viewModel.priceMax);
  } else {
    yValue = fromScreen(y - boxVolume[1], boxVolume[3], 0, viewModel.volumeMax);
  }

  const stickNumber = Math.round(
    (x - boxPrice[0]) / (view.stickLength)
  );

  const xValue = viewModel.data[stickNumber] ? viewModel.data[stickNumber] : null;

  const eventData = [
    xValue,
    yValue,
  ];

  viewModel.cursorData = eventData;
  if (viewModel.onMove) {
    viewModel.onMove(eventData)
  }
}

function drawCrosshair(ctx, x, y, boxPrice, boxVolume, chartView, viewModel) {
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  const style = chartView.style;
  ctx.strokeStyle = style.colorCrosshair;
  ctx.beginPath();
  ctx.moveTo(x, boxPrice[1]);
  ctx.lineTo(x, boxPrice[1] + boxPrice[3]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, boxVolume[1]);
  ctx.lineTo(x, boxVolume[1] + boxVolume[3]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(boxPrice[0], y);
  ctx.lineTo(boxPrice[0] + boxPrice[2],y);
  ctx.stroke();

  ctx.font = `${fontSize}px "Arial"`;

  let yValue = viewModel.cursorData[1];
  let unit = '';

  if (yValue > 9999999) {
    yValue /= 1000000;
    unit = 'M';
  } else if (yValue > 9999) {
    yValue /= 1000;
    unit = 'K';
  }

  yValue = Math.round(yValue * 10) / 10;
  const text = yValue + unit;
  ctx.fillStyle = style.colorBackground;
  ctx.fillRect(
    boxPrice[0] + boxPrice[2] + chartView.style.padding * 2,
    y - fontSize,
    ctx.measureText(text).width,
    fontSize * 2
  );

  ctx.fillStyle = style.colorScale;
  ctx.fillText(
    text,
    boxPrice[0] + boxPrice[2] + chartView.style.padding * 2,
    y + fontSize / 3
  );
}
