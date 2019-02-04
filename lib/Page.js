"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _UiContainer2 = require("./UiContainer");

var _UiElement = require("./UiElement");

var _AquiferLog = require("./AquiferLog");

var _AquiferFunctionalPersister = require("./AquiferFunctionalPersister");

// @ts-check
var timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;
/** Parent class for specific page objects. */


var Page =
/*#__PURE__*/
function (_UiContainer) {
  (0, _inherits2.default)(Page, _UiContainer);

  function Page(baseUrl) {
    var _this;

    var urlPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    (0, _classCallCheck2.default)(this, Page);

    if (urlPath && !urlPath.startsWith('/')) {
      throw new Error('urlPath should start with forward slash (/)');
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Page).call(this));
    _this.url = baseUrl + (urlPath || '');
    (0, _get2.default)((0, _getPrototypeOf2.default)(Page.prototype), "setName", (0, _assertThisInitialized2.default)(_this)).call((0, _assertThisInitialized2.default)(_this), _this.constructor.name);
    return _this;
  }

  (0, _createClass2.default)(Page, [{
    key: "setUrl",
    value: function setUrl(url) {
      this.url = url;
      return this;
    }
  }, {
    key: "load",
    value: function load() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      _AquiferLog.log.logRichMessagesWithScreenshot([{
        text: '🕸  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Load ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(this.name, " Page "),
        style: _AquiferLog.log.style.object
      }, {
        text: this.url,
        style: _AquiferLog.log.style.selector
      }]);

      browser.url(this.url);
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Page.prototype), "waitForLoad", this).call(this, timeout);
    }
  }, {
    key: "load_waitForChange",
    value: function load_waitForChange() {
      var indicatorSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '//body';
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;
      var indicatorElement = new _UiElement.UiElement(indicatorSelector);

      if (indicatorElement.isExisting()) {
        var initialIndicatorElementHtml = indicatorElement.getHtml();

        _AquiferLog.log.logRichMessagesWithScreenshot([{
          text: '🕸  ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Load ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.name, " Page "),
          style: _AquiferLog.log.style.object
        }, {
          text: this.url,
          style: _AquiferLog.log.style.selector
        }, {
          text: ' then wait for change in ',
          style: _AquiferLog.log.style.filler
        }, {
          text: indicatorSelector,
          style: _AquiferLog.log.style.selector
        }, {
          text: ' target: ',
          style: _AquiferLog.log.style.filler
        }, {
          text: "".concat(indicatorSelector, " "),
          style: _AquiferLog.log.style.selector
        }]);

        browser.url(this.url);
        new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout).setGoal(function () {
          return indicatorElement.getHtml() !== initialIndicatorElementHtml;
        }).failfastWithMessage("timeout waiting for ".concat(indicatorSelector, " to change after loading ").concat(this.name)).start();
        return (0, _get2.default)((0, _getPrototypeOf2.default)(Page.prototype), "waitForLoad", this).call(this, timeout);
      }

      return this.load(timeout);
    }
  }, {
    key: "loadWithRetry",
    value: function loadWithRetry() {
      var timeoutInMillis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio * 5;
      var succeeded = false;
      var initTime = new Date().getTime();

      while (!succeeded && new Date().getTime() - initTime < timeoutInMillis) {
        try {
          this.load();
          succeeded = true;
        } catch (err) {
          /* do nothing */
        }
      }
    }
    /* eslint class-methods-use-this: "off" */

  }, {
    key: "get",
    value: function get(selector) {
      return new _UiElement.UiElement(selector);
    }
  }], [{
    key: "load",
    value: function load(url) {
      _AquiferLog.log.logRichMessagesWithScreenshot([{
        text: '🕸  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Load ',
        style: _AquiferLog.log.style.verb
      }, {
        text: url,
        style: _AquiferLog.log.style.selector
      }]);

      browser.url(url);
    }
  }]);
  return Page;
}(_UiContainer2.UiContainer);

exports.Page = Page;
//# sourceMappingURL=Page.js.map