"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AquiferFunctionalPersister = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _AquiferTaskPersister = require("./AquiferTaskPersister");

// @ts-check
var AquiferFunctionalPersister =
/*#__PURE__*/
function () {
  function AquiferFunctionalPersister() {
    var timeoutInMillis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60 * 1000;
    (0, _classCallCheck2.default)(this, AquiferFunctionalPersister);
    this.timeoutInMillis = Math.round(timeoutInMillis);
    this.timeBetweenActionsInMillis = 200;

    this.goal = function () {
      return false;
    };

    this.task = function () {};

    this.chore = function () {};

    this.consequence = function () {};

    this.failfast = false;
    this.exceptionMessage = null;

    this.precondition = function () {
      return true;
    };

    this.exceptionMessageRunner = function () {
      return null;
    };
  }

  (0, _createClass2.default)(AquiferFunctionalPersister, [{
    key: "setTimeout",
    value: function setTimeout(timeoutInMillis) {
      this.timeoutInMillis = timeoutInMillis;
      return this;
    }
  }, {
    key: "setTimeBetweenActions",
    value: function setTimeBetweenActions(timeBetweenActionsInMillis) {
      this.timeBetweenActionsInMillis = Math.round(timeBetweenActionsInMillis);
      return this;
    }
  }, {
    key: "setGoal",
    value: function setGoal(goal) {
      this.goal = goal;
      return this;
    }
  }, {
    key: "setPrecondition",
    value: function setPrecondition(precondition) {
      this.precondition = precondition;
      return this;
    }
    /** Per loop, the task to perform before checking `goal`. */

  }, {
    key: "setTask",
    value: function setTask(task) {
      this.task = task;
      return this;
    }
    /** Per loop, the task to perform after `goal` fails. */

  }, {
    key: "setChore",
    value: function setChore(chore) {
      this.chore = chore;
      return this;
    }
  }, {
    key: "setConsequence",
    value: function setConsequence(consequence) {
      this.consequence = consequence;
      return this;
    }
  }, {
    key: "failfastWithMessage",
    value: function failfastWithMessage(exceptionMessage) {
      this.failfast = true;
      this.exceptionMessage = exceptionMessage;
      return this;
    }
  }, {
    key: "failfastWithMessageRunner",
    value: function failfastWithMessageRunner(exceptionMessageRunner) {
      this.failfast = true;
      this.exceptionMessageRunner = exceptionMessageRunner;
      return this;
    }
    /**
     * Execute the wait task using the timeouts and condition supplied by setters. Fails quietly by default; override with
     * {@link #failfastWithMessage}.
     */

  }, {
    key: "start",
    value: function start() {
      if (this.precondition()) {
        var p = _AquiferTaskPersister.AquiferTaskPersister.initialize(this.timeoutInMillis).setImplicitWait(this.timeBetweenActionsInMillis);

        while (!p.isFinished()) {
          try {
            this.task();
            p.setSuccess(this.goal());

            if (!p.didSucceed()) {
              this.chore();
            }
          } catch (error) {
            p.setException(error);
          }

          p.printThrowableIfCaught();
        }

        if (!p.didSucceed()) {
          this.consequence();

          if (this.failfast) {
            try {
              this.exceptionMessage = this.exceptionMessage || this.exceptionMessageRunner();
            } catch (error) {
              console.log('Throwable', error);
            }

            throw Error("".concat(this.exceptionMessage, ". ").concat(p.getNumTries(), " attempts over ").concat(p.timer.elapsedTimeString()));
          }
        }

        return p.didSucceed();
      }

      return null;
    }
  }]);
  return AquiferFunctionalPersister;
}();

exports.AquiferFunctionalPersister = AquiferFunctionalPersister;
//# sourceMappingURL=AquiferFunctionalPersister.js.map