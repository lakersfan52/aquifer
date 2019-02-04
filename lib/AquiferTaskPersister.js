"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AquiferTaskPersister = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _AquiferTimer = require("./AquiferTimer");

// @ts-check
var AquiferTaskPersister =
/*#__PURE__*/
function () {
  function AquiferTaskPersister(timeoutMillis) {
    (0, _classCallCheck2.default)(this, AquiferTaskPersister);
    this.timeoutMillis = timeoutMillis;
    this.timer = _AquiferTimer.AquiferTimer.startTimer(timeoutMillis);
    this.error = null;
    this.hasSucceeded = false;
    this.implicitWaitInMillis = 0;
    this.numTries = 0;
    this.isTerminated = false;
  }

  (0, _createClass2.default)(AquiferTaskPersister, [{
    key: "getNumTries",
    value: function getNumTries() {
      return this.numTries;
    }
    /** Sleeps for the given milliseconds only if task has not yet succeeded. */

  }, {
    key: "sleep",
    value: function sleep(milliseconds) {
      if (!this.hasSucceeded) {
        this.timer.threadSleep(milliseconds);
      }
    }
    /** Resets the persister's timer and sets success flag to false, for new task. */

  }, {
    key: "restart",
    value: function restart() {
      this.timer = _AquiferTimer.AquiferTimer.startTimer(this.timeoutMillis);
      this.hasSucceeded = false;
    }
  }, {
    key: "isFinished",
    value: function isFinished() {
      if (this.isTerminated) return true;

      if (this.numTries > 0) {
        this.sleep(this.implicitWaitInMillis);
      }

      this.numTries += 1;
      return this.hasSucceeded || this.timer.isExpired();
    }
  }, {
    key: "didSucceed",
    value: function didSucceed() {
      return this.hasSucceeded;
    }
  }, {
    key: "printThrowableIfCaught",
    value: function printThrowableIfCaught() {
      if (this.error != null) {
        console.log('Throwable', this.error);
      }
    }
  }, {
    key: "setSuccess",
    value: function setSuccess(didSucceed) {
      this.hasSucceeded = didSucceed;
    }
  }, {
    key: "setException",
    value: function setException(e) {
      console.log('Throwable', e);
      this.throwable = e;
    }
    /** Set the amount of time in milliseconds to wait between retrying the task. Defaults to 0 ms. */

  }, {
    key: "setImplicitWait",
    value: function setImplicitWait(milliseconds) {
      this.implicitWaitInMillis = milliseconds;
      return this;
    }
    /** Terminates the task persister. */

  }, {
    key: "terminate",
    value: function terminate() {
      this.isTerminated = true;
    }
    /** Get the elapsed time on the timer */

  }, {
    key: "getElapsedTime",
    value: function getElapsedTime() {
      return this.timer.elapsedTime();
    }
  }], [{
    key: "initialize",
    value: function initialize(timeoutMillis) {
      return new AquiferTaskPersister(timeoutMillis);
    }
  }, {
    key: "persistUntil",
    value: function persistUntil(timeoutMillis) {
      return new AquiferTaskPersister(timeoutMillis);
    }
  }]);
  return AquiferTaskPersister;
}();

exports.AquiferTaskPersister = AquiferTaskPersister;
//# sourceMappingURL=AquiferTaskPersister.js.map