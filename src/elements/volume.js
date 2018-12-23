import { toScreen } from '../coordinates';

export default function volume(view, quotes) {
  const box = view.geometry.boxVolume.padding;
  const boxContent = view.geometry.boxVolume.content;
  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = quotes.data.length;

  for(let i = 0; i < quotesLength; ++i) {
    if (view.chartType === 'candlestick') {
      volumeBars(view.ctx, quotes, i, boxContent, view.stickLength, view.stickMargin, view.style);
    } else {
      volumeLines(view.ctx, quotes, i, boxContent, view.stickLength, view.stickMargin, view.style);
    }
  }
}

function volumeLines(ctx, quotes, i, boxContent, stickLength, stickMargin, style) {
  const xStart = boxContent[0] + i * stickLength + stickLength / 2;


  ctx.strokeStyle = style.colorLine;
  ctx.beginPath();
  ctx.moveTo(
    xStart,
    toScreen(0, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
  );
  ctx.lineTo(
    xStart,
    toScreen(quotes.data[i].volume, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
  );
  ctx.stroke();

}

function volumeBars(ctx, quotes, i, boxContent, stickLength, stickMargin, style) {
  const xStart = boxContent[0] + i * stickLength + stickMargin;
  let  xEnd = boxContent[0] + (i + 1) * stickLength - stickMargin;
  if (xEnd < xStart) {
    xEnd = xStart;
  }

  let borderColor, fillColor;
  if (quotes.data[i].o <= quotes.data[i].c) {
    borderColor = style.colorBullBorder;
    fillColor = style.colorBull;
  } else {
    borderColor = style.colorBearBorder;
    fillColor = style.colorBear;
  }

  drawVolumeBar(
    ctx,
    toScreen(0, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
    toScreen(quotes.data[i].volume, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
    xStart,
    xEnd,
    fillColor,
    borderColor,
  )
}

function drawVolumeBar(ctx, o, c, xStart, xEnd, fillColor, borderColor) {
  let width = xEnd - xStart;
  if (width % 2) {
    width += 1;
  }

  const boxStick = [
    xStart,
    o,
    (xEnd - xStart),
    (c - o)
  ];

  ctx.strokeStyle = borderColor;
  ctx.fillStyle = fillColor;

  if (width >= 2) {
    ctx.fillRect(...boxStick);
    ctx.strokeRect(...boxStick);
  } else {
    ctx.beginPath();
    ctx.moveTo(
      boxStick[0] + boxStick[2] / 2,
      o
    );
    ctx.lineTo(
      boxStick[0] + boxStick[2] / 2,
      c
    );
    ctx.stroke();
  }
}
