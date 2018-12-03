import { priceToScreen } from '../chartTools';

export default function volume(view, viewModel) {
  const box = view.geometry.boxVolume.padding;
  const boxContent = view.geometry.boxVolume.content;
  view.ctx.strokeStyle = view.style.colorBorder;
  view.ctx.strokeRect(...box);

  const quotesLength = viewModel.data.length;

  for(let i = 0; i < quotesLength; ++i) {
    const xStart = boxContent[0] + i * view.stickLength + view.stickMargin;
    let  xEnd = boxContent[0] + (i + 1) * view.stickLength - view.stickMargin;
    if (xEnd < xStart) {
      xEnd = xStart;
    }

    drawVolumeBar(
      view.ctx,
      priceToScreen(0, boxContent[3], 0, viewModel.volumeMax) + boxContent[1],
      priceToScreen(viewModel.data[i].volume, boxContent[3], 0, viewModel.volumeMax) + boxContent[1],
      xStart,
      xEnd,
      (viewModel.data[i].c < viewModel.data[i].o),
      view.style,
    )
  }
}

function drawVolumeBar(ctx, o, c, xStart, xEnd, bearBull, style) {
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

  if (!bearBull) {
    ctx.strokeStyle = style.colorBull;
    ctx.fillStyle = style.colorBackground;
  } else {
    ctx.strokeStyle = style.colorBear;
    ctx.fillStyle = style.colorBear;
  }

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
