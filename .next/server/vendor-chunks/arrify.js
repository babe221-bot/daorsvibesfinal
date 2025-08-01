"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/arrify";
exports.ids = ["vendor-chunks/arrify"];
exports.modules = {

/***/ "(action-browser)/./node_modules/arrify/index.js":
/*!**************************************!*\
  !*** ./node_modules/arrify/index.js ***!
  \**************************************/
/***/ ((module) => {

eval("\n\nconst arrify = value => {\n\tif (value === null || value === undefined) {\n\t\treturn [];\n\t}\n\n\tif (Array.isArray(value)) {\n\t\treturn value;\n\t}\n\n\tif (typeof value === 'string') {\n\t\treturn [value];\n\t}\n\n\tif (typeof value[Symbol.iterator] === 'function') {\n\t\treturn [...value];\n\t}\n\n\treturn [value];\n};\n\nmodule.exports = arrify;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9hcnJpZnkvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiL2hvbWUvdXNlci9zdHVkaW8vbm9kZV9tb2R1bGVzL2FycmlmeS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFycmlmeSA9IHZhbHVlID0+IHtcblx0aWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiBbdmFsdWVdO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIFsuLi52YWx1ZV07XG5cdH1cblxuXHRyZXR1cm4gW3ZhbHVlXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyaWZ5O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/arrify/index.js\n");

/***/ })

};
;