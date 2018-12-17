import { toScreen } from '../coordinates';

export default function volume(view, quotes, viewModel) {
  const box = view.geometry.boxVolume.padding;
  const boxContent = view.geometry.boxVolume.content;
  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = quotes.data.length;

  for(let i = 0; i < quotesLength; ++i) {
    const xStart = boxContent[0] + i * view.stickLength + view.stickMargin;
    let  xEnd = boxContent[0] + (i + 1) * view.stickLength - view.stickMargin;
    if (xEnd < xStart) {
      xEnd = xStart;
    }

    let borderColor, fillColor;
    if (quotes.data[i].o <= quotes.data[i].c) {
      borderColor = view.style.colorBullBorder;
      fillColor = view.style.colorBull;
    } else {
      borderColor = view.style.colorBearBorder;
      fillColor = view.style.colorBear;
    }

    drawVolumeBar(
      view.ctx,
      toScreen(0, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
      toScreen(quotes.data[i].volume, boxContent[3], 0, quotes.maxVolume) + boxContent[1],
      xStart,
      xEnd,
      fillColor,
      borderColor,
    )
  }
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
