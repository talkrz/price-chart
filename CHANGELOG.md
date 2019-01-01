# price-chart change log

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## v0.12.4
- Add some screenshots

## v0.12.3
- Fix cursor x position error, was offset by half the stick length

## v0.12.2
- Expose chart capacity (number of data points you can draw on) in the view
  model

## v0.12.1
- Show year in time scale when displaying months
- Fixed missing months in time scale bug (again)

## v0.12.0
- Changed config data structure and chart initialization arguments
- Fix missing months in time scale bug

## v0.11.2
- Possible to draw the chart without volume box
- Fixed bug in displaying time scale labels
- Add exception when invalid dimensions passed. Sometimes browser set
  big height value to the canvas and before the change counterintuitive
  NS_ERROR_FAILURE was thrown

## v0.11.1
- Fix dark theme line color
- Add CHANGELOG.md to release procedure

## v0.11.0
- Added line chart type

## v0.10.3
- Added usage example

## v0.10.2
- Fixed UMD bundle

## v0.10.1
- Added minified UMD and ES Modules bundles

## v0.10.0
- Simplified configuration (chartConfig function)
- Added default themes
