# price-chart

Simple, zero-dependency, canvas-based library for drawing candlestick price charts

## Online demo
https://talkrz.github.io/price-chart-demo/

![Screenshot](docs/screenshot.png)


## Release new version

```
Update version in package.json
```
npm i
git add package.json package-lock.json
git commit -m "Release version v..."
git push origin master
git tag v...
git push origin --tags

npm run build
npm publish
```
