"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/stream-events";
exports.ids = ["vendor-chunks/stream-events"];
exports.modules = {

/***/ "(action-browser)/./node_modules/stream-events/index.js":
/*!*********************************************!*\
  !*** ./node_modules/stream-events/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar stubs = __webpack_require__(/*! stubs */ \"(action-browser)/./node_modules/stubs/index.js\")\n\n/*\n * StreamEvents can be used 2 ways:\n *\n * 1:\n * function MyStream() {\n *   require('stream-events').call(this)\n * }\n *\n * 2:\n * require('stream-events')(myStream)\n */\nfunction StreamEvents(stream) {\n  stream = stream || this\n\n  var cfg = {\n    callthrough: true,\n    calls: 1\n  }\n\n  stubs(stream, '_read', cfg, stream.emit.bind(stream, 'reading'))\n  stubs(stream, '_write', cfg, stream.emit.bind(stream, 'writing'))\n\n  return stream\n}\n\nmodule.exports = StreamEvents\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9zdHJlYW0tZXZlbnRzL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLFlBQVksbUJBQU8sQ0FBQyw2REFBTzs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyIvaG9tZS91c2VyL3N0dWRpby9ub2RlX21vZHVsZXMvc3RyZWFtLWV2ZW50cy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBzdHVicyA9IHJlcXVpcmUoJ3N0dWJzJylcblxuLypcbiAqIFN0cmVhbUV2ZW50cyBjYW4gYmUgdXNlZCAyIHdheXM6XG4gKlxuICogMTpcbiAqIGZ1bmN0aW9uIE15U3RyZWFtKCkge1xuICogICByZXF1aXJlKCdzdHJlYW0tZXZlbnRzJykuY2FsbCh0aGlzKVxuICogfVxuICpcbiAqIDI6XG4gKiByZXF1aXJlKCdzdHJlYW0tZXZlbnRzJykobXlTdHJlYW0pXG4gKi9cbmZ1bmN0aW9uIFN0cmVhbUV2ZW50cyhzdHJlYW0pIHtcbiAgc3RyZWFtID0gc3RyZWFtIHx8IHRoaXNcblxuICB2YXIgY2ZnID0ge1xuICAgIGNhbGx0aHJvdWdoOiB0cnVlLFxuICAgIGNhbGxzOiAxXG4gIH1cblxuICBzdHVicyhzdHJlYW0sICdfcmVhZCcsIGNmZywgc3RyZWFtLmVtaXQuYmluZChzdHJlYW0sICdyZWFkaW5nJykpXG4gIHN0dWJzKHN0cmVhbSwgJ193cml0ZScsIGNmZywgc3RyZWFtLmVtaXQuYmluZChzdHJlYW0sICd3cml0aW5nJykpXG5cbiAgcmV0dXJuIHN0cmVhbVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbUV2ZW50c1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/stream-events/index.js\n");

/***/ })

};
;