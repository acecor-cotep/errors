"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This class handle errors in the app
 */
var colors = require('colors/safe');
/**
 * Create a monoline from an array which is usefull when you have a line that is too long
 */
function monoline(parts) {
    return parts.reduce(function (str, x) { return "" + str + x; }, '');
}
/**
 * Convert a string to JSON
 * If he cannot parse it, return false
 */
function convertStringToJSON(dataString) {
    return (function () {
        try {
            return JSON.parse(dataString);
        }
        catch (_) {
            return false;
        }
    })();
}
var NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC = 3;
var NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE = 3;
var codesStorage = false;
/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
var Errors = /** @class */ (function () {
    /**
     * @param errCode - the key associated to the error
     * @param functionName - where the error happened
     * @param supString - Supplement infos about the error
     */
    function Errors(errCode, supString, functionName) {
        if (functionName === void 0) { functionName = Errors.getFunctionName(NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC); }
        this.stringError = '';
        this.errorCode = 'E0000';
        this.happened = '';
        if (errCode) {
            this.errorCode = errCode;
            if (functionName) {
                this.happened = functionName;
            }
        }
        if (supString) {
            this.stringError = supString;
        }
        this.dad = false;
    }
    /**
     * Return the name of the function that call this function
     * IT'S A HACK
     */
    Errors.getFunctionName = function (numberFuncToGoBack) {
        if (numberFuncToGoBack === void 0) { numberFuncToGoBack = 1; }
        var err = new Error('tmpErr');
        var splitted = (err.stack || '')
            .split('\n');
        // If we cannot succeed to find the good function name, return the whole data
        if (numberFuncToGoBack >= splitted.length) {
            return err.stack || '';
        }
        var trimmed = splitted[numberFuncToGoBack]
            .trim();
        // If we cannot succeed to find the good function name, return the whole data
        if (!trimmed.length) {
            return err.stack || '';
        }
        return trimmed.split(' ')[1];
    };
    /**
     * We call this function to add some trace to the error
     * @param error - new Error that will help the trace
     */
    Errors.prototype.stackTrace = function (error) {
        error.setDad(this);
        return error;
    };
    /**
     * Set a dad to the error (used by stack trace to create a stack trace using simple errors)
     * @param error
     */
    Errors.prototype.setDad = function (error) {
        this.dad = error;
    };
    /**
     * We serialize the error to be able to deserialize it after
     * @param {?Boolean} _stringify - do we need to stringify before end? Used to call it recurively
     *
     * WARNING RECURSIVE FUNCTION
     */
    Errors.prototype.serialize = function (_stringify) {
        if (_stringify === void 0) { _stringify = true; }
        var serialize = {
            stringError: this.stringError,
            errorCode: this.errorCode,
            happened: this.happened,
            dad: this.dad ? this.dad.serialize(false) : false,
        };
        return _stringify ? JSON.stringify(serialize) : serialize;
    };
    /**
     * We deserialize a previously serialized error
     * If the string is not a serialized error, create a new error with the string as new error infos
     * @param {String} str
     */
    Errors.deserialize = function (str) {
        var obj = convertStringToJSON(str);
        var constructError = function (ptr) {
            var newErrorObj = new Errors();
            newErrorObj.stringError = ptr.stringError || '';
            newErrorObj.errorCode = ptr.errorCode || 'EUNEXPECTED';
            newErrorObj.happened = ptr.happened || '';
            if (ptr.dad) {
                newErrorObj.dad = constructError(ptr.dad);
            }
            return newErrorObj;
        };
        // If the str is not an Errors serialized data
        if (!obj) {
            return new Errors('UNKNOWN_ERROR', str);
        }
        return constructError(obj);
    };
    Object.defineProperty(Errors, "DEFAULT_CODES", {
        /**
         * The default codes of the Error class
         */
        get: function () {
            return {
                // Special error that say we just want to add some extra stack trace data (but without using new error code)
                ESTACKTRACE: 'Stack Trace',
                // Default error
                E0000: 'No Specified Error',
                // Unexpected error
                EUNEXPECTED: 'Unexpected Error',
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Declare codes to the Errors class
     */
    Errors.declareCodes = function (conf) {
        if (!codesStorage) {
            codesStorage = Errors.DEFAULT_CODES;
        }
        codesStorage = __assign(__assign({}, codesStorage), conf);
    };
    Object.defineProperty(Errors, "codes", {
        /**
         * Returns the known codes
         */
        get: function () {
            if (!codesStorage) {
                codesStorage = Errors.DEFAULT_CODES;
            }
            return codesStorage;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Shortcut to handle an add to stack trace (special add --> ESTACKTRACE type)
     */
    Errors.shortcutStackTraceSpecial = function (err, funcName) {
        return Errors.handleStackTraceAdd(err, new Errors('ESTACKTRACE', '', funcName), funcName);
    };
    /**
     * Add an error into a stack trace, handle the fact of unexpected errors
     */
    Errors.handleStackTraceAdd = function (err, errToAdd, funcName) {
        if (funcName === void 0) { funcName = Errors.getFunctionName(NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE); }
        if (!Errors.staticIsAnError(err)) {
            return new Errors('EUNEXPECTED', String(err.stack || err), funcName);
        }
        return err.stackTrace(errToAdd);
    };
    /**
     * Check if the errCode is a part of the stackTrace errors
     */
    Errors.prototype.checkErrorOccur = function (errCode) {
        if (this.errorCode === errCode) {
            return true;
        }
        if (!this.dad) {
            return false;
        }
        return this.dad.checkErrorOccur(errCode);
    };
    Errors.prototype.getMeaning = function () {
        return Errors.codes[this.errorCode] || '';
    };
    /**
     * @override
     */
    Errors.prototype.toString = function () {
        return this.getErrorString();
    };
    /**
     * Get the string that correspond to the recorded error (its a stringified json)
     */
    Errors.prototype.getErrorString = function (_dad) {
        if (_dad === void 0) { _dad = false; }
        var json = {};
        var avoid = true;
        if (this.errorCode !== 'ESTACKTRACE' || (!_dad && this.errorCode === 'ESTACKTRACE')) {
            avoid = false;
            json.errorCode = this.errorCode;
            json.errorMeaning = this.getMeaning();
            if (this.stringError) {
                json.moreInfos = this.stringError;
            }
            if (this.happened) {
                json.happenedAt = this.happened;
            }
        }
        if (this.dad) {
            json.dad = this.dad.getErrorString(true);
        }
        if (_dad && avoid) {
            return json.dad;
        }
        if (_dad) {
            return json;
        }
        if (avoid) {
            return JSON.stringify(json.dad);
        }
        return JSON.stringify(json);
    };
    Errors.prototype.displayColoredError = function () {
        console.error(this.getColoredErrorString(true));
    };
    Errors.prototype.displayError = function () {
        console.error(colors.bold(colors.red(String(this.getErrorString()))));
    };
    /**
     * display the error into the console
     * WARNING THIS FUNCTION IS RECURSIVE
     */
    Errors.prototype.getColoredErrorString = function (isFirst) {
        if (isFirst === void 0) { isFirst = true; }
        var strsParts = [];
        var dadsDisplay = [];
        // Get the dad display
        if (this.dad) {
            // Here we have something like [dad, dad, dad, dad, dad, dad] displays with the latests the most high level trace
            dadsDisplay = this.dad.getColoredErrorString(false);
        }
        // Create our own display
        if (isFirst || this.errorCode !== 'ESTACKTRACE') {
            strsParts.push(monoline([
                colors.red('--> Error['),
                colors.yellow("" + this.errorCode),
                colors.red(']: ['),
                colors.yellow("" + this.getMeaning()),
                colors.red(']\n'),
            ]));
        }
        if (this.stringError) {
            colors.blue(strsParts.push("More infos: [" + this.stringError + "]\n"));
        }
        if (this.happened) {
            colors.grey(strsParts.push("Happened at: [" + this.happened + "]\n"));
        }
        // If we are the first called function, it means we have to actually handle the display
        if (isFirst) {
            // So have dad to display we have
            // strsParts which is the highest level trace we have
            // [dad, dad, dad, dad] which are the others traces, with the last dad the highest level trace
            // Starting with the highest dad we start the display
            var finalArrayToDisplay_1 = [];
            var spacesOffset_1 = ' ';
            finalArrayToDisplay_1.push(monoline([
                colors.red(colors.underline(colors.bold('TRACE: '))),
                colors.red(colors.bold('--------------------------------------------------------------')),
                '\n',
            ]));
            strsParts.forEach(function (x) { return finalArrayToDisplay_1.push("| " + spacesOffset_1 + x); });
            dadsDisplay.forEach(function (x) {
                spacesOffset_1 += ' ';
                // When we add it in the final array, we insert the graphical '    ' spaces offset
                x.forEach(function (y) { return finalArrayToDisplay_1.push("| " + spacesOffset_1 + y); });
            });
            finalArrayToDisplay_1.push(monoline([
                colors.bold(colors.red('---------------------------------------------------------------------')),
                '\n',
            ]));
            return monoline(finalArrayToDisplay_1);
        }
        // We do not have to handle the display just return our display and our dad display
        var toRet = [];
        if (strsParts.length)
            toRet.push(strsParts);
        if (dadsDisplay.length) {
            toRet = __spreadArrays(toRet, dadsDisplay);
        }
        return toRet;
    };
    Errors.staticIsAnError = function (unknown) {
        return unknown instanceof Errors;
    };
    /**
     * Set a string to specify more the error
     */
    Errors.prototype.setString = function (error) {
        this.stringError = error;
    };
    Errors.prototype.setErrorCode = function (errCode) {
        this.errorCode = errCode;
    };
    Errors.prototype.getLastStringInStack = function () {
        var ptr = this;
        while (ptr.dad) {
            ptr = ptr.dad;
        }
        return ptr.stringError;
    };
    /**
     * Get the error code (key that refer to the error)
     * The last in the stack
     */
    Errors.prototype.getLastErrorCodeInStack = function () {
        var ptr = this;
        while (ptr.dad) {
            ptr = ptr.dad;
        }
        return ptr.errorCode;
    };
    Errors.prototype.getLastErrorInStack = function () {
        var ptr = this;
        while (ptr.dad) {
            ptr = ptr.dad;
        }
        return ptr;
    };
    Errors.prototype.getErrorCode = function () {
        return this.errorCode;
    };
    return Errors;
}());
exports.default = Errors;
