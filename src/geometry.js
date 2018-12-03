/**
 * Chart box model geometry
 */
const geometry = {
  boxPrice: {
    padding: {},
    content: {},
  },
  boxVolume: {
    padding: {},
    content: {},
  }
}

export function initGeometry(style, width, height, devicePixelRatio) {
  let marginTop = style.margin[0] * devicePixelRatio;
  let marginRight = (style.margin[1] + style.scaleWidth) * devicePixelRatio;
  let marginBottom = (style.margin[2] + height * (1 - style.candlestickHeight)) * devicePixelRatio;
  let marginLeft = style.margin[3] * devicePixelRatio;
  const padding = style.padding * devicePixelRatio;
  const viewportWidth = width * devicePixelRatio;
  const viewportHeight = height * devicePixelRatio;

  geometry.padding = padding;

  geometry.boxPrice.padding = [
    Math.round(marginLeft) + 0.5,
    Math.round(marginTop) + 0.5,
    Math.round(viewportWidth - marginLeft - marginRight),
    Math.round(viewportHeight - marginTop - marginBottom),
  ];

  geometry.boxPrice.content = [
    Math.round(marginLeft + padding) + 0.5,
    Math.round(marginTop + padding) + 0.5,
    Math.round(viewportWidth - marginLeft - marginRight - padding * 2),
    Math.round(viewportHeight - marginTop - marginBottom - padding * 2)
  ];

  marginTop = (style.margin[0] + height * style.candlestickHeight) * devicePixelRatio;
  marginRight = (style.margin[1] + style.scaleWidth) * devicePixelRatio;
  marginBottom = style.margin[2] * devicePixelRatio;
  marginLeft = style.margin[3] * devicePixelRatio;

  geometry.boxVolume.padding = [
    Math.round(marginLeft) + 0.5,
    Math.round(marginTop) + 0.5,
    Math.round(viewportWidth - marginLeft - marginRight),
    Math.round(viewportHeight - marginTop - marginBottom),
  ];

  geometry.boxVolume.content = [
    Math.round(marginLeft + padding) + 0.5,
    Math.round(marginTop + padding) + 0.5,
    Math.round(viewportWidth - marginLeft - marginRight - padding * 2),
    Math.round(viewportHeight - marginTop - marginBottom - padding * 2)
  ];

  return geometry;
}
