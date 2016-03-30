(function () {
  'use strict';

  /**
   * Makes body background color change based on defined colorPoints.
   * It also sets the provided classes so other elements may change accordingly.
   *
   * e.g.
   *
   * <body>
   *   <any
   *     data-color-point='255,0,0'
   *     data-color-point-classname='red'></any>
   *   <any
   *     data-color-point='0,0,255'
   *     data-color-point-classname='blue'></any>
   * </body>
   */
  
  var colorPoints = document.querySelectorAll('[data-color-point]');
  var colorOffsets = [];
  var colorClassNames = [];
  var colors = [];

  // there needs to be at least 2 color points.
  if (colorPoints.length < 2) { return; }

  // populate main variables
  for (var i = 0; i < colorPoints.length; i++) {
    var colorPoint = colorPoints[i];
    colorOffsets.push(_getOffset(colorPoint));
    colorClassNames.push(_getColorClassName(colorPoint));
    colors.push(_getColorObj(colorPoint));
  }

  // check if the data is set correctly
  if (colors.indexOf(false) > -1) {
    return false;
  }

  function update() {
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;

    // if before first color point. make it solid.
    if (scrollTop <= colorOffsets[0]) {
      body.style.backgroundColor = _colorToRgb(colors[0]);
      return;
    }

    // if after last color point. make it solid.
    if (scrollTop >= colorOffsets[colorOffsets.length - 1]) {
      body.style.backgroundColor = _colorToRgb(colors[colorOffsets.length - 1]);
      return;
    }

    // if between two points, blend them.
    for (var i = 0; i < colorOffsets.length - 1; i++) {
      if (scrollTop < colorOffsets[i + 1]) {
        console.log(scrollTop, colorOffsets[i], colorOffsets[i + 1]);
        var percentage = (scrollTop - colorOffsets[i]) / (colorOffsets[i + 1] - colorOffsets[i]);
        var blendedColor = _blendColors(colors[i], colors[i + 1], percentage);
        body.style.backgroundColor = _colorToRgb(blendedColor);
        break;
      }
    }
  }

  // check for updates
  window.addEventListener('scroll', update);

  /**
   * Utility functions
   */
  function _getOffset(element) {
    var box = element.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var top  = box.top +  scrollTop - clientTop;

    return Math.round(top);
  }

  function _getColorClassName(element) {
    return element.getAttribute('data-color-point-classname');
  }

  function _getColorObj(element) {
    
    var colorStr = element.getAttribute('data-color-point');
    if (!colorStr || !colorStr.length || !colorStr.match(/^\s*\d\d?\d?\s*,\s*\d\d?\d?\s*,\s*\d\d?\d?\s*$/)) {
      return false;
    } else {
      return colorStr.trim().split(',').map(function (c) {
        return parseInt(c.trim());
      });
    }
  }

  function _blendColors(color1, color2, _percentage) {
    var percentage = _percentage || 0.5;
    
    var rDiff = color1[0] - color2[0];
    var gDiff = color1[1] - color2[1];
    var bDiff = color1[2] - color2[2];
    
    var blendedR = Math.round(color1[0] - rDiff * percentage);
    var blendedG = Math.round(color1[1] - gDiff * percentage);
    var blendedB = Math.round(color1[2] - bDiff * percentage);
    
    return [blendedR, blendedG, blendedB];
  }

  function _colorToRgb(color) {
    return 'rgb(' + color.join(',') + ')';
  }

})();
