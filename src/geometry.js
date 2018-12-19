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

export function makeBox(viewportWidth, viewportHeight, boxConfig, devicePixelRatio) {
  const marginT = boxConfig.margin[0] * devicePixelRatio;
  const marginR = boxConfig.margin[1] * devicePixelRatio;
  const marginB = boxConfig.margin[2] * devicePixelRatio;
  const marginL = boxConfig.margin[3] * devicePixelRatio;

  const boxTop = marginT + viewportHeight * boxConfig.top * devicePixelRatio;
  const boxLeft = marginL;
  const boxWidth = viewportWidth * devicePixelRatio - marginL - marginR;
  const boxHeight = viewportHeight * boxConfig.height * devicePixelRatio - marginT - marginB;

  const padding = boxConfig.padding * devicePixelRatio;

  const box = {};

  box.padding = [
    Math.round(boxLeft) + 0.5,
    Math.round(boxTop) + 0.5,
    Math.round(boxWidth),
    Math.round(boxHeight),
  ];

  box.content = [
    Math.round(boxLeft + padding) + 0.5,
    Math.round(boxTop + padding) + 0.5,
    Math.round(boxWidth - padding * 2),
    Math.round(boxHeight - padding * 2)
  ];

  return box;
}

export function initGeometry(geometryConfig, width, height, devicePixelRatio) {
  geometry.boxPrice = makeBox(width, height, geometryConfig.boxPrice, devicePixelRatio);
  geometry.boxVolume = makeBox(width, height, geometryConfig.boxVolume, devicePixelRatio);
  return geometry;
}
