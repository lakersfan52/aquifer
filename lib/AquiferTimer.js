"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AquiferTimer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _AquiferWait = require("./AquiferWait");

// @ts-check
var ONE_MIN_MILLIS = 60000;
var ONE_SEC_MILLIS = 1000;

var AquiferTimer =
/*#__PURE__*/
function () {
  function AquiferTimer(timeoutMillis) {
    (0, _classCallCheck2.default)(this, AquiferTimer);
    this.timeoutMillis = timeoutMillis;
    this.startTime = new Date().getTime();
  }

  (0, _createClass2.default)(AquiferTimer, [{
    key: "elapsedTime",
    value: function elapsedTime() {
      return new Date().getTime() - this.startTime;
    }
  }, {
    key: "elapsedTimeString",
    value: function elapsedTimeString() {
      var elapsedTime = this.elapsedTime();

      if (elapsedTime >= ONE_MIN_MILLIS) {
        return "".concat(elapsedTime / ONE_MIN_MILLIS, " minutes");
      }

      if (elapsedTime >= ONE_SEC_MILLIS) {
        return "".concat(elapsedTime / ONE_SEC_MILLIS, " seconds");
      }

      return "".concat(elapsedTime, " milliseconds");
    }
  }, {
    key: "isExpired",
    value: function isExpired() {
      return this.elapsedTime() > this.timeoutMillis;
    }
  }, {
    key: "threadSleep",
    value: function threadSleep(sleepMillis) {
      _AquiferWait.AquiferWait.sleep(sleepMillis);
    }
  }], [{
    key: "startTimer",
    value: function startTimer(timeoutMillis) {
      return new AquiferTimer(timeoutMillis);
    }
  }]);
  return AquiferTimer;
}();

exports.AquiferTimer = AquiferTimer;
//# sourceMappingURL=AquiferTimer.js.map