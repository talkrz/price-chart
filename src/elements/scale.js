import {
  relativeFontSize,
} from '../chartTools';

import {
  toScreen,
} from '../coordinates';

export default function scale(view, quotes, viewModel) {
  const priceBox = view.geometry.boxPrice.padding;

  drawPriceScale(view.crosshairCtx, viewModel.priceLines, quotes, view, viewModel);
  drawTimeScale(view.crosshairCtx, priceBox, viewModel.timeLines, view);
}


function drawPriceScale(ctx, scaleValues, quotes, chartView, viewModel) {
  const priceBox = chartView.geometry.boxPrice.padding;
  const priceBoxContent = chartView.geometry.boxPrice.content;
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  const ratio = priceBoxContent[3] / quotes.range;

  for(let scaleValue of scaleValues) {
    const screenY = priceBoxContent[0] + priceBoxContent[3] - (scaleValue - quotes.min) * ratio;

    ctx.strokeStyle = style.colorScale;
    ctx.beginPath();
    ctx.moveTo(
      priceBox[0] + priceBox[2],
      screenY
    );
    ctx.lineTo(
      priceBox[0] + priceBox[2] + chartView.style.padding,
      screenY
    );
    ctx.stroke();

    let atCursor = false;
    if (viewModel.cursorData) {
      const cursorY = toScreen(viewModel.cursorData[1], priceBoxContent[3], quotes.min, quotes.max);
      if (cursorY > (screenY - 2 * fontSize) && cursorY < screenY) {
        atCursor = true;
      }
    }

    if (!atCursor) {
      ctx.fillStyle = style.colorScale;
      ctx.font = `${fontSize}px "Arial"`;
      ctx.fillText(
        scaleValue,
        priceBox[0] + priceBox[2] + chartView.style.padding * 2,
        screenY + fontSize / 3
      );
    }
  }
}

function drawTimeScale(ctx, boxPrice, scaleValues, chartView) {
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  for(let i = 0; i < scaleValues.length; ++i) {
    let verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;

    ctx.fillStyle = style.colorScale;
    ctx.font = `${fontSize}px "Arial"`;
    ctx.fillText(
      verticalLine[1],
      drawingStickBegin,
      boxPrice[0] + boxPrice[3] + fontSize
    );
  }
}
