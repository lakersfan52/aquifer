"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.A_VISUAL_TEST_FAILED = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _safe = _interopRequireDefault(require("colors/safe"));

var _dateformat = _interopRequireDefault(require("dateformat"));

var fs = _interopRequireWildcard(require("fs"));

var fs_extra = _interopRequireWildcard(require("fs-extra"));

var _htmlEntities = require("html-entities");

var os = _interopRequireWildcard(require("os"));

var path = _interopRequireWildcard(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _HtmlBuilder = require("./HtmlBuilder");

var _ = require(".");

// @ts-check

/* eslint prefer-destructuring: "off" */
var entities = new _htmlEntities.AllHtmlEntities();
var A_VISUAL_TEST_FAILED = 'A visual test failed.';
exports.A_VISUAL_TEST_FAILED = A_VISUAL_TEST_FAILED;

function passthrough(message) {
  return message;
}
/** holds DOMs as well as event screenshots */


var EVENT_SNAPSHOTS_DIR_NAME = 'eventSnapshots';
var ERROR_SNAPSHOTS_DIR_NAME = 'errorSnapshots';
/** these files get copied from the visual regression service when an image test fails. */

var DIFF_IMAGES_DIR_NAME = 'diffImages';
/**
 *
 * @param {Object} style has a parameter '_styles' which is an array of strings describing the style, like "red", or "emoji"
 */

function convertStylesToClassValue(style) {
  return style && style._styles ? style._styles.join(' ') : '';
}

function getEventScreenshotFileRelPath(id) {
  return "".concat(EVENT_SNAPSHOTS_DIR_NAME, "/").concat(id, ".png");
}

function getErrorScreenshotFileRelPath(id) {
  return "".concat(ERROR_SNAPSHOTS_DIR_NAME, "/").concat(id, ".png");
}

function getDiffImageCopyRelPath(base) {
  return "".concat(DIFF_IMAGES_DIR_NAME, "/").concat(base);
}
/**
 *
 * @param {string} fullTitle
 * @param {string} title
 * @param {string} parent
 */


var getGrandparentsTitle = function getGrandparentsTitle(fullTitle, title, parent) {
  var bitToRemove = "".concat(parent, " ").concat(title);
  return fullTitle.replace(bitToRemove, '');
};

var isSingleSelector = function isSingleSelector(style, text) {
  return !text.startsWith(' excluding') && (style === aquiferStyle.selector || style === aquiferStyle.selector_red);
};

var toHtmlString = function toHtmlString(_ref) {
  var _ref$style = _ref.style,
      style = _ref$style === void 0 ? passthrough : _ref$style,
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? '' : _ref$text;
  var classValue = convertStylesToClassValue(style);

  if (text.startsWith('http')) {
    return _HtmlBuilder.html.link(classValue, text);
  }

  if (isSingleSelector(style, text)) {
    return _HtmlBuilder.html.dblclickableSelector(classValue, text);
  }

  return _HtmlBuilder.html.text(classValue, text);
};

var toConsoleString = function toConsoleString(_ref2) {
  var style = _ref2.style,
      text = _ref2.text;
  return "".concat(typeof style === 'function' ? style(text) : text);
};

var cleanPassword = function cleanPassword(message) {
  if (message.style === aquiferStyle.password) {
    message.text = message.text.replace(/[^\s]/g, '•');
    message.style = aquiferStyle.object;
  }

  return message;
};

var getScreenshotId = function getScreenshotId() {
  var currDateObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return (0, _dateformat.default)(currDateObject, 'hh:MM:ss.lTT').toLowerCase();
};

var aquiferStyle = {
  verb: _safe.default.italic,
  // @ts-ignore
  verb_red: _safe.default.italic.red,
  object: _safe.default.bold,
  // @ts-ignore
  object_red: _safe.default.bold.red,
  filler: _safe.default.reset,
  // @ts-ignore
  filler_red: _safe.default.red,
  // @ts-ignore
  selector_red: _safe.default.dim.red,
  selector: _safe.default.gray,
  emoji: {
    _styles: ['emoji']
  },
  password: 'password'
}; // @ts-ignore

var FAILURE_MESSAGES = [{
  text: '❌ ',
  style: aquiferStyle.emoji
}, {
  text: 'FAIL',
  style: _safe.default.red.bold
}];

var AquiferLog =
/*#__PURE__*/
function () {
  function AquiferLog() {
    (0, _classCallCheck2.default)(this, AquiferLog);
    this.doPrintToConsole = !global.aquiferOptions.muteConsole;
    this.doSaveEventScreenshots = !global.aquiferOptions.noPics;
    this.style = aquiferStyle;
    this.screenshotTargetName = undefined;
    this.screenshotTargetSelector = undefined;
    this.specFailed = false;
    this.aVisualTestFailed = false;
    this.errorMidpointScreenshotIds = [];
    this.errorMidpointScreenshotIds_printed = [];
  }
  /**
     * Called in global "before", once test's spec file path has been determined.
     * @param {String} specFile
     */


  (0, _createClass2.default)(AquiferLog, [{
    key: "initialize",
    value: function initialize(specFile) {
      this.isInTestCase = false;
      this.hasPrintedNontestLine = false;
      var randomWait = Math.floor(Math.random() * 1000);
      browser.pause(randomWait); // to prevent two parallel-running tests from starting at exactly the same time

      var testParentDateTime = new Date();
      this.specMillis = (0, _dateformat.default)(testParentDateTime, 'l');
      this.specTime = (0, _dateformat.default)(testParentDateTime, 'hh:MM:ss.lTT').toLowerCase();
      this.specDate = (0, _dateformat.default)(testParentDateTime, 'yyyymmdd');
      this.specFilePath = specFile;
      fs_extra.mkdirsSync(this.getReportDir());
      fs_extra.mkdirsSync(this.getEventScreenshotsDir());
      fs_extra.mkdirsSync(this.getErrorScreenshotsDir());
      fs_extra.copySync(_.iconDir, "".concat(this.getReportDir(), "/icon"));
      this.logRawToHtml(_HtmlBuilder.html.pageInitialize(this.getSpecFileTestlessName(), this.doSaveEventScreenshots, this.getRelativeSpecFilePath()));
    }
  }, {
    key: "initializeNewTestCase",
    value: function initializeNewTestCase(testCaseTitle, testParentTitle, testCaseFullTitle, testGrandparentsTitle) {
      this.isInTestCase = true;
      this.testCaseTitle = testCaseTitle;
      this.testParentTitle = testParentTitle;
      this.testCaseFullTitle = testCaseFullTitle;
      this.testGrandparentsTitle = testGrandparentsTitle;
      this.hasPrintedNontestLine = false;
    }
  }, {
    key: "endNewTestCase",
    value: function endNewTestCase() {
      this.isInTestCase = false;
      this.testCaseTitle = undefined;
      this.testCaseFullTitle = undefined;
      this.hasPrintedNontestLine = false;
    }
  }, {
    key: "getSpecFileName",
    value: function getSpecFileName() {
      var split = this.specFilePath.split('/');
      return split[split.length - 1].replace('.js', '');
    }
  }, {
    key: "getRelativeSpecFilePath",
    value: function getRelativeSpecFilePath() {
      if (this.specFilePath.includes('/src')) {
        var split = this.specFilePath.split('/src');
        var toHide = split[0];
        var toShow = this.specFilePath.replace(toHide, '');
        return toShow;
      }

      return this.specFilePath;
    }
  }, {
    key: "getSpecFileTestlessName",
    value: function getSpecFileTestlessName() {
      var split = this.specFilePath.split('/');
      return split[split.length - 1].replace('.test.js', '');
    }
  }, {
    key: "getSpecFileDirName",
    value: function getSpecFileDirName() {
      var split = this.specFilePath.split('/');
      return split[split.length - 2];
    }
  }, {
    key: "getDateDir",
    value: function getDateDir() {
      return "aquiferlog/".concat(global.aquiferOptions.runDate);
    }
  }, {
    key: "getTimeDir",
    value: function getTimeDir() {
      return "".concat(this.getDateDir(), "/").concat(global.aquiferOptions.runTime);
    }
    /** one log file per test js file */

  }, {
    key: "getReportDir",
    value: function getReportDir() {
      var result = "".concat(this.getTimeDir(), "/").concat(this.getSpecFileName(), "_").concat(this.specTime).replace('.test', '');
      return result;
    }
  }, {
    key: "getEventScreenshotsDir",
    value: function getEventScreenshotsDir() {
      return "".concat(this.getReportDir(), "/").concat(EVENT_SNAPSHOTS_DIR_NAME);
    }
  }, {
    key: "getErrorScreenshotsDir",
    value: function getErrorScreenshotsDir() {
      return "".concat(this.getReportDir(), "/").concat(ERROR_SNAPSHOTS_DIR_NAME);
    }
  }, {
    key: "getDiffImagesDir",
    value: function getDiffImagesDir() {
      return "".concat(this.getReportDir(), "/").concat(DIFF_IMAGES_DIR_NAME);
    }
  }, {
    key: "getEventDomFileAbsPath",
    value: function getEventDomFileAbsPath(id) {
      return "".concat(this.getEventScreenshotsDir(), "/").concat(id, ".html");
    }
  }, {
    key: "getEventScreenshotFileAbsPath",
    value: function getEventScreenshotFileAbsPath(id) {
      return "".concat(this.getEventScreenshotsDir(), "/").concat(id, ".png");
    }
  }, {
    key: "getErrorScreenshotFileAbsPath",
    value: function getErrorScreenshotFileAbsPath(id) {
      return "".concat(this.getErrorScreenshotsDir(), "/").concat(id, ".png");
    }
  }, {
    key: "getDiffImageCopyAbsPath",
    value: function getDiffImageCopyAbsPath(base) {
      return "".concat(this.getDiffImagesDir(), "/").concat(base);
    }
  }, {
    key: "getSpacelessTestCaseFullTitle",
    value: function getSpacelessTestCaseFullTitle() {
      if (this.isInTestCase) {
        return global.filenamify(this.testCaseFullTitle.replace(/ /g, '_'));
      }

      return global.filenamify(this.testParentTitle.replace(/ /g, '_'));
    }
  }, {
    key: "getFile",
    value: function getFile() {
      return "".concat(this.getReportDir(), "/index.html");
    }
  }, {
    key: "saveScreenshotWhileWaiting",
    value: function saveScreenshotWhileWaiting() {
      var screenshotId = getScreenshotId();
      this.errorMidpointScreenshotIds.push(screenshotId);
      this.saveErrorScreenshot(screenshotId);
    }
  }, {
    key: "saveEventScreenshot",
    value: function saveEventScreenshot(screenshotId) {
      var screenshotFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (this.doSaveEventScreenshots) {
        this.saveScreenshot(this.getEventScreenshotFileAbsPath(screenshotId), screenshotFile);
      }
    }
  }, {
    key: "saveErrorScreenshot",
    value: function saveErrorScreenshot(screenshotId) {
      this.saveScreenshot(this.getErrorScreenshotFileAbsPath(screenshotId));
    }
  }, {
    key: "saveScreenshot",
    value: function saveScreenshot(destination) {
      var optionalScreenshotSourceFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (optionalScreenshotSourceFile) {
        // screenshotFile from visual regression service.  using it instead of taking new screenshot
        // screenshotFile doens't exist yet!  but it will in a second.
        // need to spin off a thread that will wait until the file exists, and then copy it.
        // or wait to copy until later??? no, this might be the last step of a test.
        browser.call(function () {
          function sleep(ms) {
            return new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            });
          }

          function demo() {
            return _demo.apply(this, arguments);
          }

          function _demo() {
            _demo = (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee() {
              var count;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      count = 0;

                    case 1:
                      if (fs.existsSync(optionalScreenshotSourceFile)) {
                        _context.next = 9;
                        break;
                      }

                      _context.next = 4;
                      return sleep(100);

                    case 4:
                      count += 1;

                      if (!(count > 100)) {
                        _context.next = 7;
                        break;
                      }

                      return _context.abrupt("break", 9);

                    case 7:
                      _context.next = 1;
                      break;

                    case 9:
                      fs.copyFileSync(optionalScreenshotSourceFile, destination);

                    case 10:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));
            return _demo.apply(this, arguments);
          }

          demo();
        });
      } else {
        browser.saveScreenshot(destination);
      }
    }
    /**
     *
     * @param {Array | undefined} messages
     * @param {string | undefined} screenshotFile
     */

  }, {
    key: "logRichMessagesWithScreenshot",
    value: function logRichMessagesWithScreenshot() {
      var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var screenshotFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var screenshotId = this.logRichMessages(messages);
      this.saveEventScreenshot(screenshotId, screenshotFile);
    }
    /**
     *
     * @param {string} message
     * @param {string | undefined} screenshotFile
     */

  }, {
    key: "logScreenshottedMessage",
    value: function logScreenshottedMessage() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var screenshotFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var screenshotId = this.logPrefixedText(message);
      this.saveEventScreenshot(screenshotId, screenshotFile);
    }
  }, {
    key: "logPrefixedText",
    value: function logPrefixedText(message) {
      return this.logRichMessages([{
        text: message
      }]);
    }
  }, {
    key: "initializeConsoleString",
    value: function initializeConsoleString(withPrefix, currDateObject) {
      if (!withPrefix) {
        return '';
      }

      var currTime = (0, _dateformat.default)(currDateObject, 'hh:MM:sstt');

      if (this.isInTestCase) {
        return "".concat(currTime, " ").concat(_safe.default.gray("".concat(this.testGrandparentsTitle, " ").concat(this.testParentTitle).trim()), " ").concat(this.testCaseTitle, "> ");
      }

      return "".concat(currTime, " ").concat(_safe.default.gray(this.getSpecFileDirName()), "/").concat(this.getSpecFileName(), ">  ");
    }
  }, {
    key: "initializeHtmlString",
    value: function initializeHtmlString(withPrefix, withScreenshot, currDateObject) {
      var currTime = (0, _dateformat.default)(currDateObject, 'hh:MM:sstt');
      var currDate = (0, _dateformat.default)(currDateObject, 'yyyymmdd');
      var screenshotId = getScreenshotId(currDateObject);
      var onmouseoverHtml = withScreenshot ? " onmouseover=\"logEntryMouseover('".concat(screenshotId, "', '").concat(getEventScreenshotFileRelPath(screenshotId), "');\"") : '';
      var htmlBuilder = "<span class=\"logline\" id=\"entrySpan".concat(screenshotId, "\" ").concat(onmouseoverHtml, ">");
      htmlBuilder += withPrefix ? entities.encode("".concat(currDate, " ").concat(currTime, "> ")) : '';
      return htmlBuilder;
    }
  }, {
    key: "logRichMessages",
    value: function logRichMessages() {
      var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$withPrefix = _ref3.withPrefix,
          withPrefix = _ref3$withPrefix === void 0 ? true : _ref3$withPrefix,
          _ref3$withScreenshot = _ref3.withScreenshot,
          withScreenshot = _ref3$withScreenshot === void 0 ? true : _ref3$withScreenshot;

      if (withPrefix && messages !== FAILURE_MESSAGES) {
        // new logline, so delete old unused midpoint images and clear errorMidpointScreenshotIds array
        this.deleteUnusedMidpointErrorScreenshots();
      }

      var currDateObject = new Date();

      if (!this.isInTestCase && !this.hasPrintedNontestLine) {
        this.logHorizontalLine();
        this.hasPrintedNontestLine = true;
      }

      var consoleBuilder = this.initializeConsoleString(withPrefix, currDateObject);
      var htmlBuilder = this.initializeHtmlString(withPrefix, withScreenshot, currDateObject);
      messages.forEach(function (message) {
        message = cleanPassword(message);
        htmlBuilder += toHtmlString(message);
        consoleBuilder += toConsoleString(message);
      });
      htmlBuilder += '</span><br/>';
      this.logRawToHtml(htmlBuilder);

      if (this.doPrintToConsole) {
        console.log(consoleBuilder);
      }

      return getScreenshotId(currDateObject);
    }
  }, {
    key: "logErrorImageToHtml",
    value: function logErrorImageToHtml(screenshotId) {
      var _this = this;

      this.errorMidpointScreenshotIds.forEach(function (id) {
        _this.logRawToHtml("<span class='errorimgname'>".concat(id, "</span><br/><img id=\"logErrorImage\" src=").concat(getErrorScreenshotFileRelPath(id), " width=45%></img><br/>"));

        _this.errorMidpointScreenshotIds_printed.push(id);
      });
      this.logRawToHtml("<span class='errorimgname'>".concat(screenshotId, "</span><br/><img id=\"logErrorImage\" src=").concat(getErrorScreenshotFileRelPath(screenshotId), " width=45%></img><br/>"));
      this.errorMidpointScreenshotIds = [];
    }
  }, {
    key: "logFailedVisualTest",
    value: function logFailedVisualTest(diffImageFilePath, report) {
      if (!fs.existsSync(this.getDiffImagesDir())) {
        fs.mkdirSync(this.getDiffImagesDir());
      }

      var diffImageNewAbsPath = this.getDiffImageCopyAbsPath(path.parse(diffImageFilePath).base.replace(/ /g, '_'));
      var diffImageNewRelPath = getDiffImageCopyRelPath(path.parse(diffImageFilePath).base.replace(/ /g, '_'));
      fs.copyFileSync(diffImageFilePath, diffImageNewAbsPath);
      this.logRichMessages([{
        text: "Visual test failed: ".concat(JSON.stringify(report)),
        style: _safe.default.red
      }], {
        withScreenshot: false
      });
      this.logWithoutPrefix_toHtml('Diff image: ', _safe.default.red);
      this.logRawToHtml("<img style=\"width:35%\" src=\"".concat(diffImageNewRelPath, "\"><br>"));
    }
  }, {
    key: "logWithoutPrefix",
    value: function logWithoutPrefix(message, style) {
      this.logWithoutPrefix_toConsole(message, style);
      this.logWithoutPrefix_toHtml(message, style);
    }
  }, {
    key: "logRawToHtml",
    value: function logRawToHtml(text) {
      fs.appendFileSync(this.getFile(), text + os.EOL);
    }
  }, {
    key: "logHorizontalLine",
    value: function logHorizontalLine() {
      if (this.doPrintToConsole) {
        console.log('---------------------------------------------------------------------------------------');
        console.log('');
      }

      this.logRawToHtml('<hr/><br/>');
    }
    /* eslint no-param-reassign: "off" */

  }, {
    key: "logWithoutPrefix_toHtml",
    value: function logWithoutPrefix_toHtml(message, style) {
      var classValue = convertStylesToClassValue(style);
      this.logRawToHtml("<span class=\"whitespace ".concat(classValue, "\">").concat(entities.encode(message), "</span><br/>"));
    }
    /* eslint no-param-reassign: "off" */

  }, {
    key: "logWithoutPrefix_toConsole",
    value: function logWithoutPrefix_toConsole(message, style) {
      if (!style) {
        style = passthrough;
      }

      if (this.doPrintToConsole) {
        console.log(style(message));
      }
    } // run this before "it"

  }, {
    key: "logTestStart",
    value: function logTestStart() {
      this.logRawToHtml("<span id=".concat(this.getSpacelessTestCaseFullTitle(), "></span>"));
      this.logHorizontalLine();
      this.logRichMessages([{
        text: 'Starting test:  ',
        style: _safe.default.bold
      }, {
        text: "".concat(this.testGrandparentsTitle, " "),
        style: _safe.default.reset
      }, {
        text: "".concat(this.testParentTitle, " "),
        style: _safe.default.blue
      }, // @ts-ignore
      {
        text: this.testCaseTitle,
        style: _safe.default.bold.blue
      }], {
        withPrefix: false,
        withScreenshot: false
      });
      this.logWithoutPrefix('');
    }
  }, {
    key: "logPassed",
    value: function logPassed() {
      // @ts-ignore
      this.logRichMessagesWithScreenshot([{
        text: '✅ ',
        style: this.style.emoji
      }, {
        text: 'PASS',
        style: _safe.default.green.bold
      }]);
    }
  }, {
    key: "logFailed",
    value: function logFailed(stack) {
      this.specFailed = true;

      if (stack.includes(A_VISUAL_TEST_FAILED)) {
        this.logRichMessages(FAILURE_MESSAGES, {
          withScreenshot: false
        });
        this.logRawToHtml("<span name=\"thisIsWhereStackGoes\" class=\"monospace red\"><pre>".concat(entities.encode(stack), "</pre></span><br/>"));
      } else {
        this.logRichMessagesWithScreenshot(FAILURE_MESSAGES);
        this.logRawToHtml("<span name=\"thisIsWhereStackGoes\" class=\"monospace red\"><pre>".concat(entities.encode(stack), "</pre></span><br/>"));
        var screenshotId = getScreenshotId();
        browser.saveScreenshot(this.getErrorScreenshotFileAbsPath(screenshotId));
        this.logErrorImageToHtml(screenshotId); // replace favicon with favicon_fail

        var reportContents = fs.readFileSync(this.getFile()).toString();
        reportContents = reportContents.replace('favicon', 'favicon_fail');
        fs.writeFileSync(this.getFile(), reportContents);
      }
    }
    /** Called from global in wdio.conf.js */

  }, {
    key: "logVisualTestReset",
    value: function logVisualTestReset(screenshotFile) {
      this.logRichMessagesWithScreenshot([{
        text: '📷 ',
        style: this.style.emoji
      }, {
        text: 'Reset ',
        style: this.style.verb_red
      }, {
        text: 'screenshot ',
        style: this.style.filler_red
      }, {
        text: this.screenshotTargetName,
        style: this.style.object_red
      }, {
        text: this.screenshotTargetSelector,
        style: this.style.selector_red
      }], screenshotFile);
    }
    /** Called from global in wdio.conf.js */

  }, {
    key: "logVisualTestCreate",
    value: function logVisualTestCreate(screenshotFile) {
      this.logRichMessagesWithScreenshot([{
        text: '📷 ',
        style: this.style.emoji
      }, {
        text: 'Save ',
        style: this.style.verb_red
      }, {
        text: 'screenshot ',
        style: this.style.object_red
      }, {
        text: this.screenshotTargetName,
        style: this.style.object_red
      }, {
        text: this.screenshotTargetSelector,
        style: this.style.selector_red
      }], screenshotFile);
    }
    /** Called from global in wdio.conf.js */

  }, {
    key: "logVisualTestVerify",
    value: function logVisualTestVerify(screenshotFile) {
      this.logRichMessagesWithScreenshot([{
        text: '📸 ',
        style: this.style.emoji
      }, {
        text: 'Verify ',
        style: this.style.verb
      }, {
        text: 'screenshot ',
        style: this.style.object
      }, {
        text: this.screenshotTargetName,
        style: this.style.object
      }, {
        text: this.screenshotTargetSelector,
        style: this.style.selector
      }], screenshotFile);
    }
  }, {
    key: "wdioConf_beforeSuite",
    value: function wdioConf_beforeSuite(suite, runId) {
      this.isInTestCase = false;
      this.specFilePath = suite.file;
      this.testCaseTitle = undefined;
      this.testParentTitle = suite.parent;
      this.testCaseFullTitle = suite.fullTitle;
      this.testGrandparentsTitle = undefined;
      this.runId = runId;
      this.initialize(this.specFilePath);

      if (this.doPrintToConsole) {
        console.log('');
      }

      console.log('📝 ', this.reportClickablePath, '\n');
    }
  }, {
    key: "deleteUnusedMidpointErrorScreenshots",
    value: function deleteUnusedMidpointErrorScreenshots() {
      var _this2 = this;

      // delete unused midpoint screenshots
      this.errorMidpointScreenshotIds.filter(function (id) {
        return !_this2.errorMidpointScreenshotIds_printed.includes(id);
      }).forEach(function (id) {
        return fs.unlinkSync(_this2.getErrorScreenshotFileAbsPath(id));
      });
      this.errorMidpointScreenshotIds_printed = [];
      this.errorMidpointScreenshotIds = [];
    }
  }, {
    key: "wdioConf_beforeTest",
    value: function wdioConf_beforeTest(test) {
      var grandparentsTitle = getGrandparentsTitle(test.fullTitle, test.title, test.parent);
      this.initializeNewTestCase(test.title.trim(), test.parent.trim(), test.fullTitle.trim(), grandparentsTitle.trim());
      this.logTestStart();
    }
    /** called from wdio.conf.js */

  }, {
    key: "wdioConf_after",
    value: function wdioConf_after() {
      if (!global.aquiferOptions.muteConsole) {
        console.log('\n📝 ', this.reportClickablePath, '\n');
      }
    }
    /** called from wdio.conf.js */

  }, {
    key: "wdioConf_afterSession",
    value: function wdioConf_afterSession() {
      fs.appendFileSync(this.runId, "".concat(this.specFailed ? '❌ ' : '✅ ', " ").concat(this.reportClickablePath).concat(os.EOL)); // so you can scroll code up so the screenshot isn't blocking it

      for (var i = 0; i < 30; i++) {
        this.logRawToHtml('</br>');
      }

      _rimraf.default.sync('screenshots/screen');
    }
    /**
     * Called from wdio.conf.js after testcase or suite completion
     * @param {boolean} testDidPass
     * @param {*} err
     */

  }, {
    key: "wdioConf_afterTest",
    value: function wdioConf_afterTest(testDidPass, err) {
      // if test passed, ignore, else take and save screenshot.
      if (testDidPass) {
        this.logPassed();
      } else {
        this.logFailed(err.stack);
        console.log("\uD83D\uDCC9 \u274C ".concat(this.reportClickablePathWithHash));
      }

      this.endNewTestCase();
    }
  }, {
    key: "wdioConf_afterSuite",
    value: function wdioConf_afterSuite(err) {
      if (err) {
        this.wdioConf_afterTest(false, err);
      }
    }
  }, {
    key: "reportClickablePathWithHash",
    get: function get() {
      return "".concat(this.reportClickablePath, "#").concat(this.getSpacelessTestCaseFullTitle());
    }
  }, {
    key: "reportClickablePath",
    get: function get() {
      return "file://".concat(path.resolve(this.getFile()));
    }
  }]);
  return AquiferLog;
}();

var log = new AquiferLog();
exports.log = log;
global.log = log;
//# sourceMappingURL=AquiferLog.js.map