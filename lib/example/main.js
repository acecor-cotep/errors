"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require('colors/safe');
var Errors_1 = __importDefault(require("../src/Errors"));
var NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN = 3;
/**
 * We wrap the function call to add a stack trace to the error
 */
function wrapper(func) {
    try {
        return func.call(this);
    }
    catch (err) {
        throw !Errors_1.default.staticIsAnError(err) ?
            new Errors_1.default('EUNEXPECTED', String((err && err.stack) || err), Errors_1.default.getFunctionName()) :
            Errors_1.default.shortcutStackTraceSpecial(err, Errors_1.default.getFunctionName(NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN));
    }
}
/**
 * Functions we need to generate the error case
 */
function b() {
    throw new Errors_1.default('E8000');
}
function a() {
    wrapper(b);
}
function unexpectedError() {
    var variable = 'toto';
    // @ts-ignore
    variable.access.nested = 5;
}
// -----
/**
 * Catch process exception and rejection
 */
process.on('unhandledRejection', function (reason) {
    var err = new Errors_1.default('GENERAL_CATCH', "" + String(reason));
    err.displayColoredError();
});
process.on('uncaughtException', function (reason) {
    var err = new Errors_1.default('GENERAL_CATCH', "" + String(reason));
    err.displayColoredError();
});
// -----
/**
 * Declare the errors
 */
Errors_1.default.declareCodes({
    E7000: 'Unknown user',
    E8000: 'Unknown material',
    E9000: 'API error',
});
/**
 * Launch the errors cases
 */
// Display the basic error
console.log('\n\n> #1 Display a basic error\n');
try {
    throw new Errors_1.default('E7000');
}
catch (e) {
    e.displayColoredError();
}
// Display an error throw in a inner function
console.log('\n\n> #2 Display an error thrown in an inner function\n');
try {
    wrapper(b);
}
catch (e) {
    e.displayColoredError();
}
// Display an error throw in a inner function * 2
console.log('\n\n> #3 Display an error thrown in an inner function * 2\n');
try {
    wrapper(a);
}
catch (e) {
    e.displayColoredError();
}
// Display an error throw in a inner function * 2 inside of a named function
console.log('\n\n> #4 Display an error thrown in an inner function * 2\n');
function exampleFunction() {
    try {
        wrapper(a);
    }
    catch (e) {
        e.displayColoredError();
    }
}
console.log('\n\n> #5 Catch an unexpected error\n');
try {
    wrapper(unexpectedError);
}
catch (e) {
    e.displayColoredError();
}
console.log('\n\n> #5 Catch an error at top level\n');
wrapper(unexpectedError);
