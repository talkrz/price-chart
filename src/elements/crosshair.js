import { inside, screenToPrice } from '../chartTools';

export default function crosshair(view, viewModel, cursor) {
  const [x, y] = cursor;

  const boxPricePadding = view.geometry.boxPrice.padding;
  const boxVolumePadding = view.geometry.boxVolume.padding;
  const boxPrice = view.geometry.boxPrice.content;
  const boxVolume = view.geometry.boxVolume.content;

  const insidePrice = inside(cursor, boxPricePadding);
  const insideVolume = inside(cursor, boxVolumePadding)
  if (!insidePrice && !insideVolume) return;

  let xValue;
  if (insidePrice) {
    xValue = screenToPrice(y - boxPrice[1], boxPrice[3], viewModel.priceMin, viewModel.priceRange);
  } else {
    xValue = screenToPrice(y - boxVolume[1], boxVolume[3], 0, viewModel.volumeMax);
  }

  drawCrosshair(view.crosshairCtx, x, y, xValue, boxPricePadding, boxVolumePadding, view);
}

function drawCrosshair(ctx, x, y, xValue, boxPrice, boxVolume, chartView) {
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

  ctx.font = `${chartView.fontSize}px "Arial"`;

  let unit = '';

  if (xValue > 9999999) {
    xValue /= 1000000;
    unit = 'M';
  } else if (xValue > 9999) {
    xValue /= 1000;
    unit = 'K';
  }

  xValue = Math.round(xValue * 10) / 10;
  const text = xValue + unit;
  ctx.fillStyle = style.colorBackground;
  ctx.fillRect(
    boxPrice[0] + boxPrice[2] + chartView.geometry.padding * 2,
    y - chartView.fontSize,
    ctx.measureText(text).width,
    chartView.fontSize * 2
  );

  ctx.fillStyle = style.colorScale;
  ctx.fillText(
    text,
    boxPrice[0] + boxPrice[2] + chartView.geometry.padding * 2,
    y + chartView.fontSize / 3
  );
}
