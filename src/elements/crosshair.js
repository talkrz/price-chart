import { inside, relativeFontSize, formatPrice } from '../chartTools';
import { fromScreen } from '../coordinates';

export default function crosshair(view, quotes, cursorData, cursor) {
  const [x, y] = cursor;

  const boxPricePadding = view.geometry.boxPrice.padding;
  const boxVolumePadding = view.geometry.boxVolume ? view.geometry.boxVolume.padding : null;

  const insidePrice = inside(cursor, boxPricePadding);
  const insideVolume = boxVolumePadding ? inside(cursor, boxVolumePadding) : false;
  if (!insidePrice && !insideVolume) return [null, null];

  drawCrosshair(view.crosshairCtx, x, y, boxPricePadding, boxVolumePadding, view, cursorData);

  return getCursorData(view, cursor, quotes);
}

function getCursorData(view, cursor, quotes) {
  const [x, y] = cursor;
  const boxPrice = view.geometry.boxPrice.content;
  const boxVolume = view.geometry.boxVolume.content;
  const boxPricePadding = view.geometry.boxPrice.padding;

  const insidePrice = inside(cursor, boxPricePadding);
  let yValue;
  if (insidePrice) {
    yValue = fromScreen(y - boxPrice[1], boxPrice[3], quotes.min, quotes.max);
  } else {
    yValue = fromScreen(y - boxVolume[1], boxVolume[3], 0, quotes.maxVolume);
  }

  const stickNumber = Math.round(
    (x - view.stickLength / 2 - boxPrice[0]) / (view.stickLength)
  );

  const xValue = quotes.data[stickNumber] ? quotes.data[stickNumber] : null;

  const eventData = [
    xValue,
    yValue,
  ];

  return eventData;
}

function drawCrosshair(ctx, x, y, boxPrice, boxVolume, chartView, cursorData) {
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  const style = chartView.style;
  ctx.strokeStyle = style.colorCrosshair;
  ctx.beginPath();
  ctx.moveTo(x, boxPrice[1]);
  if (boxVolume) {
    ctx.lineTo(x, boxVolume[1] + boxVolume[3]);
  } else {
    ctx.lineTo(x, boxPrice[1] + boxPrice[3]);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(boxPrice[0], y);
  ctx.lineTo(boxPrice[0] + boxPrice[2],y);
  ctx.stroke();

  ctx.font = `${fontSize}px "Arial"`;

  let yValue = cursorData[1];

  const text = formatPrice(yValue);

  ctx.fillStyle = style.colorScale;
  ctx.fillText(
    text,
    boxPrice[0] + boxPrice[2] + chartView.config.padding * 2,
    y + fontSize / 3
  );
}
