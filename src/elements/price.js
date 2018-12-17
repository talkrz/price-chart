import { toScreen } from '../coordinates';

export default function price(view, quotes) {
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

    let borderColor, fillColor;
    if (quotes.data[i].o <= quotes.data[i].c) {
      borderColor = view.style.colorBullBorder;
      fillColor = view.style.colorBull;
    } else {
      borderColor = view.style.colorBearBorder;
      fillColor = view.style.colorBear;
    }

    drawPriceBar(
      view.ctx,
      toScreen(o, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(h, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(l, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      toScreen(c, boxContent[3], quotes.min, quotes.max) + boxContent[1],
      xStart,
      xEnd,
      fillColor,
      borderColor,
    );
  }
}

function drawPriceBar(ctx, o, h, l, c, xStart, xEnd, fillColor, borderColor) {
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

  ctx.strokeStyle = borderColor;
  ctx.fillStyle = fillColor;

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
