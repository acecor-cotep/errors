'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Errors = require('./Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
var Errors = function (_ErrorsLibrary) {
  (0, _inherits3.default)(Errors, _ErrorsLibrary);

  function Errors() {
    (0, _classCallCheck3.default)(this, Errors);
    return (0, _possibleConstructorReturn3.default)(this, (Errors.__proto__ || (0, _getPrototypeOf2.default)(Errors)).apply(this, arguments));
  }

  (0, _createClass3.default)(Errors, null, [{
    key: 'declareCodes',

    /**
     * Declare codes to the Errors class
     */
    value: function declareCodes(conf) {
      if (!this.codes) {
        Errors.initCodes();
      }

      this.codes = (0, _extends3.default)({}, this.codes, conf);
    }

    /**
     * Enum that contains errorCodes
     * @return {{EX: number}}
     */

  }, {
    key: 'initCodes',


    /**
     * Override the codes initialization
     *
     * Add our program codes
     */
    value: function initCodes() {
      (0, _get3.default)(Errors.__proto__ || (0, _getPrototypeOf2.default)(Errors), 'initCodes', this).call(this);

      this.codes = (0, _extends3.default)({}, this.codes, {

        // Launching error
        INVALID_LAUNCHING_MODE: 'Invalid launching mode',
        INVALID_LAUNCHING_PARAMETER: 'Invalid launching parameters',
        ERROR_CREATING_FILE_API: 'Impossible to create the api.json file',

        // Slave Error
        SLAVE_ERROR: 'Slave Error',

        // General catch
        GENERAL_CATCH: 'General Catch',

        // MAINTAINANCE
        MAINTAINANCE: 'Program is in maintainance',

        // Server Error
        E2005: 'ZeroMQ: Cannot connect the server',
        E2006: 'ZeroMQ: Cannot close the socket',
        E2007: 'ZeroMQ: Cannot bind the server',
        E2008: 'ZeroMQ: Bad socketType for the kind of ZeroMQ implementation you choose',

        E7001: 'Cannot apply/disable an abstract role',
        E7002: 'Cannot find the given role to apply/disable',
        E7003: 'Error creating a new child',
        E7004: 'Unknown slave',
        E7005: 'Timeout reached waiting for slave answer',
        E7006: 'Bad message format',
        E7007: 'Task start failed',
        E7009: 'Task is inactive',
        E7010: 'Task is useless to connect (no interactivity)',
        E7014: 'Cannot send message to client (unidirectionnal communication)',
        E7016: 'Task is closing',
        E7024: 'Mutex already taken',

        E8083: 'Kill old processes errors',
        E8088: 'Cannot read the file',
        E8089: 'Syntax error in hjson file',
        E8092: 'Bad configuration file content',
        E8191: 'Error executing a command line',
        E8200: 'Impossible to spawn process.'
      });

      console.log(this.codes);
    }
  }, {
    key: 'Code',
    get: function get() {
      if (!this.codes) {
        Errors.initCodes();
      }

      return this.codes;
    }
  }]);
  return Errors;
}(_Errors2.default); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class handle errors in the app
 */

// Includes


exports.default = Errors;
//# sourceMappingURL=ErrorsSon.js.map
