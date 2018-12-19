import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import packageConfig from './package.json';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  })
];

module.exports = [
  {
    input: 'src/chart.js',
    plugins: plugins,
    output: {
      file: packageConfig.main,
      format: 'cjs'
    }
  },
  {
    input: 'src/chart.js',
    plugins: plugins,
    output: {
      file: packageConfig.module,
      format: 'esm'
    }
  },
  {
    input: 'src/chart.js',
    plugins: plugins.concat([
      uglify()
    ]),
    output: {
      name: 'PriceChart',
      file: 'dist/price-chart-umd.min.js',
      format: 'umd'
    }
  }
];
