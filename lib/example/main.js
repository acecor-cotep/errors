'use strict';

var _Errors = require('../src/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN = 3;

/**
 * We wrap the function call to add a stack trace to the error
 */
function wrapper(func) {
  try {
    return func.call();
  } catch (err) {
    throw !_Errors2.default.staticIsAnError(err) ? new _Errors2.default('EUNEXPECTED', String(err && err.stack || err), _Errors2.default.getFunctionName()) : _Errors2.default.shortcutStackTraceSpecial(err, _Errors2.default.getFunctionName(NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN));
  }
}

function b() {
  throw new _Errors2.default('E0001');
}

function a() {
  wrapper(b);
}

function unexpectedError() {
  var variable = 'toto';

  variable.access.nested = 5;
}

process.on('unhandledRejection', function (reason) {
  var err = new _Errors2.default('GENERAL_CATCH', '' + String(reason));

  err.displayColoredError();
});

process.on('uncaughtException', function (reason) {
  var err = new _Errors2.default('GENERAL_CATCH', '' + String(reason));

  err.displayColoredError();
});

// Display the basic error

console.log('\n\n> #1 Display a basic error\n');

try {
  throw new _Errors2.default('E0001');
} catch (e) {
  e.displayColoredError();
}

// Display an error throw in a inner function

console.log('\n\n> #2 Display an error thrown in an inner function\n');

try {
  wrapper(b);
} catch (e) {
  e.displayColoredError();
}

// Display an error throw in a inner function * 2

console.log('\n\n> #3 Display an error thrown in an inner function * 2\n');

try {
  wrapper(a);
} catch (e) {
  e.displayColoredError();
}

// Display an error throw in a inner function * 2 inside of a named function

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
