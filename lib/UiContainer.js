"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiContainer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _AquiferLog = require("./AquiferLog");

// @ts-check
var timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;
/**
 * Any class that contains custom web element objects.
 *
 * Abstract class
 */

/* eslint guard-for-in: "off", no-restricted-syntax: "off",  */


var UiContainer =
/*#__PURE__*/
function () {
  function UiContainer() {
    (0, _classCallCheck2.default)(this, UiContainer);

    if (this.constructor === UiContainer) {
      throw new TypeError('Abstract class cannot be instantiated directly.');
    }
  }
  /* eslint guard-for-in: "off", no-restricted-syntax: "off" */

  /**
   * This adds a custom name parameter to each element object so that the variable's name
   * can be displayed in the ui test logs instead of just a potentially cryptic selector.
   *
   * This was inspired by the idea that maybe we should avoid using visible values in selectors to prepare for multi-language support
   */


  (0, _createClass2.default)(UiContainer, [{
    key: "nameElements",
    value: function nameElements() {
      for (var propName in this) {
        var propValue = this[propName];

        if (propValue) {
          try {
            // @ts-ignore
            propValue.setName(propName);
          } catch (err) {// do nothing. love to check if propValue was instanceOf UiElement but that requires circular dependency
          }
        }
      }
    }
  }, {
    key: "setName",
    value: function setName(name) {
      this.stuartname = name;
      return this;
    }
  }, {
    key: "waitForLoad",
    value: function waitForLoad() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      try {
        for (var i = 0; i < this.criteriaElements.length; i++) {
          var element = this.criteriaElements[i]; // @ts-ignore

          element.waitForExist(timeout);
        }
      } catch (error) {
        throw new Error("An element in ".concat(this.constructor.name, " failed to load within ").concat(timeout, " ms. ").concat(error));
      }

      return this;
    }
  }, {
    key: "waitFor",
    value: function waitFor() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      // @ts-ignore
      if (this.waitForExist) {
        // @ts-ignore
        this.waitForExist(timeout);
      }

      return this.waitForLoad(timeout);
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;

      for (var i = 0; i < this.criteriaElements.length; i++) {
        var element = this.criteriaElements[i]; // @ts-ignore

        element.getWebElement(timeout);
      }

      return true;
    }
    /* eslint class-methods-use-this: "off" */

  }, {
    key: "findWebElements",
    value: function findWebElements(selector) {
      return $$(selector);
    }
    /* eslint class-methods-use-this: "off" */

  }, {
    key: "findWebElement",
    value: function findWebElement(selector) {
      return $(selector);
    }
    /**
     * Asserts that the browser screen matches the screenshot saved in screenshots/reference.
     *
     * To reset the reference image, replace `checkVisual(...)` with `resetVisual(...)` and re-run.
     * @param  excludedElements UiElement - cssSelectors or xpaths for sections of the screen to ignore
     */

  }, {
    key: "checkVisual",
    value: function checkVisual() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        excludedElements: [],
        misMatchTolerance: 0.05
      },
          _ref$excludedElements = _ref.excludedElements,
          excludedElements = _ref$excludedElements === void 0 ? [] : _ref$excludedElements,
          _ref$misMatchToleranc = _ref.misMatchTolerance,
          misMatchTolerance = _ref$misMatchToleranc === void 0 ? 0.05 : _ref$misMatchToleranc;

      if (global.aquiferOptions.resetReferenceImages) {
        global.doDeleteReferenceImage = true;
      }

      this.waitFor();
      excludedElements.forEach(function (uiElement) {
        uiElement.waitForVisible();
      });
      var excludedSelectors = excludedElements.map(function (uiElement) {
        return uiElement.selector;
      });
      _AquiferLog.log.screenshotTargetName = this.name;
      _AquiferLog.log.screenshotTargetSelector = excludedSelectors.length > 0 ? " excluding: ".concat(JSON.stringify(excludedSelectors)) : '';
      var succeeded = false;
      var report;
      var initTime = new Date().getTime();
      var count = 0;

      while (!succeeded && new Date().getTime() - initTime < timeoutWdio) {
        global.doLogVisualTest = count === 0; // @ts-ignore

        if (this.selector) {
          /* is an element */
          // @ts-ignore
          global.customScreenshotTag = global.filenamify(this.selector);
          /* eslint prefer-destructuring: "off" */
          // @ts-ignore

          report = browser.checkElement(this.selector, {
            hide: excludedSelectors,
            misMatchTolerance: misMatchTolerance
          })[0];
        } else {
          /* is a page */
          global.customScreenshotTag = global.filenamify("".concat(this.constructor.name, "Page"));
          /* eslint prefer-destructuring: "off" */
          // @ts-ignore

          report = browser.checkDocument({
            hide: excludedSelectors,
            misMatchTolerance: misMatchTolerance
          })[0];
        }

        succeeded = report.isWithinMisMatchTolerance;

        if (!succeeded) {
          this.sleep(2000);
        }

        count += 1;
      }

      if (!report.isWithinMisMatchTolerance) {
        _AquiferLog.log.logFailedVisualTest(global.previousImageFileLocation, report);

        _AquiferLog.log.aVisualTestFailed = true;
      }

      global.customScreenshotTag = undefined;
      _AquiferLog.log.screenshotTargetName = undefined;
      _AquiferLog.log.screenshotTargetSelector = undefined;
    }
  }, {
    key: "resetVisual",
    value: function resetVisual(_ref2) {
      var _ref2$excludedElement = _ref2.excludedElements,
          excludedElements = _ref2$excludedElement === void 0 ? [] : _ref2$excludedElement,
          misMatchTolerance = _ref2.misMatchTolerance;
      // this is sloppy but i'm not sure how else to determine the ref image name - stuart 11/22/2018
      global.doDeleteReferenceImage = true;
      this.checkVisual({
        excludedElements: excludedElements,
        misMatchTolerance: misMatchTolerance
      });
      global.doDeleteReferenceImage = false;
    }
    /**
     * if input is a single array, the elements will be typed consecutively.
     *
     * if input is a list of values, the first value is a key to type (k), and the next value is how many times to type it (n), as in
     *
     * keys(k1, n1, k2, n2)
     *
     * if the last "n" value is missing, it's assumed to be 1.
     *
     * if last element is "false", then each key won't be logged
     * @param  {...any} inputs
     */

  }, {
    key: "keys",
    value: function keys() {
      try {
        this.waitFor();
      } catch (_unused) {
        /* do nothing */
      } finally {
        /* do nothing */
      }

      var inputObjects = [];
      var doLog = true;
      var outputString = '';

      if (arguments.length === 1) {
        inputObjects.push({
          k: arguments.length <= 0 ? undefined : arguments[0],
          n: 1
        });
        outputString = JSON.stringify(inputObjects[0].k);
      } else {
        for (var i = 0; i < arguments.length; i += 2) {
          var k = i < 0 || arguments.length <= i ? undefined : arguments[i];

          if (i + 1 < arguments.length) {
            var n = i + 1 < 0 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
            inputObjects.push({
              k: k,
              n: n
            });
            outputString += "".concat(JSON.stringify(k) + (n > 1 ? "x".concat(n) : ''), ", ");
          } else {
            doLog = k;
          }
        }

        outputString = outputString.slice(0, -2);
      }

      if (doLog) {
        _AquiferLog.log.logRichMessagesWithScreenshot([{
          text: '⌨  ',
          style: _AquiferLog.log.style.emoji
        }, {
          text: 'Type ',
          style: _AquiferLog.log.style.verb
        }, {
          text: outputString,
          style: _AquiferLog.log.style.object
        }]);
      }

      this.waitFor(); // @ts-ignore

      this.click && this.click({
        doLogAndWait: false
      });

      for (var _i = 0; _i < inputObjects.length; _i++) {
        var inputObject = inputObjects[_i];

        for (var j = 0; j < inputObject.n; j++) {
          browser.keys(inputObject.k);
        }
      }
    }
  }, {
    key: "sleep",
    value: function sleep() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeoutWdio;
      this.waitForLoad(timeout);
      browser.pause(timeout);
    }
  }, {
    key: "name",
    get: function get() {
      return this.stuartname;
    }
  }, {
    key: "criteriaElements",
    get: function get() {
      var abElements = [];

      for (var propName in this) {
        var propValue = this[propName];

        try {
          // @ts-ignore
          if (propValue.isLoadCriterion) {
            // propValue instanceof UiElement &&
            abElements.push(propValue);
          }
        } catch (err) {// do nothing.  i would love to check if propValue was instanceOf UiElement but that gives circular dependency errors
        }
      }

      return abElements;
    }
  }]);
  return UiContainer;
}();

exports.UiContainer = UiContainer;
//# sourceMappingURL=UiContainer.js.map