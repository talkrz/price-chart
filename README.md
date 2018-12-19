# price-chart

Simple, lightweight, zero-dependency, canvas-based library for drawing candlestick price charts

## Online demo

This demo includes both React and vanilla JS examples:
https://talkrz.github.io/price-chart-demo/

![Screenshot](docs/screenshot.png)

## Usage

### Minimal example without user interactions

Include the library in your HTML document:
```html
<script src="https://unpkg.com/@talkrz/price-chart@latest/dist/price-chart-umd.min.js"></script>
```

Make canvas elements to draw the chart on:
```html
<div id="Root">
  <div id="ChartContent" class="Chart">
    <canvas id="ChartCanvasContent" class="Chart-canvas">
    </canvas>
    <canvas id="ChartCanvasScale" class="Chart-canvas-scale">
    </canvas>
  </div>
</div>
```

Position the canvas layers one on top the other:
```css
#Root {
  width: 100%;
  height: 100vh;
  display: flex;
}

.Chart {
  position: relative;
  flex-grow: 1;
}

.Chart-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.Chart-canvas-scale {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
```

Draw the chart:
```javascript
// get screen device pixel ratio
const devicePixelRatio = window.devicePixelRatio;

// create HTML elements references
const content = document.getElementById('ChartContent');
const base = document.getElementById('ChartCanvasContent');
const scale = document.getElementById('ChartCanvasScale');

// set chart dimensions
const width = content.offsetWidth;
const height = content.offsetHeight;

// define drawing layers, minimum 2 layers are required
// one for drawing price and volume
// and other for scale
const layers = {
  base: base.getContext("2d"),
  scale: scale.getContext("2d")
};

// set canvas elements dimensions
base.width = width * devicePixelRatio;
base.height = height * devicePixelRatio;
scale.width = width * devicePixelRatio;
scale.height = height * devicePixelRatio;

// prepare chart view
PriceChart.chartInit(
  layers,
  data,
  width,
  height,
  devicePixelRatio,
  8,
  0,
  PriceChart.chartThemes()['light'],
  'en',
);

// draw chart
PriceChart.chartDraw();
```

## Release new version

1. Update version in package.json
2. Run:
```
# This command will fail if tests don't pass
node ./scripts/release.js
```
3. Execute commands printed by it
