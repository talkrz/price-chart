import babel from 'rollup-plugin-babel';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  })
];

module.exports = {
  input: 'src/chart.js',
  plugins: plugins,
  output: {
    file: 'dist/price-chart.js',
    format: 'cjs'
  }
};
