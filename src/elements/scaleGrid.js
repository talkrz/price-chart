export default function scaleGrid(view, viewModel) {
  drawPriceScaleGrid(view.ctx, viewModel.priceLines, viewModel.priceMin, viewModel.priceRange, view);
  drawTimeScaleGrid(view.ctx, viewModel.timeLines, view);
}

function drawPriceScaleGrid(ctx, scaleValues, priceMin, priceRange, chartView) {
  const priceBox = chartView.geometry.boxPrice.padding;
  const priceBoxContent = chartView.geometry.boxPrice.content;
  const style = chartView.style;
  const ratio = priceBoxContent[3] / priceRange;

  for(let scaleValue of scaleValues) {
    const screenY = priceBoxContent[0] + priceBoxContent[3] - (scaleValue - priceMin) * ratio;

    ctx.strokeStyle = style.colorGrid;
    ctx.beginPath();
    ctx.moveTo(priceBox[0], screenY);
    ctx.lineTo(
      priceBox[0] + priceBox[2],
      screenY
    );
    ctx.stroke();
  }
}

function drawTimeScaleGrid(ctx, scaleValues, chartView) {
  const boxPrice = chartView.geometry.boxPrice.padding;
  const boxVolume = chartView.geometry.boxVolume.padding;

  const style = chartView.style;

  for(let i = 0; i < scaleValues.length; ++i) {
    let verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;
    ctx.beginPath();
    ctx.moveTo(drawingStickBegin, boxPrice[1]);
    ctx.lineTo(drawingStickBegin, boxVolume[1] + boxVolume[3]);
    ctx.stroke();
  }
}
