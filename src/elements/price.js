import { toScreen } from '../coordinates';

export default function price(view, quotes) {
  const box = view.geometry.boxPrice.padding;
  const boxContent = view.geometry.boxPrice.content;

  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = quotes.data.length;
  const q = quotes.data;
  let prevC = q[0].o;
  for(let i = 0; i < quotesLength; ++i) {
    if (view.chartType === 'candlestick') {
      priceCandlestick(view.ctx, quotes, i, boxContent, view.stickLength, view.stickMargin, view.style);
    } else {
      priceLine(view.ctx, quotes, i, boxContent, view.stickLength, view.style);
    }


    prevC = q[i].c;
  }
}

function priceLine(ctx, quotes, i, boxContent, stickLength, style) {
  const xStart = boxContent[0] + i * stickLength;
  let xEnd = boxContent[0] + (i + 1) * stickLength;
  const q = quotes.data;
  const c = q[i].c;
  const prevC = i === 0 ? q[i].o : q[i - 1].c;

  ctx.strokeStyle = style.colorLine;
  ctx.beginPath();
  ctx.moveTo(
    xStart,
    toScreen(prevC, boxContent[3], quotes.min, quotes.max) + boxContent[1]
  );
  ctx.lineTo(
    xEnd,
    toScreen(c, boxContent[3], quotes.min, quotes.max) + boxContent[1]
  );
  ctx.stroke();
}

function priceCandlestick(ctx, quotes, i, boxContent, stickLength, stickMargin, style) {
  const xStart = boxContent[0] + i * stickLength + stickMargin;
  let xEnd = boxContent[0] + (i + 1) * stickLength - stickMargin;
  if (xEnd < xStart) {
    xEnd = xStart;
  }

  const q = quotes.data;

  const o = q[i].o;
  const h = q[i].h;
  const l = q[i].l;
  const c = q[i].c;

  let borderColor, fillColor;
  if (o <= c) {
    borderColor = style.colorBullBorder;
    fillColor = style.colorBull;
  } else {
    borderColor = style.colorBearBorder;
    fillColor = style.colorBear;
  }

  candlestick(
    ctx,
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

export function candlestick(ctx, o, h, l, c, xStart, xEnd, fillColor, borderColor) {
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
