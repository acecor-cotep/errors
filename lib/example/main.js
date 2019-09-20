"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Errors = _interopRequireDefault(require("../src/Errors"));

var NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN = 3;
/**
 * We wrap the function call to add a stack trace to the error
 */

function wrapper(func) {
  try {
    return func.call(this);
  } catch (err) {
    throw !_Errors["default"].staticIsAnError(err) ? new _Errors["default"]('EUNEXPECTED', String(err && err.stack || err), _Errors["default"].getFunctionName()) : _Errors["default"].shortcutStackTraceSpecial(err, _Errors["default"].getFunctionName(NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN));
  }
}
/**
 * Functions we need to generate the error case
 */


function b() {
  throw new _Errors["default"]('E8000');
}

function a() {
  wrapper(b);
}

function unexpectedError() {
  var variable = 'toto';
  variable.access.nested = 5;
} // -----

/**
 * Catch process exception and rejection
 */


process.on('unhandledRejection', function (reason) {
  var err = new _Errors["default"]('GENERAL_CATCH', "".concat(String(reason)));
  err.displayColoredError();
});
process.on('uncaughtException', function (reason) {
  var err = new _Errors["default"]('GENERAL_CATCH', "".concat(String(reason)));
  err.displayColoredError();
}); // -----

/**
 * Declare the errors
 */

_Errors["default"].declareCodes({
  E7000: 'Unknown user',
  E8000: 'Unknown material',
  E9000: 'API error'
});
/**
 * Launch the errors cases
 */
// Display the basic error


console.log('\n\n> #1 Display a basic error\n');

try {
  throw new _Errors["default"]('E7000');
} catch (e) {
  e.displayColoredError();
} // Display an error throw in a inner function


console.log('\n\n> #2 Display an error thrown in an inner function\n');

try {
  wrapper(b);
} catch (e) {
  e.displayColoredError();
} // Display an error throw in a inner function * 2


console.log('\n\n> #3 Display an error thrown in an inner function * 2\n');

try {
  wrapper(a);
} catch (e) {
  e.displayColoredError();
} // Display an error throw in a inner function * 2 inside of a named function


console.log('\n\n> #4 Display an error thrown in an inner function * 2\n');

function exampleFunction() {
  try {
    wrapper(a);
  } catch (e) {
    e.displayColoredError();
  }
}

console.log('\n\n> #5 Catch an unexpected error\n');

try {
  wrapper(unexpectedError);
} catch (e) {
  e.displayColoredError();
}

console.log('\n\n> #5 Catch an error at top level\n');
wrapper(unexpectedError);
//# sourceMappingURL=main.js.map
