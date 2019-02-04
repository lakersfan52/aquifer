"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AquiferAssert = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _AquiferLog = require("./AquiferLog");

// @ts-check
var timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;

var AquiferAssert =
/*#__PURE__*/
function () {
  function AquiferAssert() {
    (0, _classCallCheck2.default)(this, AquiferAssert);
  }

  (0, _createClass2.default)(AquiferAssert, null, [{
    key: "visualTestsPassed",
    value: function visualTestsPassed() {
      if (_AquiferLog.log.aVisualTestFailed) {
        _AquiferLog.log.aVisualTestFailed = false;
        throw new Error(_AquiferLog.A_VISUAL_TEST_FAILED);
      }
    }
  }, {
    key: "valueEquals",
    value: function valueEquals(f, value, targetDescription) {
      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : timeoutWdio;

      var screenshotId = _AquiferLog.log.logRichMessages([{
        text: '🤔  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Assert ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(targetDescription, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'equals ',
        style: _AquiferLog.log.style.verb
      }, {
        text: value,
        style: _AquiferLog.log.style.object
      }]);

      try {
        browser.waitUntil(function () {
          return f() === value;
        }, Math.round(timeout / 2));
      } catch (err) {
        _AquiferLog.log.saveScreenshotWhileWaiting();
      }

      try {
        browser.waitUntil(function () {
          return f() === value;
        }, timeout);
      } catch (err) {
        throw new Error("".concat(targetDescription, ": Expected:  \"").concat(value, "\". Actual: \"").concat(f(), "\""));
      } finally {
        _AquiferLog.log.saveEventScreenshot(screenshotId);
      }
    }
  }, {
    key: "assert",
    value: function assert(boolean, description) {
      var screenshotId = _AquiferLog.log.logRichMessages([{
        text: '🤔  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Assert true: ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(description, ". "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'Actual: ',
        style: _AquiferLog.log.style.filler
      }, {
        text: JSON.stringify(boolean),
        style: _AquiferLog.log.style.object
      }]);

      _AquiferLog.log.saveEventScreenshot(screenshotId);

      if (!boolean) {
        throw new Error("Assertion failed. ".concat(description));
      }
    }
  }]);
  return AquiferAssert;
}();

exports.AquiferAssert = AquiferAssert;
//# sourceMappingURL=AquiferAssert.js.map