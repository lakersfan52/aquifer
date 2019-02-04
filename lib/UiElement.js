"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiElement = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Key = require("./Key");

var _AquiferLog = require("./AquiferLog");

var _UiContainer2 = require("./UiContainer");

var _AquiferFunctionalPersister = require("./AquiferFunctionalPersister");

// @ts-check
var timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;
/**
 * WebElement wrapper - allows for:
 * 1.  custom actions (click, hover, etc) to wait for target before attempting action.
 * 2.  custom logging per relevant action
 * 3.  child web elements
 */


var UiElement =
/*#__PURE__*/
function (_UiContainer) {
  (0, _inherits2.default)(UiElement, _UiContainer);
  (0, _createClass2.default)(UiElement, null, [{
    key: "$",
    value: function $(selector) {
      return new UiElement(selector);
    }
    /**
       * @param {String} selector - xpath or css selector
       */

  }]);

  function UiElement(selector) {
    var _this;

    (0, _classCallCheck2.default)(this, UiElement);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(UiElement).call(this));
    _this.selector = selector;
    _this.isLoadCriterion = false;
    _this.parentPage = undefined;
    return _this;
  }

  (0, _createClass2.default)(UiElement, [{
    key: "setName",
    value: function setName(name) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(UiElement.prototype), "setName", this).call(this, name);
    }
    /**
     * Marks the given UiElement as being a critical component of its parent container.  Absence of this item in the DOM means the parent container is not loaded.
     */

  }, {
    key: "tagAsLoadCriterion",
    value: function tagAsLoadCriterion() {
      this.isLoadCriterion = true;
      return this;
    }
    /* eslint class-methods-use-this: "off" */

  }, {
    key: "getWebElement",
    value: function getWebElement() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      this.waitForExist(timeout);
      return browser.element(this.selector);
    }
  }, {
    key: "getWebElements",
    value: function getWebElements() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      this.waitForExist(timeout);
      return $$(this.selector);
    }
  }, {
    key: "getHtml",
    value: function getHtml() {
      var _this2 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      return new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout).setPrecondition(function () {
        return _this2.waitForExist(timeout);
      }).setGoal(function () {
        return _this2.getWebElement().getHTML();
      }).failfastWithMessage("timeout trying to get html for ".concat(this.selector)).start();
    }
    /**
     * Returns a child UiElement component with the given relative selector.
     * @param {string} selector must match parent selector style (xpath vs css-selector)
     */

  }, {
    key: "get",
    value: function get(selector) {
      if (this.selector.startsWith('/') && selector.startsWith('/')) {
        return new UiElement(this.selector + selector);
      }

      if (!this.selector.startsWith('/') && !selector.startsWith('/')) {
        return new UiElement("".concat(this.selector, " ").concat(selector));
      }

      throw new Error("Parent and child elements must have selectors of the same type. Parent: <".concat(this.selector, ">, Child: <").concat(selector, ">."));
    }
  }, {
    key: "getChildren",
    value: function getChildren(selector) {
      if (this.selector.startsWith('/') && selector.startsWith('/')) {
        return this.findWebElements(this.selector + selector);
      }

      if (!this.selector.startsWith('/') && !selector.startsWith('/')) {
        return this.findWebElements("".concat(this.selector, " ").concat(selector));
      }

      throw new Error("Parent and child elements must have selectors of the same type. Parent: <".concat(this.selector, ">, Child: <").concat(selector, ">."));
    }
    /** Returns an array of text values of all web elements currently matching the given UiElement's selector. */

  }, {
    key: "getTexts",
    value: function getTexts() {
      var wes = this.getWebElements();
      var texts = [];
      wes.forEach(function (we) {
        texts.push(we.getText());
      });
      return texts;
    }
  }, {
    key: "getText",
    value: function getText() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      return this.getWebElement(timeout).getText();
    }
  }, {
    key: "click",
    value: function click() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$doLogAndWait = _ref.doLogAndWait,
          doLogAndWait = _ref$doLogAndWait === void 0 ? true : _ref$doLogAndWait,
          _ref$timeout = _ref.timeout,
          timeout = _ref$timeout === void 0 ? timeoutWdio : _ref$timeout;

      if (doLogAndWait) {
        this.logAndWait([{
          text: '👇 ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Click ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: "".concat(this.selector),
          style: _AquiferLog.log.style.selector
        }], timeout);
      }

      browser.click(this.selector);
    }
  }, {
    key: "click_ifExists",
    value: function click_ifExists() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      if (this.isExisting()) {
        this.logAndWait([{
          text: '👇 ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Click ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: "".concat(this.selector),
          style: _AquiferLog.log.style.selector
        }], timeout);
        browser.click(this.selector);
      }
    }
  }, {
    key: "doubleClick",
    value: function doubleClick() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$doLog = _ref2.doLog,
          doLog = _ref2$doLog === void 0 ? true : _ref2$doLog,
          _ref2$timeout = _ref2.timeout,
          timeout = _ref2$timeout === void 0 ? timeoutWdio : _ref2$timeout;

      if (doLog) {
        this.logAndWait([{
          text: '👇👇 ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Double-click ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: "".concat(this.selector),
          style: _AquiferLog.log.style.selector
        }], timeout);
      }

      browser.click(this.selector);
    }
    /**
     * I think this places the mouse over the center of the element and scrolls the page so the entire element is within view.
     */

  }, {
    key: "hover",
    value: function hover() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$doLog = _ref3.doLog,
          doLog = _ref3$doLog === void 0 ? true : _ref3$doLog,
          _ref3$timeout = _ref3.timeout,
          timeout = _ref3$timeout === void 0 ? timeoutWdio : _ref3$timeout;

      if (doLog) {
        this.logAndWait([{
          text: '🕴  ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Hover ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: "".concat(this.selector),
          style: _AquiferLog.log.style.selector
        }], timeout);
      }

      browser.moveToObject(this.selector);
      return this;
    }
  }, {
    key: "scroll",
    value: function scroll() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      return this.hover({
        doLog: false,
        timeout: timeout
      });
    }
  }, {
    key: "click_waitForChange",
    value: function click_waitForChange() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$indicatorSelect = _ref4.indicatorSelector,
          indicatorSelector = _ref4$indicatorSelect === void 0 ? '//body' : _ref4$indicatorSelect,
          _ref4$doLog = _ref4.doLog,
          doLog = _ref4$doLog === void 0 ? true : _ref4$doLog,
          _ref4$timeout = _ref4.timeout,
          timeout = _ref4$timeout === void 0 ? timeoutWdio : _ref4$timeout;

      var initialIndicatorElementHtml = browser.element(indicatorSelector).getHTML();
      doLog && this.logAndWait([{
        text: '👇 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Click ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'then wait for change in ',
        style: _AquiferLog.log.style.filler
      }, {
        text: indicatorSelector,
        style: _AquiferLog.log.style.selector
      }, {
        text: ' target: ',
        style: _AquiferLog.log.style.filler
      }, {
        text: "".concat(this.selector, " "),
        style: _AquiferLog.log.style.selector
      }], timeout);
      browser.click(this.selector);

      var goal = function goal() {
        return browser.element(indicatorSelector).getHTML() !== initialIndicatorElementHtml;
      };

      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).setConsequence(function () {
        return _AquiferLog.log.saveScreenshotWhileWaiting();
      }).start();
      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).failfastWithMessage("Timeout waiting ".concat(timeout, " ms for ").concat(indicatorSelector, " to change after clicking ").concat(this.selector)).start();
    }
  }, {
    key: "click_waitForExisting",
    value: function click_waitForExisting(indicatorSelector) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;

      if (browser.isExisting(indicatorSelector)) {
        throw new Error("Element already exists: ".concat(indicatorSelector));
      }

      this.logAndWait([{
        text: '👇 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Click ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'then wait for element to exist: ',
        style: _AquiferLog.log.style.filler
      }, {
        text: indicatorSelector,
        style: _AquiferLog.log.style.selector
      }, {
        text: ' target: ',
        style: _AquiferLog.log.style.filler
      }, {
        text: "".concat(this.selector, " "),
        style: _AquiferLog.log.style.selector
      }, timeout]);
      browser.click(this.selector);

      var goal = function goal() {
        return browser.isExisting(indicatorSelector);
      };

      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).setConsequence(function () {
        return _AquiferLog.log.saveScreenshotWhileWaiting();
      }).start();
      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).failfastWithMessage("Timeout waiting ".concat(timeout, " ms for ").concat(indicatorSelector, " to exist after clicking ").concat(this.selector)).start();
    }
    /**
     * Clicks each instance of the given webelement assuming it disappears upon click.
     */

  }, {
    key: "clickAll_disappearing",
    value: function clickAll_disappearing() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      this.logAndWait([{
        text: '👇 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Click to remove all instances of ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: this.selector,
        style: _AquiferLog.log.style.selector
      }, timeout]);
      this.click_waitForChange({
        doLog: false
      });

      while (this.isExisting()) {
        this.click_waitForChange({
          doLog: false
        });
      }
    }
  }, {
    key: "click_waitForNotExisting",
    value: function click_waitForNotExisting() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$indicatorSelect = _ref5.indicatorSelector,
          indicatorSelector = _ref5$indicatorSelect === void 0 ? this.selector : _ref5$indicatorSelect,
          _ref5$timeout = _ref5.timeout,
          timeout = _ref5$timeout === void 0 ? timeoutWdio : _ref5$timeout;

      if (indicatorSelector === this.selector) {
        this.logAndWait([{
          text: '👇 ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Click ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: 'then wait for target to disappear ',
          style: _AquiferLog.log.style.filler
        }, {
          text: indicatorSelector,
          style: _AquiferLog.log.style.selector
        }, timeout]);
      } else {
        this.logAndWait([{
          text: '👇 ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Click ',
          style: _AquiferLog.log.style.verb
        }, {
          text: "".concat(this.stuartname, " "),
          style: _AquiferLog.log.style.object
        }, {
          text: 'then wait for element to disappear: ',
          style: _AquiferLog.log.style.filler
        }, {
          text: indicatorSelector,
          style: _AquiferLog.log.style.selector
        }, {
          text: ' target: ',
          style: _AquiferLog.log.style.filler
        }, {
          text: "".concat(this.selector, " "),
          style: _AquiferLog.log.style.selector
        }, timeout]);
      }

      browser.click(this.selector);
      browser.waitUntil(function () {
        return !browser.isExisting(indicatorSelector);
      }, timeout);
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref6$maskTextInLogs = _ref6.maskTextInLogs,
          maskTextInLogs = _ref6$maskTextInLogs === void 0 ? false : _ref6$maskTextInLogs,
          _ref6$timeout = _ref6.timeout,
          timeout = _ref6$timeout === void 0 ? timeoutWdio : _ref6$timeout;

      if (typeof value === 'number') {
        throw new Error('input can be string or array, not number');
      }

      this.logAndWait([{
        text: '⌨  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Set value ',
        style: _AquiferLog.log.style.verb
      }, {
        text: 'of ',
        style: _AquiferLog.log.style.filler
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'to ',
        style: _AquiferLog.log.style.filler
      }, {
        text: "".concat(value, " "),
        style: maskTextInLogs ? _AquiferLog.log.style.password : _AquiferLog.log.style.object
      }, {
        text: "".concat(this.selector, " "),
        style: _AquiferLog.log.style.selector
      }], timeout);
      /* note: browser.setValue doesn't work with the WS editor in branch rules. */

      this.clear({
        doLog: false,
        timeout: timeout
      });
      this.keys(value, 1, false);
    }
    /**
     * Deletes all values in a field using backspace and delete keys.
     */

  }, {
    key: "clear",
    value: function clear() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref7$doLog = _ref7.doLog,
          doLog = _ref7$doLog === void 0 ? true : _ref7$doLog,
          _ref7$timeout = _ref7.timeout,
          timeout = _ref7$timeout === void 0 ? timeoutWdio : _ref7$timeout;

      doLog && this.logAndWait([{
        text: '✨ ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Clear ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: "".concat(this.selector, " "),
        style: _AquiferLog.log.style.selector
      }], timeout);
      this.click({
        doLogAndWait: false,
        timeout: timeout
      });
      this.sleep(100);
      this.keys(_Key.key.DELETE, 20, _Key.key.BACKSPACE, 40, false);
    }
    /** If event screenshots are being saved, attempt to hover over an object prior to interacting with it so that the mouse-over state is captured in the image.  */

  }, {
    key: "failSafeHover",
    value: function failSafeHover() {
      var _this3 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      try {
        browser.waitUntil(function () {
          return browser.isExisting(_this3.selector);
        }, timeout);
        browser.moveToObject(this.selector);
      } catch (err) {// do nothing.
      }
    }
  }, {
    key: "logAndWait",
    value: function logAndWait(messages) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;

      if (!this.name) {
        throw new Error("Found ".concat(this.constructor.name, " with no name.  Make sure that the constructor for each class extending UiContainer ends with super.nameElements(). selector: ").concat(this.selector));
      }

      if (_AquiferLog.log.doSaveEventScreenshots) {
        this.failSafeHover(timeout);
      }

      var screenshotId = _AquiferLog.log.logRichMessages(messages);

      _AquiferLog.log.saveEventScreenshot(screenshotId);

      this.waitForExist(timeout);
    }
  }, {
    key: "clickAndType",
    value: function clickAndType(value) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;
      this.logAndWait([{
        text: '👇 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Click ',
        style: _AquiferLog.log.style.verb
      }, {
        text: this.stuartname,
        style: _AquiferLog.log.style.object
      }, {
        text: ' and ',
        style: _AquiferLog.log.style.filler
      }, {
        text: 'type ',
        style: _AquiferLog.log.style.verb
      }, {
        text: value,
        style: _AquiferLog.log.style.object
      }, {
        text: " ".concat(this.selector),
        style: _AquiferLog.log.style.selector
      }], timeout);
      browser.click(this.selector);
      browser.keys(value);
    }
    /**
     *
     * @param {UiElement} destination
     */

  }, {
    key: "dragAndDropTo",
    value: function dragAndDropTo(destination) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;
      this.logAndWait([{
        text: '🏎  ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Drag ',
        style: _AquiferLog.log.style.verb
      }, {
        text: this.stuartname,
        style: _AquiferLog.log.style.object
      }, {
        text: ' to ',
        style: _AquiferLog.log.style.filler
      }, {
        text: destination.stuartname,
        style: _AquiferLog.log.style.object
      }, {
        text: ' [',
        style: _AquiferLog.log.style.filler
      }, {
        text: this.selector,
        style: _AquiferLog.log.style.selector
      }, {
        text: '], [',
        style: _AquiferLog.log.style.filler
      }, {
        text: destination.selector,
        style: _AquiferLog.log.style.selector
      }, {
        text: ']',
        style: _AquiferLog.log.style.filler
      }], timeout);
      browser.dragAndDrop(this.selector, destination.selector);
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(filePath) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;
      this.logAndWait([{
        text: '📂 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Upload file ',
        style: _AquiferLog.log.style.verb
      }, {
        text: "".concat(filePath, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: 'to ',
        style: _AquiferLog.log.style.filler
      }, {
        text: "".concat(this.stuartname, " "),
        style: _AquiferLog.log.style.object
      }, {
        text: "".concat(this.selector, " "),
        style: _AquiferLog.log.style.selector
      }], timeout);
      browser.chooseFile(this.selector, filePath);
    }
  }, {
    key: "waitForText",
    value: function waitForText(text) {
      var _this4 = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeoutWdio;
      (0, _get2.default)((0, _getPrototypeOf2.default)(UiElement.prototype), "waitForLoad", this).call(this, timeout);

      var screenshotId = _AquiferLog.log.logRichMessages([{
        text: '🤔 ',
        style: _AquiferLog.log.style.emoji
      }, {
        text: 'Assert ',
        style: _AquiferLog.log.style.verb
      }, {
        text: this.stuartname,
        style: _AquiferLog.log.style.object
      }, {
        text: "'s text is ",
        style: _AquiferLog.log.style.filler
      }, {
        text: text,
        style: _AquiferLog.log.style.object
      }, {
        text: " ".concat(this.selector),
        style: _AquiferLog.log.style.selector
      }]);

      this.waitForExist(timeout);

      var goal = function goal() {
        return text === _this4.getWebElement(timeout).getText();
      };

      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).setConsequence(function () {
        return _AquiferLog.log.saveScreenshotWhileWaiting();
      }).start();
      new _AquiferFunctionalPersister.AquiferFunctionalPersister(timeout / 2).setGoal(goal).failfastWithMessageRunner(function () {
        return "Element \"".concat(_this4.stuartname, "\"'s text is \"").concat(_this4.getWebElement(timeout).getText(), "\" after ").concat(timeout, " ms.  Expected: \"").concat(text, "\". Selector: ").concat(_this4.selector);
      }).start();

      _AquiferLog.log.saveEventScreenshot(screenshotId);
    }
  }, {
    key: "waitForNotExist",
    value: function waitForNotExist() {
      var _this5 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      try {
        browser.waitUntil(function () {
          return !browser.isExisting(_this5.selector);
        }, Math.round(timeout / 2));
      } catch (err) {
        _AquiferLog.log.saveScreenshotWhileWaiting();
      }

      try {
        browser.waitUntil(function () {
          return !browser.isExisting(_this5.selector);
        }, timeout);
      } catch (err) {
        throw new Error("Error waiting for ".concat(this.stuartname, " to not exist within ").concat(timeout, " ms. Selector: ").concat(this.selector, ".  Original error: ").concat(err, " "));
      }
    }
    /**
     * Doesn't log.
     * @param {Number} timeout in milliseconds
     */

  }, {
    key: "waitForExist",
    value: function waitForExist() {
      var _this6 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      try {
        browser.waitUntil(function () {
          return browser.isExisting(_this6.selector);
        }, Math.round(timeout / 2));
      } catch (err) {
        _AquiferLog.log.saveScreenshotWhileWaiting();
      }

      try {
        browser.waitUntil(function () {
          return browser.isExisting(_this6.selector);
        }, Math.round(timeout / 2));
      } catch (err) {
        throw new Error("Error finding ".concat(this.stuartname, " within ").concat(timeout, " ms. Selector: ").concat(this.selector, ".  Original error: ").concat(err, " "));
      }

      return true;
    }
    /**
     * This is not a super reliable function since selenium isn't 100% accurate at determining visibility.
     * @param {Number} timeout in milliseconds
     */

  }, {
    key: "waitForVisible",
    value: function waitForVisible() {
      var _this7 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      try {
        browser.waitUntil(function () {
          return browser.isVisible(_this7.selector);
        }, Math.round(timeout / 2));
      } catch (err) {
        _AquiferLog.log.saveScreenshotWhileWaiting();
      }

      try {
        browser.waitUntil(function () {
          return browser.isVisible(_this7.selector);
        }, timeout);
      } catch (err) {
        throw new Error("Error finding visible ".concat(this.stuartname, " within ").concat(timeout, " ms. Selector: ").concat(this.selector, ".  Original error: ").concat(err, " "));
      }
    }
  }, {
    key: "isExisting",
    value: function isExisting() {
      return browser.isExisting(this.selector);
    }
    /* eslint guard-for-in: "off", no-restricted-syntax: "off" */

    /**
     * This adds a custom name parameter to each element object so that the variable's name
     * can be displayed in the ui test logs instead of just a potentially cryptic selector.
     *
     * This was inspired by the idea that maybe we should avoid using visible values in selectors to prepare for multi-language support
     */

  }, {
    key: "nameElements",
    value: function nameElements() {
      for (var propName in this) {
        var propValue = this[propName];

        if (propValue instanceof UiElement) {
          propValue.setName(propName);
        }
      }
    }
  }]);
  return UiElement;
}(_UiContainer2.UiContainer);

exports.UiElement = UiElement;
//# sourceMappingURL=UiElement.js.map