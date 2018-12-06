import {
  humanScalePrice,
  dateToTimeScale,
  relativeFontSize,
} from '../chartTools';

export default function scale(view, viewModel) {
  const priceBox = view.geometry.boxPrice.padding;

  const boxVolume = view.geometry.boxVolume.padding;

  const priceLines = preparePriceScale(viewModel.priceMin, viewModel.priceMax);
  drawPriceScale(view.ctx, priceLines, viewModel.priceMin, viewModel.priceRange, view);

  const timeLines = prepareTimeScale(viewModel.data, view.locale);
  drawTimeScale(view.ctx, priceBox, boxVolume, timeLines, view);
}

function preparePriceScale(min, max) {
  const humanScale = humanScalePrice(max - min);

  const scaleLines = [];
  for(let i = 0; i < max; i += humanScale) {
    if (i > min) {
      scaleLines.push(Math.round(i * 100) / 100);
    }
  }

  return scaleLines;
}

function prepareTimeScale(quotes, locale) {
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

function drawPriceScale(ctx, scaleValues, priceMin, priceRange, chartView) {
  const priceBox = chartView.geometry.boxPrice.padding;
  const priceBoxContent = chartView.geometry.boxPrice.content;
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  const ratio = priceBoxContent[3] / priceRange;

  for(let scaleValue of scaleValues) {
    const screenY = chartView.geometry.padding + chartView.geometry.margin[0] + priceBoxContent[3] - (scaleValue - priceMin) * ratio;

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
    ctx.font = `${fontSize}px "Arial"`;
    ctx.fillText(
      scaleValue,
      priceBox[0] + priceBox[2] + chartView.geometry.padding * 2,
      screenY + fontSize / 3
    );
  }
}

function drawTimeScale(ctx, boxPrice, boxVolume, scaleValues, chartView) {
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
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
    ctx.font = `${fontSize}px "Arial"`;
    ctx.fillText(
      verticalLine[1],
      drawingStickBegin,
      boxPrice[0] + boxPrice[3] + fontSize
    );
  }
}
