# price-chart

Simple, zero-dependency, canvas-based library for drawing candlestick price charts

## Online demo
https://talkrz.github.io/price-chart-demo/

![Screenshot](docs/screenshot.png)


## Release new version

Update version in package.json
```
# Update package lock file
npm i

# Commit changes
git add package.json package-lock.json
git commit -m "Release version v..."
git push origin master

# Tag new version
git tag v...
git push origin --tags

# Build & publish
npm run build
npm publish
```
