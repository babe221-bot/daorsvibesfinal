"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/text-hex";
exports.ids = ["vendor-chunks/text-hex"];
exports.modules = {

/***/ "(action-browser)/./node_modules/text-hex/index.js":
/*!****************************************!*\
  !*** ./node_modules/text-hex/index.js ***!
  \****************************************/
/***/ ((module) => {

eval("\n\n/***\n * Convert string to hex color.\n *\n * @param {String} str Text to hash and convert to hex.\n * @returns {String}\n * @api public\n */\nmodule.exports = function hex(str) {\n  for (\n    var i = 0, hash = 0;\n    i < str.length;\n    hash = str.charCodeAt(i++) + ((hash << 5) - hash)\n  );\n\n  var color = Math.floor(\n    Math.abs(\n      (Math.sin(hash) * 10000) % 1 * 16777216\n    )\n  ).toString(16);\n\n  return '#' + Array(6 - color.length + 1).join('0') + color;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy90ZXh0LWhleC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyIvaG9tZS91c2VyL3N0dWRpby9ub2RlX21vZHVsZXMvdGV4dC1oZXgvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKioqXG4gKiBDb252ZXJ0IHN0cmluZyB0byBoZXggY29sb3IuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUZXh0IHRvIGhhc2ggYW5kIGNvbnZlcnQgdG8gaGV4LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGV4KHN0cikge1xuICBmb3IgKFxuICAgIHZhciBpID0gMCwgaGFzaCA9IDA7XG4gICAgaSA8IHN0ci5sZW5ndGg7XG4gICAgaGFzaCA9IHN0ci5jaGFyQ29kZUF0KGkrKykgKyAoKGhhc2ggPDwgNSkgLSBoYXNoKVxuICApO1xuXG4gIHZhciBjb2xvciA9IE1hdGguZmxvb3IoXG4gICAgTWF0aC5hYnMoXG4gICAgICAoTWF0aC5zaW4oaGFzaCkgKiAxMDAwMCkgJSAxICogMTY3NzcyMTZcbiAgICApXG4gICkudG9TdHJpbmcoMTYpO1xuXG4gIHJldHVybiAnIycgKyBBcnJheSg2IC0gY29sb3IubGVuZ3RoICsgMSkuam9pbignMCcpICsgY29sb3I7XG59O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/text-hex/index.js\n");

/***/ })

};
;