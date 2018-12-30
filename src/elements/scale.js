import {
  relativeFontSize,
} from '../chartTools';

import {
  toScreen,
} from '../coordinates';

export default function scale(view, quotes, priceLines, timeLines, cursorData) {
  const priceBox = view.geometry.boxPrice.padding;

  drawPriceScale(view.crosshairCtx, priceLines, quotes, view, cursorData);
  drawTimeScale(view.crosshairCtx, priceBox, timeLines, view);
}


function drawPriceScale(ctx, scaleValues, quotes, chartView, cursorData) {
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
      priceBox[0] + priceBox[2] + chartView.config.padding,
      screenY
    );
    ctx.stroke();

    let atCursor = false;
    if (cursorData) {
      const cursorY = toScreen(cursorData[1], priceBoxContent[3], quotes.min, quotes.max);
      if (cursorY > (screenY - 2 * fontSize) && cursorY < screenY) {
        atCursor = true;
      }
    }

    if (!atCursor) {
      ctx.fillStyle = style.colorScale;
      ctx.font = `${fontSize}px "Arial"`;
      ctx.fillText(
        scaleValue,
        priceBox[0] + priceBox[2] + chartView.config.padding * 2,
        screenY + fontSize / 3
      );
    }
  }
}

function drawTimeScale(ctx, boxPrice, scaleValues, chartView) {
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize);
  let previousLabelX = Number.MAX_SAFE_INTEGER;
  for(let i = scaleValues.length - 1; i > 0; --i) {
    let verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;

    ctx.fillStyle = style.colorScale;
    ctx.font = `${fontSize}px "Arial"`;

    const labelWidth = ctx.measureText(verticalLine[1]).width;

    // prevent drawing labels on top each other
    if (drawingStickBegin + labelWidth < previousLabelX) {
      ctx.fillText(
        verticalLine[1],
        drawingStickBegin,
        boxPrice[0] + boxPrice[3] + fontSize
      );
    }

    previousLabelX = drawingStickBegin;

  }
}
