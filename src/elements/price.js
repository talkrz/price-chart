import { toScreen } from '../coordinates';

export default function price(view, quotes, viewModel) {
  const box = view.geometry.boxPrice.padding;
  const boxContent = view.geometry.boxPrice.content;

  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = quotes.data.length;
  const q = quotes.data;
  for(let i = 0; i < quotesLength; ++i) {
    const xStart = boxContent[0] + i * view.stickLength + view.stickMargin;
    let xEnd = boxContent[0] + (i + 1) * view.stickLength - view.stickMargin;
    if (xEnd < xStart) {
      xEnd = xStart;
    }

    const o = q[i].o;
    const h = q[i].h;
    const l = q[i].l;
    const c = q[i].c;

    drawPriceBar(
      view.ctx,
      toScreen(o, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(h, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(l, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(c, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      xStart,
      xEnd,
      (q[i].c < q[i].o),
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
