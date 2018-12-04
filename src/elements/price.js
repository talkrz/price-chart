import { priceToScreen } from '../chartTools';

export default function price(view, viewModel) {
  const box = view.geometry.boxPrice.padding;
  const boxContent = view.geometry.boxPrice.content;

  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = viewModel.data.length;
  for(let i = 0; i < quotesLength; ++i) {
    const xStart = boxContent[0] + i * view.stickLength + view.stickMargin;
    let xEnd = boxContent[0] + (i + 1) * view.stickLength - view.stickMargin;
    if (xEnd < xStart) {
      xEnd = xStart;
    }

    const o = viewModel.data[i].o;
    const h = viewModel.data[i].h;
    const l = viewModel.data[i].l;
    const c = viewModel.data[i].c;

    drawPriceBar(
      view.ctx,
      priceToScreen(o, boxContent[3], viewModel.priceMin, viewModel.priceRange) + boxContent[1],
      priceToScreen(h, boxContent[3], viewModel.priceMin, viewModel.priceRange) + boxContent[1],
      priceToScreen(l, boxContent[3], viewModel.priceMin, viewModel.priceRange) + boxContent[1],
      priceToScreen(c, boxContent[3], viewModel.priceMin, viewModel.priceRange) + boxContent[1],
      xStart,
      xEnd,
      (viewModel.data[i].c < viewModel.data[i].o),
      view.style,
    );
  }
}

function drawPriceBar(ctx, o, h, l, c, xStart, xEnd, bearBull, style) {
  let width = xEnd - xStart;
  if (width % 2) {
    width += 1;
  }

  const boxStick = [
    xStart,
    o,
    width,
    c - o
  ];

  if (!bearBull) {
    ctx.strokeStyle = style.colorBullBorder;
    ctx.fillStyle = style.colorBull;
  } else {
    ctx.strokeStyle = style.colorBearBorder;
    ctx.fillStyle = style.colorBear;
  }

  ctx.beginPath();
  ctx.moveTo(
    boxStick[0] + boxStick[2] / 2,
    h
  );
  ctx.lineTo(
    boxStick[0] + boxStick[2] / 2,
    l
  );
  ctx.stroke();


  if (width >= 2) {
    ctx.fillRect(...boxStick);
    ctx.strokeRect(...boxStick);
  }

}
