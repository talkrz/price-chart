import { humanScalePrice, dateToTimeScale } from '../chartTools';

export default function scale(view, viewModel) {
  const scaleLines = prepareXScale(viewModel.priceMin, viewModel.priceMax);

  const boxPricePadding = view.geometry.boxPrice.padding;

  drawYScale(view.ctx, boxPricePadding, scaleLines, viewModel.priceMin, viewModel.priceRange, view);

  const yLines = prepareYScale(viewModel.data, view.locale);

  const boxVolume = view.geometry.boxVolume.padding;

  drawXScale(view.ctx, boxPricePadding, boxVolume, yLines, view);
}

function prepareXScale(min, max) {
  const humanScale = humanScalePrice(max - min);

  const scaleLines = [];
  for(let i = 0; i < max; i += humanScale) {
    if (i > min) {
      scaleLines.push(Math.round(i * 100) / 100);
    }
  }

  return scaleLines;
}

function prepareYScale(quotes, locale) {
  const min = new Date(quotes[0].date).getTime();
  const max = new Date(quotes[quotes.length - 1].date).getTime();
  const diff = max - min;

  const yScaleLines = [];
  let verticalUnit = null;
  for(let i = 0; i < quotes.length; ++i) {
    const newVerticalUnit = dateToTimeScale(new Date(quotes[i].date), diff, locale);

    if (newVerticalUnit !== verticalUnit) {
      yScaleLines.push([i, newVerticalUnit]);
    }
    verticalUnit = newVerticalUnit;
  }

  return yScaleLines;
}

function drawYScale(ctx, priceBox, scaleValues, priceMin, priceRange, chartView) {
  const style = chartView.style;
  const ratio = priceBox[3] / priceRange;

  for(let scaleValue of scaleValues) {
    const screenY = chartView.geometry.padding + priceBox[3] - (scaleValue - priceMin) * ratio;

    ctx.strokeStyle = style.colorGrid;
    ctx.beginPath();
    ctx.moveTo(priceBox[0], screenY);
    ctx.lineTo(
      priceBox[0] + priceBox[2],
      screenY
    );
    ctx.stroke();

    ctx.strokeStyle = style.colorScale;
    ctx.beginPath();
    ctx.moveTo(
      priceBox[0] + priceBox[2],
      screenY
    );
    ctx.lineTo(
      priceBox[0] + priceBox[2] + chartView.geometry.padding,
      screenY
    );
    ctx.stroke();

    ctx.fillStyle = style.colorScale;
    ctx.font = `${chartView.fontSize}px "Arial"`;
    ctx.fillText(
      scaleValue,
      priceBox[0] + priceBox[2] + chartView.geometry.padding * 2,
      screenY + chartView.fontSize / 3
    );
  }
}

function drawXScale(ctx, boxPrice, boxVolume, scaleValues, chartView) {
  const style = chartView.style;
  for(let i = 0; i < scaleValues.length; ++i) {
    let verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;
    ctx.beginPath();
    ctx.moveTo(drawingStickBegin, boxPrice[1]);
    ctx.lineTo(drawingStickBegin, boxPrice[1] + boxPrice[3]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(drawingStickBegin, boxVolume[1]);
    ctx.lineTo(drawingStickBegin, boxVolume[1] + boxVolume[3]);
    ctx.stroke();

    ctx.fillStyle = style.colorScale;
    ctx.font = `${chartView.fontSize}px "Arial"`;
    ctx.fillText(
      verticalLine[1],
      drawingStickBegin,
      boxPrice[0] + boxPrice[3] + chartView.fontSize
    );
  }
}
